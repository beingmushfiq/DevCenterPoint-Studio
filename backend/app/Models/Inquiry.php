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
        'company',
        'project_types',
        'budget_range',
        'timeline',
        'details',
        'status',
        'internal_notes',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'project_types' => 'array',
    ];
}
