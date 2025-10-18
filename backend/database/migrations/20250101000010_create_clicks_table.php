<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('url_id')->constrained('urls')->cascadeOnDelete();
            $table->string('ip', 64)->nullable()->index();
            $table->string('user_agent', 1024)->nullable();
            $table->string('referrer', 1024)->nullable();
            $table->string('country', 64)->nullable()->index();
            $table->timestamps();
            $table->index(['url_id', 'created_at']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('clicks');
    }
};
