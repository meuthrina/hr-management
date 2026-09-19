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
        // IMAN - Create the departments table
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // IMAN - Added a unique constraint to the name column to ensure that department names are unique in the database.
            $table->string('code', 10)->nullable(); // IMAN - Added a code column for department codes, limited to 10 characters, and made it nullable because not all departments have codes.
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
