<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SolutionProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'category',
        'badge',
        'title',
        'tagline',
        'icon_name',
        'mockup_title',
        'live_url',
        'admin_url',
        'demo_username',
        'demo_password',
        'demo_role',
        'stats',
        'activity_logs',
        'business_outcomes',
        'client_benefits',
        'deliverables',
        'sample_action_label',
        'sample_action_toast',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'stats' => 'array',
        'activity_logs' => 'array',
        'business_outcomes' => 'array',
        'client_benefits' => 'array',
        'deliverables' => 'array',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];
}
