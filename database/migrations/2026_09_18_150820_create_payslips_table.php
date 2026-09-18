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
        // IMAN - Create the payslips table
        Schema::create('payslips', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_id')->constrained()->cascadeOnDelete();
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('gross_pay', 12, 2);
            $table->decimal('deductions', 12, 2)->default(0); // IMAN - Added a deductions column to store the total deductions for the payslip, with a default value of 0. The decimal type is used to allow for precise representation of monetary values. 12, 2 means a total of 12 digits with 2 decimal places.
            $table->decimal('net_pay', 12, 2);
            $table->timestamp('issued_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payslips');
    }
};
