<?php

namespace Tests\Feature;

use App\Models\Categoria;
use App\Models\Producto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ProductoControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function puede_listar_productos()
    {
        $categoria = Categoria::factory()->create();
        Producto::factory()->count(3)->create(['category_id' => $categoria->id]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
                 ->assertJsonStructure([
                     'data' => [
                         '*' => ['id', 'nombre', 'marca', 'precio', 'categoria']
                     ]
                 ]);
    }

    /** @test */
    public function puede_crear_un_producto_con_imagen_url()
    {
        $categoria = Categoria::factory()->create();
        $data = [
            'nombre' => 'Tarjeta Grafica',
            'marca' => 'Don.Cofellio',
            'descripcion' => 'Café artesanal de Cajamarca',
            'precio' => 15.50,
            'stock' => 10,
            'category_id' => $categoria->id,
            'estado' => true,
            'image_url' => 'https://example.com/images/cafe.jpg', // ✅ tu campo correcto
        ];

        $response = $this->postJson('/api/products', $data);

        $response->assertStatus(201)
                 ->assertJsonFragment(['nombre' => 'Tarjeta Grafica']);

        $this->assertDatabaseHas('productos', ['nombre' => 'Tarjeta Grafica']);
    }

    /** @test */
    public function puede_actualizar_un_producto()
    {
        $categoria = Categoria::factory()->create();
        $producto = Producto::factory()->create([
            'category_id' => $categoria->id,
            'nombre' => 'Producto viejo'
        ]);

        $data = [
            'nombre' => 'Producto actualizado',
            'marca' => $producto->marca,
            'descripcion' => $producto->descripcion,
            'precio' => $producto->precio,
            'stock' => $producto->stock,
            'category_id' => $producto->category_id,
            'estado' => $producto->estado,
            'image_url' => 'https://example.com/new-image.jpg',
        ];

        $response = $this->putJson("/api/products/{$producto->id}", $data);

        $response->assertStatus(200)
                 ->assertJsonFragment(['nombre' => 'Producto actualizado']);
    }

    /** @test */
    public function puede_eliminar_un_producto()
    {
        $producto = Producto::factory()->create();

        $response = $this->deleteJson("/api/products/{$producto->id}");

        $response->assertStatus(200)
                 ->assertJson(['message' => 'Product successfully deleted']);

        $this->assertDatabaseMissing('productos', ['id' => $producto->id]);
    }

    /** @test */
    public function no_puede_eliminar_un_producto_inexistente()
    {
        $response = $this->deleteJson('/api/products/9999');

        $response->assertStatus(404)
                 ->assertJson(['message' => 'Product not found']);
    }
}
