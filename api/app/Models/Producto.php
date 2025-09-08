<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'description',
        'price',
        'sku',
        'category_id',
        'stock_quantity',
        'is_active',
        'image_url',
        'weight',
        'dimensions',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'weight' => 'decimal:2',
        'is_active' => 'boolean',
        'dimensions' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}


// $fillable → Security: what you allow to be mass assigned.

// $hidden → Privacy: what you hide when exposing data.

// $casts → Data handling: automatic type conversion when retrieving/saving.