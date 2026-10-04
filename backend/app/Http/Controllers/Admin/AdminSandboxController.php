<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SandboxApp;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSandboxController extends Controller
{
    public function index(): Response
    {
        $sandboxApps = SandboxApp::orderBy('display_order')->get();

        return Inertia::render('Admin/Sandbox/Index', [
            'sandboxApps' => $sandboxApps,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:100|unique:sandbox_apps,slug',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'badge' => 'required|string|max:100',
            'description' => 'required|string',
            'live_url' => 'required|url|max:500',
            'admin_url' => 'nullable|url|max:500',
            'accent_color' => 'required|string|max:50',
            'icon_name' => 'required|string|max:50',
            'credentials_username' => 'nullable|string|max:100',
            'credentials_password' => 'nullable|string|max:100',
            'roles' => 'nullable|array',
            'credentials_notes' => 'nullable|string',
            'features' => 'nullable|array',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        SandboxApp::create($validated);

        return back()->with('success', 'Sandbox application environment registered successfully.');
    }

    public function update(Request $request, SandboxApp $sandboxApp): RedirectResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|max:100|unique:sandbox_apps,slug,' . $sandboxApp->id,
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'badge' => 'required|string|max:100',
            'description' => 'required|string',
            'live_url' => 'required|url|max:500',
            'admin_url' => 'nullable|url|max:500',
            'accent_color' => 'required|string|max:50',
            'icon_name' => 'required|string|max:50',
            'credentials_username' => 'nullable|string|max:100',
            'credentials_password' => 'nullable|string|max:100',
            'roles' => 'nullable|array',
            'credentials_notes' => 'nullable|string',
            'features' => 'nullable|array',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $sandboxApp->update($validated);

        return back()->with('success', 'Sandbox application environment updated successfully.');
    }

    public function destroy(SandboxApp $sandboxApp): RedirectResponse
    {
        $sandboxApp->delete();

        return back()->with('success', 'Sandbox environment removed.');
    }
}
