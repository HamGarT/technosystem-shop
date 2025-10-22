<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Categoria extends Model
{
    //
     protected $fillable = [
        "nombre",
        "descripcion"
    ];

    public function products(): HasMany
    {
        return $this->hasMany(Producto::class, 'category_id');
    }
}

