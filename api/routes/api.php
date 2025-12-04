<?php

use App\Http\Controllers\API\CategoriaController;
use App\Http\Controllers\API\EmailVerificationController;
use App\Http\Controllers\API\MercadoPagoController;
use App\Http\Controllers\API\PaymentController;
use App\Http\Controllers\API\PedidoController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\ProductoController;
use App\Http\Controllers\API\AuthController;


Route::group(['prefix' => 'auth'], function () {
    Route::post('/verify-email', [EmailVerificationController::class, 'verifyEmail']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/verify-otp', [EmailVerificationController::class, 'verifyOTP']);
    Route::post('/resend-otp', [EmailVerificationController::class, 'resendOTP']);
    
    Route::middleware('auth:api')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::get('/me', [AuthController::class, 'me']);
    });
});

// Route::prefix('payment')->middleware('auth:api')->group(function(){
//     Route::post('/create-preference', [MercadoPagoController::class, 'createPaymentPreference']);
// });

Route::prefix('payment')->group(function(){
   Route::post('/create-preference', [PaymentController::class, 'createPreference']);
    // Route::get('/mercadopago/success', [MercadoPagoController::class, 'success'])->name('mercadopago.success');
    // Route::get('/mercadopago/failure', [MercadoPagoController::class, 'failure'])->name('mercadopago.failure');
    // Route::get('/mercadopago/pending', [MercadoPagoController::class, 'pending'])->name('mercadopago.pending');
    // Route::get('/mercadopago/success', [MercadoPagoController::class, 'success'])->name('mercadopago.success');
    // Route::get('/mercadopago/failure', [MercadoPagoController::class, 'failure'])->name('mercadopago.failure');
});

Route::post('/webhook/mercadopago', [PaymentController::class, 'webhook']);

Route::prefix('products')->group(function () {
    Route::get('/', [ProductoController::class, 'index']);
    Route::get('/search', [ProductoController::class, 'search']);
    Route::get('/{id}', [ProductoController::class, 'show']);    
    Route::middleware(['auth:api', 'role:admin'])->group(function () {
        Route::post('/', [ProductoController::class, 'store']);
        Route::put('/{id}', [ProductoController::class, 'update']);
        Route::delete('/{id}', [ProductoController::class, 'delete']);
    });
});

Route::prefix('pedidos')->middleware('auth:api')->group(function () {
    Route::middleware('role:admin')->group(function () {
        Route::put('/{id}/status', [PedidoController::class, 'updateStatus']);
    });
    Route::post('/', [PedidoController::class, 'store']);
    Route::get('/', [PedidoController::class, 'index']);
    Route::get('/{id}', [PedidoController::class, 'show']);
});

Route::prefix('categorias')->group(function () {
    Route::post('/', [CategoriaController::class, 'store']); 
    Route::get('/', [CategoriaController::class, 'index']);
    Route::get('/detailed', [CategoriaController::class, 'detailedIndex']);
    Route::delete('/{id}', [CategoriaController::class, 'delete']);
});

