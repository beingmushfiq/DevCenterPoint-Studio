<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Capability extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'tagline',
        'description',
        'icon_name',
        'features',
        'technologies',
        'architecture_points',
        'code_snippet',
        'display_order',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'technologies' => 'array',
        'architecture_points' => 'array',
        'is_active' => 'boolean',
    ];
}
