<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'tagline',
        'category',
        'client',
        'year',
        'duration',
        'overview',
        'problem',
        'solution',
        'metrics',
        'tech_stack',
        'thumbnail_url',
        'hero_image_url',
        'gallery',
        'live_url',
        'github_url',
        'is_featured',
        'display_order',
        'is_published',
    ];

    protected $casts = [
        'metrics' => 'array',
        'tech_stack' => 'array',
        'gallery' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
    ];
}
