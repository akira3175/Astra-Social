<?php
namespace App\Http\Requests;

use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateReportRequest extends FormRequest{
	public function authorize(){
        return true;
    }

    public function rules(){
        return [
        	'reporter_id' => ['required', 'integer', 'exists:users,id','min:1'],
        	'target_type' => ['sometimes', Rule::in([
        		Report::TARGET_TYPE_POST,
        		Report::TARGET_TYPE_USER,
        		Report::TARGET_TYPE_COMMENT,
        	])],
        	'target_id' => ['required', 'integer', 'min:1'],
        	'reason' => ['required','string'],
        	'status' => ['sometimes', Rule::in([
        		Report::STATUS_PENDING,
        		Report::STATUS_RESOLVED,
        		Report::STATUS_REJECTED,
        	])],
        ];
    }

    public function messages(): array
    {
        return [
            'target_type.in' => 'target type must be POST, USER, or COMMENT',
            'status.in' => 'status must be PENDING, RESOLVED, REJECTED',
            'reason' => 'required',
        ];
    }

}