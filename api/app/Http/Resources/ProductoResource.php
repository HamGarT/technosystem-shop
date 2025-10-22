<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'nombre'      => $this->nombre,
            'precio'      => $this->precio,
            'descripcion' => $this->descripcion,
            'stock'       => $this->stock,
            'image_url' => $this->image_url,
            'categoria'   => $this->categoria->nombre ?? null,
            'marca' => $this->marca
            // 'categoria' => Categoria::find($this->category_id)?->nombre
        ];


    }
}
