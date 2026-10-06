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
        Schema::create('solution_products', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('category', 100);
            $table->string('badge', 100);
            $table->string('title', 255);
            $table->text('tagline');
            $table->string('icon_name', 50)->default('Globe');
            $table->string('mockup_title', 255);
            $table->string('live_url', 500)->nullable();
            $table->string('admin_url', 500)->nullable();
            $table->string('demo_username', 100)->nullable();
            $table->string('demo_password', 100)->nullable();
            $table->string('demo_role', 100)->nullable();
            $table->json('stats')->nullable();
            $table->json('activity_logs')->nullable();
            $table->json('business_outcomes')->nullable();
            $table->json('client_benefits')->nullable();
            $table->json('deliverables')->nullable();
            $table->string('sample_action_label', 100)->nullable();
            $table->text('sample_action_toast')->nullable();
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
        Schema::dropIfExists('solution_products');
    }
};
