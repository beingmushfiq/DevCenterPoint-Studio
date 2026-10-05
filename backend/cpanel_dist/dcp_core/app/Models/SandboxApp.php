<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SandboxApp extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'category',
        'badge',
        'description',
        'live_url',
        'admin_url',
        'accent_color',
        'icon_name',
        'credentials_username',
        'credentials_password',
        'roles',
        'credentials_notes',
        'features',
        'stats',
        'activity_logs',
        'business_outcomes',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'roles' => 'array',
        'features' => 'array',
        'stats' => 'array',
        'activity_logs' => 'array',
        'business_outcomes' => 'array',
        'is_active' => 'boolean',
        'display_order' => 'integer',
    ];
}
