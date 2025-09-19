<?php

use App\Http\Controllers\API\ProductoController;
use Illuminate\Support\Facades\Route;
use Psy\Output\ProcOutputPager;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/products', [ProductoController::class, 'index']);
Route::post('/products/create', [ProductoController::class,'create']);
Route::get('/products/{id}', [ProductoController::class,'show']);