<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPostController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(): Response
    {
        $posts = Post::orderByDesc('published_at')->orderBy('display_order')->get();

        return Inertia::render('Admin/Posts/Index', [
            'posts' => $posts,
        ]);
    }

    /**
     * Store a newly created post.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'author_name' => 'required|string|max:100',
            'excerpt' => 'required|string|max:500',
            'body' => 'required|string',
            'cover_image_url' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        Post::create($validated);

        return back()->with('success', 'Post created successfully.');
    }

    /**
     * Update the specified post.
     */
    public function update(Request $request, Post $post): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'author_name' => 'required|string|max:100',
            'excerpt' => 'required|string|max:500',
            'body' => 'required|string',
            'cover_image_url' => 'nullable|string|max:500',
            'tags' => 'nullable|array',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'display_order' => 'integer',
            'is_published' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        $post->update($validated);

        return back()->with('success', 'Post updated successfully.');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return back()->with('success', 'Post deleted successfully.');
    }
}
