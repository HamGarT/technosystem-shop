<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Producto extends Model
{
    
    use HasFactory;

    protected $fillable = [
        'nombre',
        'marca',
        'descripcion',
        'precio',
        'stock',
        'category_id',
        'estado',
        'image_url',
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'updated_at' => 'datetime',
    ];

    public function categoria(){
        return $this->belongsTo(Categoria::class, 'category_id');
    }
}


// $fillable → Security: what you allow to be mass assigned.

// $hidden → Privacy: what you hide when exposing data.

// $casts → Data handling: automatic type conversion when retrieving/saving.