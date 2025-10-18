<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('urls', function (Blueprint $table) {
            $table->id();
            $table->string('slug', 32)->unique();
            $table->text('target_url');
            $table->unsignedBigInteger('user_id')->nullable()->index();
            $table->timestamps();
            $table->index(['created_at']);
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('urls');
    }
};
