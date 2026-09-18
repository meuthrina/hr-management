<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo; // This import statement is used to include the BelongsTo class from the Illuminate\Database\Eloquent\Relations namespace. The BelongsTo class is used to define an inverse one-to-many relationship between models, allowing you to retrieve the parent record of a related model.
use Illuminate\Database\Eloquent\Relations\HasMany; // This import statement is used to include the HasMany class from the Illuminate\Database\Eloquent\Relations namespace. The HasMany class is used to define a one-to-many relationship between models, allowing you to retrieve related records from the database.
use Illuminate\Database\Eloquent\Casts\Attribute\Fillable; // This import statement is used to include the Fillable attribute class from the Illuminate\Database\Eloquent\Casts namespace. The Fillable attribute is used to specify which attributes of the model can be mass-assigned, providing a way to protect against mass assignment vulnerabilities.
use App\Models\Department; // This import statement is used to include the Department model from the App\Models namespace. The Department model represents the departments in the application and is used to establish relationships between the Position model and the Department model.
use App\Models\Employee; // This import statement is used to include the Employee model from the App\Models namespace. The Employee model represents the employees in the application and is used to establish relationships between the Position model and the Employee model.

#[Fillable('department_id', 'title', 'description')] // This line uses the Fillable attribute to specify that the 'department_id', 'title', and 'description' attributes of the Position model can be mass-assigned. This means that when creating or updating a Position instance, these attributes can be set using an array of data, while other attributes will be protected from mass assignment.
class Position extends Model
{
    /** @use HasFactory<\Database\Factories\PositionFactory> */
    use HasFactory;

    public function department(): BelongsTo // This method defines an inverse one-to-many relationship between the Position model and the Department model. It indicates that a position belongs to a specific department. The BelongsTo return type specifies that this relationship will return a single Department instance associated with the position.
    {
        return $this->belongsTo(Department::class);
    }

    public function employees(): HasMany // This method defines a one-to-many relationship between the Position model and the Employee model. It indicates that a position can have multiple employees associated with it. The HasMany return type specifies that this relationship will return a collection of Employee instances related to the position.
    {
        return $this->hasMany(Employee::class);
    }
}
