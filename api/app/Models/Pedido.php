<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $fillable = [
        "estado",
        "precio_total",
        "cantidad_productos",
        "fecha_pedido"
    ] ;
}
