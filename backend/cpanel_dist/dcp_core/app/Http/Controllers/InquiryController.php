<?php

namespace App\Http\Controllers;

use App\Mail\InquiryConfirmationMail;
use App\Mail\NewInquiryAdminNotification;
use App\Models\Inquiry;
use App\Models\SiteSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class InquiryController extends Controller
{
    /**
     * Store a newly created project inquiry.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'company' => 'nullable|string|max:100',
            'project_types' => 'required|array',
            'budget_range' => 'nullable|string|max:50',
            'timeline' => 'required|string|max:50',
            'details' => 'required|string|max:5000',
            'selected_tech' => 'nullable|array',
        ]);

        $randomSuffix = rand(1000, 9999);
        $referenceNumber = 'DCP-' . date('Y') . '-' . $randomSuffix;

        $inquiry = Inquiry::create([
            'reference_number' => $referenceNumber,
            'name' => trim($validated['name']),
            'email' => strtolower(trim($validated['email'])),
            'company' => isset($validated['company']) ? trim($validated['company']) : null,
            'project_types' => $validated['project_types'],
            'budget_range' => $validated['budget_range'] ?? 'Flexible',
            'timeline' => $validated['timeline'],
            'details' => trim($validated['details']),
            'status' => 'new',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Send transactional notifications (gracefully caught if mail driver is not configured)
        try {
            $adminEmail = SiteSetting::where('key', 'contact_email')->value('value') ?: config('mail.from.address');
            if ($adminEmail) {
                Mail::to($adminEmail)->send(new NewInquiryAdminNotification($inquiry));
            }
            Mail::to($inquiry->email)->send(new InquiryConfirmationMail($inquiry));
        } catch (\Throwable $mailErr) {
            Log::warning('Inquiry notification email skipped or failed: ' . $mailErr->getMessage());
        }

        return response()->json([
            'success' => true,
            'id' => $inquiry->id,
            'reference_number' => $inquiry->reference_number,
        ], 201);
    }
}
