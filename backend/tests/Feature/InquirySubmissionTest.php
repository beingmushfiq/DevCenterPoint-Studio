<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InquirySubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_visitors_can_submit_project_inquiry(): void
    {
        $payload = [
            'name' => 'Alice Tech Lead',
            'email' => 'alice@enterprise.com',
            'company' => 'Enterprise Corp',
            'project_types' => ['Product Engineering', 'AI & Intelligent Systems'],
            'budget_range' => '$25k - $50k',
            'timeline' => '1-3 months',
            'details' => 'Need high throughput API with machine learning classification.',
            'selected_tech' => ['React', 'Laravel', 'PostgreSQL'],
        ];

        $response = $this->postJson('/inquiry', $payload);

        $response->assertStatus(201)
            ->assertJsonStructure(['success', 'id', 'reference_number']);

        $this->assertDatabaseHas('inquiries', [
            'email' => 'alice@enterprise.com',
            'name' => 'Alice Tech Lead',
            'status' => 'new',
        ]);
    }
}
