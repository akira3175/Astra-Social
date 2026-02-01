<?php

namespace App\Http\Requests;

use App\Models\Post;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreatePostRequest extends FormRequest
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
            'content' => ['nullable', 'string'],
            'privacy' => ['sometimes', Rule::in([Post::PRIVACY_PUBLIC, Post::PRIVACY_FRIENDS, Post::PRIVACY_ONLY_ME])],
            'parent_id' => ['sometimes', 'nullable', 'integer', 'exists:posts,id'],
            'files' => ['sometimes', 'array', 'max:4'],
            'files.*' => ['file', 'max:20480', 'mimes:jpg,jpeg,png,gif,webp,mp4,mov,avi,webm,pdf,doc,docx'],
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
            'privacy.in' => 'Privacy must be PUBLIC, FRIENDS, or ONLY_ME',
            'parent_id.exists' => 'Parent post not found',
            'files.max' => 'Maximum 4 files allowed per post',
            'files.*.max' => 'Each file must be less than 20MB',
            'files.*.mimes' => 'File type not supported',
        ];
    }
}
