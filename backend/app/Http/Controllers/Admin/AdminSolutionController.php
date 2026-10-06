<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use App\Models\SolutionProduct;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminSolutionController extends Controller
{
    /**
     * Display a listing of the Solution Studio products.
     */
    public function index(): Response
    {
        $solutions = SolutionProduct::orderBy('display_order')->get();
        $showStudio = SiteSetting::where('key', 'show_solution_studio_on_site')->value('value') === 'true';

        return Inertia::render('Admin/Solutions/Index', [
            'solutions' => $solutions,
            'showSolutionStudioOnSite' => $showStudio,
        ]);
    }

    /**
     * Store a newly created solution product.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validatePayload($request);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        SolutionProduct::create($validated);

        return back()->with('success', 'Solution product created successfully.');
    }

    /**
     * Update the specified solution product.
     */
    public function update(Request $request, SolutionProduct $solutionProduct): RedirectResponse
    {
        $validated = $this->validatePayload($request, $solutionProduct->id);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $solutionProduct->update($validated);

        return back()->with('success', 'Solution product updated successfully.');
    }

    /**
     * Toggle an individual solution product's visibility.
     */
    public function toggleActive(SolutionProduct $solutionProduct): RedirectResponse
    {
        $solutionProduct->update([
            'is_active' => !$solutionProduct->is_active,
        ]);

        $status = $solutionProduct->is_active ? 'visible' : 'hidden';
        return back()->with('success', "Solution '{$solutionProduct->title}' is now {$status} on the public site.");
    }

    /**
     * Master toggle for public Solution Studio visibility.
     */
    public function toggleSiteStudio(Request $request): RedirectResponse
    {
        $show = $request->boolean('show_solution_studio');

        SiteSetting::updateOrCreate(
            ['key' => 'show_solution_studio_on_site'],
            ['value' => $show ? 'true' : 'false', 'group' => 'commercial']
        );

        $stateMsg = $show
            ? 'Solution Studio is now LIVE on the public site.'
            : 'Solution Studio is now HIDDEN from the public site.';
        return back()->with('success', $stateMsg);
    }

    /**
     * Delete the specified solution product.
     */
    public function destroy(SolutionProduct $solutionProduct): RedirectResponse
    {
        $solutionProduct->delete();

        return back()->with('success', 'Solution product deleted successfully.');
    }

    /**
     * Shared validation rules for store/update.
     */
    private function validatePayload(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'slug' => 'nullable|string|max:100|unique:solution_products,slug' . ($ignoreId ? ',' . $ignoreId : ''),
            'category' => 'required|string|max:100',
            'badge' => 'required|string|max:100',
            'title' => 'required|string|max:255',
            'tagline' => 'required|string',
            'icon_name' => 'required|string|max:50',
            'mockup_title' => 'required|string|max:255',
            'live_url' => 'nullable|string|max:500',
            'admin_url' => 'nullable|string|max:500',
            'demo_username' => 'nullable|string|max:100',
            'demo_password' => 'nullable|string|max:100',
            'demo_role' => 'nullable|string|max:100',
            'stats' => 'nullable|array',
            'activity_logs' => 'nullable|array',
            'business_outcomes' => 'nullable|array',
            'client_benefits' => 'nullable|array',
            'deliverables' => 'nullable|array',
            'sample_action_label' => 'nullable|string|max:100',
            'sample_action_toast' => 'nullable|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);
    }
}
