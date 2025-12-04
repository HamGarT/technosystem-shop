<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SendOTP extends Mailable
{
    use Queueable, SerializesModels;
    public $otp;
    public $userName;

    /**
     * Create a new message instance.
     */
    public function __construct($otp, $userName)
    {
        $this->otp = $otp;
        $this->userName = $userName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Send O T P',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }

    public function build()
    {
        $htmlContent = "
            <h1>Email Verification Code</h1>
            <p>Hi {$this->userName},</p>
            <p>Your verification code is:</p>
            <h2 style='letter-spacing: 5px; font-size: 28px; color: #007bff;'>{$this->otp}</h2>
            <p>This code expires in 10 minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
        ";

        return $this->subject('Your Verification Code')
                    ->html($htmlContent);
    }
}
