<?php

namespace Database\Factories;

use App\Models\Pedido;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Pedido>
 */
class PedidoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Pedido::class;

    public function definition()
    {
        return [
            'estado' => 'pendiente',
            'cantidad_productos' => 0,
            'fecha_pedido' => now(),
            'departamento' => $this->faker->state(),
            'provincia' => $this->faker->city(),
            'direccion_entrega' => $this->faker->address(),
            'usuario_id' => User::factory(),
        ];
    }
}
