<?php

use App\Http\Controllers\API\ProductoController;
use Illuminate\Support\Facades\Route;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/products', [ProductoController::class, 'index']);
//  
