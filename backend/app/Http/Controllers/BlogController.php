<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ProvidesPublicCmsPayload;
use App\Models\Post;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    use ProvidesPublicCmsPayload;

    /**
     * Display the engineering blog index.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Blog/Index', [
            ...$this->cmsPayload(),
            'posts' => Post::where('is_published', true)
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->orderByDesc('published_at')
                ->get(),
        ]);
    }

    /**
     * Display a single article, resolved by its slug.
     */
    public function show(Post $post): Response
    {
        abort_unless(
            $post->is_published && $post->published_at && $post->published_at->isPast(),
            404
        );

        return Inertia::render('Public/Blog/Show', [
            ...$this->cmsPayload(),
            'post' => $post,
            'related' => Post::where('is_published', true)
                ->whereNotNull('published_at')
                ->where('published_at', '<=', now())
                ->where('id', '!=', $post->id)
                ->orderByDesc('published_at')
                ->limit(3)
                ->get(),
        ]);
    }
}
