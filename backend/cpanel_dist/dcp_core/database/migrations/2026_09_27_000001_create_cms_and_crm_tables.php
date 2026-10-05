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
        // 1. Inquiries (Leads CRM)
        Schema::create('inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('reference_number', 50)->unique();
            $table->string('name', 255);
            $table->string('email', 255);
            $table->string('company', 255)->nullable();
            $table->json('project_types');
            $table->string('budget_range', 100);
            $table->string('timeline', 100);
            $table->text('details');
            $table->string('status', 50)->default('new');
            $table->text('internal_notes')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->timestamps();
        });

        // 2. Newsletter Subscribers
        Schema::create('newsletter_subscribers', function (Blueprint $table) {
            $table->id();
            $table->string('email', 255)->unique();
            $table->string('status', 50)->default('subscribed');
            $table->string('unsubscribe_token', 64)->unique();
            $table->timestamp('unsubscribed_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });

        // 3. Projects & Case Studies
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 255)->unique();
            $table->string('title', 255);
            $table->string('tagline', 255)->nullable();
            $table->string('category', 100);
            $table->string('client', 255)->nullable();
            $table->string('year', 10);
            $table->string('duration', 50)->nullable();
            $table->text('overview');
            $table->text('problem');
            $table->text('solution');
            $table->json('metrics')->nullable();
            $table->json('tech_stack');
            $table->string('thumbnail_url', 500);
            $table->string('hero_image_url', 500)->nullable();
            $table->json('gallery')->nullable();
            $table->string('live_url', 500)->nullable();
            $table->string('github_url', 500)->nullable();
            $table->boolean('is_featured')->default(false);
            $table->integer('display_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // 4. Capabilities (Services)
        Schema::create('capabilities', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 255)->unique();
            $table->string('title', 255);
            $table->string('tagline', 255);
            $table->text('description');
            $table->string('icon_name', 100);
            $table->json('features');
            $table->json('technologies');
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 5. Engineering Philosophy Milestones
        Schema::create('milestones', function (Blueprint $table) {
            $table->id();
            $table->string('number', 20);
            $table->string('title', 255);
            $table->string('tagline', 255);
            $table->text('description');
            $table->string('metric_label', 100)->nullable();
            $table->string('metric_value', 100)->nullable();
            $table->text('code_preview')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 6. Team Members
        Schema::create('team_members', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('role', 255);
            $table->text('bio')->nullable();
            $table->string('avatar_url', 500)->nullable();
            $table->json('social_links')->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // 7. FAQs
        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category', 100);
            $table->text('question');
            $table->text('answer');
            $table->integer('display_order')->default(0);
            $table->boolean('is_published')->default(true);
            $table->timestamps();
        });

        // 8. Universal Page Sections & Blocks (Enables 100% granular CMS control)
        Schema::create('page_sections', function (Blueprint $table) {
            $table->id();
            $table->string('section_key', 100);
            $table->string('block_key', 100);
            $table->longText('content');
            $table->boolean('is_visible')->default(true);
            $table->integer('display_order')->default(0);
            $table->timestamps();

            $table->unique(['section_key', 'block_key']);
        });

        // 9. Global Site Settings & SEO
        Schema::create('site_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key', 100)->unique();
            $table->longText('value')->nullable();
            $table->string('group', 50)->default('general');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('site_settings');
        Schema::dropIfExists('page_sections');
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('team_members');
        Schema::dropIfExists('milestones');
        Schema::dropIfExists('capabilities');
        Schema::dropIfExists('projects');
        Schema::dropIfExists('newsletter_subscribers');
        Schema::dropIfExists('inquiries');
    }
};
