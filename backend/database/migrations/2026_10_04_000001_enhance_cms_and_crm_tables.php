<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Enhance inquiries table with CRM fields
        Schema::table('inquiries', function (Blueprint $table) {
            $table->string('phone', 50)->nullable()->after('email');
            $table->string('lead_source', 100)->default('Website Form')->after('status');
            $table->string('priority', 20)->default('medium')->after('lead_source'); // low, medium, high, urgent
            $table->decimal('estimated_value', 12, 2)->nullable()->after('priority');
            $table->date('target_close_date')->nullable()->after('estimated_value');
        });

        // 2. Testimonials (Corporate Social Proof & Endorsements)
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->string('client_name', 255);
            $table->string('client_role', 255);
            $table->string('company_name', 255);
            $table->string('company_logo_url', 500)->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->text('quote');
            $table->string('project_reference', 255)->nullable();
            $table->string('metric_highlight', 100)->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // 3. Sandbox Apps (Live Environments & Simulators)
        Schema::create('sandbox_apps', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('name', 255);
            $table->string('category', 100);
            $table->string('badge', 100);
            $table->text('description');
            $table->string('live_url', 500);
            $table->string('admin_url', 500)->nullable();
            $table->string('accent_color', 50)->default('#2E4AF9');
            $table->string('icon_name', 50)->default('Globe');
            $table->string('credentials_username', 100)->nullable();
            $table->string('credentials_password', 100)->nullable();
            $table->json('roles')->nullable();
            $table->text('credentials_notes')->nullable();
            $table->json('features')->nullable();
            $table->json('stats')->nullable();
            $table->json('activity_logs')->nullable();
            $table->json('business_outcomes')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sandbox_apps');
        Schema::dropIfExists('testimonials');

        Schema::table('inquiries', function (Blueprint $table) {
            $table->dropColumn(['phone', 'lead_source', 'priority', 'estimated_value', 'target_close_date']);
        });
    }
};
