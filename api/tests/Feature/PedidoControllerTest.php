<?php

namespace Tests\Feature;

use App\Models\Pedido;
use App\Models\Producto;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PedidoControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Crear usuario y autenticarlo
        $user = User::factory()->create();
        $this->actingAs($user, 'api'); // O Sanctum::actingAs($user);
    }

    /** @test */
    public function puede_listar_pedidos()
    {
        Pedido::factory()->count(3)->create();

        $response = $this->getJson('/api/pedidos');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'estado', 'cantidad_productos', 'fecha_pedido']
                ]
            ]);
    }

    /** @test */
    public function puede_crear_un_pedido()
    {
        $producto = Producto::factory()->create(['stock' => 10, 'precio' => 100]);

        $data = [
            "departamento" => "Cajamarca",
            "provincia" => "Cajamarca",
            "direccion" => "Av. Los Pinos 123",
            "usuario_id" => auth()->id(),
            "pedido_items" => [
                [
                    "producto_id" => $producto->id,
                    "cantidad" => 2
                ]
            ]
        ];

        $response = $this->postJson('/api/pedidos', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'estado', 'cantidad_productos']]);

        $this->assertDatabaseHas('pedidos', ['usuario_id' => auth()->id()]);
        $this->assertDatabaseHas('pedido_items', ['producto_id' => $producto->id]);
    }

    /** @test */
    public function puede_ver_detalle_de_un_pedido()
    {
        $pedido = Pedido::factory()->create();

        $response = $this->getJson("/api/pedidos/{$pedido->id}");

        $response->assertStatus(201)
            ->assertJsonStructure(['data' => ['id', 'estado']]);
    }

    /** @test */
    public function puede_actualizar_estado_de_pedido()
    {
        $pedido = Pedido::factory()->create(['estado' => 'pendiente']);

        $data = ['estado' => 'completado'];

        $response = $this->putJson("/api/pedidos/{$pedido->id}/status", $data);

        $response->assertStatus(200)
            ->assertJsonFragment(['estado' => 'completado']);

        $this->assertDatabaseHas('pedidos', ['id' => $pedido->id, 'estado' => 'completado']);
    }

    /** @test */
    public function no_puede_actualizar_un_pedido_inexistente()
    {
        $response = $this->putJson("/api/pedidos/9999/status", ['estado' => 'completado']);

        $response->assertStatus(404)
            ->assertJson(['message' => 'Order not found']);
    }
}
