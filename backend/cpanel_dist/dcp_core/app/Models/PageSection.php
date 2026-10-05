<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageSection extends Model
{
    use HasFactory;

    protected $fillable = [
        'section_key',
        'block_key',
        'content',
        'is_visible',
        'display_order',
    ];

    protected $casts = [
        'is_visible' => 'boolean',
    ];
}
