<?php

use App\Http\Controllers\API\CategoriaController;
use App\Http\Controllers\API\PedidoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductoController;

Route::prefix('products')->group(function () {
    Route::post('/', [ProductoController::class, 'store']);
    Route::get('/', [ProductoController::class, 'index']);
    Route::get('/{id}', [ProductoController::class, 'show']);
    Route::post('/{id}', [ProductoController::class, 'update']);
    Route::put('/{id}', [ProductoController::class, 'update']);
    Route::delete('/{id}', [ProductoController::class, 'delete']);
});


Route::prefix('pedidos')->group(function () {
    Route::post('/', [PedidoController::class, 'store']);
    Route::get('/', [PedidoController::class, 'index']);
    Route::get('/{id}', [PedidoController::class, 'show']);
    Route::put('/{id}/status', [PedidoController::class, 'updateStatus']);
});

Route::prefix('categorias')->group(function () {
    Route::post('/', [CategoriaController::class, 'store']);
    Route::get('/', [CategoriaController::class, 'index']);
    Route::get('/detailed', [CategoriaController::class, 'detailedIndex']);
    Route::delete('/{id}', [CategoriaController::class, 'delete']);
});

