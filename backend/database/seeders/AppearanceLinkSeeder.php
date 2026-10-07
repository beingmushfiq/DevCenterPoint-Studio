<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class AppearanceLinkSeeder extends Seeder
{
    /**
     * Repoint the header, drawer and footer navigation settings at real URLs.
     *
     * Idempotent: each key is matched on its name and written in place, so the
     * deploy script can re-run this on an already-populated production database.
     * It exists because the full DatabaseSeeder only runs when the database is
     * empty, so a corrected default would otherwise never reach a live site that
     * still holds the previous hash-only links.
     *
     * Links at dedicated routes use real paths so crawlers can follow them.
     * Homepage-only sections use `/#anchor` so they still resolve when the
     * header or footer is rendered on a standalone page. `#contact` stays
     * in-page because every public page renders the inquiry section.
     */
    public function run(): void
    {
        $settings = [
            'header_nav_links' => [
                ['label' => 'Work', 'href' => '/work'],
                ['label' => 'Services', 'href' => '/services'],
                ['label' => 'Blog', 'href' => '/blog'],
                ['label' => 'Architecture', 'href' => '/#architecture'],
                ['label' => 'Process', 'href' => '/#process'],
            ],
            'header_drawer_links' => [
                ['label' => 'Selected Work', 'href' => '/work', 'note' => '9 Production Systems'],
                ['label' => 'Services & Capabilities', 'href' => '/services', 'note' => 'Full-stack & AI'],
                ['label' => 'Engineering Blog', 'href' => '/blog', 'note' => 'Guides & Case Notes'],
                ['label' => 'Sprint Methodology', 'href' => '/#process', 'note' => 'Discovery to Deployment'],
                ['label' => 'Start Project Collaboration', 'href' => '/#contact', 'note' => 'Scope & Architecture Estimator'],
            ],
            'footer_columns' => [
                [
                    'title' => 'Navigation',
                    'links' => [
                        ['label' => 'Services', 'href' => '/services'],
                        ['label' => 'Selected Work', 'href' => '/work'],
                        ['label' => 'Engineering Blog', 'href' => '/blog'],
                        ['label' => 'Architecture', 'href' => '/#architecture'],
                        ['label' => 'Tech Ecosystem', 'href' => '/#tech'],
                        ['label' => 'Lifecycle Process', 'href' => '/#process'],
                        ['label' => 'Principles', 'href' => '/#about'],
                        ['label' => 'FAQ & Engagement', 'href' => '/#faq'],
                        ['label' => 'Start Project', 'href' => '#contact'],
                    ],
                ],
            ],
        ];

        foreach ($settings as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => json_encode($value), 'group' => 'appearance']
            );
        }
    }
}
