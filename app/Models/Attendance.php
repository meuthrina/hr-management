<?php

namespace App\Models;

use Database\Factories\AttendanceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable('employee_id', 'work_date', 'status', 'clock_in', 'clock_out')]
class Attendance extends Model
{
    /** @use HasFactory<AttendanceFactory> */
    use HasFactory;

    protected function casts(): array // This method defines the data type casting for specific attributes of the Attendance model. It returns an array that specifies how certain attributes should be cast when retrieved from the database. In this case, the 'work_date' attribute is cast to a 'date' type, and the 'clock_in' and 'clock_out' attributes are cast to 'datetime' types. This ensures that these attributes are handled correctly when working with instances of the Attendance model.
    {
        return [
            'work_date' => 'date',
            'clock_in' => 'datetime',
            'clock_out' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo // This method defines an inverse one-to-many relationship between the Attendance model and the Employee model. It indicates that an attendance record belongs to a specific employee. The BelongsTo return type specifies that this relationship will return a single Employee instance associated with the attendance record.
    {
        return $this->belongsTo(Employee::class);
    }
}
