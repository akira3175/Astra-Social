<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
            'first_name' => ['sometimes', 'nullable', 'string', 'max:50'],
            'last_name' => ['sometimes', 'nullable', 'string', 'max:50'],
            'bio' => ['sometimes', 'nullable', 'string'],
            'avatar_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'cover_url' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'max:20', Rule::unique('profiles', 'phone')->ignore(request()->user()?->id, 'user_id')],
            'address' => ['sometimes', 'nullable', 'string', 'max:255'],
            'birth_date' => ['sometimes', 'nullable', 'date', 'before:today'],
            'gender' => ['sometimes', 'nullable', Rule::in(['MALE', 'FEMALE', 'OTHER'])],
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
            'first_name.max' => 'First name must not exceed 50 characters',
            'last_name.max' => 'Last name must not exceed 50 characters',
            'avatar_url.max' => 'Avatar URL must not exceed 255 characters',
            'cover_url.max' => 'Cover URL must not exceed 255 characters',
            'phone.max' => 'Phone must not exceed 20 characters',
            'phone.unique' => 'Phone number already exists',
            'address.max' => 'Address must not exceed 255 characters',
            'birth_date.date' => 'Birth date must be a valid date',
            'birth_date.before' => 'Birth date must be before today',
            'gender.in' => 'Gender must be MALE, FEMALE, or OTHER',
        ];
    }
}
