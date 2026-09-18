<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable('employee_id', 'period_start', 'period_end', 'gross_pay', 'issued_at', 'deductions', 'net_pay')]
class Payslip extends Model
{
    /** @use HasFactory<\Database\Factories\PayslipFactory> */
    use HasFactory;

    protected functions casts(): array // This method defines the data type casting for specific attributes of the Payslip model. It returns an array that specifies how certain attributes should be cast when retrieved from the database. In this case, the 'period_start' and 'period_end' attributes are cast to 'date' types, and the 'issued_at' attribute is cast to a 'datetime' type. This ensures that these attributes are handled correctly when working with instances of the Payslip model.
    {
        return [
            'period_start' => 'date',
            'period_end' => 'date',
            'issued_at' => 'datetime',
            'gross_pay' => 'decimal:2',
            'deductions' => 'decimal:2',
            'net_pay' => 'decimal:2',
        ];
    }

    /**
     * @return BelongsTo<Employee, $this>
     */
    public function employee(): BelongsTo // This method defines an inverse one-to-many relationship between the Payslip model and the Employee model. It indicates that a payslip belongs to a specific employee. The BelongsTo return type specifies that this relationship will return a single Employee instance associated with the payslip.
    {
        return $this->belongsTo(Employee::class);
    }
}

