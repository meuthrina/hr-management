// This file is for the Positions index page in the HR management system. It displays a list of positions, allows users to create, edit, and delete positions, and provides filtering options.

import { Head, Link, router, useForm } from '@inertiajs/react'; // Importing necessary modules from Inertia.js for handling page head, links, routing, and form management.
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { Department, PaginatedResponse, Position } from '@/types/hr-types'; // Importing necessary types from the hr-types file for type safety and clarity.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { BriefcaseBusiness, Pencil, Plus, Search, Trash2, X } from 'lucide-react';

interface PositionFilters { // Interface for position filters used in the search and filtering functionality.
    search?: string;
    department?: string;
}

interface PositionsIndexProps { // Interface for the props passed to the PositionsIndex component, including paginated positions, departments, and filters.
    positions: PaginatedResponse<Position>; // The paginated list of positions to be displayed on the page.
    departments: Pick<Department, 'id' | 'name'>[]; // A list of departments with only the 'id' and 'name' properties, used for filtering positions by department.
    filters: PositionFilters; // Filters used for searching and filtering positions.
}

const positionFormDefaults = { // Default values for the position form used in creating and editing positions.
    department_id: '',
    title: '',
    description: '',
};

// The PositionsIndex component is the main component for the Positions index page. It handles displaying the list of positions, creating new positions, editing existing positions, and deleting positions. It also provides search and filter functionality.
export default function PositionsIndex({ positions, departments, filters }: PositionsIndexProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State to manage the visibility of the create position dialog.
    const [editingPosition, setEditingPosition] = useState<Position | null>(null); // State to manage the position currently being edited. If null, no position is being edited.
    const [search, setSearch] = useState(filters.search ?? ''); // State to manage the search input value, initialized with the current search filter if available.

    const createPositionForm = useForm(positionFormDefaults); // Form state for creating a new position, initialized with default values.
    const editPositionForm = useForm(positionFormDefaults); // Form state for editing an existing position, initialized with default values.

    function handleCreatePositionSubmit(e: FormEvent) { // Function to handle the submission of the create position form. It prevents the default form submission behavior and sends a POST request to create a new position.
        e.preventDefault(); // Prevent the default form submission behavior.
        createPositionForm.post('/positions', { // Send a POST request to the '/positions' endpoint with the form data to create a new position.
            onSuccess: () => {
                toast.success('Position created successfully');
                setIsCreateDialogOpen(false);
                createPositionForm.reset();
            }
        });
    }

    function handleEditPosition(position: Position) { // Function to handle the editing of an existing position. It sets the editingPosition state and populates the editPositionForm with the selected position's data.
        setEditingPosition(position); // Set the position being edited to the selected position.
        editPositionForm.setData({ // Populate the editPositionForm with the selected position's data.
            department_id: String(position.department_id),
            title: position.title,
            description: position.description ?? '',
        });
    }

    // Function to handle the submission of the edit position form. It prevents the default form submission behavior and sends a PATCH request to update the position.
    function handleEditPositionSubmit(e: FormEvent) {
        e.preventDefault();
        if (!editingPosition) return;
        editPositionForm.patch(`/positions/${editingPosition.id}`, { // Send a PATCH request to the '/positions/:id' endpoint with the form data to update the position.
            onSuccess: () => {
                toast.success('Position updated successfully');
                setEditingPosition(null);
            }
        });
    }

    function handleDeletePosition(position: Position) { // Function to handle the deletion of a position. It prompts the user for confirmation and sends a DELETE request to remove the position if confirmed.
        if (confirm(`Are you sure you want to delete the position "${position.title}"?`)) {
            router.delete(`/positions/${position.id}`, { // Send a DELETE request to the '/positions/:id' endpoint to delete the position.
                onSuccess: () => {
                    toast.success('Position deleted successfully');
                }
            });
        }
    }

    function applyPositionFilters(nextFilters: PositionFilters) { // Function to apply filters for searching and filtering positions. It updates the URL with the new filters while preserving the current state and scroll position.
        router.get('/positions', { search: nextFilters.search || undefined, department: nextFilters.department || undefined }, { // Send a GET request to the '/positions' endpoint with the new filters to update the displayed positions.
            preserveState: true, // Preserve the current state of the page, including form data and other state variables.
            preserveScroll: true, // Preserve the current scroll position on the page to avoid jarring jumps when filters are applied.
        });
    }

    return ( // Render the PositionsIndex component.
        <>
            <Head title="Positions" />
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-bold">Positions</h1>
                    <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Position
                    </Button>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <form onSubmit={(e) => { e.preventDefault(); applyPositionFilters({ ...filters, search }); }} className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search positions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button type="submit" size="sm">Search</Button>
                    </form>
                    {/* The department filter dropdown allows users to filter positions by department. It displays a list of departments and updates the filters when a department is selected. */}
                    <select value={filters.department || ''} onChange={(e) => applyPositionFilters({ ...filters, department: e.target.value || undefined })} className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>

                    {filters.search && (
                        <Button variant="ghost" size="sm" onClick={() => { setSearch(''); applyPositionFilters({ ...filters, search: undefined }); }}>
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
                {/* The positions table displays a list of positions and provides actions for editing, deleting, and creating new positions. */}
                {positions.data.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center text-muted-foreground">
                        <BriefcaseBusiness className="mx-auto h-12 w-12" />
                        <p className="mt-2">No positions found.</p>
                        <p className="mt-1 text-sm">Try adjusting your search or filters.</p>
                        <Button variant="outline" size="sm" className="mt-4" onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Position
                        </Button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                            <table className="w-full min-w-[640px] text-left text-sm">
                                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                                    <tr>
                                        <th scope="col" className="px-4 py-3 text-left">Title</th>
                                        <th scope="col" className="px-4 py-3 text-left">Department</th>
                                        <th scope="col" className="px-4 py-3 text-left">Employees</th>
                                        <th scope="col" className="px-4 py-3 text-right">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {positions.data.map((position) => (
                                        <tr key={position.id} className="transition-colors hover:bg-gray-50">
                                            <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">{position.title}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{position.department?.name ?? 'Unassigned'}</td>
                                            <td className="whitespace-nowrap px-4 py-3 text-gray-600">{position.employees_count ?? 0}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button type="button" variant="outline" size="icon" aria-label={`Edit ${position.title}`} title={`Edit ${position.title}`} onClick={() => handleEditPosition(position)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button type="button" variant="destructive" size="icon" aria-label={`Delete ${position.title}`} title={`Delete ${position.title}`} onClick={() => handleDeletePosition(position)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {/* If there are multiple pages of positions, a pagination component is displayed. */}
                        {positions.last_page > 1 && (
                            <div aria-label="Positions pagination" className="mt-4 flex flex-wrap justify-center gap-1">
                                {positions.links.map((link, index) => 
                                    link.url ? (
                                        <Link key={index} href={link.url} preserveScroll aria-current={link.active ? 'page' : undefined} dangerouslySetInnerHTML={{__html: link.label}} className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${link.active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}/>
                                    ) : (
                                        <span key={index} aria-current={link.active ? 'page' : undefined} dangerouslySetInnerHTML={{__html: link.label}} className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm ${link.active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-400'}`} />
                                    ),
                                )}
                            </div>
                        )}
                    </>
            )}
            {/* Dialogs for creating and editing positions. */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) =>  { if (!open) { setIsCreateDialogOpen(false); createPositionForm.reset(); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Position</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreatePositionSubmit} className="space-y-4">
                        <PositionsFormFields form={createPositionForm} departments={departments} />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); createPositionForm.reset(); }}>Cancel</Button>
                            <Button type="submit" disabled={createPositionForm.processing}>{createPositionForm.processing ? 'Creating...' : 'Create'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            <Dialog open={!!editingPosition} onOpenChange={(open) =>  { if (!open) { setEditingPosition(null) } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Position</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditPositionSubmit} className="space-y-4">
                        <PositionsFormFields form={editPositionForm} departments={departments} />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => { setEditingPosition(null) }}>Cancel</Button>
                            <Button type="submit" disabled={editPositionForm.processing}>{editPositionForm.processing ? 'Saving...' : 'Save'}</Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// The PositionsFormFields component is a reusable form component that renders the input fields for creating or editing a position. It takes a form object and a list of departments as props, which contain the form data, error messages, and department options.
function PositionsFormFields({ form, departments }: { form: ReturnType<typeof useForm<typeof positionFormDefaults>>, departments: Pick<Department, 'id' | 'name'>[] }) {
    return (
        <>
            <div>
                <Label htmlFor="department_id">Department</Label>
                <select
                    id="department_id"
                    value={form.data.department_id}
                    onChange={(e) => form.setData('department_id', e.target.value)}
                    className="mt-1 block h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                </select>
                <InputError message={form.errors.department_id} />
            </div>

            <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" type="text" value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} className="mt-1" />
                <InputError message={form.errors.title} />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <textarea id="description" rows={3} value={form.data.description} onChange={(e) => form.setData('description', e.target.value)} className="mt-1 block w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]" />
                <InputError message={form.errors.description} />
            </div>
        </>
    );
}  

// The layout property is used to define the layout for the PositionsIndex page. It includes breadcrumbs for navigation, indicating that the user is currently on the "Positions" page.
PositionsIndex.layout = { breadcrumbs: [{ label: 'Positions', href: '/positions' }] };