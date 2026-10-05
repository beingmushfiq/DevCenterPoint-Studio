<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capability;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminCapabilityController extends Controller
{
    /**
     * Display a listing of capabilities.
     */
    public function index(): Response
    {
        $capabilities = Capability::orderBy('display_order')->get();

        return Inertia::render('Admin/Capabilities/Index', [
            'capabilities' => $capabilities,
        ]);
    }

    /**
     * Update the specified capability.
     */
    public function update(Request $request, Capability $capability): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'tagline' => 'required|string|max:255',
            'description' => 'required|string',
            'icon_name' => 'required|string|max:100',
            'features' => 'required|array',
            'technologies' => 'required|array',
            'architecture_points' => 'nullable|array',
            'code_snippet' => 'nullable|string',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $capability->update($validated);

        return back()->with('success', 'Capability updated successfully.');
    }
}
