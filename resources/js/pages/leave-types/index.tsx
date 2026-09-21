import { Head, router, useForm } from '@inertiajs/react';
import { useState, type FormEvent } from 'react';
import { toast } from 'sonner';
import type { LeaveType } from '@/types/hr-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { CalendarClock, Pencil, Plus, Trash2 } from 'lucide-react';

interface LeaveTypesIndexProps { // Define the props for the LeaveTypesIndex component, which includes an array of leave types with their associated leave requests count.
    leaveTypes: (LeaveType & { leave_requests_count: number })[];
}

const leaveTypeFormDefaults = {
    name: '',
    default_days_per_year: '',
    is_paid: true,
};

export default function LeaveTypesIndex({ leaveTypes }: LeaveTypesIndexProps) {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingLeaveType, setEditingLeaveType] = useState<LeaveType | null>(null);

    const createLeaveTypeForm = useForm(leaveTypeFormDefaults);
    const editLeaveTypeForm = useForm(leaveTypeFormDefaults);
    const totalRequests = leaveTypes.reduce((sum, leaveType) => sum + (leaveType.leave_requests_count ?? 0), 0); // Calculate the total number of leave requests across all leave types by summing the leave_requests_count for each leave type, defaulting to 0 if the count is undefined.
    const paidLeaveTypes = leaveTypes.filter((leaveType) => leaveType.is_paid).length; // Calculate the number of paid leave types by filtering the leaveTypes array for leave types where is_paid is true and getting the length of the resulting array.
    const unpaidLeaveTypes = leaveTypes.length - paidLeaveTypes; // Calculate the number of unpaid leave types by subtracting the number of paid leave types from the total number of leave types.

    // Handle form submissions for creating and editing leave types, as well as deleting leave types. These functions use Inertia.js to send requests to the server and handle success and error responses, displaying appropriate toast notifications to the user.
    function handleCreateLeaveTypeSubmit(e: FormEvent) {
        e.preventDefault();

        createLeaveTypeForm.post('/leave-types', {
            onSuccess: () => {
                toast.success('Leave type created successfully');
                setIsCreateDialogOpen(false);
                createLeaveTypeForm.reset();
            },
            onError: () => {
                toast.error('Failed to create leave type');
            },
        });
    }

    // Handle the editing of a leave type by setting the editingLeaveType state and populating the editLeaveTypeForm with the selected leave type's data. This allows the user to modify the leave type's details in a form.
    function handleEditLeaveType(leaveType: LeaveType) {
        setEditingLeaveType(leaveType);
        editLeaveTypeForm.setData({
            name: leaveType.name,
            default_days_per_year: String(leaveType.default_days_per_year),
            is_paid: leaveType.is_paid,
        });
    }

    // Handle form submission for editing a leave type. This function sends a PATCH request to update the leave type on the server and provides feedback to the user through toast notifications based on the success or failure of the operation.
    function handleEditLeaveTypeSubmit(e: FormEvent) {
        e.preventDefault();

        if (!editingLeaveType) {
            return;
        }

        editLeaveTypeForm.patch(`/leave-types/${editingLeaveType.id}`, {
            onSuccess: () => {
                toast.success('Leave type updated successfully');
                setEditingLeaveType(null);
            },
            onError: () => {
                toast.error('Failed to update leave type');
            },
        });
    }

    // Handle the deletion of a leave type by confirming the action with the user and sending a DELETE request to the server. This function provides feedback to the user through toast notifications based on the success or failure of the operation.
    function handleDeleteLeaveType(leaveType: LeaveType) {
        if (!confirm(`Are you sure you want to delete the leave type "${leaveType.name}"?`)) {
            return;
        }

        router.delete(`/leave-types/${leaveType.id}`, {
            onSuccess: () => {
                toast.success('Leave type deleted successfully');
            },
            onError: () => {
                toast.error('Failed to delete leave type');
            },
        });
    }

    return (
        <>
            <Head title="Leave Types" />

            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <p className="mb-1 text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Policy Setup</p>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Leave Types</h1>
                </div>
                <Button onClick={() => setIsCreateDialogOpen(true)} className="h-10 shadow-sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Leave Type
                </Button>
            </div>

            {/* Stats */}
            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Total Types</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{leaveTypes.length}</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
                    <p className="text-sm text-emerald-700">Paid Leave</p>
                    <p className="mt-2 text-2xl font-semibold text-emerald-900">{paidLeaveTypes}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <p className="text-sm text-slate-600">Total Requests</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{totalRequests}</p>
                </div>
            </div>

            {/* Table */}
            {leaveTypes.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center shadow-sm">
                    <CalendarClock className="mx-auto mb-3 h-10 w-10 text-slate-400" />
                    <p className="text-lg font-medium text-slate-700">No leave types found.</p>
                    <p className="mt-1 text-sm text-slate-500">Create a leave type to get started.</p>
                    <Button className="mt-5" onClick={() => setIsCreateDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Leave Type
                    </Button>
                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="bg-slate-50 text-xs uppercase tracking-[0.2em] text-slate-600">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left">Name</th>
                                    <th scope="col" className="px-4 py-3 text-left">Days / Year</th>
                                    <th scope="col" className="px-4 py-3 text-left">Paid</th>
                                    <th scope="col" className="px-4 py-3 text-left">Requests</th>
                                    <th scope="col" className="px-4 py-3 text-right">
                                        <span className="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {leaveTypes.map((leaveType) => (
                                    <tr key={leaveType.id} className="transition-colors hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{leaveType.name}</td>
                                        <td className="px-4 py-3 text-slate-600">{leaveType.default_days_per_year}</td>
                                        <td className="px-4 py-3 text-slate-600">
                                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${leaveType.is_paid ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'}`}>
                                                {leaveType.is_paid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-slate-600">
                                            <span className="inline-flex min-w-10 justify-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                                                {leaveType.leave_requests_count}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="outline"
                                                    aria-label={`Edit ${leaveType.name}`}
                                                    title={`Edit ${leaveType.name}`}
                                                    onClick={() => handleEditLeaveType(leaveType)}
                                                    className="h-9 w-9"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    type="button"
                                                    size="icon"
                                                    variant="destructive"
                                                    aria-label={`Delete ${leaveType.name}`}
                                                    title={`Delete ${leaveType.name}`}
                                                    onClick={() => handleDeleteLeaveType(leaveType)}
                                                    className="h-9 w-9"
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
                </div>
            )}

            {/* Create Leave Type Dialog */}
            <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
                if (!open) {
                    setIsCreateDialogOpen(false);
                    createLeaveTypeForm.reset();
                }
            }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Create Leave Type</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateLeaveTypeSubmit} className="space-y-5">
                        <LeaveTypeFormFields form={createLeaveTypeForm} />
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setIsCreateDialogOpen(false);
                                    createLeaveTypeForm.reset();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={createLeaveTypeForm.processing}>
                                {createLeaveTypeForm.processing ? 'Creating...' : 'Create'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Leave Type Dialog */}
            <Dialog open={!!editingLeaveType} onOpenChange={(open) => {
                if (!open) {
                    setEditingLeaveType(null);
                }
            }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Edit Leave Type</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleEditLeaveTypeSubmit} className="space-y-5">
                        <LeaveTypeFormFields form={editLeaveTypeForm} />
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setEditingLeaveType(null)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={editLeaveTypeForm.processing}>
                                {editLeaveTypeForm.processing ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

// Form fields component for creating and editing leave types. This component renders the input fields for the leave type's name, default days per year, and whether it is paid or unpaid. It uses the provided form object to manage the form state and handle changes to the input values.
function LeaveTypeFormFields({ form }: { form: ReturnType<typeof useForm<typeof leaveTypeFormDefaults>> }) {
    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-slate-700">Name</Label>
                <Input
                    id="name"
                    type="text"
                    value={form.data.name}
                    onChange={(e) => form.setData('name', e.target.value)}
                    className="mt-0 h-10"
                    placeholder="Annual Leave"
                />
                <InputError message={form.errors.name} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="default_days_per_year" className="text-sm font-medium text-slate-700">Default days per year</Label>
                <Input
                    id="default_days_per_year"
                    type="number"
                    min={0}
                    max={365}
                    value={form.data.default_days_per_year}
                    onChange={(e) => form.setData('default_days_per_year', e.target.value)}
                    className="mt-0 h-10"
                    placeholder="14"
                />
                <InputError message={form.errors.default_days_per_year} />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3">
                <input
                    id="is_paid"
                    type="checkbox"
                    checked={form.data.is_paid}
                    onChange={(e) => form.setData('is_paid', e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <Label htmlFor="is_paid" className="cursor-pointer select-none text-sm font-medium text-slate-700">
                    Paid leave
                </Label>
            </div>
            <InputError message={form.errors.is_paid} />
        </>
    );
}

LeaveTypesIndex.layout = { breadcrumbs: [{ label: 'Leave Types', href: '/leave-types' }] };
