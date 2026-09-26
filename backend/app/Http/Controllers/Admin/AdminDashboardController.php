<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Capability;
use App\Models\Inquiry;
use App\Models\NewsletterSubscriber;
use App\Models\Project;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    /**
     * Display the Admin CMS Dashboard.
     */
    public function index(): Response
    {
        $stats = [
            'totalInquiries' => Inquiry::count(),
            'newInquiries' => Inquiry::where('status', 'new')->count(),
            'totalSubscribers' => NewsletterSubscriber::where('status', 'subscribed')->count(),
            'totalProjects' => Project::count(),
            'totalCapabilities' => Capability::count(),
        ];

        $recentInquiries = Inquiry::latest()->take(5)->get();
        $recentSubscribers = NewsletterSubscriber::latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentInquiries' => $recentInquiries,
            'recentSubscribers' => $recentSubscribers,
        ]);
    }
}
