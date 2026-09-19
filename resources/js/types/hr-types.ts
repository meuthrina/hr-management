// This file defines TypeScript types and interfaces for the HR management system (response to frontend requests).

// The PaginationLink interface represents a single link in a paginated response.
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}


// The PaginatedResponse<T> interface represents a paginated response containing an array of data of type T, along with pagination metadata.
export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

// The SearchFilters interface represents the structure of search filters that can be applied when querying data.
export interface SearchFilters {
    search?: string;
}

export type Role = 'admin' | 'hr' | 'manager' | 'employee'; // Define a type for user roles in the HR management system.
export type EmploymentStatus = 'active' | 'terminated' | 'on_leave'; // Define a type for employment status of employees in the HR management system.
export type LeaveStatus = 'pending' | 'approved' | 'rejected'; // Define a type for the status of leave requests in the HR management system.

// The Department interface represents a department within the organization, including its properties and optional counts of positions and employees.
export interface Department {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    positions_count?: number;
    employees_count?: number;
    created_at: string;
    updated_at: string;
}

// The Position interface represents a job position within a department, including its properties and optional counts of employees.
export interface Position {
    id: number;
    title: string;
    description: string | null;
    department_id: number;
    department?: Department;
    employees_count?: number;
    created_at: string;
    updated_at: string;
}

// The Employee interface represents an employee within the organization, including their personal and employment details, as well as optional references to their department, position, and manager.
export interface Employee {
    id: number;
    user_id: number | null;
    first_name: string;
    last_name: string;
    full_name: string;
    email: string;
    phone: string | null;
    department_id: number | null;
    position_id: number | null;
    manager_id: number | null;
    hire_date: string;
    employment_status: EmploymentStatus;
    salary: string;
    avatar_path: string | null;
    avatar_url: string | null;
    address: string | null;
    department?: Department | null;
    position?: Position | null;
    manager?: Employee | null;
    created_at: string;
    updated_at: string;
}

export interface LeaveType {
    id: number;
    name: string;
    default_days_per_year: number;
    is_paid: boolean;
}

export interface LeaveBalance {
    id: number;
    employee_id: number;
    leave_type_id: number;
    year: number;
    entitled_days: number;
    used_days: number;
    remaining_days: number;
    leave_type?: LeaveType;
}

export interface LeaveRequest {
    id: number;
    employee_id: number;
    leave_type_id: number;
    start_date: string;
    end_date: string;
    days: number;
    reason: string | null;
    status: LeaveStatus;
    reviewed_by: number | null;
    reviewed_at: string | null;
    review_note: string | null;
    employee?: Employee;
    leave_type?: LeaveType;
}

export interface Attendance {
    id: number;
    employee_id: number;
    work_date: string;
    clock_in: string | null;
    clock_out: string | null;
    status: 'present' | 'absent' | 'late';
    employee?: Employee;
}

export interface Payslip {
    id: number;
    employee_id: number;
    period_start: string;
    period_end: string;
    gross_pay: string;
    deductions: string;
    net_pay: string;
    issued_at: string | null;
    employee?: Employee;
}