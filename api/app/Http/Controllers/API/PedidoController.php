<?php

namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Http\Requests\CreateOrderRequest;
use App\Http\Requests\UpdateOrderStatusRequest;
use App\Http\Resources\PedidoDetailedResource;
use App\Http\Resources\PedidoSimpleResource;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Producto;
use Date;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{

    use HasFactory;
    //
    public function index(){
        $pedidos = Pedido::with('usuario')->paginate(15);
        return PedidoSimpleResource::collection($pedidos);
    }
    public function store(CreateOrderRequest $request){
       try {
            DB::beginTransaction();
        
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
                $producto = Producto::lockForUpdate()->find($item["producto_id"]);
                if(!$producto) {
                    throw new Exception("Producto no encontrado: {$item['producto_id']}");
                }
                if($producto->stock < $item['cantidad']) {
                    throw new Exception("Stock insuficiente para {$producto->nombre}. Disponible: {$producto->stock}, Solicitado: {$item['cantidad']}");
                }
                PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                ]);
                $total_price += $producto->precio * $item["cantidad"];
                $cantidad_productos += $item["cantidad"];
                $producto->decrement('stock', $item['cantidad']);
            }
            $pedido->precio_total = $total_price;
            $pedido->cantidad_productos = $cantidad_productos;
            $pedido->save();
            DB::commit();
            return (new PedidoSimpleResource($pedido))
                ->response()
                ->setStatusCode(201);
            
        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al crear el pedido',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function show($id){
        try{
            //$pedido = Pedido::findOrFail($id);
            $pedido = Pedido::with('usuario', 'pedidos.producto')->find($id); 
            return (new PedidoDetailedResource($pedido))
                    ->response()
                    ->setStatusCode(201);

        }catch(ModelNotFoundException){
            return response()->json([
                'message' => 'Product not found'
            ], 404); 
        }
    }

    public function updateStatus($id, UpdateOrderStatusRequest $request){
    try{
        $pedido = Pedido::findOrFail($id);
        $data = $request->validated();
        
        $pedido->estado = $data["estado"];
        $pedido->save();
        
        return (new PedidoSimpleResource($pedido))
            ->response()
            ->setStatusCode(200);
            
    }catch(ModelNotFoundException){
        return response()->json([
            'message' => 'Order not found'
        ], 404);
    }
}
}
