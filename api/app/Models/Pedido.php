<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
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

}
    