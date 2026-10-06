<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Models\Faq;
use App\Models\PageSection;
use App\Models\Plan;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    /**
     * Serve the XML sitemap.
     *
     * The public site is a single Inertia page, so `/` is the only crawlable
     * URL: hash fragments (`/#work`) are not separate documents to a crawler and
     * were removed in favour of one authoritative entry whose `lastmod` tracks
     * the most recent CMS edit.
     */
    public function index(): Response
    {
        $settings = SiteSetting::pluck('value', 'key');

        $siteUrl = rtrim(
            ($settings['seo_canonical_url'] ?? null) ?: (config('app.url') ?: url('/')),
            '/'
        );

        $ogImage = ($settings['seo_og_image'] ?? null) ?: '/og-image.png';
        if (! preg_match('#^https?://#', $ogImage)) {
            $ogImage = $siteUrl.'/'.ltrim($ogImage, '/');
        }

        $lastmod = $this->lastModified();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
              .'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'."\n";
        $xml .= "  <url>\n";
        $xml .= '    <loc>'.$this->esc($siteUrl.'/')."</loc>\n";
        $xml .= '    <lastmod>'.$this->esc($lastmod)."</lastmod>\n";
        $xml .= "    <changefreq>weekly</changefreq>\n";
        $xml .= "    <priority>1.0</priority>\n";
        $xml .= "    <image:image>\n";
        $xml .= '      <image:loc>'.$this->esc($ogImage)."</image:loc>\n";
        $xml .= '      <image:title>'.$this->esc(
            ($settings['seo_meta_title'] ?? null) ?: 'DevCenterPoint — Digital Products, Software & Intelligent Systems'
        )."</image:title>\n";
        $xml .= "    </image:image>\n";
        $xml .= "  </url>\n";
        $xml .= "</urlset>\n";

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    /**
     * The most recent `updated_at` across every publicly rendered content table,
     * formatted as a W3C date. Falls back to today when the tables are empty.
     */
    protected function lastModified(): string
    {
        $models = [
            Project::class,
            Capability::class,
            Faq::class,
            Plan::class,
            Testimonial::class,
            PageSection::class,
            SiteSetting::class,
        ];

        $latest = null;

        foreach ($models as $model) {
            $value = $model::max('updated_at');
            if ($value && (! $latest || $value > $latest)) {
                $latest = $value;
            }
        }

        return $latest
            ? \Illuminate\Support\Carbon::parse($latest)->toAtomString()
            : now()->toAtomString();
    }

    protected function esc(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
