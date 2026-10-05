<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminInquiryController extends Controller
{
    /**
     * Display a listing of project inquiries.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $priority = $request->query('priority');
        $search = $request->query('search');

        $query = Inquiry::query()->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($priority && $priority !== 'all') {
            $query->where('priority', $priority);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->paginate(20)->withQueryString();

        // Also get count by status for pipeline summaries
        $statusCounts = [
            'all' => Inquiry::count(),
            'new' => Inquiry::where('status', 'new')->count(),
            'reviewed' => Inquiry::where('status', 'reviewed')->count(),
            'contacted' => Inquiry::where('status', 'contacted')->count(),
            'qualified' => Inquiry::where('status', 'qualified')->count(),
            'proposal_sent' => Inquiry::where('status', 'proposal_sent')->count(),
            'closed_won' => Inquiry::where('status', 'closed_won')->count(),
            'closed_lost' => Inquiry::where('status', 'closed_lost')->count(),
        ];

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'statusCounts' => $statusCounts,
            'filters' => [
                'status' => $status ?? 'all',
                'priority' => $priority ?? 'all',
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Store a newly created inquiry / lead manually from Admin CRM.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'project_types' => 'nullable|array',
            'budget_range' => 'required|string|max:100',
            'timeline' => 'required|string|max:100',
            'details' => 'required|string',
            'status' => 'required|in:new,reviewed,contacted,qualified,proposal_sent,closed_won,closed_lost',
            'lead_source' => 'nullable|string|max:100',
            'priority' => 'required|in:low,medium,high,urgent',
            'estimated_value' => 'nullable|numeric|min:0',
            'target_close_date' => 'nullable|date',
            'internal_notes' => 'nullable|string',
        ]);

        $year = date('Y');
        $random = strtoupper(substr(uniqid(), -4));
        $ref = "DCP-{$year}-{$random}";

        Inquiry::create(array_merge($validated, [
            'reference_number' => $ref,
            'lead_source' => $validated['lead_source'] ?? 'Manual CRM Entry',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]));

        return back()->with('success', "Lead #{$ref} added to CRM pipeline successfully.");
    }

    /**
     * Update inquiry status and internal notes.
     */
    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,contacted,qualified,proposal_sent,closed_won,closed_lost',
            'priority' => 'nullable|in:low,medium,high,urgent',
            'estimated_value' => 'nullable|numeric|min:0',
            'target_close_date' => 'nullable|date',
            'internal_notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        return back()->with('success', 'Lead updated successfully.');
    }

    /**
     * Export inquiries matching filters to CSV.
     */
    public function exportCsv(Request $request): StreamedResponse
    {
        $status = $request->query('status');
        $priority = $request->query('priority');
        $search = $request->query('search');

        $query = Inquiry::query()->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($priority && $priority !== 'all') {
            $query->where('priority', $priority);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        $leads = $query->get();
        $filename = 'devcenterpoint-leads-' . date('Y-m-d') . '.csv';

        return response()->stream(function () use ($leads) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, [
                'Reference Number',
                'Client Name',
                'Company',
                'Email',
                'Phone',
                'Project Types',
                'Budget Tier',
                'Timeline',
                'Status',
                'Priority',
                'Estimated Value ($)',
                'Lead Source',
                'Details',
                'Created At',
            ]);

            foreach ($leads as $lead) {
                fputcsv($handle, [
                    $lead->reference_number,
                    $lead->name,
                    $lead->company ?? 'N/A',
                    $lead->email,
                    $lead->phone ?? 'N/A',
                    is_array($lead->project_types) ? implode(', ', $lead->project_types) : '',
                    $lead->budget_range,
                    $lead->timeline,
                    ucfirst(str_replace('_', ' ', $lead->status)),
                    ucfirst($lead->priority ?? 'Medium'),
                    $lead->estimated_value ? '$' . number_format($lead->estimated_value, 2) : 'N/A',
                    $lead->lead_source ?? 'Website',
                    $lead->details,
                    $lead->created_at->format('Y-m-d H:i'),
                ]);
            }

            fclose($handle);
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Delete an inquiry.
     */
    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return back()->with('success', 'Lead removed from CRM.');
    }
}
