<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminFaqController extends Controller
{
    /**
     * Display a listing of FAQs.
     */
    public function index(): Response
    {
        $faqs = Faq::orderBy('display_order')->get();

        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $faqs,
        ]);
    }

    /**
     * Store a newly created FAQ.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'question' => 'required|string',
            'answer' => 'required|string',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        Faq::create($validated);

        return back()->with('success', 'FAQ added successfully.');
    }

    /**
     * Update the specified FAQ.
     */
    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|string|max:100',
            'question' => 'required|string',
            'answer' => 'required|string',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        $faq->update($validated);

        return back()->with('success', 'FAQ updated successfully.');
    }

    /**
     * Delete the specified FAQ.
     */
    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back()->with('success', 'FAQ deleted successfully.');
    }
}
