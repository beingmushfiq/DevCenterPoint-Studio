<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ProvidesPublicCmsPayload;
use App\Models\Project;
use App\Models\SolutionProduct;
use Inertia\Inertia;
use Inertia\Response;

class SolutionController extends Controller
{
    use ProvidesPublicCmsPayload;

    /**
     * Display a programmatic industry solution landing page.
     */
    public function show(SolutionProduct $solution): Response
    {
        abort_if(! $solution->is_active, 404);

        // Find relevant case studies linked by category
        $relatedProjects = Project::where('is_published', true)
            ->where(function ($query) use ($solution) {
                $query->where('category', 'like', "%{$solution->category}%")
                    ->orWhere('industry', 'like', "%{$solution->category}%");
            })
            ->take(3)
            ->get();

        if ($relatedProjects->isEmpty()) {
            $relatedProjects = Project::where('is_published', true)->take(3)->get();
        }

        return Inertia::render('Public/Solutions/Show', array_merge($this->cmsPayload(), [
            'solution' => $solution,
            'relatedProjects' => $relatedProjects,
        ]));
    }
}
