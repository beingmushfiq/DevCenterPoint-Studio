<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ProvidesPublicCmsPayload;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class WorkController extends Controller
{
    use ProvidesPublicCmsPayload;

    /**
     * Display the archive of published case studies.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Work/Index', [
            ...$this->cmsPayload(),
            'works' => Project::where('is_published', true)
                ->orderBy('display_order')
                ->get(),
        ]);
    }

    /**
     * Display a single case study, resolved by its slug.
     */
    public function show(Project $project): Response
    {
        abort_unless($project->is_published, 404);

        return Inertia::render('Public/Work/Show', [
            ...$this->cmsPayload(),
            'work' => $project,
            'related' => Project::where('is_published', true)
                ->where('id', '!=', $project->id)
                ->orderBy('display_order')
                ->limit(3)
                ->get(),
        ]);
    }
}
