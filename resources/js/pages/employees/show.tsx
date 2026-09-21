import { Head, Link } from '@inertiajs/react';
import type { Attendance, Employee, LeaveBalance, LeaveRequest, Payslip } from '@/types/hr-types';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';

// Interface for employee details
interface EmployeeDetailsProps {
	employee: Employee & { // The employee object includes additional related data such as leave balances, leave requests, attendances, and payslips.
		leave_balances?: LeaveBalance[];
		leave_requests?: LeaveRequest[];
		attendances?: Attendance[];
		payslips?: Payslip[];
	};
}

// Styles for different employee statuses, mapping each status to a specific background and text color for visual distinction in the UI.
const employeeStatusStyles: Record<string, string> = {
	active: 'bg-green-100 text-green-700',
	on_leave: 'bg-amber-100 text-amber-700',
	terminated: 'bg-red-100 text-red-700',
};

// Styles for different employee leave statuses, mapping each leave status to a specific background and text color for visual distinction in the UI.
const employeeLeaveStatusStyles: Record<string, string> = {
	pending: 'bg-amber-100 text-amber-700',
	approved: 'bg-green-100 text-green-700',
	rejected: 'bg-red-100 text-red-700',
};

// Function to format a string value as Indonesian Rupiah currency, using the Intl.NumberFormat API for proper localization and formatting.
function formatEmployeeCurrency(value: string) {
	return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(parseFloat(value));
}

// The EmployeeShow component displays detailed information about a specific employee, including their contact information, job details, leave balances, recent leave requests, attendances, and payslips. It uses the Inertia.js Head component to set the page title dynamically based on the employee's full name.
export default function EmployeeShow({ employee }: EmployeeDetailsProps) {
    // Generate initials from the employee's first and last name for display when an avatar is not available. The initials are converted to uppercase for consistency in presentation.
    const initials = `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`.toUpperCase();

    return (
        <>
            <Head title={`${employee.full_name} - Employee Details`} />
            {/* Main Content */}
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <Link href="/employees" className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                    </Link>

                    <div className="flex min-w-0 items-center gap-4">
                    {employee.avatar_url ? (
                        <img src={employee.avatar_url} alt={`${employee.full_name}'s Avatar`} className="h-12 w-12 shrink-0 rounded-full object-cover" />
                    ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-300 font-semibold text-white">
                            {initials}
                        </div>
                    )}
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="truncate text-lg font-semibold">{employee.full_name}</h1>
                            <span className={`rounded px-2 py-1 text-xs font-medium ${employeeStatusStyles[employee.employment_status] ?? 'bg-gray-100 text-gray-700'}`}>
                                {employee.employment_status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <p className="text-sm text-gray-500">{employee.position?.title || 'No Position'} - {employee.department?.name || 'No Department'}</p>
                        {employee.manager && (
                            <p className="text-sm text-gray-500">Manager: {employee.manager.full_name}</p>
                        )}
                    </div>
                    </div>
                </div>
                
                {/* Employee Details */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Contact & Job */}
                    <div className="space-y-4">
                        <EmployeeDetailsSection title="Contact Information">
                            <EmployeeInfoRow icon={Mail} label="Email" value={employee.email} />
                            <EmployeeInfoRow icon={Phone} label="Phone" value={employee.phone || 'N/A'} />
                            <EmployeeInfoRow icon={MapPin} label="Address" value={employee.address || 'N/A'} />
                        </EmployeeDetailsSection>

                        <EmployeeDetailsSection title="Leave Balances">
                            {employee.leave_balances && employee.leave_balances.length > 0 ? (
                                <ul className="space-y-2">
                                    {employee.leave_balances.map((balance) => (
                                            <li key={balance.id} className="flex items-center justify-between gap-3 rounded bg-gray-50 p-2">
                                                <span className="min-w-0 truncate">{balance.leave_type?.name ?? 'Leave'}</span>
                                                <span className="shrink-0 text-sm font-semibold">{balance.remaining_days} / {balance.entitled_days} days left</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-gray-500">No leave balances available.</p>
                            )}
                        </EmployeeDetailsSection>
                    </div>

                    {/* Leave & Attendances */}
                    <div className="space-y-4">
                        {/* Recent Leave Requests */}
                        <EmployeeDetailsSection title="Recent Leave Requests">
                            {employee.leave_requests && employee.leave_requests.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {employee.leave_requests.map((request) => (
                                        <div key={request.id} className="flex items-center justify-between gap-3 p-2">
                                            <div>
                                                <p className="text-sm font-medium">{request.leave_type?.name ?? 'Leave'}</p>
                                                <p className="text-xs text-gray-500">
                                                    {request.start_date} to {request.end_date}
                                                </p>
                                            </div>
                                            <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${employeeLeaveStatusStyles[request.status] ?? 'bg-gray-100 text-gray-700'}`}>
                                                {request.status.toUpperCase()}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No leave requests available.</p>
                            )}
                        </EmployeeDetailsSection>
                        
                        {/* Recent Attendances */}
                        <EmployeeDetailsSection title="Recent Attendances">
                            {employee.attendances && employee.attendances.length > 0 ? (
                                <div className="overflow-x-auto">
                                <table className="min-w-[640px] w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-in</th>
                                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check-out</th>
                                            <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {employee.attendances.map((attendance) => (
                                            <tr key={attendance.id} className="transition-colors hover:bg-gray-50">
                                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{attendance.work_date}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-500">{attendance.clock_in || 'N/A'}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-500">{attendance.clock_out || 'N/A'}</td>
                                                <td className="whitespace-nowrap px-4 py-2 text-gray-500">{attendance.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No attendance records available.</p>
                            )}
                        </EmployeeDetailsSection>

                        
                        <EmployeeDetailsSection title="Recent Payslips">
                            {employee.payslips && employee.payslips.length > 0 ? (
                                <div className="space-y-2">
                                    {employee.payslips.map((payslip) => (
                                        <div key={payslip.id} className="flex items-center justify-between gap-3 rounded bg-gray-50 p-2">
                                            <span className="text-sm">{payslip.period_start.slice(0, 10)} to {payslip.period_end.slice(0, 10)}</span>
                                            <span className="shrink-0 text-sm font-semibold">{formatEmployeeCurrency(payslip.net_pay)}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No payslips available.</p>
                            )}
                        </EmployeeDetailsSection>
                    </div>
                </div>
            </div>
        </>
    );
}

// Component to display a section of employee details with a title and content. It provides a consistent layout for different sections of the employee profile, such as contact information, leave balances, and recent activities.
function EmployeeDetailsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h2 className="mb-3 text-base font-semibold">{title}</h2>
            {children}
        </div>
    );
}

// Component to display a single row of employee information with an icon, label, and value. It is used within the EmployeeDetailsSection to present individual pieces of data in a clear and organized manner.
function EmployeeInfoRow({ icon: Icon, label, value }: { icon: React.ComponentType; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3">
            <span className="text-sm font-medium text-gray-700">{label}:</span>
            <span className="min-w-0 break-words text-sm text-gray-500">{value}</span>
        </div>
    );
}

// Setting the layout for the EmployeeShow page, including breadcrumbs for navigation. The breadcrumbs provide a trail for users to follow back to the Employees list and indicate that they are currently viewing an employee's profile.
EmployeeShow.layout = { breadcrumbs: [{ label: 'Employees', href: '/employees' }, { label: 'Profile', href: '#' }] };