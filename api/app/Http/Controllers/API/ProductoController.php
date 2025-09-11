<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Resources\ProductoResource;
use Illuminate\Http\Request;
use App\Models\Producto;
class ProductoController extends Controller
{
    //
    
    public function index(){
        return  ProductoResource::collection(Producto::all());
    }
    public function save(StoreProductoRequest $request){

        $data = $request->validated();
        $producto = Producto::create($data);
        return new ProductoResource($producto);
    }
}
