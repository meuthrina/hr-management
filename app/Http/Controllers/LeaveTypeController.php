<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\LeaveType;
use Illuminate\Http\RedirectResponse;

// This controller manages the CRUD operations for Leave Types in the HR management system. It includes methods for listing, creating, updating, and deleting leave types, with appropriate validation and response handling.
class LeaveTypeController extends Controller
{
    // This method lists all the leave types in the system. It retrieves the leave types from the database, including a count of associated leave requests, and orders them by name. The data is then passed to an Inertia view for rendering.
    public function index(): Response
    {
        return Inertia::render('leave-types/index', [
            'leaveTypes' => LeaveType::withCount('leaveRequests')->orderBy('name')->get(),
        ]);
    }

    // This method creates a new leave type. It validates the input data, creates a new LeaveType instance, and returns a redirect response with a success message.
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:leave_types,name'],
            'default_days_per_year' => ['required', 'integer', 'min:0', 'max:365'],
            'is_paid' => ['required', 'boolean'],
        ]);

        LeaveType::create($data);

        return back()->with('success', 'Leave type created successfully.');
    }

    // This method updates an existing leave type. It validates the input data, updates the LeaveType instance, and returns a redirect response with a success message.
    public function update(Request $request, LeaveType $leaveType): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:leave_types,name,' . $leaveType->id],
            'default_days_per_year' => ['required', 'integer', 'min:0', 'max:365'],
            'is_paid' => ['required', 'boolean'],
        ]);

        $leaveType->update($data);

        return back()->with('success', 'Leave type updated successfully.');
    }

    // This method deletes an existing leave type. It deletes the LeaveType instance and returns a redirect response with a success message.
    public function destroy(LeaveType $leaveType): RedirectResponse
    {
        $leaveType->delete();

        return back()->with('success', 'Leave type deleted successfully.');
    }
}
