<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCmsAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin/dashboard');
        $response->assertRedirect('/super-admin/login');
    }

    public function test_authenticated_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create([
            'role' => 'superadmin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_authenticated_admin_can_access_inquiries_crm(): void
    {
        $admin = User::factory()->create([
            'role' => 'superadmin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/inquiries');
        $response->assertStatus(200);
    }
}
