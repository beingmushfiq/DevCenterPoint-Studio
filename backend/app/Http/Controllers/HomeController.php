<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\ProvidesPublicCmsPayload;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    use ProvidesPublicCmsPayload;

    /**
     * Display the public DevCenterPoint Studio landing page.
     */
    public function index(): Response
    {
        return Inertia::render('Public/Home', $this->cmsPayload());
    }
}
