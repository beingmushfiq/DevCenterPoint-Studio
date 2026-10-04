<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminTeamController extends Controller
{
    public function index(): Response
    {
        $team = TeamMember::orderBy('display_order')->get();

        return Inertia::render('Admin/Team/Index', [
            'team' => $team,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'required|string',
            'avatar_url' => 'nullable|string|max:500',
            'social_links' => 'nullable|array',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        TeamMember::create($validated);

        return back()->with('success', 'Team member added successfully.');
    }

    public function update(Request $request, TeamMember $teamMember): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'bio' => 'required|string',
            'avatar_url' => 'nullable|string|max:500',
            'social_links' => 'nullable|array',
            'display_order' => 'integer',
            'is_active' => 'boolean',
        ]);

        $teamMember->update($validated);

        return back()->with('success', 'Team member updated successfully.');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $teamMember->delete();

        return back()->with('success', 'Team member removed.');
    }
}
