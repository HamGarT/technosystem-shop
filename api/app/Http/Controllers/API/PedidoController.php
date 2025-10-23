<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Resources\PedidoResource;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Producto;
use Date;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Http\Request;
use function PHPUnit\Framework\returnArgument;

class PedidoController extends Controller
{
    //
    public function index(){
        $pedidos = Pedido::with('usuario')->paginate(15);
        return PedidoResource::collection($pedidos);
    }
    public function store(CreateOrderRequest $request){
        $total_price = 0;
        $cantidad_productos = 0;
        $data = $request->validated();
    
        $pedido = Pedido::create([
            "estado" => "pendiente",
            "fecha_pedido" => now(), 
            "departamento" => $data["departamento"],
            "provincia" => $data["provincia"],
            "direccion_entrega" => $data["direccion"],
            "usuario_id" => $data["usuario_id"],
        ]);
        
        foreach($data["pedido_items"] as $item) {
            $producto = Producto::find($item["producto_id"]);
        
            if($producto) {
                PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                ]);
                $total_price += $producto->precio * $item["cantidad"];
                $cantidad_productos += $item["cantidad"];
            }
        }
    
        $pedido->precio_total = $total_price;
        $pedido->cantidad_productos = $cantidad_productos;
        $pedido->save();
        return (new PedidoResource($pedido))
            ->response()
            ->setStatusCode(201);
    }

    public function show($id){
        try{
            $pedido = Pedido::findOrFail($id);
            return (new PedidoResource($pedido))
                    ->response()
                    ->setStatusCode(201);

        }catch(ModelNotFoundException){
            return response()->json([
                'message' => 'Product not found'
            ], 404); 
        }
    }
}
