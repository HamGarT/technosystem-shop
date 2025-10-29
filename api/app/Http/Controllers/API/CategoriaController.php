<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Resources\CategoriaDetailedResource;
use App\Http\Resources\CategoriaSimpleResource;
use App\Models\Categoria;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class CategoriaController extends Controller
{

    public function index(){
        $categorias = Categoria::paginate(15);
        return CategoriaSimpleResource::collection($categorias);
    }

    public function detailedIndex(){
        $categorias = Categoria::withCount('products')->paginate(15);
        return CategoriaDetailedResource::collection($categorias);
    }
    public function store(StoreCategoriaRequest $request){
        try{
            $data = $request->validated();
            $categoria = Categoria::create($data);
            return (new CategoriaSimpleResource($categoria))
                    ->response()
                    ->setStatusCode(201);
        }catch(Exception $e){
            return response()->json([
                'message' => 'Failed to create category',
                'error' => 'Internal server error niooooo',
                "log" => $e->getMessage()
            ], 500);
        }
    }

    public function delete($id){
        try{
            $categoria = Categoria::withCount('products')->findOrFail($id);
            if($categoria->products_count > 0){ 
                throw new Exception("Categoria con productos no puede ser eliminada");
            }
            $categoria->delete();
            return response()->json([
                "message" => "Categoria eliminada exitosamente",
            ]);
        }catch(ModelNotFoundException){
            return response()->json([
                "message"=>"Categoria no encontrada"
            ], 404);
        }catch(Exception $e){
            return response()->json([
                "message"=> "Error al eliminar categoria",
                "error" => $e->getMessage()
            ], 422);
        }
    }   
}
