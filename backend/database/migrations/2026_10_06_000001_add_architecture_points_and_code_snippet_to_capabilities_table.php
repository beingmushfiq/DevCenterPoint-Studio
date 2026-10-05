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
        Schema::table('capabilities', function (Blueprint $table) {
            $table->json('architecture_points')->nullable()->after('technologies');
            $table->text('code_snippet')->nullable()->after('architecture_points');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('capabilities', function (Blueprint $table) {
            $table->dropColumn(['architecture_points', 'code_snippet']);
        });
    }
};
