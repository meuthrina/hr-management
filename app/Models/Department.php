<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute\Fillable; // This import statement is used to include the Fillable attribute class from the Illuminate\Database\Eloquent\Casts namespace. The Fillable attribute is used to specify which attributes of the model can be mass-assigned, providing a way to protect against mass assignment vulnerabilities.
use Illuminate\Database\Eloquent\Factories\HasFactory; // This import statement is used to include the HasFactory trait from the Illuminate\Database\Eloquent\Factories namespace. The HasFactory trait allows the model to have a corresponding factory for generating test data, making it easier to create instances of the model for testing purposes.
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany; // This import statement is used to include the HasMany class from the Illuminate\Database\Eloquent\Relations namespace. The HasMany class is used to define a one-to-many relationship between models, allowing you to retrieve related records from the database.

#[Fillable('name', 'code', 'description')] // This line uses the Fillable attribute to specify that the 'name', 'code', and 'description' attributes of the Department model can be mass-assigned. This means that when creating or updating a Department instance, these attributes can be set using an array of data, while other attributes will be protected from mass assignment.
class Department extends Model
{
    /** @use HasFactory<\Database\Factories\DepartmentFactory> */
    use HasFactory;

    public function positions(): HasMany // This method defines a one-to-many relationship between the Department model and the Position model. It indicates that a department can have multiple positions associated with it. The HasMany return type specifies that this relationship will return a collection of Position instances related to the department.
    {
        return $this->hasMany(Position::class);
    }
    
    public function employees(): HasMany // This method defines a one-to-many relationship between the Department model and the Employee model. It indicates that a department can have multiple employees associated with it. The HasMany return type specifies that this relationship will return a collection of Employee instances related to the department.
    {
        return $this->hasMany(Employee::class);
    }

}
