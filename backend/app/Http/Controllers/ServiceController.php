<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ProvidesPublicCmsPayload;
use App\Models\Capability;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    use ProvidesPublicCmsPayload;

    /**
     * Display the index of engineering services (CMS capabilities).
     */
    public function index(): Response
    {
        return Inertia::render('Public/Services/Index', [
            ...$this->cmsPayload(),
            'services' => Capability::where('is_active', true)
                ->orderBy('display_order')
                ->get(),
        ]);
    }

    /**
     * Display a single service, resolved by its slug.
     */
    public function show(Capability $capability): Response
    {
        abort_unless($capability->is_active, 404);

        return Inertia::render('Public/Services/Show', [
            ...$this->cmsPayload(),
            'service' => $capability,
            'related' => Capability::where('is_active', true)
                ->where('id', '!=', $capability->id)
                ->orderBy('display_order')
                ->limit(3)
                ->get(),
        ]);
    }
}
