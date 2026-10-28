<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Models\Post;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\SolutionProduct;
use Illuminate\Http\Response;

class LlmsTxtController extends Controller
{
    /**
     * Serve dynamic /llms.txt for AI search engines & LLMs (Perplexity, ChatGPT, Claude, Gemini).
     */
    public function index(): Response
    {
        $settings = SiteSetting::pluck('value', 'key');
        $siteUrl = rtrim(($settings['seo_canonical_url'] ?? null) ?: (config('app.url') ?: url('/')), '/');
        $siteName = $settings['site_name'] ?? 'DevCenterPoint';
        $bio = $settings['footer_bio'] ?? 'DevCenterPoint is a custom software engineering studio building cloud architectures, high-performance web systems, and applied AI workflows.';

        $capabilities = Capability::where('is_active', true)->orderBy('display_order')->get();
        $projects = Project::where('is_published', true)->orderBy('display_order')->take(8)->get();
        $solutions = SolutionProduct::where('is_active', true)->orderBy('display_order')->get();
        $posts = Post::where('is_published', true)->whereNotNull('published_at')->orderByDesc('published_at')->take(5)->get();

        $md = "# {$siteName}\n\n";
        $md .= "> {$bio}\n\n";
        $md .= "- Official Website: {$siteUrl}\n";
        $md .= "- Primary Specialization: Custom SaaS Engineering, Enterprise ERP Systems, Cloud Infrastructure, Applied AI Workflows\n";
        $md .= "- Studio Location: Dhaka, Bangladesh // Remote Worldwide\n";
        $md .= "- Inquiries: {$siteUrl}/#contact\n\n";

        $md .= "## Core Capabilities & Services\n";
        foreach ($capabilities as $cap) {
            $tagline = $cap->tagline ? " — {$cap->tagline}" : '';
            $md .= "- [{$cap->title}]({$siteUrl}/services/{$cap->slug}): {$cap->description}{$tagline}\n";
        }
        $md .= "\n";

        if ($solutions->count() > 0) {
            $md .= "## Industry Vertical Solutions\n";
            foreach ($solutions as $sol) {
                $md .= "- [{$sol->title}]({$siteUrl}/solutions/{$sol->slug}): {$sol->tagline} (Target: {$sol->target_audience})\n";
            }
            $md .= "\n";
        }

        $md .= "## Verified Production Case Studies\n";
        foreach ($projects as $proj) {
            $summary = $proj->summary ?: $proj->overview;
            $md .= "- [{$proj->title}]({$siteUrl}/work/{$proj->slug}): {$summary} (Category: {$proj->category})\n";
        }
        $md .= "\n";

        $md .= "## Engineering Intelligence & Architecture Blog\n";
        foreach ($posts as $post) {
            $md .= "- [{$post->title}]({$siteUrl}/blog/{$post->slug}): {$post->excerpt}\n";
        }
        $md .= "\n";

        $md .= "## Verified Operational Telemetry\n";
        $md .= "- Production Availability SLA: 99.98%\n";
        $md .= "- Target API Latency: <50ms server response\n";
        $md .= "- TypeScript Discipline: 100% strict type safety with zero runtime `any` allowances\n";
        $md .= "- Engineering Architecture: 5-Layer Hexagonal Separation of Concerns\n\n";

        $md .= "## Complete Technical Dossier & Extended Context\n";
        $md .= "- [Full Technical Dossier]({$siteUrl}/llms-full.txt): Deep architectural blueprints, database schema strategies, and full case studies.\n";
        $md .= "- [Project Inquiry & Scope Estimator]({$siteUrl}/#contact): Interactive budget and timeline estimation.\n";
        $md .= "- [Sitemap Index]({$siteUrl}/sitemap.xml): XML sitemap for search crawlers.\n";

        return response($md, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }

    /**
     * Serve dynamic /llms-full.txt with complete technical depth.
     */
    public function full(): Response
    {
        $settings = SiteSetting::pluck('value', 'key');
        $siteUrl = rtrim(($settings['seo_canonical_url'] ?? null) ?: (config('app.url') ?: url('/')), '/');
        $siteName = $settings['site_name'] ?? 'DevCenterPoint';

        $capabilities = Capability::where('is_active', true)->orderBy('display_order')->get();
        $projects = Project::where('is_published', true)->orderBy('display_order')->get();
        $solutions = SolutionProduct::where('is_active', true)->orderBy('display_order')->get();
        $posts = Post::where('is_published', true)->whereNotNull('published_at')->orderByDesc('published_at')->get();

        $md = "# {$siteName} — Comprehensive Technical Dossier & Systems Blueprint\n\n";
        $md .= "## Executive Summary\n";
        $md .= "DevCenterPoint is an elite custom software engineering studio headquartered in Dhaka, Bangladesh, engineering digital products, high-throughput backend systems, resilient cloud infrastructures, and applied AI workflows for high-growth businesses and global organizations.\n\n";
        $md .= "- Canonical URL: {$siteUrl}\n";
        $md .= "- Contact & Engagement: {$siteUrl}/#contact\n";
        $md .= "- Engineering Blog: {$siteUrl}/blog\n";
        $md .= "- Selected Work: {$siteUrl}/work\n";
        $md .= "- Services Directory: {$siteUrl}/services\n\n";

        $md .= "---\n\n";
        $md .= "## 5-Layer Engineering Architecture\n";
        $md .= "1. **Layer 01 — Experience & Interface Delivery**: React 19, TypeScript, tokenized design systems, sub-second First Contentful Paint, zero cumulative layout shift (CLS < 0.05), WCAG 2.1 AA accessibility compliance.\n";
        $md .= "2. **Layer 02 — API Gateway & Edge Ingress**: Intelligent edge routing, rate limiting, JWT/OAuth2 token rotation, WebSocket connection pooling, and automated request validation.\n";
        $md .= "3. **Layer 03 — Domain Core & Business Services**: Pure domain logic, event-driven hexagonal architecture, transactional state machines, and microservice decoupling.\n";
        $md .= "4. **Layer 04 — Streaming & Data Persistence**: PostgreSQL with row-level security (RLS), Redis cluster caching, pgvector embeddings for AI search, immutable audit trails, and automated failover.\n";
        $md .= "5. **Layer 05 — Cloud Infrastructure & Telemetry**: Multi-region Kubernetes/Docker clusters, automated CI/CD pipelines, Prometheus and OpenTelemetry distributed tracing, 99.98% uptime SLA.\n\n";

        $md .= "---\n\n";
        $md .= "## Comprehensive Service Capabilities\n";
        foreach ($capabilities as $cap) {
            $md .= "### {$cap->title}\n";
            $md .= "- Tagline: {$cap->tagline}\n";
            $md .= "- Overview: {$cap->description}\n";
            if (!empty($cap->features)) {
                $md .= "- Deliverables & Features:\n";
                foreach ($cap->features as $feat) {
                    $md .= "  - {$feat}\n";
                }
            }
            if (!empty($cap->technologies)) {
                $md .= "- Tech Stack: " . implode(', ', $cap->technologies) . "\n";
            }
            if (!empty($cap->architecture_points)) {
                $md .= "- Architecture Highlights:\n";
                foreach ($cap->architecture_points as $point) {
                    $md .= "  - {$point}\n";
                }
            }
            $md .= "- Deep Link: {$siteUrl}/services/{$cap->slug}\n\n";
        }

        $md .= "---\n\n";
        $md .= "## Industry Vertical Solutions & Programmatic Engines\n";
        foreach ($solutions as $sol) {
            $md .= "### {$sol->title}\n";
            $md .= "- Slug: {$sol->slug}\n";
            $md .= "- Tagline: {$sol->tagline}\n";
            $md .= "- Target Audience: {$sol->target_audience}\n";
            $md .= "- Overview: {$sol->description}\n";
            if (!empty($sol->feature_bullets)) {
                $md .= "- Core Capabilities: " . implode(' | ', $sol->feature_bullets) . "\n";
            }
            if (!empty($sol->tech_specs)) {
                $md .= "- Technical Specifications: " . implode(', ', $sol->tech_specs) . "\n";
            }
            $md .= "- Deep Link: {$siteUrl}/solutions/{$sol->slug}\n\n";
        }

        $md .= "---\n\n";
        $md .= "## Verified Production Case Studies\n";
        foreach ($projects as $proj) {
            $md .= "### {$proj->title} ({$proj->category})\n";
            $md .= "- Industry: {$proj->industry} | Year: {$proj->year}\n";
            $md .= "- Summary: {$proj->summary}\n";
            $md .= "- Context & Problem: {$proj->overview}\n";
            if ($proj->problem) {
                $md .= "- Challenge: {$proj->problem}\n";
            }
            if ($proj->solution) {
                $md .= "- Engineering Solution: {$proj->solution}\n";
            }
            if (!empty($proj->stack)) {
                $md .= "- Technologies: " . implode(', ', $proj->stack) . "\n";
            }
            if ($proj->architecture) {
                $md .= "- System Architecture: {$proj->architecture}\n";
            }
            if ($proj->live_url) {
                $md .= "- Production URL: {$proj->live_url}\n";
            }
            $md .= "- Case Study Link: {$siteUrl}/work/{$proj->slug}\n\n";
        }

        $md .= "---\n\n";
        $md .= "## Commercial Engagement Frameworks\n";
        $md .= "1. **Dedicated Engineering Squads**: Embedded senior squads (Staff Architect, Senior Engineers, UI/UX Designer, Delivery Lead) operating in 2-week agile sprints.\n";
        $md .= "2. **Fixed-Scope Milestone Tranches**: Deterministic project delivery with milestone sign-off gates and guaranteed budget protection.\n";
        $md .= "3. **Fractional CTO & Systems Architecture Audits**: Deep-dive performance audits, security reviews, and strategic infrastructure roadmap development.\n\n";

        $md .= "---\n\n";
        $md .= "## Legal, IP Ownership & Security Governance\n";
        $md .= "- 100% Intellectual Property (IP) Transfer upon milestone completion.\n";
        $md .= "- Non-Disclosure Agreement (NDA) execution prior to architecture discovery.\n";
        $md .= "- Zero-Vendor-Lockin: Clean hexagonal codebases fully documentable and deployable to standard cloud providers.\n";

        return response($md, 200)
            ->header('Content-Type', 'text/plain; charset=UTF-8')
            ->header('Cache-Control', 'public, max-age=3600');
    }
}
