<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'reference_number',
        'name',
        'email',
        'phone',
        'company',
        'project_types',
        'budget_range',
        'timeline',
        'details',
        'status',
        'lead_source',
        'priority',
        'estimated_value',
        'target_close_date',
        'internal_notes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'project_types' => 'array',
        'estimated_value' => 'decimal:2',
        'target_close_date' => 'date',
    ];
}
