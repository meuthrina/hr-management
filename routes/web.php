<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController; // Add this line to import the DepartmentController
use App\Http\Controllers\PositionController; // Add this line to import the PositionController
use App\Http\Controllers\EmployeeController; // Add this line to import the EmployeeController

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::middleware('role:admin,hr')->group(function () { // Group routes that require the user to have either the 'admin' or 'hr' role
        Route::get('departments', [DepartmentController::class, 'index'])->name('departments.index'); // Route to list departments
        Route::post('departments', [DepartmentController::class, 'store'])->name('departments.store'); // Route to create a new department
        Route::patch('departments/{department}', [DepartmentController::class, 'update'])->name('departments.update'); // Route to update an existing department
        Route::delete('departments/{department}', [DepartmentController::class, 'destroy'])->name('departments.destroy'); // Route to delete an existing department

        Route::get('positions', [PositionController::class, 'index'])->name('positions.index'); // Route to list positions
        Route::post('positions', [PositionController::class, 'store'])->name('positions.store'); // Route to create a new position
        Route::patch('positions/{position}', [PositionController::class, 'update'])->name('positions.update'); // Route to update an existing position
        Route::delete('positions/{position}', [PositionController::class, 'destroy'])->name('positions.destroy'); // Route to delete an existing position

        // This middleware group is for routes that require the user to have either the 'admin', 'hr', or 'manager' role. It includes routes for listing and showing employees.
        Route::middleware('role:admin,hr,manager')->group(function () { // Group routes that require the user to have either the 'admin', 'hr', or 'manager' role
            Route::get('employees', [EmployeeController::class, 'index'])->name('employees.index'); // Route to list employees
            Route::get('employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show'); // Route to show a specific employee's details
        });

        // This middleware group is for routes that require the user to have either the 'admin' or 'hr' role. It includes routes for creating, updating, and deleting employees.
        Route::middleware('role:admin,hr')->group(function () { // Group routes that require the user to have either the 'admin' or 'hr' role
            Route::post('employees', [EmployeeController::class, 'store'])->name('employees.store'); // Route to create a new employee
            Route::patch('employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update'); // Route to update an existing employee
            Route::delete('employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy'); // Route to delete an existing employee
        });
    });
});

require __DIR__.'/settings.php';
