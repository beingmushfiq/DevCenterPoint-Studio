<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewInquiryAdminNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Inquiry $inquiry)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "New Project Lead [{$this->inquiry->reference_number}] from {$this->inquiry->name}",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #0c1017; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;'>
                    <h2 style='color: #3b82f6; margin-bottom: 4px;'>New Client Inquiry Received</h2>
                    <p style='color: #94a3b8; font-size: 14px; margin-top: 0;'>Reference: <strong style='color: #f8fafc;'>{$this->inquiry->reference_number}</strong></p>
                    <hr style='border: none; border-top: 1px solid #334155; margin: 20px 0;' />
                    <table style='width: 100%; font-size: 14px; line-height: 1.6;'>
                        <tr><td style='color: #94a3b8; width: 140px;'>Client Name:</td><td><strong style='color: #f8fafc;'>{$this->inquiry->name}</strong></td></tr>
                        <tr><td style='color: #94a3b8;'>Email:</td><td><a href='mailto:{$this->inquiry->email}' style='color: #60a5fa;'>{$this->inquiry->email}</a></td></tr>
                        <tr><td style='color: #94a3b8;'>Company:</td><td>" . ($this->inquiry->company ?: 'Not provided') . "</td></tr>
                        <tr><td style='color: #94a3b8;'>Budget:</td><td>{$this->inquiry->budget_range}</td></tr>
                        <tr><td style='color: #94a3b8;'>Timeline:</td><td>{$this->inquiry->timeline}</td></tr>
                    </table>
                    <div style='margin-top: 20px; padding: 15px; background: #020617; border-radius: 8px; border: 1px solid #1e293b;'>
                        <strong style='color: #94a3b8; font-size: 12px; text-transform: uppercase;'>Project Scope:</strong>
                        <p style='margin-top: 8px; font-size: 14px; color: #cbd5e1; white-space: pre-wrap;'>{$this->inquiry->details}</p>
                    </div>
                </div>
            ",
        );
    }
}
