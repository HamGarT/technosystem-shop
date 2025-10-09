<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductoController;

Route::post('/products', [ProductoController::class, 'store']);
Route::get('/products', [ProductoController::class, 'index']);
Route::get('/products/{id}', [ProductoController::class, 'show']);