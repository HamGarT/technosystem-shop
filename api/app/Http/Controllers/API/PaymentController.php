<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Pedido;
use App\Models\PedidoItem;
use App\Models\Producto;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Client\Payment\PaymentClient;
use MercadoPago\MercadoPagoConfig;

class PaymentController extends Controller
{
    // public function __construct()
    // {
    //     MercadoPagoConfig::setAccessToken(env('MERCADO_PAGO_ACCESS_TOKEN'));
    // }

    // Crear preferencia para Checkout Pro
    public function createPreference(Request $request)
    {
        try {

            Log::info('Creando preferencia de pago');
            $this->authenticate();
            Log::info('Autenticado con éxito');

            $client = new PreferenceClient();

            $items = [];
            foreach ($request->pedido_items as $item) {
                $producto = Producto::find($item['producto_id']);

                if (!$producto) {
                    return response()->json([
                        'error' => "Producto no encontrado: {$item['producto_id']}"
                    ], 404);
                }

                $items[] = [
                    'id' => (string) $producto->id,
                    'title' => $producto->nombre,
                    'quantity' => (int) $item['cantidad'],
                    'unit_price' => (float) $producto->precio,
                    'currency_id' => 'PEN'
                ];
            }

            // Guardar datos del pedido en external_reference
            $externalReference = json_encode([
                'usuario_id' => $request->usuario_id,
                'departamento' => $request->departamento,
                'provincia' => $request->provincia,
                'direccion' => $request->direccion,
                'pedido_items' => $request->pedido_items
            ]);

            $preference = $client->create([
                'items' => $items,
                'back_urls' => [
                    'success' => env('FRONTEND_URL') . '/pago/exitoso',
                    'failure' => env('FRONTEND_URL') . '/pago/fallido',
                    'pending' => env('FRONTEND_URL') . '/pago/pendiente'
                ],
                'auto_return' => 'approved',
                'external_reference' => $externalReference,
                'notification_url' => env('APP_URL') . '/api/webhook/mercadopago'
            ]);

            return response()->json([
                'id' => $preference->id
            ]);

        }catch (\MercadoPago\Exceptions\MPApiException $e) {
            

            // Obtener detalles del error de MercadoPago
            $response = $e->getApiResponse();
            $content = $response->getContent();

            \Log::error('MercadoPago API Error:', [
                'status' => $e->getStatusCode(),
                'content' => $content
            ]);

            Log::error('MercadoPago API Error 33: ' . json_encode($e->getApiResponse()->getContent()));

            return response()->json([
                'status' => 'error',
                'message' => 'Error de MercadoPago',
                'error' => $content
            ], 422);

        } catch (Exception $e) {
            Log::error('Error creando preferencia:', ['error' => $e->getMessage()]);

            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Webhook - MercadoPago notifica cuando se paga
    public function webhook(Request $request)
    {
        try {
            Log::info('Webhook recibido:', $request->all());

            if ($request->type === 'payment') {
                $paymentId = $request->data['id'];

                $client = new PaymentClient();
                $payment = $client->get($paymentId);

                Log::info('Payment status:', ['status' => $payment->status]);

                if ($payment->status === 'approved') {
                    $orderData = json_decode($payment->external_reference, true);

                    // Verificar si ya existe el pedido
                    $existingOrder = Pedido::where('payment_id', $paymentId)->first();
                    if ($existingOrder) {
                        return response()->json(['status' => 'already_processed']);
                    }

                    // Crear el pedido
                    $this->crearPedido($orderData, $paymentId);
                }
            }

            return response()->json(['status' => 'ok']);

        } catch (Exception $e) {
            Log::error('Error en webhook:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    private function crearPedido($orderData, $paymentId)
    {
        DB::transaction(function () use ($orderData, $paymentId) {
            $total_price = 0;
            $cantidad_productos = 0;

            $pedido = Pedido::create([
                'estado' => 'pagado',
                'fecha_pedido' => now(),
                'departamento' => $orderData['departamento'],
                'provincia' => $orderData['provincia'],
                'direccion_entrega' => $orderData['direccion'],
                'usuario_id' => $orderData['usuario_id'],
                'payment_id' => $paymentId,
            ]);

            foreach ($orderData['pedido_items'] as $item) {
                $producto = Producto::lockForUpdate()->find($item['producto_id']);

                if (!$producto) {
                    throw new Exception("Producto no encontrado: {$item['producto_id']}");
                }

                if ($producto->stock < $item['cantidad']) {
                    throw new Exception("Stock insuficiente para {$producto->nombre}");
                }

                PedidoItem::create([
                    'pedido_id' => $pedido->id,
                    'producto_id' => $producto->id,
                    'cantidad' => $item['cantidad'],
                ]);

                $total_price += $producto->precio * $item['cantidad'];
                $cantidad_productos += $item['cantidad'];
                $producto->decrement('stock', $item['cantidad']);
            }

            $pedido->precio_total = $total_price;
            $pedido->cantidad_productos = $cantidad_productos;
            $pedido->save();

            Log::info('Pedido creado:', ['pedido_id' => $pedido->id]);
        });
    }

    protected function authenticate()
    {
        $mpAccessToken = config('services.mercadopago.token');
        if (!$mpAccessToken) {
            throw new Exception("El token de acceso de Mercado Pago no está configurado.");
        }
        MercadoPagoConfig::setAccessToken($mpAccessToken);
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }
}
