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
     * Idempotent and non-destructive: the key is only rewritten when the value
     * currently in the database still equals one of the superseded defaults
     * below. A description an editor has customised in the admin panel is
     * therefore never clobbered, while a site still carrying an old default is
     * fixed in place.
     *
     * Needed because the full DatabaseSeeder only runs against an empty
     * database, so amending the default there would never reach a live site.
     * Every historical default is listed because production was seeded at a
     * different point in the rebrand than any given commit, so a single "old"
     * value would silently miss the string actually stored on the server.
     */
    public function run(): void
    {
        $updates = [
            'seo_meta_description' => [
                // Superseded defaults, newest first. The 204-char entry is the
                // one live production currently carries (pre-rebrand seeding,
                // still containing the "zero technical debt" claim).
                'old' => [
                    'DevCenterPoint designs and engineers mission-critical software products, scalable SaaS platforms, intelligent AI systems, and cloud infrastructure engineered for zero technical debt and real-world impact.',
                    'DevCenterPoint is a custom software development studio in Dhaka, Bangladesh. We build SaaS platforms, web applications, ERP systems and AI-powered software for startups and enterprises worldwide.',
                    'Elite software engineering consultancy founded by Mushfiq specializing in scalable web systems, AI pipelines, and resilient cloud architectures.',
                ],
                // 150 chars, within the recommended 120-160 range.
                'new' => 'Custom software development studio in Dhaka, Bangladesh. DevCenterPoint builds SaaS platforms, web apps, ERP systems and AI products for global teams.',
            ],
        ];

        foreach ($updates as $key => $values) {
            $current = SiteSetting::where('key', $key)->value('value');

            // Absent, empty, or still a superseded default -> safe to correct.
            if ($current === null || $current === '' || in_array($current, $values['old'], true)) {
                SiteSetting::updateOrCreate(
                    ['key' => $key],
                    ['value' => $values['new'], 'group' => 'seo']
                );
            }
        }
    }
}
