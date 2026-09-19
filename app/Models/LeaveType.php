<?php

namespace App\Models;

use Database\Factories\LeaveTypeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable('name', 'default_days_per_year', 'is_paid')]
class LeaveType extends Model
{
    /** @use HasFactory<LeaveTypeFactory> */
    use HasFactory;

    protected function casts(): array
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
