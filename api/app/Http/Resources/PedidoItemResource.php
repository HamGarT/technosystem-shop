<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PedidoItemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'producto' => $this->producto?->nombre ?? 'N/A',
            'cantidad' => $this->cantidad,
            'total' => ($this->producto?->precio ?? 0) * $this->cantidad
        ];
    }
}
