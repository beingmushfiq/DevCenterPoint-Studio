<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSectionController extends Controller
{
    /**
     * Display a listing of page sections and blocks.
     */
    public function index(): Response
    {
        $sections = PageSection::orderBy('section_key')->get();

        return Inertia::render('Admin/PageBlocks/Index', [
            'sections' => $sections,
        ]);
    }

    /**
     * Update or create a page section block.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'section_key' => 'required|string|max:100',
            'block_key' => 'required|string|max:100',
            'content' => 'required|string',
            'is_visible' => 'boolean',
        ]);

        PageSection::updateOrCreate(
            ['section_key' => $validated['section_key'], 'block_key' => $validated['block_key']],
            [
                'content' => $validated['content'],
                'is_visible' => $validated['is_visible'] ?? true,
            ]
        );

        return back()->with('success', 'Section block updated successfully.');
    }
}
