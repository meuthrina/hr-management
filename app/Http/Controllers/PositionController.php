<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Position;
use App\Models\Department;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class PositionController extends Controller
{
    // This method handles the index route for positions, allowing for optional search and department filtering.
    public function index(Request $request) : Response
    {
        // Start building the query to fetch positions, including the related department and counts of related employees, ordered by the latest.
        $query = Position::with('department')->withCount('employees')->latest();

        if ($request->filled('search')) { // If a search term is provided in the request, filter the positions based on the title.
            $query->where('title', 'like', "%{$request->input('search')}%");
        }

        if ($request->filled('department')) { // If a department filter is provided in the request, filter the positions based on the department ID.
            $query->where('department_id', $request->integer('department'));
        }

        return Inertia::render('positions/index', [ // Render the positions/index view
            'positions' => $query->paginate(10)->withQueryString(), // Paginate the results and include the query string in the pagination links.
            'departments' => Department::orderBy('name')->get(['id', 'name']), // Fetch all departments ordered by name to populate the department filter dropdown.
            'filters' => $request->only(['search', 'department']), // Pass the search and department filters back to the view for maintaining state in the UI.
        ]);
    }

    // This method handles the creation of a new position.
    public function store(Request $request) : RedirectResponse
    {
        // Validate the incoming request data for creating a new position.
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
        ]);

        // Create a new position using the validated data.
        Position::create($validatedData);

        return back()->with('success', 'Position created successfully.'); // Redirect back with a success message.
    }

    // This method handles the updating of an existing position.
    public function update(Request $request, Position $position) : RedirectResponse
    {
        // Validate the incoming request data for updating an existing position.
        $validatedData = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'department_id' => ['required', 'exists:departments,id'],
            'description' => ['nullable', 'string'],
        ]);

        // Update the specified position with the validated data.
        $position->update($validatedData);

        return back()->with('success', 'Position updated successfully.'); // Redirect back with a success message.
    }

    // This method handles the deletion of a position.
    public function destroy(Position $position) : RedirectResponse
    {
        // Delete the specified position.
        $position->delete();

        return back()->with('success', 'Position deleted successfully.'); // Redirect back with a success message.
    }
}
