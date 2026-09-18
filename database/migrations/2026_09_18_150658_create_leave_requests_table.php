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
        // IMAN - Create the leave requests table
        Schema::create('leave_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete(); // IMAN - Added a foreign key constraint to the employee_id column, linking it to the employees table. This ensures that each leave request is associated with a valid employee and enforces referential integrity. on delete, if an employee is deleted, all associated leave requests will also be deleted (cascade on delete).
            $table->foreignId('leave_type_id')->constrained()->cascadeOnDelete(); // IMAN - Added a foreign key constraint to the leave_type_id column, linking it to the leave_types table. This ensures that each leave request is associated with a valid leave type and enforces referential integrity. on delete, if a leave type is deleted, all associated leave requests will also be deleted (cascade on delete).
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedSmallInteger('days');
            $table->text('reason')->nullable();
            $table->string('status')->default('pending');
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete(); // IMAN - Added a foreign key constraint to the reviewed_by column, linking it to the users table. This allows for associating a leave request with a user who reviewed it, and if the user is deleted, the reviewed_by field will be set to null.
            $table->timestamp('reviewed_at')->nullable();
            $table->text('review_note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('leave_requests');
    }
};
