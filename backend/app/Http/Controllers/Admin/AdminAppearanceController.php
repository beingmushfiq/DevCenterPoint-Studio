<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminAppearanceController extends Controller
{
    /**
     * Template keys and the settings this controller is allowed to write.
     */
    private const HEADER_TEMPLATES = ['glass-pill', 'solid-bar', 'mega-menu'];

    private const FOOTER_TEMPLATES = ['four-column', 'compact-row', 'mega-sitemap'];

    private const ALLOWED_SETTING_KEYS = [
        'header_template',
        'footer_template',
        'booking_url',
        'booking_cta_label',
        'booking_in_header',
        'booking_in_footer',
        'header_nav_links',
        'header_drawer_links',
        'footer_columns',
        'footer_ecosystem_links',
        'footer_bio',
        'footer_status_label',
        'footer_tagline',
        'footer_copyright_text',
    ];

    /**
     * Display the header & footer appearance editor.
     */
    public function index(): Response
    {
        $settings = SiteSetting::where('group', 'appearance')->pluck('value', 'key');

        $overrides = [];
        foreach (['header_override', 'footer_override'] as $blockKey) {
            $section = PageSection::where('section_key', 'appearance')
                ->where('block_key', $blockKey)
                ->first();

            $decoded = $section ? json_decode($section->content, true) : null;

            $overrides[$blockKey] = [
                'html' => $decoded['html'] ?? '',
                'css' => $decoded['css'] ?? '',
                'js' => $decoded['js'] ?? '',
                'mode' => $decoded['mode'] ?? 'off',
            ];
        }

        return Inertia::render('Admin/Appearance/Index', [
            'settings' => $settings,
            'overrides' => $overrides,
            'headerTemplates' => self::HEADER_TEMPLATES,
            'footerTemplates' => self::FOOTER_TEMPLATES,
        ]);
    }

    /**
     * Update template selection and structured header/footer content.
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'header_template' => 'required|string|in:' . implode(',', self::HEADER_TEMPLATES),
            'footer_template' => 'required|string|in:' . implode(',', self::FOOTER_TEMPLATES),
            'booking_url' => 'nullable|url|max:500',
            'booking_cta_label' => 'nullable|string|max:100',
            'booking_in_header' => 'required|in:true,false',
            'booking_in_footer' => 'required|in:true,false',
            'header_nav_links' => 'nullable|array',
            'header_nav_links.*.label' => 'required|string|max:100',
            'header_nav_links.*.href' => 'required|string|max:500',
            'header_nav_links.*.note' => 'nullable|string|max:200',
            'header_drawer_links' => 'nullable|array',
            'header_drawer_links.*.label' => 'required|string|max:100',
            'header_drawer_links.*.href' => 'required|string|max:500',
            'header_drawer_links.*.note' => 'nullable|string|max:200',
            'footer_columns' => 'nullable|array',
            'footer_columns.*.title' => 'required|string|max:100',
            'footer_columns.*.links' => 'nullable|array',
            'footer_columns.*.links.*.label' => 'required|string|max:100',
            'footer_columns.*.links.*.href' => 'required|string|max:500',
            'footer_ecosystem_links' => 'nullable|array',
            'footer_ecosystem_links.*.label' => 'required|string|max:100',
            'footer_ecosystem_links.*.href' => 'required|string|max:500',
            'footer_ecosystem_links.*.note' => 'nullable|string|max:100',
            'footer_ecosystem_links.*.accent' => 'nullable|string|max:20',
            'footer_bio' => 'nullable|string|max:1000',
            'footer_status_label' => 'nullable|string|max:150',
            'footer_tagline' => 'nullable|string|max:200',
            'footer_copyright_text' => 'nullable|string|max:300',
        ]);

        foreach (self::ALLOWED_SETTING_KEYS as $key) {
            if (! array_key_exists($key, $validated)) {
                continue;
            }

            $value = $validated[$key];

            if (is_array($value)) {
                $value = json_encode($value);
            }

            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value ?? '', 'group' => 'appearance']
            );
        }

        return back()->with('success', 'Appearance settings updated successfully.');
    }

    /**
     * Save a raw HTML/CSS/JS override for the header or footer.
     */
    public function saveOverride(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'region' => 'required|in:header,footer',
            'html' => 'nullable|string|max:102400',
            'css' => 'nullable|string|max:51200',
            'js' => 'nullable|string|max:51200',
            'mode' => 'required|in:off,preview,live',
        ]);

        PageSection::updateOrCreate(
            ['section_key' => 'appearance', 'block_key' => $validated['region'] . '_override'],
            [
                'content' => json_encode([
                    'html' => $validated['html'] ?? '',
                    'css' => $validated['css'] ?? '',
                    'js' => $validated['js'] ?? '',
                    'mode' => $validated['mode'],
                ]),
                'is_visible' => $validated['mode'] === 'live',
            ]
        );

        $message = $validated['mode'] === 'live'
            ? 'Override published to the live site.'
            : 'Override saved.';

        return back()->with('success', $message);
    }
}
