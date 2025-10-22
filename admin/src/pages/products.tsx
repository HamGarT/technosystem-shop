
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Edit2, Trash2, Search } from "lucide-react"
import { ProductForm } from "@/components/product-form"
import axios from "axios"

interface Product {
  id: number
  nombre: string
  marca: string
  categoria: string
  precio: number
  stock: number
  descripcion: string
  estado: "active" | "inactive"
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([

  ])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(()=>{
    axios.get("http://127.0.0.1:8000/api/products")
    .then((respone)=>{
      setProducts(respone.data.data);
      console.log(respone.data.data)
    })
  }, [])



  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || p.marca.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleSave = (product: Omit<Product, "id">) => {
    if (editingId) {
      setProducts(products.map((p) => (p.id === editingId ? { ...product, id: editingId } : p)))
      setEditingId(null)
    } else {
      axios.post("http://127.0.0.1:8000/api/products", product)
        .catch(e => {
          console.log("error al guarda producto", e)
        });
      setProducts([...products, { ...product, id: Math.max(...products.map((p) => p.id), 0) + 1 }])
    }
    setShowForm(false)
  }

  const editingProduct = editingId ? products.find((p) => p.id === editingId) : null

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Productos</h1>
          <p className="text-muted-foreground">Gestiona tu catálogo de productos</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(true)
          }}
          className="gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <ProductForm
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false)
            setEditingId(null)
          }}
          editingId={editingId}
          initialData={editingProduct}
        />
      )}

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o marca..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos</CardTitle>
          <CardDescription>{filteredProducts.length} productos encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Nombre</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Marca</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Categoría</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Precio</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Stock</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">#00{product.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{product.nombre}</p>
                        <p className="text-xs text-muted-foreground">{product.descripcion}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm">{product.marca}</td>
                    <td className="py-3 px-4">{product.categoria}</td>
                    <td className="py-3 px-4 font-semibold">${product.precio}</td>
                    <td className="py-3 px-4">
                      <span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${product.estado === "active" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                          }`}
                      >
                        {product.estado === "active" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(product.id)
                            setShowForm(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}