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
        // IMAN - Create the employees table
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // IMAN - Added a foreign key constraint to the user_id column, linking it to the users table. This allows for associating an employee with a user account, and if the user is deleted, the employee record will remain but the user_id will be set to null.
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('phone')->nullable();
            $table->foreignId('department_id')->nullable()->constrained()->nullOnDelete(); // IMAN - Added a foreign key constraint to the department_id column, linking it to the departments table. This allows for associating an employee with a department, and if the department is deleted, the employee record will remain but the department_id will be set to null.
            $table->foreignId('position_id')->nullable()->constrained()->nullOnDelete(); // IMAN - Added a foreign key constraint to the position_id column, linking it to the positions table. This allows for associating an employee with a position, and if the position is deleted, the employee record will remain but the position_id will be set to null.
            $table->foreignId('manager_id')->nullable()->constrained('employees')->nullOnDelete(); // IMAN - Added a foreign key constraint to the manager_id column, linking it to the employees table itself. This allows for associating an employee with a manager (who is also an employee), and if the manager is deleted, the employee record will remain but the manager_id will be set to null.
            $table->date('hire_date');
            $table->string('employment_status')->default('active');
            $table->decimal('salary', 12, 2)->default(0); // IMAN - Added a salary column to store the employee's salary, with a default value of 0. The decimal type is used to allow for precise representation of monetary values. 12, 2 means a total of 12 digits with 2 decimal places.
            $table->string('avatar_path')->nullable();
            $table->text('address')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
