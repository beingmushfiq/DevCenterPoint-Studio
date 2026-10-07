<?php

namespace Database\Seeders;

use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class SeoMetaSeeder extends Seeder
{
    /**
     * Correct the stored SEO meta description so it fits the ~160-character
     * window search engines render.
     *
     * Idempotent and non-destructive: each key is only rewritten when the value
     * currently in the database still equals the previous default. A description
     * an editor has customised in the admin panel is therefore never clobbered,
     * while a site still carrying the old over-long default is fixed in place.
     *
     * Needed because the full DatabaseSeeder only runs against an empty database,
     * so amending the default in the seeder alone would never reach a live site.
     */
    public function run(): void
    {
        $updates = [
            'seo_meta_description' => [
                // The old over-long default (195 chars) this replaces.
                'old' => 'DevCenterPoint is a custom software development studio in Dhaka, Bangladesh. We build SaaS platforms, web applications, ERP systems and AI-powered software for startups and enterprises worldwide.',
                // 150 chars, within the recommended 120-160 range.
                'new' => 'Custom software development studio in Dhaka, Bangladesh. DevCenterPoint builds SaaS platforms, web apps, ERP systems and AI products for global teams.',
            ],
        ];

        foreach ($updates as $key => $values) {
            $current = SiteSetting::where('key', $key)->value('value');

            // Absent or still the old default -> safe to write the corrected value.
            if ($current === null || $current === '' || $current === $values['old']) {
                SiteSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $values['new'], 'group' => 'seo']
                );
            }
        }
    }
}
