<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "nombre"=> "required|string|max:255",
            "image" => 'nullable|image|mimes:jpg,jpeg,png|max:4048',
            "image_url" => "nullable|string",
            "marca"=> "required|string",
            "descripcion"=> "nullable|string",
            "precio"=> "required|numeric|min:0",
            "stock"=> "required|integer|min:0",
            "category_id"=> "exists:categorias,id",
            "estado"=>"boolean"
        ];
    }
}
