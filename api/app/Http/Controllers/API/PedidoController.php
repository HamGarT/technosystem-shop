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
use Illuminate\Http\Request;
use Date;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Exception;
use Illuminate\Support\Facades\DB;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;
use Illuminate\Support\Facades\Log;

class PedidoController extends Controller
{

    use HasFactory;
    // public function __construct()
    // {
    //     MercadoPagoConfig::setAccessToken(env('MERCADO_PAGO_ACCESS_TOKEN'));
    // }
    //
    public function index()
    {
        $pedidos = Pedido::with('usuario')->paginate(15);
        return PedidoSimpleResource::collection($pedidos);
    }
    // public function store(Request $request)
    // {
    //     try {
    //         DB::beginTransaction();
    //         Log::info('Creando preferencia de pago');
    //         $this->authenticate();
    //         Log::info('Autenticado con éxito');
    //         // 1. Procesar pago en MercadoPago
    //         $client = new PaymentClient();

    //         $paymentData = [
    //             'transaction_amount' => (float) $request->input('transaction_amount'),
    //             'token' => $request->input('token'),
    //             'description' => 'Compra en tienda',
    //             'installments' => (int) $request->input('installments', 1),
    //             'payment_method_id' => $request->input('payment_method_id'),
    //             'payer' => [
    //                 'email' => $request->input('payer.email'),
    //             ]
    //         ];

    //         // issuer_id es opcional (solo para tarjetas)
    //         if ($request->has('issuer_id')) {
    //             $paymentData['issuer_id'] = (int) $request->input('issuer_id');
    //         }

    //         // identification es opcional
    //         if ($request->has('payer.identification')) {
    //             $paymentData['payer']['identification'] = [
    //                 'type' => $request->input('payer.identification.type', 'DNI'),
    //                 'number' => $request->input('payer.identification.number')
    //             ];
    //         }
    //         \Log::info('Payment data:', $paymentData);

    //         $payment = $client->create($paymentData);

    //         // 2. Verificar estado del pago
    //         if ($payment->status !== 'approved') {
    //             DB::rollBack();
    //             return response()->json([
    //                 'status' => $payment->status,
    //                 'status_detail' => $payment->status_detail,
    //                 'message' => $this->getStatusMessage($payment->status)
    //             ]);
    //         }

    //         // 3.  Crear pedido con TU estructura
    //         $order = $request->input('order');
    //         $total_price = 0;
    //         $cantidad_productos = 0;

    //         $pedido = Pedido::create([
    //             "estado" => "pagado",
    //             "fecha_pedido" => now(),
    //             "departamento" => $order["departamento"],
    //             "provincia" => $order["provincia"],
    //             "direccion_entrega" => $order["direccion"],
    //             "usuario_id" => $order["usuario_id"],
    //             // "payment_id" => $payment->id,
    //         ]);

    //         foreach ($order["pedido_items"] as $item) {
    //             $producto = Producto::lockForUpdate()->find($item["producto_id"]);

    //             if (!$producto) {
    //                 throw new Exception("Producto no encontrado: {$item['producto_id']}");
    //             }

    //             if ($producto->stock < $item['cantidad']) {
    //                 throw new Exception("Stock insuficiente para {$producto->nombre}");
    //             }

    //             PedidoItem::create([
    //                 'pedido_id' => $pedido->id,
    //                 'producto_id' => $producto->id,
    //                 'cantidad' => $item['cantidad'],
    //             ]);

    //             $total_price += $producto->precio * $item["cantidad"];
    //             $cantidad_productos += $item["cantidad"];
    //             $producto->decrement('stock', $item['cantidad']);
    //         }

    //         $pedido->precio_total = $total_price;
    //         $pedido->cantidad_productos = $cantidad_productos;
    //         $pedido->save();

    //         DB::commit();

    //         return response()->json([
    //             'status' => 'approved',
    //             'payment_id' => $payment->id,
    //             'pedido' => new PedidoSimpleResource($pedido),
    //             'message' => '¡Pago exitoso!'
    //         ]);

    //     } catch (\MercadoPago\Exceptions\MPApiException $e) {
    //         DB::rollBack();

    //         // Obtener detalles del error de MercadoPago
    //         $response = $e->getApiResponse();
    //         $content = $response->getContent();

    //         \Log::error('MercadoPago API Error:', [
    //             'status' => $e->getStatusCode(),
    //             'content' => $content
    //         ]);

    //         Log::error('MercadoPago API Error 33: ' . json_encode($e->getApiResponse()->getContent()));

    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Error de MercadoPago',
    //             'error' => $content
    //         ], 422);

    //     } catch (Exception $e) {
    //         DB::rollBack();
    //         \Log::error('Error general:', ['error' => $e->getMessage()]);
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Error al procesar el pago',
    //             'error' => $e->getMessage()
    //         ], 422);
    //     }
    // }

    public function show($id)
    {
        try {
            //$pedido = Pedido::findOrFail($id);
            $pedido = Pedido::with('usuario', 'pedidos.producto')->find($id);
            return (new PedidoDetailedResource($pedido))
                ->response()
                ->setStatusCode(201);

        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Product not found'
            ], 404);
        }
    }

    public function updateStatus($id, UpdateOrderStatusRequest $request)
    {
        try {
            $pedido = Pedido::findOrFail($id);
            $data = $request->validated();

            $pedido->estado = $data["estado"];
            $pedido->save();

            return (new PedidoSimpleResource($pedido))
                ->response()
                ->setStatusCode(200);

        } catch (ModelNotFoundException) {
            return response()->json([
                'message' => 'Order not found'
            ], 404);
        }
    }

    private function getStatusMessage($status)
    {
        $messages = [
            'approved' => '¡Pago aprobado!',
            'pending' => 'Pago pendiente de confirmación',
            'rejected' => 'El pago fue rechazado',
            'in_process' => 'El pago está en revisión',
        ];

        return $messages[$status] ?? 'Estado desconocido';
    }

    // protected function authenticate()
    // {
    //     $mpAccessToken = config('services.mercadopago.token');
    //     if (!$mpAccessToken) {
    //         throw new Exception("El token de acceso de Mercado Pago no está configurado.");
    //     }
    //     MercadoPagoConfig::setAccessToken($mpAccessToken);
    //     MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    // }

}
