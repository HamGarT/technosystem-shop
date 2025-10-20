<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductoRequest;
use App\Http\Resources\ProductoResource;
use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProductoController extends Controller
{



    public function index()
    {
        $productos = Producto::with('categoria')->paginate(15);                
        return ProductoResource::collection($productos);
    }

    public function show($id)
    { 
        $producto = Producto::with('categoria')->find($id);
        if ($producto) {
            return new ProductoResource($producto);
        }
        return response()->json(['message' => 'Product not found'], 404);
    }

    public function store(StoreProductoRequest $request)
    {
        try {
            $data = $request->validated();
            $producto = Producto::create($data);

            $photoUrl = $this->handleProductPhotoUpload($request, $producto->id);
            if ($photoUrl) {
                $producto->update(['image_url' => $photoUrl]);
            }

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


public function delete($id){
    try{
        $producto = Producto::findOrFail($id);
        $producto->delete();
        return response()->json([
            'message'=> 'Product successfully deleted'
        ]);
        
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Product not found'
        ], 404);
    } catch (\Exception $e){
        return response()->json([
            'message' => 'Failed to delete product',
            'error' => 'Internal server error'
        ], 500);
    }
}

public function update($id, StoreProductoRequest $request){
    try{
        
        $data = $request->validated();
        $producto = Producto::findOrFail($id);
        $producto->update($data);
        $photoUrl = $this->handleProductPhotoUpload($request, $producto->id);
        if ($photoUrl) {
            $producto->update(['image_url'=> $photoUrl]);
        }
        return (new ProductoResource($producto))
            ->response()
            ->setStatusCode(200);
            
    } catch (ModelNotFoundException $e) {
        return response()->json([
            'message' => 'Product not found'
        ], 404);
    } catch (\Exception $e){
        return response()->json([
            'message' => 'Failed to update product',
            'error' => 'Internal server error'
        ], 500);
    }
}


    private function handleProductPhotoUpload(Request $request, $productId)
    {
        if (!$request->hasFile('image')) {
            return null;
        }
        
        $request->validate([
            'image' => 'nullable|image|mimes:jpg,jpeg,png|max:4048',
        ]);

        $uuid = \Str::uuid();
        $extension = $request->file('image')->getClientOriginalExtension();
        $filename = $uuid . '.' . $extension;

        $path = $request->file('image')->storeAs(
            "product_images/{$productId}",
            $filename,
            'public'
        );
        return Storage::url($path); ;
    }

  
}
