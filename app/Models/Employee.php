<?php

namespace App\Models;

use Database\Factories\EmployeeFactory;
use Illuminate\Database\Eloquent\Attributes\Appends; // This import statement is used to include the Appends attribute class from the Illuminate\Database\Eloquent\Attributes namespace. The Appends attribute is used to specify additional attributes that should be appended to the model's array and JSON representations, allowing for the inclusion of computed or derived attributes in the model's output.
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage; // This import statement is used to include the Storage facade from the Illuminate\Support\Facades namespace. The Storage facade provides a convenient way to interact with the file storage system in Laravel, allowing for file uploads, retrievals, and deletions. In this case, it is used to generate URLs for employee avatars stored in the application's storage.

// This import statement is used to include the Fillable attribute class from the Illuminate\Database\Eloquent\Casts namespace. The Fillable attribute is used to specify which attributes of the model can be mass-assigned, providing a way to protect against mass assignment vulnerabilities.
#[Fillable('user_id', 'first_name', 'last_name', 'email', 'phone', 'department_id', 'position_id', 'manager_id', 'hire_date', 'employee_status', 'salary', 'avatar_path', 'address')]
#[Appends('full_name', 'avatar_url')] // This attribute is used to specify additional attributes that should be appended to the model's array and JSON representations. In this case, the 'full_name' and 'avatar_url' attributes will be included when the model is converted to an array or JSON format.

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
    protected function fullName(): Attribute // This method defines a computed attribute called 'full_name' that returns the full name of the employee by concatenating the 'first_name' and 'last_name' attributes.
    {
        return Attribute::get(fn () => "{$this->first_name} {$this->last_name}");
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function avatarUrl(): Attribute { // This method defines a computed attribute called 'avatar_url' that returns the URL of the employee's avatar image. It checks if the 'avatar_path' attribute is set and generates a URL using the Storage facade. If the 'avatar_path' is not set, it returns null.
        return Attribute::get(fn (): ?string => $this->avatar_path ? Storage::url($this->avatar_path) : null);
    }
    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo // This method defines a relationship between the Employee model and the User model. It indicates that an employee belongs to a user, establishing a one-to-one relationship. The BelongsTo return type specifies that this relationship will return an instance of the User model associated with the employee.
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Department, $this>
     */
    public function department(): BelongsTo // This method defines a relationship between the Employee model and the Department model. It indicates that an employee belongs to a department, establishing a one-to-many relationship. The BelongsTo return type specifies that this relationship will return an instance of the Department model associated with the employee.
    {
        return $this->belongsTo(Department::class);
    }

    /**
     * @return BelongsTo<Position, $this>
     */
    public function position(): BelongsTo // This method defines a relationship between the Employee model and the Position model. It indicates that an employee belongs to a position, establishing a one-to-many relationship. The BelongsTo return type specifies that this relationship will return an instance of the Position model associated with the employee.
    {
        return $this->belongsTo(Position::class);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function manager(): BelongsTo // This method defines a relationship between the Employee model and itself, representing the employee who is the manager of the current employee. It indicates that an employee belongs to another employee as a manager, establishing a one-to-many relationship. The BelongsTo return type specifies that this relationship will return an instance of the Employee model representing the manager of the current employee.
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
