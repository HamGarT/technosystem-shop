"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Package } from "lucide-react"
import axios from "axios";
import { toast } from "react-hot-toast"
import { Textarea } from "@/components/ui/textarea"

interface Category {
  id: number
  nombre: string
  descripcion: string
  products_count: number
  slug: string
}

export function Categories() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [categories, setCategories] = useState<Category[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [newDescription, setNewDescription] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  useEffect(() => {
    axios.get(`${apiUrl}/api/categorias/detailed`)
      .then((response) => {
        console.log(response.data)
        setCategories(response.data.data)
      })
  }, []);

  const validateForm = (name: string, description: string) => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "El nombre es requerido"
    if (!description.trim()) newErrors.description = "La descripción es requerida"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAdd = async () => {
    if (validateForm(newCategory, newDescription)) {

      const categoria = {
        id: Math.max(...categories.map((c) => c.id), 0) + 1,
        nombre: newCategory,
        descripcion: newDescription,
        slug: generateSlug(newCategory),
        products_count: 0,
      }
      try {
        await axios.post(`${apiUrl}/api/categorias`, categoria);
        toast.success('¡Categoría registrada!');
        setCategories([
          ...categories,
          categoria
        ])
        setNewCategory("")
        setNewDescription("")
        setErrors({})
      } catch (error) {
        toast.error('Error al registrar la categoría');
        console.error(error);
      }
    }
  }

  const handleEdit = (id: number) => {
    const category = categories.find((c) => c.id === id)
    if (category) {
      setEditingId(id)
      setEditName(category.nombre)
      setEditDescription(category.descripcion)
    }
  }

  const handleSaveEdit = () => {
    if (validateForm(editName, editDescription)) {
      setCategories(
        categories.map((c) =>
          c.id === editingId ? { ...c, name: editName, description: editDescription, slug: generateSlug(editName) } : c,
        ),
      )
      setEditingId(null)
      setEditName("")
      setEditDescription("")
      setErrors({})
    }
  }

  const handleDelete = (id: number) => {
    setCategories(categories.filter((c) => c.id !== id))
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Categorías</h1>
          <p className="text-muted-foreground">Gestiona las categorías de productos</p>
        </div>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{editingId ? "Editar Categoría" : "Nueva Categoría"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input
                  value={editingId ? editName : newCategory}
                  onChange={(e) => (editingId ? setEditName(e.target.value) : setNewCategory(e.target.value))}
                  placeholder="Nombre de la categoría"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-sm font-medium">Slug</label>
                <Input
                  disabled
                  value={generateSlug(editingId ? editName : newCategory)}
                  placeholder="Se genera automáticamente"
                  className="bg-muted"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={editingId ? editDescription : newDescription}
                onChange={(e) => (editingId ? setEditDescription(e.target.value) : setNewDescription(e.target.value))}
                placeholder="Descripción de la categoría"
                className={`w-full px-3 py-2 border rounded-md bg-background text-foreground ${errors.description ? "border-red-500" : "border-input"}`}
                rows={3}
              />
              {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
            </div>
            <div className="flex justify-end gap-2">
              {editingId && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditingId(null)
                    setEditName("")
                    setEditDescription("")
                    setErrors({})
                  }}
                >
                  Cancelar
                </Button>
              )}
              <Button onClick={editingId ? handleSaveEdit : handleAdd} className="gap-2">
                <Plus className="w-4 h-4" />
                {editingId ? "Actualizar" : "Agregar"} Categoría
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    {category.nombre}
                  </CardTitle>
                  <CardDescription className="mt-2">{category.descripcion}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(category.id)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Productos:</span>
                  <span className="font-semibold text-lg">{category.products_count}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Slug:</span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{generateSlug(category.nombre)}</code>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
