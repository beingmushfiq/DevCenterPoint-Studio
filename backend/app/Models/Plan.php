<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'name',
        'badge',
        'tagline',
        'description',
        'pricing_model',
        'price_usd',
        'price_eur',
        'price_gbp',
        'price_bdt',
        'billing_period',
        'timeline_estimate',
        'squad_composition',
        'sla_commitment',
        'recommended_for',
        'features',
        'cta_text',
        'cta_action',
        'cta_url',
        'display_order',
        'is_featured',
        'is_published',
    ];

    protected $casts = [
        'features' => 'array',
        'is_featured' => 'boolean',
        'is_published' => 'boolean',
        'display_order' => 'integer',
    ];
}
