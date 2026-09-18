<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute\Fillable;

#[Fillable('name', 'default_days_per_year', 'is_paid')]
class LeaveType extends Model
{
    /** @use HasFactory<\Database\Factories\LeaveTypeFactory> */
    use HasFactory;

    protected functions casts(): array // This method defines the data type casting for specific attributes of the LeaveType model. It returns an array that specifies how certain attributes should be cast when retrieved from the database. In this case, the 'is_paid' attribute is cast to a 'boolean' type, ensuring that it is treated as a boolean value when working with instances of the LeaveType model.
    {
        return [
            'is_paid' => 'boolean',
        ];
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
}
