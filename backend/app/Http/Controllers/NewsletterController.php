<?php

namespace App\Http\Controllers;

use App\Mail\NewsletterWelcomeMail;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class NewsletterController extends Controller
{
    /**
     * Subscribe an email address to the newsletter.
     */
    public function subscribe(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:150',
        ]);

        $email = strtolower(trim($validated['email']));

        $subscriber = NewsletterSubscriber::where('email', $email)->first();

        if ($subscriber) {
            if ($subscriber->status === 'unsubscribed') {
                $subscriber->update([
                    'status' => 'subscribed',
                    'unsubscribed_at' => null,
                ]);
            }
            return response()->json([
                'success' => true,
                'id' => $subscriber->id,
                'email' => $subscriber->email,
                'message' => 'Subscription active',
            ]);
        }

        $subscriber = NewsletterSubscriber::create([
            'email' => $email,
            'status' => 'subscribed',
            'unsubscribe_token' => Str::random(32),
            'ip_address' => $request->ip(),
        ]);

        try {
            Mail::to($subscriber->email)->send(new NewsletterWelcomeMail($subscriber));
        } catch (\Throwable $mailErr) {
            Log::warning('Welcome newsletter email skipped or failed: ' . $mailErr->getMessage());
        }

        return response()->json([
            'success' => true,
            'id' => $subscriber->id,
            'email' => $subscriber->email,
        ], 201);
    }

    /**
     * One-click unsubscribe from newsletter.
     */
    public function unsubscribe(string $token): Response
    {
        $subscriber = NewsletterSubscriber::where('unsubscribe_token', $token)->first();

        if ($subscriber) {
            $subscriber->update([
                'status' => 'unsubscribed',
                'unsubscribed_at' => now(),
            ]);
        }

        return Inertia::render('Public/UnsubscribeSuccess', [
            'email' => $subscriber ? $subscriber->email : null,
            'success' => (bool) $subscriber,
        ]);
    }
}
