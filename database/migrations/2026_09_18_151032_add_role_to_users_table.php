<?php

// This migration adds a 'role' column to the 'users' table. The 'role' column is of type string and has a default value of 'user'. This allows for role-based access control in the application, enabling differentiation between users with different permissions or responsibilities.

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
        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default('employee')->after('email'); // Adding a 'role' column to the 'users' table with a default value of 'employee'. This column will be used to define the role of the user in the application, such as 'admin', 'manager', 'hr', or 'employee'.
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role'); // Dropping the 'role' column from the 'users' table in case of a rollback. This ensures that the database schema can be reverted to its previous state if needed.
        });
    }
};
