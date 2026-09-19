<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DepartmentController; // Add this line to import the DepartmentController
use App\Http\Controllers\PositionController; // Add this line to import the PositionController

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
    });
});

require __DIR__.'/settings.php';
