<?php

namespace App\Http\Controllers\API;
use MercadoPago\MercadoPagoConfig;
use MercadoPago\Client\Preference\PreferenceClient;
use MercadoPago\Exceptions\MPApiException;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class MercadoPagoController extends Controller
{
    public function createPaymentPreference(Request $request)
    {
        Log::info('Creando preferencia de pago');
        $this->authenticate();
        Log::info('Autenticado con éxito');

        // Obtener los items del pedido desde la solicitud
        $pedidoItems = $request->input('pedido_items');

        if (empty($pedidoItems) || !is_array($pedidoItems)) {
            return response()->json(['error' => 'Los items del pedido son requeridos.'], 400);
        }

        // Transformar pedido_items al formato que MercadoPago espera
        $items = [];
        foreach ($pedidoItems as $item) {
            // Aquí deberías obtener los datos del producto desde tu base de datos
            $producto = \App\Models\Producto::find($item['producto_id']);

            if (!$producto) {
                return response()->json(['error' => "Producto {$item['producto_id']} no encontrado. "], 404);
            }

            $items[] = [
                "id" => (string) $producto->id,
                "title" => $producto->nombre,
                "description" => $producto->descripcion ?? $producto->nombre,
                "quantity" => (int) $item['cantidad'],
                "currency_id" => "PEN", // O "ARS", "MXN", etc.  según tu país
                "unit_price" => (float) $producto->precio,
            ];
        }

        // Información del comprador
        $payer = [
            "name" => $request->input('name', 'John'),
            "surname" => $request->input('surname', 'Doe'),
            "email" => $request->input('email', 'user@example.com'),
        ];

        // Crear la solicitud de preferencia
        $requestData = $this->createPreferenceRequest($items, $payer);

        // Guardar datos adicionales para el pedido (opcional)
        $requestData['external_reference'] = json_encode([
            'usuario_id' => $request->input('usuario_id'),
            'departamento' => $request->input('departamento'),
            'provincia' => $request->input('provincia'),
            'direccion' => $request->input('direccion'),
        ]);

        $client = new PreferenceClient();

        try {
            $preference = $client->create($requestData);

            return response()->json([
                'id' => $preference->id,
                'init_point' => $preference->init_point,
            ]);
        } catch (MPApiException $error) {
            Log::error('MercadoPago API Error: ' . json_encode($error->getApiResponse()->getContent()));
            return response()->json([
                'error' => $error->getApiResponse()->getContent(),
            ], 500);
        } catch (Exception $e) {
            Log::error('Exception: ' . $e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    // Autenticación con Mercado Pago 
    protected function authenticate()
    {
        $mpAccessToken = config('services.mercadopago.token');
        if (!$mpAccessToken) {
            throw new Exception("El token de acceso de Mercado Pago no está configurado.");
        }
        MercadoPagoConfig::setAccessToken($mpAccessToken);
        MercadoPagoConfig::setRuntimeEnviroment(MercadoPagoConfig::LOCAL);
    }

    // Función para crear la estructura de preferencia 
    protected function createPreferenceRequest($items, $payer): array
    {
        $paymentMethods = [
            "excluded_payment_methods" => [],
            "installments" => 12,
            "default_installments" => 1
        ];

        // ✅ Usar config() en lugar de env()
        $frontendUrl = config('services.mercadopago.frontend_url', 'http://localhost:5174');

        // 🔍 Log para debug - TEMPORAL
        Log::info('Frontend URL: ' . $frontendUrl);

        $backUrls = [
            "success" => "https://www.tu-sitio/success",
            "failure" => "https://www.tu-sitio/failure",
            "pending" => "https://www.tu-sitio/pending"
        ];

        // 🔍 Log para debug - TEMPORAL
        Log::info('Back URLs: ', $backUrls);

        $request = [
            "items" => $items,
            "payer" => $payer,
            "payment_methods" => $paymentMethods,
            "back_urls" => $backUrls,
            "statement_descriptor" => "TIENDA ONLINE",
            "external_reference" => "1234567890",
            "expires" => false,
            "auto_return" => 'approved',
        ];

        return $request;
    }
}
