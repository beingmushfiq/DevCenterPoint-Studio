<?php

namespace App\Http\Controllers;

use App\Models\Capability;
use App\Models\Faq;
use App\Models\PageSection;
use App\Models\Plan;
use App\Models\Post;
use App\Models\Project;
use App\Models\SiteSetting;
use App\Models\Testimonial;
use Illuminate\Http\Response;
use Illuminate\Support\Carbon;

class SitemapController extends Controller
{
    /**
     * Serve the XML sitemap.
     *
     * Every indexable public URL is emitted from CMS content so `lastmod` stays
     * accurate and new services, case studies or articles appear automatically.
     * Hash fragments (`/#work`) are not separate documents to a crawler, so only
     * real routes are listed.
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

        $urls = [];
        $urls[] = $this->entry(
            $siteUrl.'/',
            $this->lastModified(),
            'weekly',
            '1.0',
            [[$ogImage, ($settings['seo_meta_title'] ?? null) ?: 'DevCenterPoint — Digital Products, Software & Intelligent Systems']]
        );

        $urls[] = $this->entry($siteUrl.'/services', $this->lastModified([Capability::class]), 'weekly', '0.9');
        $urls[] = $this->entry($siteUrl.'/work', $this->lastModified([Project::class]), 'weekly', '0.9');
        $urls[] = $this->entry($siteUrl.'/blog', $this->lastModified([Post::class]), 'daily', '0.8');

        foreach (Capability::where('is_active', true)->orderBy('display_order')->get() as $capability) {
            $urls[] = $this->entry(
                $siteUrl.'/services/'.$capability->slug,
                $this->stamp($capability->updated_at),
                'monthly',
                '0.8'
            );
        }

        foreach (Project::where('is_published', true)->orderBy('display_order')->get() as $project) {
            $urls[] = $this->entry(
                $siteUrl.'/work/'.$project->slug,
                $this->stamp($project->updated_at),
                'monthly',
                '0.7'
            );
        }

        $posts = Post::where('is_published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at')
            ->get();

        foreach ($posts as $post) {
            $urls[] = $this->entry(
                $siteUrl.'/blog/'.$post->slug,
                $this->stamp($post->updated_at),
                'monthly',
                '0.7',
                $post->cover_image_url ? [[$this->absolute($post->cover_image_url, $siteUrl), $post->title]] : []
            );
        }

        $xml = '<?xml version="1.0" encoding="UTF-8"?>'."\n";
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" '
              .'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">'."\n";
        $xml .= implode('', $urls);
        $xml .= "</urlset>\n";

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    /**
     * Render one <url> block.
     *
     * @param  array<int, array{0: string, 1: string}>  $images
     */
    protected function entry(
        string $loc,
        string $lastmod,
        string $changefreq,
        string $priority,
        array $images = []
    ): string {
        $xml = "  <url>\n";
        $xml .= '    <loc>'.$this->esc($loc)."</loc>\n";
        $xml .= '    <lastmod>'.$this->esc($lastmod)."</lastmod>\n";
        $xml .= '    <changefreq>'.$changefreq."</changefreq>\n";
        $xml .= '    <priority>'.$priority."</priority>\n";
        foreach ($images as [$imageLoc, $imageTitle]) {
            $xml .= "    <image:image>\n";
            $xml .= '      <image:loc>'.$this->esc($imageLoc)."</image:loc>\n";
            $xml .= '      <image:title>'.$this->esc($imageTitle)."</image:title>\n";
            $xml .= "    </image:image>\n";
        }
        $xml .= "  </url>\n";

        return $xml;
    }

    /**
     * Absolute URL for a CMS image path, which may be stored relative.
     */
    protected function absolute(string $path, string $siteUrl): string
    {
        return preg_match('#^https?://#', $path)
            ? $path
            : $siteUrl.'/'.ltrim($path, '/');
    }

    /**
     * The most recent `updated_at` across the given (or every public) content
     * table, formatted as a W3C date. Falls back to today when the tables are empty.
     *
     * @param  array<int, class-string>|null  $models
     */
    protected function lastModified(?array $models = null): string
    {
        $models = $models ?? [
            Project::class,
            Capability::class,
            Faq::class,
            Plan::class,
            Post::class,
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

        return $latest ? $this->stamp($latest) : now()->toAtomString();
    }

    protected function stamp(mixed $value): string
    {
        return Carbon::parse($value)->toAtomString();
    }

    protected function esc(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
    }
}
