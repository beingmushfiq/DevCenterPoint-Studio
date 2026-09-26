<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminProjectController extends Controller
{
    /**
     * Display a listing of projects.
     */
    public function index(): Response
    {
        $projects = Project::orderBy('display_order')->get();

        return Inertia::render('Admin/Projects/Index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'category' => 'required|string|max:100',
            'client' => 'nullable|string|max:255',
            'year' => 'required|string|max:10',
            'duration' => 'nullable|string|max:50',
            'overview' => 'required|string',
            'problem' => 'required|string',
            'solution' => 'required|string',
            'metrics' => 'nullable|array',
            'tech_stack' => 'required|array',
            'thumbnail_url' => 'required|string|max:500',
            'hero_image_url' => 'nullable|string|max:500',
            'live_url' => 'nullable|string|max:500',
            'github_url' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        Project::create($validated);

        return back()->with('success', 'Project created successfully.');
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'tagline' => 'nullable|string|max:255',
            'category' => 'required|string|max:100',
            'client' => 'nullable|string|max:255',
            'year' => 'required|string|max:10',
            'duration' => 'nullable|string|max:50',
            'overview' => 'required|string',
            'problem' => 'required|string',
            'solution' => 'required|string',
            'metrics' => 'nullable|array',
            'tech_stack' => 'required|array',
            'thumbnail_url' => 'required|string|max:500',
            'hero_image_url' => 'nullable|string|max:500',
            'live_url' => 'nullable|string|max:500',
            'github_url' => 'nullable|string|max:500',
            'is_featured' => 'boolean',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        $project->update($validated);

        return back()->with('success', 'Project updated successfully.');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Project $project): RedirectResponse
    {
        $project->delete();

        return back()->with('success', 'Project deleted successfully.');
    }
}
