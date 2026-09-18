<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// This import statement is used to include the Fillable attribute class from the Illuminate\Database\Eloquent\Casts namespace. The Fillable attribute is used to specify which attributes of the model can be mass-assigned, providing a way to protect against mass assignment vulnerabilities.
#[Fillable('user_id', 'first_name', 'last_name', 'email', 'phone', 'department_id', 'position_id', 'manager_id', 'hire_date', 'employee_status', 'salary', 'avatar_path', 'address')]
class Employee extends Model
{
    /** @use HasFactory<\Database\Factories\EmployeeFactory> */
    use HasFactory;

    protected functions casts(): array // This method defines the data type casting for specific attributes of the Employee model. It returns an array that specifies how certain attributes should be cast when retrieved from the database. In this case, the 'hire_date' attribute is cast to a 'date' type, and the 'salary' attribute is cast to a 'decimal' type with 2 decimal places. This ensures that these attributes are handled correctly when working with instances of the Employee model.
    {
        return [
            'hire_date' => 'date',
            'salary' => 'decimal:2',
        ];
    }

    protected function fullName(): Attribute // This method defines a custom accessor for the 'full_name' attribute of the Employee model. It returns an instance of the Attribute class, which allows you to define how the 'full_name' attribute should be retrieved. In this case, it concatenates the 'first_name' and 'last_name' attributes with a space in between, providing a convenient way to access the full name of an employee.
    {
        return Attribute::get(fn () => "{$this->first_name} {$this->last_name}");
    }

    public function user(): BelongsTo // This method defines an inverse one-to-many relationship between the Employee model and the User model. It indicates that an employee belongs to a specific user. The BelongsTo return type specifies that this relationship will return a single User instance associated with the employee.
    {
        return $this->belongsTo(User::class);
    }

    public function department(): BelongsTo // This method defines an inverse one-to-many relationship between the Employee model and the Department model. It indicates that an employee belongs to a specific department. The BelongsTo return type specifies that this relationship will return a single Department instance associated with the employee.
    {
        return $this->belongsTo(Department::class);
    }

    public function position(): BelongsTo // This method defines an inverse one-to-many relationship between the Employee model and the Position model. It indicates that an employee belongs to a specific position. The BelongsTo return type specifies that this relationship will return a single Position instance associated with the employee.
    {
        return $this->belongsTo(Position::class);
    }

    public function manager(): BelongsTo // This method defines an inverse one-to-many relationship between the Employee model and itself, representing the manager of the employee. It indicates that an employee can have a manager, which is another employee. The BelongsTo return type specifies that this relationship will return a single Employee instance representing the manager of the employee.
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /** This employee who reports to this employee
     * 
     * @return HasMany<Employee, $this>
     * 
     */

    public function reports(): HasMany // This method defines a one-to-many relationship between the Employee model and itself, representing the employees who report to this employee. It indicates that an employee can have multiple direct reports, which are other employees. The HasMany return type specifies that this relationship will return a collection of Employee instances representing the direct reports of the employee.
    {
        return $this->hasMany(Employee::class, 'manager_id');
    }

    /**
     * @return HasMany<LeaveRequest, $this>
     */
    public function leaveRequests(): HasMany // This method defines a one-to-many relationship between the Employee model and the LeaveRequest model. It indicates that an employee can have multiple leave requests associated with them. The HasMany return type specifies that this relationship will return a collection of LeaveRequest instances related to the employee.
    {
        return $this->hasMany(LeaveRequest::class);
    }

    /**
     * @return HasMany<LeaveBalance, $this>
     */
    public function leaveBalances(): HasMany // This method defines a one-to-many relationship between the Employee model and the LeaveBalance model. It indicates that an employee can have multiple leave balances associated with
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /**
     * @return HasMany<Attendance, $this>
     * 
     */

    public function attendances(): HasMany // This method defines a one-to-many relationship between the Employee model and the Attendance model. It indicates that an employee can have multiple attendance records associated with them. The HasMany return type specifies that this relationship will return a collection of Attendance instances related to the employee.
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * @return HasMany<Payslip, $this>
     */

    public function payslips(): HasMany // This method defines a one-to-many relationship between the Employee model and the Payslip model. It indicates that an employee can have multiple payslips associated with them. The HasMany return type specifies that this relationship will return a collection of Payslip instances related to the employee.
    {
        return $this->hasMany(Payslip::class);
    }
}