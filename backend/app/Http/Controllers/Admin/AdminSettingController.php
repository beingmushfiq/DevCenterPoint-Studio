<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SiteSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingController extends Controller
{
    /**
     * Keys owned by AdminAppearanceController — excluded here to avoid clobbering.
     */
    private const APPEARANCE_KEYS = [
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
     * Display a listing of site settings and SEO metadata.
     */
    public function index(): Response
    {
        $settings = SiteSetting::all();

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update site settings.
     */
    public function update(Request $request): RedirectResponse
    {
        $data = $request->except(['_token', '_method', ...self::APPEARANCE_KEYS]);

        foreach ($data as $key => $value) {
            SiteSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Site settings updated successfully.');
    }
}
