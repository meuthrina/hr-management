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
        // IMAN - Create the leave balances table
        Schema::create('leave_balances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->foreignId('leave_type_id')->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('year');
            $table->unsignedSmallInteger('entitled_days')->default(0); // IMAN - Added an entitled_days column to store the total number of leave days an employee is entitled to for a specific leave type in a given year, with a default value of 0. The unsignedSmallInteger type is used to allow for a range of 0 to 65535, which is sufficient for leave days.
            $table->unsignedSmallInteger('used_days')->default(0);
            $table->timestamps();

            $table->unique(['employee_id', 'leave_type_id', 'year']); // IMAN - Added a unique constraint to ensure that each employee can only have one leave balance record per leave type per year. This prevents duplicate leave balance records for the same employee, leave type, and year combination.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_balances');
    }
};
