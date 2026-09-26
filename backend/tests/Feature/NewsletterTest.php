<?php

namespace Tests\Feature;

use App\Models\NewsletterSubscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsletterTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitors_can_subscribe_to_newsletter(): void
    {
        $response = $this->postJson('/newsletter/subscribe', [
            'email' => 'subscriber@company.com',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'email' => 'subscriber@company.com',
            ]);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'subscriber@company.com',
            'status' => 'subscribed',
        ]);
    }

    public function test_subscribers_can_one_click_unsubscribe(): void
    {
        $subscriber = NewsletterSubscriber::create([
            'email' => 'unsub@company.com',
            'status' => 'subscribed',
            'unsubscribe_token' => 'sample-test-token-12345',
        ]);

        $response = $this->get('/newsletter/unsubscribe/' . $subscriber->unsubscribe_token);

        $response->assertStatus(200);

        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'unsub@company.com',
            'status' => 'unsubscribed',
        ]);
    }
}
