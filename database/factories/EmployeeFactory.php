<?php

namespace Database\Factories;

use App\Models\Department;
use App\Models\Employee;
use App\Models\Position;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $firstName = fake()->firstName();
        $lastName = fake()->lastName();

        return [
            'user_id' => null, // This field is set to null by default, indicating that the employee is not associated with a user account initially. It can be updated later when a user account is created for the employee.
            'first_name' => $firstName, // This field is populated with a randomly generated first name using the Faker library. It represents the employee's first name.
            'last_name' => $lastName, // This field is populated with a randomly generated last name using the Faker library. It represents the employee's last name.
            'email' => fake()->unique()->safeEmail(), // This field is populated with a unique and safe email address generated
            'phone' => fake()->phoneNumber(), // This field is populated with a randomly generated phone number using the Faker library. It represents the employee's contact number.
            'department_id' => Department::factory(), // This field is populated with a randomly generated department ID using the Department factory. It establishes a relationship between the employee and a department.
            'position_id' => Position::factory(), // This field is populated with a randomly generated position ID using the Position factory. It establishes a relationship between the employee and a position.
            'manager_id' => null, // This field is set to null by default, indicating that the employee does not have a manager assigned initially. It can be updated later when a manager is assigned to the employee.
            'hire_date' => fake()->dateTimeBetween('-5 years', 'now'), // This field is populated with a randomly generated hire date within the last 5 years using the Faker library. It represents the date when the employee was hired.
            'employment_status' => 'active', // This field is set to 'active' by default, indicating that the employee is currently employed. It can be updated later to reflect changes in the employee's employment status.
            'salary' => fake()->numberBetween(3500000, 20000000), // This field is populated with a randomly generated salary amount between 3,500,000 and 20,000,000 using the Faker library. It represents the employee's salary.
            'avatar_path' => null, // This field is set to null by default
            'address' => fake()->address(), // This field is populated with a randomly generated address using the Faker library. It represents the employee's residential address.
        ];
    }
}
