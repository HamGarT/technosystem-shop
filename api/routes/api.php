<?php

use App\Http\Controllers\API\CategoriaController;
use App\Http\Controllers\API\PedidoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductoController;
use App\Http\Controllers\API\AuthController;


Route::group(['prefix' => 'auth'], function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    // User routes - accessible to all authenticated users
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});


// Route::prefix('products')->group(function () {
//     Route::post('/', [ProductoController::class, 'store']);
//     Route::get('/', [ProductoController::class, 'index']);
//     Route::get('/{id}', [ProductoController::class, 'show']);
//     Route::post('/{id}', [ProductoController::class, 'update']);
//     Route::put('/{id}', [ProductoController::class, 'update']);
//     Route::delete('/{id}', [ProductoController::class, 'delete']);
// });

// Route::middleware(['auth:api', 'role:admin'])->group(function () {
//     Route::get('/admin/users', [AdminController::class, 'getAllUsers']);
//     Route::post('/admin/users', [AdminController::class, 'createUser']);
//     Route::put('/admin/users/{id}', [AdminController::class, 'updateUser']);
//     Route::delete('/admin/users/{id}', [AdminController::class, 'deleteUser']);
    
//     Route::get('/admin/dashboard', [AdminController::class, 'adminDashboard']);
//     Route::get('/admin/reports', [AdminController::class, 'getReports']);
// });

Route::prefix('products')->group(function () {
    // Public - Anyone can view
    Route::get('/', [ProductoController::class, 'index']);
    Route::get('/{id}', [ProductoController::class, 'show']);
    
    // Admin only - Create, Update, Delete
    Route::middleware(['auth:api', 'role:admin'])->group(function () {
        Route::post('/', [ProductoController::class, 'store']);
        Route::put('/{id}', [ProductoController::class, 'update']);
        Route::delete('/{id}', [ProductoController::class, 'delete']);
    });
});

Route::prefix('pedidos')->middleware('auth:api')->group(function () {
    // Admin only
    Route::middleware('role:admin')->group(function () {
        Route::post('/', [PedidoController::class, 'store']);
        Route::put('/{id}/status', [PedidoController::class, 'updateStatus']);
    });
    
    // All authenticated users
    Route::get('/', [PedidoController::class, 'index']);
    Route::get('/{id}', [PedidoController::class, 'show']);
});

Route::prefix('categorias')->group(function () {
    Route::post('/', [CategoriaController::class, 'store']);
    Route::get('/', [CategoriaController::class, 'index']);
    Route::get('/detailed', [CategoriaController::class, 'detailedIndex']);
    Route::delete('/{id}', [CategoriaController::class, 'delete']);
});

