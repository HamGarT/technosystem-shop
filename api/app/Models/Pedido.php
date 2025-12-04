<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use function PHPUnit\Framework\returnArgument;

class Pedido extends Model
{
    use HasFactory;
    protected $fillable = [
        "estado",
        "cantidad_productos",
        "fecha_pedido",
        "departamento",
        "provincian",
        "usuario_id",
        "direccion_entrega"
    ] ;

    public function usuario(){
        return $this->belongsTo(User::class,'usuario_id');
    }

    public function pedidos(){
        return $this->hasMany(PedidoItem::class, 'pedido_id');
    }

    public function getPrecioTotalAttribute()
    {
        return $this->pedidos->sum(fn($item) => ($item->producto?->precio ?? 0) * $item->cantidad);
    }

}
