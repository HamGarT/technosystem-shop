"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { SimpleCategory } from "@/types"
import axios from "axios"

interface ProductFormProps {
  onSave: (product: any) => void
  onCancel: () => void
  editingId: number | null
  initialData?: any
}

export function ProductForm({ onSave, onCancel, editingId, initialData }: ProductFormProps) {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState<SimpleCategory[]>([]);
  const [formData, setFormData] = useState(
    initialData || {
      nombre: "",
      category_id: "",
      precio: "",
      stock: "",
      descripcion: "",
      marca: "",
      image_url: "",
      status: "0" as const,
    },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    axios.get(`${apiUrl}/api/categorias`)
      .then((response) => {
        setCategories(response.data.data)
        console.log(response)
      })
  }, [])

  useEffect(() => {
    if (initialData && !formData.category_id) {
      const categoryId = categories.find((item) => item.nombre === initialData.categoria)?.id.toString();
      if (categoryId) {
        setFormData({ ...formData, category_id: categoryId });
      }
    }
  }, [initialData, categories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es requerido"
    if (!formData.category_id.trim()) newErrors.category = "La categoría es requerida"
    if (!formData.precio || Number.parseFloat(formData.precio) <= 0) newErrors.precio = "El precio debe ser mayor a 0"
    if (!formData.stock || Number.parseInt(formData.stock) < 0) newErrors.stock = "El stock no puede ser negativo"
    if (!formData.marca.trim()) newErrors.sku = "El SKU es requerido"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSave({
        ...formData,
        precio: Number.parseFloat(formData.precio),
        stock: Number.parseInt(formData.stock),
        categoria: categories.find((item) => item.id == formData.category_id)?.nombre
      })
      console.log('category_id:', formData.category_id);  // Verifica qué valor tiene
      console.log('categories:',  categories.find((item) => item.id == formData.category_id)?.nombre);
    }
  }

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{editingId ? "Editar Producto" : "Nuevo Producto"}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nombre</label>
              <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Nombre del producto"
                className={errors.nombre ? "border-red-500" : ""}
              />
              {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Marca</label>
              <Input
                value={formData.marca}
                onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                placeholder="Marca del producto"
                className={errors.marca ? "border-red-500" : ""}
              />
              {errors.marca && <p className="text-xs text-red-500 mt-1">{errors.marca}</p>}
            </div>
            <div>
              <label>Categorías</label>
              <Select
                value={formData.category_id || ""}
                onValueChange={(value) => {
                  setFormData({ ...formData, category_id: value });
                }}

              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.nombre}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Precio</label>
              <Input
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                placeholder="0.00"
                className={errors.precio ? "border-red-500" : ""}
              />
              {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Stock</label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="0"
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && <p className="text-xs text-red-500 mt-1">{errors.stock}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Estado</label>
              <Select
                onValueChange={(value) => setFormData({ ...formData, estado: value })}
                value={formData.estado ? "0" : "1"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>

                  <SelectItem value="1">
                    Activo
                  </SelectItem>
                  <SelectItem value="0">
                    Inactivo
                  </SelectItem>

                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Url del imagen</label>
            <Input
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="Pega aqui la url de una imagen"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
              placeholder="Descripción del producto"
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">{editingId ? "Actualizar" : "Crear"} Producto</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
