<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Categoria;

class CategoriaControllerTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    use RefreshDatabase;

    /** @test */
    public function puede_listar_categorias_simples()
    {
        Categoria::factory()->count(3)->create();

        $response = $this->getJson('/api/categorias');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'nombre'] // según tu CategoriaSimpleResource
                ]
            ]);
    }

    /** @test */
    public function puede_crear_una_categoria()
    {
        $data = [
            'nombre' => 'Tecnología',
            'descripcion' => 'Categoría relacionada con productos tecnológicos'
        ];

        $response = $this->postJson('/api/categorias', $data);

        $response->assertStatus(201)
            ->assertJsonPath('data.nombre', 'Tecnología');

        $this->assertDatabaseHas('categorias', ['nombre' => 'Tecnología']);
    }

    /** @test */
    public function no_puede_eliminar_categoria_con_productos()
    {
        $categoria = Categoria::factory()->hasProducts(2)->create();

        $response = $this->deleteJson("/api/categorias/{$categoria->id}");

        $response->assertStatus(422)
            ->assertJsonFragment([
                "message" => "Error al eliminar categoria"
            ]);
    }

    /** @test */
    public function puede_eliminar_categoria_sin_productos()
    {
        $categoria = Categoria::factory()->create();

        $response = $this->deleteJson("/api/categorias/{$categoria->id}");

        $response->assertStatus(200)
            ->assertJsonFragment([
                "message" => "Categoria eliminada exitosamente"
            ]);

        $this->assertDatabaseMissing('categorias', ['id' => $categoria->id]);
    }
}
