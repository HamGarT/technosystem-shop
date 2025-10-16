<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
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
            "departamento" => "required|string",
            "provincia" => "required|string",
            "direccion" => "required|string",
            "usuario_id" => "required|exists:users,id",
            "pedido_items" => "required|array|min:1",
            "pedido_items.*.producto_id" => "required|exists:productos,id",
            "pedido_items.*.cantidad" => "required|integer|min:1",
        ];
    }
}
