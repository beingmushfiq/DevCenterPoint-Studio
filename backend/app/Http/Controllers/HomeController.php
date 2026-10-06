<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Models\Faq;
use App\Models\Milestone;
use App\Models\PageSection;
use App\Models\Plan;
use App\Models\Project;
use App\Models\SandboxApp;
use App\Models\SiteSetting;
use App\Models\SolutionProduct;
use App\Models\TeamMember;
use App\Models\Testimonial;
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

        $testimonials = Testimonial::where('is_published', true)
            ->orderBy('display_order')
            ->get();

        $sandboxApps = SandboxApp::where('is_active', true)
            ->orderBy('display_order')
            ->get();

        $rawSections = PageSection::where('is_visible', true)->get();
        $sections = [];
        foreach ($rawSections as $section) {
            $decoded = json_decode($section->content, true);
            $sections[$section->section_key][$section->block_key] = $decoded !== null ? $decoded : $section->content;
        }

        $settings = SiteSetting::pluck('value', 'key');

        $plans = [];
        if (($settings['show_pricing_on_site'] ?? 'false') === 'true') {
            $plans = Plan::where('is_published', true)
                ->orderBy('display_order')
                ->get();
        }

        $solutions = [];
        if (($settings['show_solution_studio_on_site'] ?? 'false') === 'true') {
            $solutions = SolutionProduct::where('is_active', true)
                ->orderBy('display_order')
                ->get();
        }

        return Inertia::render('Public/Home', [
            'capabilities' => $capabilities,
            'projects' => $projects,
            'milestones' => $milestones,
            'faqs' => $faqs,
            'team' => $team,
            'testimonials' => $testimonials,
            'sandboxApps' => $sandboxApps,
            'plans' => $plans,
            'solutionProducts' => $solutions,
            'pageSections' => $sections,
            'siteSettings' => $settings,
        ]);
    }
}
