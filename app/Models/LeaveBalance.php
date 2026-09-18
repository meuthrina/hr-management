<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('employee_id', 'leave_type_id', 'year', 'entitled_days', 'used_days')]
class LeaveBalance extends Model
{
    /** @use HasFactory<\Database\Factories\LeaveBalanceFactory> */
    use HasFactory;

    protected functions remainingDays(): Attribute // This method defines a custom attribute called "remainingDays" for the LeaveBalance model. It calculates the remaining leave days for an employee by subtracting the used days from the entitled days. The Attribute return type specifies that this method will return an instance of the Attribute class, which allows you to define custom accessors and mutators for model attributes.
    {
        return new Attribute::get( fn () => $this->entitled_days - $this->used_days);
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo // This method defines an inverse one-to-many relationship between the LeaveBalance model and the Employee model. It indicates that a leave balance belongs to a specific employee
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return BelongsTo<LeaveType, $this>
     */
    public function leaveType(): BelongsTo // This method defines an inverse one-to-many relationship between the LeaveBalance model and the LeaveType model. It indicates that a leave balance belongs to a specific leave type. The BelongsTo return type specifies that this relationship will return a single LeaveType instance associated with the leave balance.
    {
        return $this->belongsTo(LeaveType::class);
    }
}
