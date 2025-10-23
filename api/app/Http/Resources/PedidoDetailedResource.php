<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoDetailedResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "estado" => $this->estado,
            "precio_total" => $this->precio_total,
            "cantidad_productos"=> $this->cantidad_productos,
            "fecha_pedido"=> $this->fecha_pedido,
            "usuario" => $this->usuario->name,
            "email" => $this->usuario->email,
            "items" => PedidoItemResource::collection($this->pedidos)
        ];
    }
}
