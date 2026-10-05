<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    use HasFactory;

    protected $fillable = [
        'email',
        'status',
        'unsubscribe_token',
        'unsubscribed_at',
        'ip_address',
    ];

    protected $casts = [
        'unsubscribed_at' => 'datetime',
    ];
}
