<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return false;
    }

    public function rules(): array
    {
        return [
            "nombre"=> "required|string|max:255",
            "descripcion"=> "nullable|string",
            "precio"=> "required|numeric|min:0",
            "stock"=> "required|integer|min:0º",
            "categria_id"=> "exists:categorias,id",
            "estado"=>"boolean"
        ];
    }
}
