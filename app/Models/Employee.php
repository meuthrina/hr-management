<?php

namespace App\Models;

use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

// This import statement is used to include the Fillable attribute class from the Illuminate\Database\Eloquent\Casts namespace. The Fillable attribute is used to specify which attributes of the model can be mass-assigned, providing a way to protect against mass assignment vulnerabilities.
#[Fillable('user_id', 'first_name', 'last_name', 'email', 'phone', 'department_id', 'position_id', 'manager_id', 'hire_date', 'employee_status', 'salary', 'avatar_path', 'address')]
class Employee extends Model
{
    /** @use HasFactory<EmployeeFactory> */
    use HasFactory;

    protected function casts(): array // This method defines the data type casting for specific attributes of the Employee model. It returns an array that specifies how certain attributes should be cast when retrieved from the database. In this case, the 'hire_date' attribute is cast to a 'date' type, and the 'salary' attribute is cast to a 'decimal' type with 2 decimal places. This ensures that these attributes are handled correctly when working with instances of the Employee model.
    {
        return [
            'hire_date' => 'date',
            'salary' => 'decimal:2',
        ];
    }

    /**
     * @return Attribute<non-falsy-string, never>
     */
    protected function fullName(): Attribute
    {
        return Attribute::get(fn () => "{$this->first_name} {$this->last_name}");
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * @return BelongsTo<Position, $this>
     */
    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    /** This employee who reports to this employee
     *
     * @return HasMany<Employee, $this>
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
