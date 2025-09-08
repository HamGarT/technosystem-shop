<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table ->string('nombre');
            $table-> text('descripcion') -> nullable();
            $table-> decimal('precio', 10,2);
            $table -> integer('stock') -> default(0);
            $table -> string('marca');
            $table -> date('fecha_vencimiento') -> nullable();
            $table -> foreignId('category_id')->constrained('categorias')->onDelete('cascade');
            $table -> boolean('estado')->default(true);
            $table -> index('category_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};

//$table -> foreign('categoria_id') -> references('id') -> on('categorias') -> onDelete('cascade');