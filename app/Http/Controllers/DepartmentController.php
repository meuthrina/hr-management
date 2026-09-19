<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia; // Add this line to import the Inertia facade
use Inertia\Response; // Add this line to import the Response class
use Illuminate\Http\RedirectResponse; // Add this line to import the RedirectResponse class
use Illuminate\Validation\Rule; // Add this line to import the Rule class for validation

class DepartmentController extends Controller
{
    // This method handles the index route for departments, allowing for optional search functionality.
    public function index(Request $request): Response
    {
        // Start building the query to fetch departments, including counts of related positions and employees, ordered by the latest.
        $query = Department::withCount(['positions', 'employees'])->latest();

        // If a search term is provided in the request, filter the departments based on the name or code.
        if ($request->filled('search')) {
            $term = "%{$request->input('search')}%"; // Prepare the search term for a LIKE query
            // Use a closure to group the where conditions for name and code.
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                    ->orWhere('code', 'like', $term);
            });
        }
        return Inertia::render('departments/index', [ // Render the departments/index view
            'departments' => $query->paginate(10)->withQueryString(), // Paginate the results and include the query string in the pagination links.
            'filters' => $request->only(['search']), // Pass the search filter back to the view for maintaining state in the UI.
        ]);
    }

    // This method handles the creation of a new department.
    public function store(Request $request): RedirectResponse
    {
        // Validate the incoming request data for creating a new department.
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
            'code' => ['required', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
        ]);

        // Create a new department using the validated data.
        Department::create($validatedData);

        return back()->with('success', 'Department created successfully.'); // Redirect back with a success message.
    }

    // This method handles the updating of an existing department.
    public function update(Request $request, Department $department): RedirectResponse
    {
        // Validate the incoming request data for updating an existing department.
        $validatedData = $request->validate([
            'name' => ['required', 'string', 'max:255', Rule::unique('departments')->ignore($department->id)], // Ensure the name is unique, ignoring the current department's ID.
            'code' => ['required', 'string', 'max:10'],
            'description' => ['nullable', 'string'],
        ]);

        // Update the department with the validated data.
        $department->update($validatedData);

        // Redirect back with a success message.
        return back()->with('success', 'Department updated successfully.'); // Redirect back with a success message.
    }

    // This method handles the deletion of a department.
    public function destroy(Department $department): RedirectResponse
    {
        // Delete the specified department.
        $department->delete();

        // Redirect back with a success message.
        return back()->with('success', 'Department deleted successfully.'); // Redirect back with a success message.
    }
}
