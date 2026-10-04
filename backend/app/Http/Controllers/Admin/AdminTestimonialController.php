<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTestimonialController extends Controller
{
    public function index(): Response
    {
        $testimonials = Testimonial::orderBy('display_order')->get();

        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_role' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'company_logo_url' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|string|max:500',
            'quote' => 'required|string',
            'project_reference' => 'nullable|string|max:255',
            'metric_highlight' => 'nullable|string|max:100',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        Testimonial::create($validated);

        return back()->with('success', 'Testimonial created successfully.');
    }

    public function update(Request $request, Testimonial $testimonial): RedirectResponse
    {
        $validated = $request->validate([
            'client_name' => 'required|string|max:255',
            'client_role' => 'required|string|max:255',
            'company_name' => 'required|string|max:255',
            'company_logo_url' => 'nullable|string|max:500',
            'avatar_url' => 'nullable|string|max:500',
            'quote' => 'required|string',
            'project_reference' => 'nullable|string|max:255',
            'metric_highlight' => 'nullable|string|max:100',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        $testimonial->update($validated);

        return back()->with('success', 'Testimonial updated successfully.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimonial removed successfully.');
    }
}
