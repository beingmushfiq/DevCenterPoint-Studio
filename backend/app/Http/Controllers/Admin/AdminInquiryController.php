<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Inquiry;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminInquiryController extends Controller
{
    /**
     * Display a listing of project inquiries.
     */
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $search = $request->query('search');

        $query = Inquiry::query()->latest();

        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        $inquiries = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Inquiries/Index', [
            'inquiries' => $inquiries,
            'filters' => [
                'status' => $status ?? 'all',
                'search' => $search ?? '',
            ],
        ]);
    }

    /**
     * Update inquiry status and internal notes.
     */
    public function update(Request $request, Inquiry $inquiry): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:new,reviewed,contacted,closed',
            'internal_notes' => 'nullable|string',
        ]);

        $inquiry->update($validated);

        return back()->with('success', 'Inquiry updated successfully.');
    }

    /**
     * Delete an inquiry.
     */
    public function destroy(Inquiry $inquiry): RedirectResponse
    {
        $inquiry->delete();

        return back()->with('success', 'Inquiry deleted successfully.');
    }
}
