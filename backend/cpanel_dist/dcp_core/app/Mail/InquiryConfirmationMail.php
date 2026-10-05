<?php

namespace App\Mail;

use App\Models\Inquiry;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InquiryConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Inquiry $inquiry)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "We have received your project inquiry [{$this->inquiry->reference_number}] - DevCenterPoint Studio",
        );
    }

    public function content(): Content
    {
        return new Content(
            htmlString: "
                <div style='font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0c1017; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;'>
                    <h2 style='color: #3b82f6; margin-bottom: 4px;'>Thank You, {$this->inquiry->name}</h2>
                    <p style='color: #94a3b8; font-size: 14px;'>We have received your project scope and initiated our architectural review.</p>
                    <hr style='border: none; border-top: 1px solid #334155; margin: 20px 0;' />
                    <p style='font-size: 14px; line-height: 1.6; color: #cbd5e1;'>
                        Your reference tracking number is <strong style='color: #60a5fa;'>{$this->inquiry->reference_number}</strong>.
                    </p>
                    <p style='font-size: 14px; line-height: 1.6; color: #cbd5e1;'>
                        A senior systems architect from our squad will examine your requirements, review technical feasibility, and respond within <strong>48 to 72 hours</strong>.
                    </p>
                    <div style='margin-top: 24px; padding: 16px; background: #020617; border-radius: 8px; border: 1px solid #1e293b; font-size: 13px; color: #94a3b8;'>
                        <strong>DevCenterPoint Studio</strong><br />
                        Software Systems Built for Scale, Resilience & Speed<br />
                        <a href='https://devcenterpoint.com' style='color: #3b82f6;'>devcenterpoint.com</a>
                    </div>
                </div>
            ",
        );
    }
}
