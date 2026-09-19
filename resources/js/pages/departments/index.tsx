// This file is for departments management page in the HR management system. It provides functionality to view, create, edit, and delete departments, as well as search for departments based on specific criteria. The page uses Inertia.js for server-side rendering and state management, and it leverages React components for the user interface.

import { Head, Link, router, useForm } from '@inertiajs/react'; // Importing necessary modules from Inertia.js for handling page head, links, routing, and form management.
import { useState, type FormEvent } from 'react'; 
import { toast } from 'sonner'; // Importing the toast library for displaying notifications.
import type { Department, PaginatedResponse, SearchFilters } from '@/types/hr-types'; // Importing TypeScript types for department data, paginated responses, and search filters.
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Building2, Pencil, Plus, Search, Trash2, X } from 'lucide-react';

interface DepartmentIndexProps { // Defining the props for the DepartmentsIndex component, which includes a paginated response of departments and search filters.
	departments: PaginatedResponse<Department>; // The paginated response containing department data.
	filters: SearchFilters; // The search filters applied to the departments.
}

const departmentFormDefaults = { // Default values for the department form.
	name: '',
	code: '',
	description: '',
};

export default function DepartmentsIndex({ departments, filters }: DepartmentIndexProps) { // The main component for the departments management page. It receives departments and filters as props.
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State to manage the visibility of the create department dialog.
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null); // State to manage the department currently being edited. It can be null if no department is being edited.
    const [search, setSearch] = useState(filters.search || ''); // State to manage the search term for departments.

    const createDepartmentForm = useForm({...departmentFormDefaults}); // Form state for creating a new department, initialized with default values.
    const editDepartmentForm = useForm({...departmentFormDefaults}); // Form state for editing an existing department, initialized with default values.

    function handleCreateDepartmentSubmit(e: FormEvent) { // Function to handle the submission of the create department form. It prevents the default form submission behavior and sends a POST request to create a new department.
        e.preventDefault(); // Prevent the default form submission behavior.
        createDepartmentForm.post('/departments', { // Send a POST request to the '/departments' endpoint with the form data.
            onSuccess: () => {
                toast.success('Department created successfully');
                setIsCreateDialogOpen(false);
                createDepartmentForm.reset();
            },
            onError: () => {
                toast.error('Failed to create department');
            },
        });
    }

    function handleEditDepartment(department: Department) { // Function to handle the editing of an existing department. It sets the editingDepartment state and populates the editDepartmentForm with the department's current data.
        setEditingDepartment(department); // Set the department being edited.
        editDepartmentForm.setData({ // Populate the editDepartmentForm with the department's current data.
            name: department.name,
            code: department.code || '',
            description: department.description || '',
        });
    }

    function handleEditDepartmentSubmit(e: FormEvent) { // Function to handle the submission of the edit department form. It prevents the default form submission behavior and sends a PATCH request to update the department.
        e.preventDefault(); // Prevent the default form submission behavior.
        if (!editingDepartment) return; // If no department is being edited, exit the function.
        editDepartmentForm.patch(`/departments/${editingDepartment.id}`, { // Send a PATCH request to the '/departments/{id}' endpoint with the form data to update the department.
            onSuccess: () => {
                toast.success('Department updated successfully');
                setEditingDepartment(null);
            },
            onError: () => {
                toast.error('Failed to update department');
            },
        });
    }

    function handleDeleteDepartment(department: Department) { // Function to handle the deletion of a department. It prompts the user for confirmation and sends a DELETE request to remove the department if confirmed.
        if (!confirm(`Are you sure you want to delete the department "${department.name}"? This action cannot be undone.`)) {
            return;
        }
        router.delete(`/departments/${department.id}`, { // Send a DELETE request to the '/departments/{id}' endpoint to delete the department.
            onSuccess: () => {
                toast.success('Department deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete department');
            },
        });
    }

    function handleDepartmentSearchSubmit(e: FormEvent) { // Function to handle the submission of the department search form. It prevents the default form submission behavior and sends a GET request to filter departments based on the search term.
        e.preventDefault(); // Prevent the default form submission behavior.
        router.get('/departments', { search: search || undefined}, { // Send a GET request to the '/departments' endpoint with the search term as a query parameter. If the search term is empty, it will be undefined.
            preserveState: true, // Preserve the current state of the page, including form data and pagination, when navigating to the new URL.
            preserveScroll: true // Preserve the current scroll position of the page when navigating to the new URL.
        });
    }

    function clearDepartmentSearch() { // Function to clear the department search filters. It resets the search state and sends a GET request to retrieve all departments without any search filters.
        setSearch(''); // Reset the search state to an empty string.
        router.get('/departments', { preserveState: true}); // Send a GET request to the '/departments' endpoint without any search filters, preserving the current state of the page.
    }

    return ( // The main JSX structure of the DepartmentsIndex component. It includes the page head, search form, department table, pagination, and dialogs for creating and editing departments.
        <>
            <Head title="Departments" />
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Departments</h1>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Department
                </Button>
            </div>
            {/* The search form allows users to search for departments based on a search term. It includes an input field for the search term and buttons to submit the search or clear the search filters. */}
            <form onSubmit={handleDepartmentSearchSubmit} className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="relative w-full sm:max-w-sm">
                    <Search className="absolute left-2 h-4 w-4 text-gray-400" />
                    <Input
                        className="pl-8"
                        placeholder="Search departments..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Button type="submit">Search</Button>
                {/* If there is a search term, a button to clear the search filters is also displayed. */}
                {filters.search && (
                    <Button type="button" variant="ghost" onClick={clearDepartmentSearch}>
                        <X className="mr-2 h-4 w-4" /> Clear
                    </Button>
                )}
            </form>
            {/* The department table displays a list of departments. If there are no departments, it displays a message and a button to create a new department. */}
            {departments.data.length === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-300 px-6 py-12 text-center text-gray-500">
                    <Building2 className="mx-auto mb-2 h-8 w-8" />
                    <p>No departments found.</p>
                    <p className="text-sm">Try adjusting your search or create a new department.</p>
                    <Button className="mt-2" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Department
                    </Button>
                </div>
            ) : (
                <> {/* If there are departments, the table is rendered. */}
                <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                    <table className="w-full min-w-[640px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-600">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left">Name</th>
                                <th scope="col" className="px-4 py-3 text-left">Code</th>
                                <th scope="col" className="px-4 py-3 text-left">Positions</th>
                                <th scope="col" className="px-4 py-3 text-left">Employees</th>
                                <th scope="col" className="px-4 py-3 text-right">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {departments.data.map((department) => (
                                <tr key={department.id} className="transition-colors hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium text-gray-900">{department.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{department.code || '-'}</td>
                                    <td className="px-4 py-3 text-gray-600">{department.positions_count ?? 0}</td>
                                    <td className="px-4 py-3 text-gray-600">{department.employees_count ?? 0}</td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex items-center gap-2">
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="outline"
                                                aria-label={`Edit ${department.name}`}
                                                title={`Edit ${department.name}`}
                                                onClick={() => handleEditDepartment(department)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="destructive"
                                                aria-label={`Delete ${department.name}`}
                                                title={`Delete ${department.name}`}
                                                onClick={() => handleDeleteDepartment(department)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* If there are multiple pages of departments, a pagination component is displayed. */}
                {departments.last_page > 1 && (
                    <div aria-label="Departments pagination" className="mt-4 flex flex-wrap justify-center gap-1">
                        {/* The pagination links are rendered using the links from the departments object. */}
                        {departments.links.map((link, index) =>
                            link.url ? (
                                <Link
                                    key={index}
                                    href={link.url}
                                    preserveScroll
                                    aria-current={link.active ? 'page' : undefined}
                                    className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                                        link.active
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                </Link>
                            ) : (
                                <span
                                    key={index}
                                    aria-current={link.active ? 'page' : undefined}
                                    className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm ${link.active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-400'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ),
                        )}
                    </div>
                )}
                </>
            )}
            {/* Dialogs for creating and editing departments. */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {if (!open) {setIsCreateDialogOpen(false); createDepartmentForm.reset();}}}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create Department</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateDepartmentSubmit} className="space-y-4">
                        <DepartmentFormFields form={createDepartmentForm} />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => {setIsCreateDialogOpen(false); createDepartmentForm.reset();}}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createDepartmentForm.processing}>
                                {createDepartmentForm.processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
            {/* The edit department dialog is conditionally rendered based on whether a department is being edited. It allows users to update the details of an existing department. */}
            <Dialog open={!!editingDepartment} onOpenChange={(open) => {if (!open) {setEditingDepartment(null);}}}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Department</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditDepartmentSubmit} className="space-y-4">
                        <DepartmentFormFields form={editDepartmentForm} />
                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => {setEditingDepartment(null);}}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editDepartmentForm.processing}>
                                {editDepartmentForm.processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// The DepartmentFormFields component is a reusable form component that renders the input fields for creating or editing a department. It takes a form object as a prop, which contains the form data and error messages.
function DepartmentFormFields({ form }: { form: ReturnType<typeof useForm<typeof departmentFormDefaults>> }) {
    return (
        <>
            <div>
                <Label htmlFor="name">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    autoFocus
                />
                <InputError message={form.errors.name} />
            </div>

            <div>
                <Label htmlFor="code">Code</Label>
                <Input
                    id="code"
                    type="text"
                    value={form.data.code}
                    onChange={(e) => form.setData('code', e.target.value)}
                    placeholder="Optional"
                />
                <InputError message={form.errors.code} />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    rows={3}
                    value={form.data.description}
                    onChange={(e) => form.setData('description', e.target.value)}
                    placeholder="Optional"
                    className="w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                />
                <InputError message={form.errors.description} />
            </div>
        </>
    );
}

// The layout property is used to define the layout for the DepartmentsIndex page. It includes breadcrumbs for navigation, indicating that the user is currently on the "Departments" page.
DepartmentsIndex.layout =  {breadcrumbs: [{ title: 'Departments', href: '/departments' }]};