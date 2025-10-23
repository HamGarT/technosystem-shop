<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PedidoItem extends Model
{
    protected $fillable = [
        "producto_id",
        "cantidad",
        "pedido_id",
    ] ;

    public function producto(){
        return $this->belongsTo(Producto::class, 'producto_id');
    }
}
