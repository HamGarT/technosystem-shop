<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoriaRequest;
use App\Http\Resources\CategoriaResource;
use App\Models\Categoria;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;


class CategoriaController extends Controller
{

    public function index(){
        $categorias = Categoria::paginate(15);
        return CategoriaResource::collection($categorias);
    }
    public function store(StoreCategoriaRequest $request){
        try{
            $data = $request->validated();
            $categoria = Categoria::create($data);
            return (new CategoriaResource($categoria))
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
            $categoria = Categoria::findOrFail($id);
            $categoria->delete();
            return response()->json([
                "message" => "Category succesfully deleted",
            ]);
        }catch(ModelNotFoundException){
            return response()->json([
                "message"=>"Category not found"
            ], 404);
        }catch(Exception $e){
            return response()->json([
                "message"=> "Failed to delete category",
                "error" => "Internal server error"
            ], 500);
        }
    }
}
