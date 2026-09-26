<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Models\Faq;
use App\Models\Milestone;
use App\Models\PageSection;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public DevCenterPoint Studio landing page.
     */
    public function index(): Response
    {
        $capabilities = Capability::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $projects = Project::where('is_published', true)
            ->orderBy('display_order')
            ->get();

        $milestones = Milestone::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $faqs = Faq::where('is_published', true)
            ->orderBy('display_order')
            ->get();

        $team = TeamMember::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $rawSections = PageSection::where('is_visible', true)->get();
        $sections = [];
        foreach ($rawSections as $section) {
            $decoded = json_decode($section->content, true);
            $sections[$section->section_key][$section->block_key] = $decoded !== null ? $decoded : $section->content;
        }

        $settings = SiteSetting::pluck('value', 'key');

        return Inertia::render('Public/Home', [
            'capabilities' => $capabilities,
            'projects' => $projects,
            'milestones' => $milestones,
            'faqs' => $faqs,
            'team' => $team,
            'pageSections' => $sections,
            'siteSettings' => $settings,
        ]);
    }
}
