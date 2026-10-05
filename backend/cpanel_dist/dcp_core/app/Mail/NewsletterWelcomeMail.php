<?php

namespace App\Mail;

use App\Models\NewsletterSubscriber;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public NewsletterSubscriber $subscriber)
    {
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Welcome to the DevCenterPoint Engineering Dispatch",
        );
    }

    public function content(): Content
    {
        $unsubUrl = url('/newsletter/unsubscribe/' . $this->subscriber->unsubscribe_token);

        return new Content(
            htmlString: "
                <div style='font-family: sans-serif; max-width: 600px; margin: auto; padding: 24px; background: #0c1017; color: #e2e8f0; border-radius: 12px; border: 1px solid #1e293b;'>
                    <h2 style='color: #8b5cf6; margin-bottom: 4px;'>Welcome to the Engineering Dispatch</h2>
                    <p style='color: #94a3b8; font-size: 14px;'>You are now subscribed to quarterly architecture breakdowns, case studies, and systems engineering insights from DevCenterPoint.</p>
                    <hr style='border: none; border-top: 1px solid #334155; margin: 20px 0;' />
                    <p style='font-size: 14px; line-height: 1.6; color: #cbd5e1;'>
                        We publish deeply technical retrospectives on high-concurrency systems, distributed databases, and real-world software architecture.
                    </p>
                    <div style='margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b;'>
                        Sent by DevCenterPoint Studio.<br />
                        If you wish to stop receiving these updates, you can <a href='{$unsubUrl}' style='color: #94a3b8; text-decoration: underline;'>unsubscribe with one click</a>.
                    </div>
                </div>
            ",
        );
    }
}
