<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Employee;
use Inertia\Inertia;
use App\Models\Department;
use App\Models\Position;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

// The EmployeeController class is responsible for handling requests related to employee management, including listing, showing, creating, updating, and deleting employees.
class EmployeeController extends Controller
{
    // This method handles the index route for employees, allowing for optional search and filter functionality.
    public function index(Request $request) : Response
    {
        $employeeQuery = Employee::with(['department', 'position'])->latest(); // Start building the query to fetch employees, including their related department and position, ordered by the latest.

        if ($request->filled('search')) { // If a search term is provided in the request, filter the employees based on first name, last name, or email.
            $employeeSearchTerm = "%{$request->input('search')}%"; // Prepare the search term for a LIKE query
            $employeeQuery->where(function ($employeeFilterQuery) use ($employeeSearchTerm) { // Use a closure to group the where conditions for first name, last name, and email.
                $employeeFilterQuery->where('first_name', 'like', "%{$employeeSearchTerm}%")
                    ->orWhere('last_name', 'like', "%{$employeeSearchTerm}%")
                    ->orWhere('email', 'like', "%{$employeeSearchTerm}%");
            });
        }

        // If a department filter is provided in the request, filter the employees based on the selected department.
        if ($request->filled('department_id')) {
            // Filter employees by department ID if provided in the request
            $employeeQuery->where('department_id', $request->input('department'));
        }

        // If a status filter is provided in the request, filter the employees based on the selected employment status.
        if ($request->filled('status')) {
            // Filter employees by employment status if provided in the request
            $employeeQuery->where('employment_status', $request->input('status'));
        }

        return Inertia::render('employees/index', [ // Render the employees/index view
            'employees' => $employeeQuery->paginate(12)->withQueryString(), // Paginate the results and include the query string in the pagination links.
            'departments' => Department::orderBy('name')->get(['id', 'name']), // Fetch all departments ordered by name to populate the department filter dropdown.
            'positions' => Position::orderBy('title')->get(['id', 'title', 'department_id']), // Fetch all positions ordered by title to populate the position filter dropdown.
            'managers' => Employee::orderBy('first_name')->get(['id', 'first_name', 'last_name']), // Fetch all employees ordered by first name to populate the manager filter dropdown.
            'filters' => $request->only(['search', 'department', 'status']), // Pass the search, department, and status filters back to the view for maintaining state in the UI.
        ]);
    }

    // This method handles the display of a single employee's details, including related data such as department, position, manager, leave balances, leave requests, attendances, and payslips.
    public function show(Employee $employee): Response
    {
        // Load the employee's related data.
        $employee->load([
            'department',
            'position',
            'manager',
            'leaveBalances.leaveType', // Load the leave balances along with their associated leave types.
            'leaveRequests.leaveType', // Load the leave requests along with their associated leave types.
            'attendances' => fn ($attendanceQuery) => $attendanceQuery->latest('work_date')->limit(10), // Load the latest 10 attendances ordered by work date.
            'payslips' => fn ($payslipQuery) => $payslipQuery->latest('period_end')->limit(6), // Load the latest 6 payslips ordered by period end date.
        ]);

        // Render the employees/show view with the loaded employee data.
        return Inertia::render('employees/show', [
            'employee' => $employee,
        ]);
    }

    /**
     * @return array<string, mixed> 
     */

    // This method validates the incoming request data for creating or updating an employee. It takes an optional Employee instance to handle unique email validation during updates.
    protected function validateEmployeeData(Request $request, ?Employee $employee = null): array
    {
        // Validate the incoming request data for creating or updating an employee, ensuring that all required fields are present and meet the specified criteria.
        return $request->validate([
            'first_name' => ['required', 'string', 'max:255'],
            'last_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:employees,email' . ($employee ? ',' . $employee->id : '')], // Ensure the email is unique, ignoring the current employee's ID if provided.
            'phone' => ['nullable', 'string', 'max:20'],
            'department_id' => ['required', 'exists:departments,id'],
            'position_id' => ['required', 'exists:positions,id'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'hire_date' => ['required', 'date'],
            'employment_status' => ['required', 'in:active,on_leave,terminated'], // Ensure the employment status is one of the allowed values: active, on_leave, or terminated.
            'salary' => ['required', 'numeric', 'min:0'],
            'address' => ['nullable', 'string', 'max:500'],
            'avatar' => ['nullable', 'image', 'max:2048'], // Max size 2MB
        ]);
    }

    // This method handles the creation of a new employee, including validation and optional avatar upload.
    public function store(Request $request): RedirectResponse
    {
        $validatedEmployeeData = $this->validateEmployeeData($request); // Validate the incoming request data for creating a new employee.

        // If an avatar is uploaded, store it in the public storage and update the avatar_path in the validated data.
        if ($request->hasFile('avatar')) {
            $validatedEmployeeData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        unset($validatedEmployeeData['avatar']); // Remove avatar from validated data if not present

        Employee::create($validatedEmployeeData); // Create a new employee using the validated data.

        return back()->with('success', 'Employee created successfully.');
    }

    // This method handles the update of an existing employee, including validation and optional avatar update.
    public function update(Request $request, Employee $employee): RedirectResponse
    {
        // Validate the incoming request data for updating an existing employee, ensuring that all required fields are present and meet the specified criteria.
        $validatedEmployeeData = $this->validateEmployeeData($request, $employee);

        // If an avatar is uploaded, store it in the public storage and update the avatar_path in the validated data.
        if ($request->hasFile('avatar')) {
            // Delete the old avatar if it exists
            if ($employee->avatar_path) {
                Storage::disk('public')->delete($employee->avatar_path);
            }
            $validatedEmployeeData['avatar'] = $request->file('avatar')->store('avatars', 'public');
        }

        unset($validatedEmployeeData['avatar']); // Remove avatar from validated data if not present

        $employee->update($validatedEmployeeData); // Update the employee with the validated data.

        return back()->with('success', 'Employee updated successfully.');
    }

    // This method handles the deletion of an employee, including the removal of their avatar if it exists.
    public function destroy(Employee $employee): RedirectResponse
    {
        // Delete the avatar if it exists
        if ($employee->avatar_path) {
            Storage::disk('public')->delete($employee->avatar_path);
        }

        $employee->delete(); // Delete the specified employee.

        return to_route('employees.index')->with('success', 'Employee deleted successfully.'); // Redirect to the employees index route with a success message.
    }
}