<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute\Fillable;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('employee_id', 'leave_type_id', 'start_date', 'end_date','days','status', 'reason', 'reviewed_by', 'reviewed_at', 'review_note')]
class LeaveRequest extends Model
{
    /** @use HasFactory<\Database\Factories\LeaveRequestFactory> */
    use HasFactory;

    protected functions casts(): array // This method defines the data type casting for specific attributes of the LeaveRequest model. It returns an array that specifies how certain attributes should be cast when retrieved from the database. In this case, the 'start_date' and 'end_date' attributes are cast to 'date' types, and the 'reviewed_at' attribute is also cast to a 'date' type. This ensures that these attributes are handled correctly when working with instances of the LeaveRequest model.
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'reviewed_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * @return BelongsTo<LeaveType, $this>
     */
    public function leaveType()
    {
        return $this->belongsTo(LeaveType::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
