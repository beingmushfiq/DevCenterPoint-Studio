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
        Schema::create('plans', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 100)->unique();
            $table->string('name', 255);
            $table->string('badge', 100)->nullable();
            $table->string('tagline', 255)->nullable();
            $table->text('description')->nullable();
            $table->string('pricing_model', 50)->default('custom'); // custom, fixed, monthly, milestone
            $table->string('price_usd', 100)->nullable();
            $table->string('price_eur', 100)->nullable();
            $table->string('price_gbp', 100)->nullable();
            $table->string('price_bdt', 100)->nullable();
            $table->string('billing_period', 50)->nullable(); // one-time, monthly, milestone tranche
            $table->string('timeline_estimate', 100)->nullable();
            $table->string('squad_composition', 255)->nullable();
            $table->string('sla_commitment', 255)->nullable();
            $table->text('recommended_for')->nullable();
            $table->json('features')->nullable();
            $table->string('cta_text', 100)->default('Inquire About Plan');
            $table->string('cta_action', 50)->default('contact');
            $table->string('cta_url', 500)->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(false); // Default unpublished
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plans');
    }
};
