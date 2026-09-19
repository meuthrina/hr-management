<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Department;
use App\Models\Employee;
use App\Models\LeaveBalance;
use App\Models\LeaveRequest;
use App\Models\LeaveType;
use App\Models\Payslip;
use App\Models\Position;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create users with different roles for testing purposes. These users will have specific roles assigned to them, which can be used to test role-based access control and permissions within the application. The users created are:
        // 1. Admin User: This user has the 'admin' role and can perform administrative tasks within the application.
        $adminUser = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@hr.test',
            'role' => 'admin',
        ]);
        // 2. HR User: This user has the 'hr' role and can manage human resources-related tasks, such as employee management and leave requests.
        $hrUser = User::factory()->create([
            'name' => 'HR User',
            'email' => 'hr@hr.test',
            'role' => 'hr',
        ]);
        // 3. Manager User: This user has the 'manager' role and can oversee and manage employees within their department or team.
        $managerUser = User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@hr.test',
            'role' => 'manager',
        ]);
        // 4. Employee User: This user has the 'employee' role and represents a regular employee who can submit leave requests and view their own information.
        $employeeUser = User::factory()->create([
            'name' => 'Employee User',
            'email' => 'employee@hr.test',
            'role' => 'employee',
        ]);

        // Create leave types for testing purposes. These leave types will be used to categorize different types of leave requests that employees can submit. The leave types created are:
        // 1. Annual Leave: This leave type represents paid time off for employees to take vacations or personal time. It has a default of 20 days per year.
        $annualLeave = LeaveType::factory()->create([
            'name' => 'Annual Leave',
            'default_days_per_year' => 20,
            'is_paid' => true,
        ]);
        // 2. Sick Leave: This leave type represents paid time off for employees to recover from illness or injury. It has a default of 10 days per year.
        $sickLeave = LeaveType::factory()->create([
            'name' => 'Sick Leave',
            'default_days_per_year' => 10,
            'is_paid' => true,
        ]);
        // 3. Unpaid Leave: This leave type represents unpaid time off for employees who need to take leave without pay. It has a default of 0 days per year.
        $unpaidLeave = LeaveType::factory()->create([
            'name' => 'Unpaid Leave',
            'default_days_per_year' => 0,
            'is_paid' => false,
        ]);
        $leaveTypes = [$annualLeave, $sickLeave, $unpaidLeave];

        // Create departments and positions for testing purposes. These departments and positions will be used to organize employees within the organization and define their roles and responsibilities. The departments and positions created are:
        // The blueprint array defines the department names and their corresponding position positionTitles. Each department will have multiple positions associated with it, allowing for a hierarchical structure within the organization.
        $blueprint = [
            'Engineering' => ['Software Engineer', 'DevOps Engineer', 'QA Engineer'],
            'Human Resources' => ['HR Manager', 'Recruiter'],
            'Sales' => ['Sales Manager', 'Account Executive'],
            'Marketing' => ['Marketing Manager', 'Content Strategist'],
            'Finance' => ['Financial Analyst', 'Accountant'],
        ];
        $positions = collect(); // This collection will hold all the positions created for each department. It allows for easy access to the positions when creating employees and assigning them to specific roles within the organization.
        $departments = collect(); // This collection will hold all the departments created based on the blueprint. It allows for easy access to the departments when creating employees and assigning them to specific departments within the organization.

        // Loop through the blueprint and create departments and positions for each department.
        foreach ($blueprint as $departmentName => $positionTitles) {
            // Create a department using the factory and set its name, code, and description.
            $department = Department::factory()->create([
                'name' => $departmentName,
                'code' => strtoupper(substr(str_replace(' ', '', $departmentName), 0, 3)), // Generate a department code by taking the first three letters of the department name, converting them to uppercase, and removing any spaces. This code can be used as a unique identifier for the department within the organization.
                'description' => "The {$departmentName} department.",
            ]);
            $departments->push($department); // Add the created department to the departments collection for later use when creating employees and assigning them to specific departments.

            // Loop through the position positionTitles for the current department and create positions for each title.
            foreach ($positionTitles as $positionName) {
                // Create a position using the factory and set its title, description, and associate it with the current department. The position is created using the department's positions relationship, which allows for easy association between the position and its corresponding department.
                $positions->push($department->positions()->create([
                    'title' => $positionName,
                    'description' => "The {$positionName} position.",
                ]));
            }
        }

        // Create managers for testing purposes. These managers will be responsible for overseeing and managing employees within their respective departments and positions.
        $managers = collect(); // This collection will hold all the managers created for each department. It allows for easy access to the managers when creating employees and assigning them to specific roles within the organization.
        // Loop through the departments and create a manager for each department. The manager is assigned to a specific position within the department, and their user_id is set to null for all managers except the first one, which is assigned to the HR user. This allows for testing different scenarios where some managers have associated user accounts while others do not.
        foreach ($departments as $key => $department) {
            $managerPosition = $positions->where('title', 'like', '%Manager%')->first() // Find a position that contains the word "Manager" in its title.
            ?? $department->positions()->first(); // If no manager position is found, use the first position in the department as a fallback.

            // Create a manager using the factory and set their user_id, department_id, position_id, and manager_id.
            $managers->push(Employee::factory()->create([
                'user_id' => $key === 0 ? $managerUser->id : null, // Assign the HR user as the manager for the first department, and leave the user_id null for other managers. This allows for testing different scenarios where some managers have associated user accounts while others do not.
                'department_id' => $department->id,
                'position_id' => $managerPosition->id,
                'manager_id' => null, // Managers do not have a manager assigned to them, so this field is set to null.
            ]));
        }

        // Create a demo employee for testing purposes. This employee will be used to test various functionalities within the application, such as leave requests, attendance records, and payslips. The demo employee is assigned to a specific department, position, and manager for testing scenarios where employees belong to different departments and report to different managers.
        Employee::factory()->create([
            'user_id' => $employeeUser->id,
            'first_name' => 'John',
            'last_name' => 'Doe',
            'email' => 'employee@hr.test',
            'department_id' => $departments->first()->id, // Assign a random department to the employee from the list of created departments. This allows for testing scenarios where employees belong to different departments within the organization.
            'position_id' => $positions->first()->id, // Assign a random position to the employee from the list of created positions. This allows for testing scenarios where employees hold different roles and responsibilities within the organization.
            'manager_id' => $managers->first()->id, // Assign a random manager to the employee from the list of created managers. This allows for testing scenarios where employees report to different managers within the organization.
        ]);

        // Create additional employees for testing purposes. These employees will be used to test various functionalities within the application, such as leave requests, attendance records, and payslips. The additional employees are assigned to random departments, positions, and managers for testing scenarios where employees belong to different departments and report to different managers.
        // This loop iterates 30 times to create 30 additional employees. Each employee is assigned to a random department, position, and manager from the previously created collections. This allows for testing scenarios where employees belong to different departments and report to different managers within the organization.
        for ($key = 0; $key < 30; $key++) {
            $department = $departments->random();
            $position = $positions->where('department_id', $department->id)->random(); // Assign a random position from the selected department to the employee. This ensures that employees are assigned to positions that belong to their respective departments, maintaining the organizational structure and hierarchy.
            // Create an employee using the factory and set their department_id, position_id, and manager_id. The manager_id is assigned to a random manager from the list of created managers, allowing for testing scenarios where employees report to different managers within the organization.
            Employee::factory()->create([
                'department_id' => $department->id,
                'position_id' => $position->id,
                'manager_id' => $managers->random()->id,
            ]);
        }

        // Create leave balances, leave requests, attendance records, and payslips for each employee. These records will be used to test various functionalities within the application, such as leave management, attendance tracking, and payroll processing. The records are created for each employee to simulate real-world scenarios where employees have different leave balances, submit leave requests, have attendance records, and receive payslips.
        $year = (int) now()->year; // Get the current year to use when creating leave balances and leave requests. This ensures that the records are created for the current year, allowing for accurate testing of leave management and attendance tracking functionalities within the application.
        // Loop through all employees and create leave balances, leave requests, attendance records, and payslips for each employee. The leave balances are created based on the leave types defined earlier, and the leave requests are created for approximately 40% of the employees. Attendance records are created for the last 5 working days, and payslips are generated for the current month.
        Employee::all()->each(function (Employee $employee) use ($leaveTypes, $hrUser, $year) {
            foreach ($leaveTypes as $type) {
                LeaveBalance::factory()->create([
                    'employee_id' => $employee->id,
                    'leave_type_id' => $type->id,
                    'year' => $year,
                    'entitled_days' => $type->default_days_per_year,
                    'used_days' => 0, // Initialize the used_days field to 0 for each leave balance. This indicates that the employee has not used any of their entitled leave days for the current year, allowing for accurate tracking of leave usage and remaining leave balances throughout the year.
                ]);
            }
            // Create leave requests for approximately 40% of the employees. This simulates real-world scenarios where not all employees submit leave requests, allowing for testing of leave management functionalities within the application. The leave requests are created with random start and end dates, reasons, and statuses to simulate different types of leave requests that employees may submit.
            if (rand(1, 10) <= 4) { // Approximately 40% chance to create a leave request for the employee
                $type = $leaveTypes[array_rand($leaveTypes)];
                $start = Carbon::now()->addDays(rand(-20, 20)); // Random start date between 20 days in the past and 20 days in the future
                $end = (clone $start)->addDays(rand(0, 4)); // Random end date between 0 and 4 days after the start date
                $status = ['pending', 'approved', 'rejected'][array_rand(['pending', 'approved', 'rejected'])]; 
                LeaveRequest::create([
                    'employee_id' => $employee->id,
                    'leave_type_id' => $type->id,
                    'start_date' => $start->toDateString(),
                    'end_date' => $end->toDateString(),
                    'days' => $start->diffInDays($end) + 1, // Calculate the number of days for the leave request by finding the difference between the start and end dates and adding 1 to include both the start and end dates in the count.
                    'reason' => fake()->sentence(),
                    'status' => $status,
                    'reviewed_by' => $status === 'pending' ? null : $hrUser->id,
                    'reviewed_at' => $status === 'pending' ? null : now(),
                ]);
            }
            // Create attendance records for the last 5 working days. This simulates real-world scenarios where employees have attendance records for their workdays, allowing for testing of attendance tracking functionalities within the application. The attendance records are created with random clock-in and clock-out times, and the status is determined based on whether the employee clocked in on time or late.
            for ($d = 1; $d <= 5; $d++) {
                $date = Carbon::now()->subDays($d); // Get the date for the last 5 working days by subtracting the number of days from the current date. This ensures that attendance records are created for the most recent workdays, allowing for accurate testing of attendance tracking functionalities within the application.
                $in = (clone $date)->setTime(rand(8, 9), rand(0, 59)); // Generate a random clock-in time between 8:00 AM and 9:59 AM for the employee. This simulates real-world scenarios where employees may clock in at different times, allowing for testing of attendance tracking functionalities within the application.
                Attendance::create([
                    'employee_id' => $employee->id,
                    'work_date' => $date->toDateString(),
                    'clock_in' => $in,
                    'clock_out' => (clone $in)->addHours(rand(7, 9)), // Generate a random clock-out time by adding 7 to 9 hours to the clock-in time. This simulates real-world scenarios where employees may work different lengths of time, allowing for testing of attendance tracking functionalities within the application.
                    'status' => $in->format('H') < 9 ? 'on_time' : 'late', // Determine the attendance status based on whether the employee clocked in before 9:00 AM (on time) or after 9:00 AM (late). This allows for testing of attendance tracking functionalities within the application, including the ability to identify late arrivals and track employee punctuality.
                ]);
            }
            // Create payslips for the current month. This simulates real-world scenarios where employees receive payslips for their work during the month, allowing for testing of payroll processing functionalities within the application. The payslips are created with calculated gross pay, deductions, and net pay based on the employee's salary.
            $gross = (float) $employee->salary / 12; // Calculate the gross pay for the employee by dividing their annual salary by 12 to get the monthly salary. This allows for accurate calculation of payslips based on the employee's salary, ensuring that the payslips reflect the correct amount of pay for the current month.
            $deductions = round($gross * 0.2, 2); // Calculate the deductions for the employee by taking 20% of their gross pay and rounding it to 2 decimal places. This simulates real-world scenarios where employees may have deductions from their pay, such as taxes or benefits, allowing for testing of payroll processing functionalities within the application.
            Payslip::create([
                'employee_id' => $employee->id,
                'period_start' => now()->startOfMonth()->toDateString(),
                'period_end' => now()->endOfMonth()->toDateString(),
                'gross_pay' => round($gross, 2),
                'deductions' => $deductions,
                'net_pay' => round($gross - $deductions, 2),
                'issued_at' => now(),
            ]);
        });
    }
}