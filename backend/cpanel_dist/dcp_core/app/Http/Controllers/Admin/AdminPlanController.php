<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPlanController extends Controller
{
    /**
     * Display a listing of plans & pricing packages.
     */
    public function index(): Response
    {
        $plans = Plan::orderBy('display_order')->get();
        $showPricing = SiteSetting::where('key', 'show_pricing_on_site')->value('value') === 'true';
        $heading = SiteSetting::where('key', 'pricing_section_heading')->value('value') ?? 'Transparent Engineering Engagements';
        $subheading = SiteSetting::where('key', 'pricing_section_subheading')->value('value') ?? 'Predictable milestones, dedicated senior squads, and zero-compromise system architecture.';

        return Inertia::render('Admin/Plans/Index', [
            'plans' => $plans,
            'showPricingOnSite' => $showPricing,
            'pricingSectionHeading' => $heading,
            'pricingSectionSubheading' => $subheading,
        ]);
    }

    /**
     * Store a newly created plan.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:100|unique:plans,slug',
            'badge' => 'nullable|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'pricing_model' => 'required|string|in:custom,fixed,monthly,milestone',
            'price_usd' => 'nullable|string|max:100',
            'price_eur' => 'nullable|string|max:100',
            'price_gbp' => 'nullable|string|max:100',
            'price_bdt' => 'nullable|string|max:100',
            'billing_period' => 'nullable|string|max:50',
            'timeline_estimate' => 'nullable|string|max:100',
            'squad_composition' => 'nullable|string|max:255',
            'sla_commitment' => 'nullable|string|max:255',
            'recommended_for' => 'nullable|string',
            'features' => 'nullable|array',
            'cta_text' => 'nullable|string|max:100',
            'cta_action' => 'nullable|string|max:50',
            'cta_url' => 'nullable|string|max:500',
            'display_order' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['name']);
        }

        Plan::create($validated);

        return back()->with('success', 'Plan created successfully.');
    }

    /**
     * Update the specified plan.
     */
    public function update(Request $request, Plan $plan): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:100|unique:plans,slug,' . $plan->id,
            'badge' => 'nullable|string|max:100',
            'tagline' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'pricing_model' => 'required|string|in:custom,fixed,monthly,milestone',
            'price_usd' => 'nullable|string|max:100',
            'price_eur' => 'nullable|string|max:100',
            'price_gbp' => 'nullable|string|max:100',
            'price_bdt' => 'nullable|string|max:100',
            'billing_period' => 'nullable|string|max:50',
            'timeline_estimate' => 'nullable|string|max:100',
            'squad_composition' => 'nullable|string|max:255',
            'sla_commitment' => 'nullable|string|max:255',
            'recommended_for' => 'nullable|string',
            'features' => 'nullable|array',
            'cta_text' => 'nullable|string|max:100',
            'cta_action' => 'nullable|string|max:50',
            'cta_url' => 'nullable|string|max:500',
            'display_order' => 'integer',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
        ]);

        $plan->update($validated);

        return back()->with('success', 'Plan updated successfully.');
    }

    /**
     * Toggle the individual plan's published state.
     */
    public function togglePublish(Plan $plan): RedirectResponse
    {
        $plan->update([
            'is_published' => !$plan->is_published,
        ]);

        $status = $plan->is_published ? 'published' : 'draft';
        return back()->with('success', "Plan '{$plan->name}' moved to {$status}.");
    }

    /**
     * Master toggle for public site pricing visibility.
     */
    public function toggleSitePricing(Request $request): RedirectResponse
    {
        $show = $request->boolean('show_pricing');
        
        SiteSetting::updateOrCreate(
            ['key' => 'show_pricing_on_site'],
            ['value' => $show ? 'true' : 'false', 'group' => 'commercial']
        );

        if ($request->has('heading')) {
            SiteSetting::updateOrCreate(
                ['key' => 'pricing_section_heading'],
                ['value' => $request->input('heading'), 'group' => 'commercial']
            );
        }

        if ($request->has('subheading')) {
            SiteSetting::updateOrCreate(
                ['key' => 'pricing_section_subheading'],
                ['value' => $request->input('subheading'), 'group' => 'commercial']
            );
        }

        $stateMsg = $show ? 'Pricing section is now LIVE on the public site.' : 'Pricing section is now HIDDEN from the public site.';
        return back()->with('success', $stateMsg);
    }

    /**
     * Delete the specified plan.
     */
    public function destroy(Plan $plan): RedirectResponse
    {
        $plan->delete();

        return back()->with('success', 'Plan deleted successfully.');
    }
}
