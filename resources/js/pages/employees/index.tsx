import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { Department, Employee, PaginatedResponse, Position } from '@/types/hr-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { Pencil, Plus, Search, Trash2, Users, X } from 'lucide-react';

// Interface for employee filters
interface EmployeeFilters {
    search?: string;
    department?: string;
    status?: string;
}

// Interface for the props expected by the EmployeesIndex component, including employees data, departments, positions, managers, and filters.
interface EmployeesIndexProps {
    employees: PaginatedResponse<Employee>; // Paginated response containing employee data, allowing for efficient handling of large datasets with pagination.
    departments: Pick<Department, 'id' | 'name'>[]; // Array of department objects containing only the 'id' and 'name' properties, used for filtering and displaying department information in the employee management interface.
    positions: Pick<Position, 'id' | 'title' | 'department_id'>[]; // Array of position objects containing only the 'id', 'title', and 'department_id' properties, used for filtering and displaying position information in the employee management interface.
    managers: { id: number; first_name: string; last_name: string }[]; // Array of manager objects containing only the 'id', 'first_name', and 'last_name' properties, used for filtering and displaying manager information in the employee management interface.
    filters: EmployeeFilters;
}

const employeeFormDefaults = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    manager_id: '',
    hire_date: '',
    employment_status: 'active',
    salary: '',
    address: '',
    avatar: null as File | null, // Default value for the avatar field is set to null, indicating that no file is selected initially. This allows for optional file uploads when creating or editing an employee's profile.
}

// Define a mapping of employee employment statuses to their corresponding CSS classes for styling purposes. This allows for consistent visual representation of different employment statuses in the UI.
const employeeStatusStyles: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    on_leave: 'bg-yellow-100 text-yellow-800',
    terminated: 'bg-red-100 text-red-800',
};

// The EmployeesIndex component is the main component for managing employees. It handles displaying a list of employees, filtering, searching, and managing employee creation and editing through dialogs.
export default function EmployeesIndex({ employees, departments, positions, managers, filters }: EmployeesIndexProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // State to manage the visibility of the "Create Employee" dialog. When true, the dialog is open, allowing users to create a new employee. When false, the dialog is closed.
    const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null); // State to manage the currently selected employee for editing. When an employee is selected for editing, this state holds the employee's data. When no employee is selected, it is set to null, indicating that no editing is in progress.
    const [employeeSearch, setEmployeeSearch] = useState(filters.search ?? ''); // State to manage the search input for filtering employees. It is initialized with the current search filter from the props, allowing users to search for employees by name or other criteria. The state updates as the user types in the search input field.

    // Initialize forms for creating and editing employees using the useForm hook from Inertia.js. The forms are initialized with default values defined in employeeFormDefaults, allowing for consistent form handling and validation when creating or editing employee records.
    const createEmployeeForm = useForm({...employeeFormDefaults});
    const editEmployeeForm = useForm({...employeeFormDefaults});

    // Function to handle the submission of the "Create Employee" form. It prevents the default form submission behavior, sends a POST request to create a new employee, and handles success and error responses with appropriate feedback to the user.
    function handleCreateEmployeeSubmit(e: FormEvent) {
        e.preventDefault();
        createEmployeeForm.post('employees', {
            forceFormData: true, // Ensures that the form data is sent as FormData, allowing for file uploads (e.g., avatar) to be handled correctly in the request.
            onSuccess: () => {
                setIsCreateDialogOpen(false);
                createEmployeeForm.reset();
                toast.success('Employee created successfully.');
            },
            onError: () => {
                toast.error('Failed to create employee. Please check the form for errors.');
            }
        });
    }

    // Function to handle the selection of an employee for editing. It sets the selected employee in the state and populates the edit form with the employee's existing data, allowing users to modify the employee's information.
    function handleEditEmployee(employee: Employee) {
        setEditingEmployee(employee);
        editEmployeeForm.setData({
            first_name: employee.first_name,
            last_name: employee.last_name,
            email: employee.email,
            phone: employee.phone ?? '',
            department_id: employee.department_id?.toString() ?? '',
            position_id: employee.position_id?.toString() ?? '',
            manager_id: employee.manager_id?.toString() ?? '',
            hire_date: employee.hire_date?.slice(0, 10) ?? '',
            employment_status: employee.employment_status,
            salary: employee.salary?.toString() ?? '',
            address: employee.address ?? '',
            avatar: null,
        });
    }

    // Function to handle the submission of the "Edit Employee" form. It prevents the default form submission behavior, transforms the form data to include a PATCH method, and sends a POST request to update the employee's information.
    function handleEditEmployeeSubmit(e: FormEvent) {
        e.preventDefault();
        if (!editingEmployee) return;
        editEmployeeForm.transform((data) => ({ ...data, _method: 'PATCH' })); // Transform the form data to include a PATCH method, allowing the server to recognize the request as an update operation for the employee's information.
        editEmployeeForm.post(`employees/${editingEmployee.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingEmployee(null);
                editEmployeeForm.reset();
                toast.success('Employee updated successfully.');
            },
            onError: () => {
                toast.error('Failed to update employee. Please check the form for errors.');
            }
        });
    }

    // Function to handle the deletion of an employee. It prompts the user for confirmation before sending a DELETE request to remove the employee from the system.
    function handleDeleteEmployee(employee: Employee) {
        if (!confirm(`Are you sure you want to delete ${employee.first_name} ${employee.last_name}?`)) {
            return;
        }

        router.delete(`employees/${employee.id}`, {
            onSuccess: () => {
                toast.success('Employee deleted successfully.');
            },
            onError: () => {
                toast.error('Failed to delete employee.');
            }
        });
    }

    // Function to apply filters to the employee list. It sends a GET request to the server with the updated filter values, preserving the current state and replacing the current URL.
    function applyEmployeeFilters(nextFilters: EmployeeFilters) {
        router.get('/employees', {
            search: nextFilters.search || undefined,
            department: nextFilters.department || undefined,
            status: nextFilters.status || undefined,
        }, { preserveState: true, replace: true });
    }

    return (
        <>
            <Head title="Employees" />
            <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                {/* Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <h1 className="text-2xl font-semibold">Employees</h1>
                    <Button variant="outline" size="sm" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Employee
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        applyEmployeeFilters({ ...filters, search: employeeSearch });
                    }} className="flex w-full items-center gap-2 sm:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                value={employeeSearch}
                                onChange={(e) => setEmployeeSearch(e.target.value)}
                                placeholder="Search employees..."
                                className="pl-8"
                            />
                        </div>
                        <Button type="submit" size="sm">Search</Button>
                    </form>

                    <select
                        value={filters.department || ''}
                        onChange={(e) => applyEmployeeFilters({ ...filters, department: e.target.value || undefined })}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                        <option value="">All Departments</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status || ''}
                        onChange={(e) => applyEmployeeFilters({ ...filters, status: e.target.value || undefined })}
                        className="h-9 rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                    >
                        <option value="">All Statuses</option>
                        <option value="active">Active</option>
                        <option value="on_leave">On Leave</option>
                        <option value="terminated">Terminated</option>
                    </select>
                </div>
            </div>

            {/* Employee List */}
            {employees.data.length === 0 ? (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 px-6 text-center text-muted-foreground">
                    <Users className="mb-2 h-12 w-12" />
                    <p>No employees found.</p>
                    <p className="text-sm">Try adjusting your search or filters.</p>
                    <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => applyEmployeeFilters({})}>
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {employees.data.map((employee) => (
                                <div key={employee.id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                                    <div className="mb-4 flex items-start gap-3">
                                        <EmployeeAvatar employee={employee} />
                                        <div className="min-w-0">
                                            <Link href={`/employees/${employee.id}`} className="block truncate font-medium text-blue-600 hover:underline">
                                                {employee.first_name} {employee.last_name}
                                            </Link>
                                            <p className="text-sm text-gray-500">{employee.position?.title || 'No Position'}</p>
                                            <p className="text-sm text-gray-500">{employee.department?.name || 'No Department'}</p>
                                        </div>
                                    </div>
                                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded ${employeeStatusStyles[employee.employment_status] || 'bg-gray-100 text-gray-800'}`}>
                                            {employee.employment_status.replace('_', ' ').toUpperCase()}
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            <Button type="button" variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </Button>
                                            <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteEmployee(employee)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Pagination */}
                        <div className="mt-4">
                            {employees.last_page > 1 && (
                                <div aria-label="Employees pagination" className="flex flex-wrap justify-center gap-1">
                                    {employees.links.map((link, index) => (
                                        link.url ? (
                                            <Link key={index} href={link.url} preserveScroll aria-current={link.active ? 'page' : undefined} className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${link.active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}>
                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                            </Link>
                                        ) : (
                                            <span key={index} aria-current={link.active ? 'page' : undefined} dangerouslySetInnerHTML={{ __html: link.label }} className={`inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm ${link.active ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-200 text-gray-400'}`} />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

            {/* Create Employee Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => { if (!open) { setIsCreateDialogOpen(false); createEmployeeForm.reset(); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Employee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateEmployeeSubmit} className="space-y-4">
                        <EmployeeFormFields form={createEmployeeForm} departments={departments} positions={positions} managers={managers} />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => { setIsCreateDialogOpen(false); createEmployeeForm.reset(); }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createEmployeeForm.processing}>
                                {createEmployeeForm.processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Employee Dialog */}
            <Dialog open={!!editingEmployee} onOpenChange={(open) => { if (!open) { setEditingEmployee(null); editEmployeeForm.reset(); } }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditEmployeeSubmit} className="space-y-4">
                        <EmployeeFormFields form={editEmployeeForm} departments={departments} positions={positions} managers={managers} />
                        <div className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" onClick={() => { setEditingEmployee(null); editEmployeeForm.reset(); }}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editEmployeeForm.processing}>
                                {editEmployeeForm.processing ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Define the layout for the EmployeesIndex page, including breadcrumbs for navigation. This provides users with context and allows them to easily navigate back to the employees list from other pages.
EmployeesIndex.layout = { breadcrumbs: [{ label: 'Employees', href: '/employees' }] };

// Component to display an employee's avatar. If the employee has an avatar URL, it displays the image; otherwise, it shows the employee's initials in a styled circle.
function EmployeeAvatar({ employee }: { employee: Employee }) {
    // Generate initials from the employee's first and last name, converting them to uppercase for display in the avatar placeholder when no image is available.
    const initials = `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();

    // If the employee has an avatar URL, display the image; otherwise, display the initials in a styled circle.
    if (employee.avatar_url) {
        return (
            <img src={employee.avatar_url} alt={`${employee.first_name} ${employee.last_name}`} className="h-12 w-12 shrink-0 rounded-full object-cover" />
        );
    }

    // Display the employee's initials in a styled circle.
    return (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-300 font-semibold text-white">
            {initials}
        </div>
    );
}

// Component for rendering the form fields used in both creating and editing employees. It takes in the form state, departments, positions, and managers as props to populate the relevant select options and handle form data binding.
function EmployeeFormFields({ form, departments, positions, managers }: {
    form: ReturnType<typeof useForm< typeof employeeFormDefaults>>; // The form state managed by the useForm hook, which includes the current form data, errors, and processing state for handling form submissions and validations.
    departments: Pick<Department, 'id' | 'name'>[]; // Array of department objects containing only the 'id' and 'name' properties, used to populate the department select field in the employee form.
    positions: Pick<Position, 'id' | 'title' | 'department_id'>[];
    managers: { id: number; first_name: string; last_name: string }[] }) {
    // Filter available positions based on the selected department. If a department is selected, only positions belonging to that department are shown; otherwise, all positions are available for selection. This ensures that users can only select relevant positions when creating or editing an employee.
    const availablePositions = form.data.department_id ? positions.filter(pos => pos.department_id.toString() === form.data.department_id) : positions;

    return (
        // Render the form fields for employee creation and editing, including inputs for first name, last name, email, phone, department, position, manager, employment status, hire date, salary, and address. Each field is bound to the form state and displays validation errors when applicable.
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" value={form.data.first_name} onChange={(e) => form.setData('first_name', e.target.value)} />
                    <InputError message={form.errors.first_name} />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" value={form.data.last_name} onChange={(e) => form.setData('last_name', e.target.value)} />
                    <InputError message={form.errors.last_name} />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={form.data.email} onChange={(e) => form.setData('email', e.target.value)} />
                    <InputError message={form.errors.email} />
                </div>
                <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={form.data.phone} onChange={(e) => form.setData('phone', e.target.value)} />
                    <InputError message={form.errors.phone} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div>
                    <Label htmlFor="department_id">Department</Label>
                    <select id="department_id" value={form.data.department_id} onChange={(e) => form.setData('department_id', e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="">Select a department</option>
                        {departments.map((dept) => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                    <InputError message={form.errors.department_id} />
                </div>
                <div>
                    <Label htmlFor="position_id">Position</Label>
                    <select id="position_id" value={form.data.position_id} onChange={(e) => form.setData('position_id', e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="">Select a position</option>
                        {availablePositions.map((pos) => (
                            <option key={pos.id} value={pos.id}>{pos.title}</option>
                        ))}
                    </select>
                    <InputError message={form.errors.position_id} />
                </div>
                <div>
                    <Label htmlFor="manager_id">Manager</Label>
                    <select id="manager_id" value={form.data.manager_id} onChange={(e) => form.setData('manager_id', e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="">Select a manager</option>
                        {managers.map((manager) => (
                            <option key={manager.id} value={manager.id}>{manager.first_name} {manager.last_name}</option>
                        ))}
                    </select>
                    <InputError message={form.errors.manager_id} />
                </div>
                <div>
                    <Label htmlFor="e-status">Employment Status</Label>
                    <select id="e-status" value={form.data.employment_status} onChange={(e) => form.setData('employment_status', e.target.value)} className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]">
                        <option value="active">Active</option>
                        <option value="on_leave">On Leave</option>
                        <option value="terminated">Terminated</option>
                    </select>
                    <InputError message={form.errors.employment_status} />
                </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                <div>
                    <Label htmlFor="hire_date">Hire Date</Label>
                    <Input id="hire_date" type="date" value={form.data.hire_date} onChange={(e) => form.setData('hire_date', e.target.value)} />
                    <InputError message={form.errors.hire_date} />
                </div>
                <div>
                    <Label htmlFor="salary">Salary</Label>
                    <Input id="salary" type="number" value={form.data.salary} onChange={(e) => form.setData('salary', e.target.value)} />
                    <InputError message={form.errors.salary} />
                </div>
            </div>

            <div className="mt-4">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.data.address} onChange={(e) => form.setData('address', e.target.value)} />
                <InputError message={form.errors.address} />
            </div>

            <div className="mt-4">
                <Label htmlFor="avatar">Avatar</Label>
                <Input id="avatar" type="file" accept="image/*" onChange={(e) => form.setData('avatar', e.target.files ? e.target.files[0] : null)} />
                {form.progress && <progress className="text-sm text-gray-500">Uploading: {form.progress.percentage}%</progress>}
                <InputError message={form.errors.avatar} />
            </div>

        </>
    );
}