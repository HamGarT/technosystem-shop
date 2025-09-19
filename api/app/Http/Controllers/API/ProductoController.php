<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Resources\ProductoResource;
use Illuminate\Http\Request;
use App\Models\Producto;
use Illuminate\Support\Facades\Http;
class ProductoController extends Controller
{



    public function index()
    {
        $productos = Producto::paginate(15); // 15 items per page
        return ProductoResource::collection($productos);
    }

    public function show($id)
    {
        $producto = Producto::find($id);
        if ($producto) {
            return new ProductoResource($producto);
        }
        return response()->json(['message' => 'Product not found'], 404);
    }
    public function create(StoreProductoRequest $request)
    {

        try {
            $data = $request->validated();
            $producto = Producto::create($data);

            return (new ProductoResource($producto))
                ->response()
                ->setStatusCode(201);

        } catch (\Exception $e) {
            \Log::error('Failed to create product: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create product',
                'error' => 'Internal server error'
            ], 500);
        }
    }
}
