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

        $content = trim($validated['content']);
        if (str_starts_with($content, '{') || str_starts_with($content, '[')) {
            json_decode($content);
            if (json_last_error() !== JSON_ERROR_NONE) {
                return back()->withErrors(['content' => 'Invalid JSON syntax: ' . json_last_error_msg()]);
            }
        }

        PageSection::updateOrCreate(
            ['section_key' => $validated['section_key'], 'block_key' => $validated['block_key']],
            [
                'content' => $content,
                'is_visible' => $validated['is_visible'] ?? true,
            ]
        );

        return back()->with('success', 'Section block updated successfully.');
    }
}
