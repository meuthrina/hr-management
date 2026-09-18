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
        // IMAN - Create the attendances table
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete(); // IMAN - Added a foreign key constraint to the employee_id column, linking it to the employees table. This ensures that each attendance record is associated with a valid employee and enforces referential integrity. on delete, if an employee is deleted, all associated attendance records will also be deleted (cascade on delete).
            $table->date('work_date');
            $table->timestamp('clock_in')->nullable();
            $table->timestamp('clock_out')->nullable();
            $table->string('status')->default('present');
            $table->timestamps();

            $table->unique(['employee_id', 'work_date']); // IMAN - Added a unique constraint to ensure that each employee can only have one attendance record per work date. This prevents duplicate attendance records for the same employee on the same day.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
