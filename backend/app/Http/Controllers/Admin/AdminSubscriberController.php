<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminSubscriberController extends Controller
{
    /**
     * Display a listing of newsletter subscribers.
     */
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = NewsletterSubscriber::query()->latest();

        if ($search) {
            $query->where('email', 'like', "%{$search}%");
        }

        $subscribers = $query->paginate(20)->withQueryString();

        return Inertia::render('Admin/Subscribers/Index', [
            'subscribers' => $subscribers,
            'filters' => [
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Delete a subscriber.
     */
    public function destroy(NewsletterSubscriber $subscriber): RedirectResponse
    {
        $subscriber->delete();

        return back()->with('success', 'Subscriber removed successfully.');
    }

    /**
     * Export all active subscribers to CSV.
     */
    public function exportCsv(): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="subscribers_' . date('Y-m-d') . '.csv"',
        ];

        return response()->stream(function () {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['ID', 'Email', 'Status', 'Subscribed At']);

            NewsletterSubscriber::chunk(200, function ($subscribers) use ($handle) {
                foreach ($subscribers as $sub) {
                    fputcsv($handle, [
                        $sub->id,
                        $sub->email,
                        $sub->status,
                        $sub->created_at->toDateTimeString(),
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }
}
