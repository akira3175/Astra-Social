<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SendRegisterOtpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:50', 'unique:users,username', 'regex:/^[a-zA-Z0-9_]+$/'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'birth_date' => ['required', 'date', 'before:today'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'username.required' => 'Username is required',
            'username.min' => 'Username must be at least 3 characters',
            'username.max' => 'Username must not exceed 50 characters',
            'username.unique' => 'Username already exists',
            'username.regex' => 'Username can only contain letters, numbers, and underscores',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.unique' => 'Email already exists',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least 6 characters',
            'password.confirmed' => 'Password confirmation does not match',
            'first_name.required' => 'First name is required',
            'last_name.required' => 'Last name is required',
            'birth_date.required' => 'Birth date is required',
            'birth_date.date' => 'Birth date must be a valid date',
            'birth_date.before' => 'Birth date must be before today',
        ];
    }
}
