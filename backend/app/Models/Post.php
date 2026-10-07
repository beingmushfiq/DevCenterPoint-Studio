<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'category',
        'author_name',
        'excerpt',
        'body',
        'cover_image_url',
        'tags',
        'seo_title',
        'seo_description',
        'published_at',
        'display_order',
        'is_published',
    ];

    protected $casts = [
        'tags' => 'array',
        'published_at' => 'datetime',
        'is_published' => 'boolean',
    ];
}
