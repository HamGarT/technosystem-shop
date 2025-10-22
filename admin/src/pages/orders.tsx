"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle, Clock, AlertCircle, X } from "lucide-react"

interface OrderItem {
  productName: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: "pending" | "processing" | "completed" | "cancelled"
  date: string
  items: OrderItem[]
  shippingAddress: string
}

export function Orders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "#001",
      customer: "Juan García",
      email: "juan@example.com",
      total: 299.99,
      status: "completed",
      date: "2025-01-20",
      items: [{ productName: "Laptop Pro", quantity: 1, price: 299.99 }],
      shippingAddress: "Calle Principal 123, Madrid",
    },
    {
      id: "#002",
      customer: "María López",
      email: "maria@example.com",
      total: 149.5,
      status: "processing",
      date: "2025-01-20",
      items: [
        { productName: "Mouse Inalámbrico", quantity: 2, price: 29 },
        { productName: "Teclado Mecánico", quantity: 1, price: 89.5 },
      ],
      shippingAddress: "Avenida Central 456, Barcelona",
    },
    {
      id: "#003",
      customer: "Carlos Rodríguez",
      email: "carlos@example.com",
      total: 599.99,
      status: "pending",
      date: "2025-01-19",
      items: [{ productName: "Monitor 4K", quantity: 1, price: 599.99 }],
      shippingAddress: "Plaza Mayor 789, Valencia",
    },
    {
      id: "#004",
      customer: "Ana Martínez",
      email: "ana@example.com",
      total: 89.99,
      status: "completed",
      date: "2025-01-19",
      items: [{ productName: "Webcam HD", quantity: 1, price: 89.99 }],
      shippingAddress: "Calle Secundaria 321, Sevilla",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "processing":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pending":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusLabel = (status: Order["status"]) => {
    const labels = {
      completed: "Completado",
      processing: "Procesando",
      pending: "Pendiente",
      cancelled: "Cancelado",
    }
    return labels[status]
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600"
      case "processing":
        return "bg-blue-500/10 text-blue-600"
      case "pending":
        return "bg-yellow-500/10 text-yellow-600"
      default:
        return "bg-red-500/10 text-red-600"
    }
  }

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Pedidos</h1>
        <p className="text-muted-foreground">Gestiona todos los pedidos de tu tienda</p>
      </div>

      {/* Search and Filter */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, cliente o email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
        >
          <option value="all">Todos los estados</option>
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="completed">Completado</option>
          <option value="cancelled">Cancelado</option>
        </select>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Pedidos</CardTitle>
          <CardDescription>{filteredOrders.length} pedidos encontrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID Pedido</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Cliente</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Artículos</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Total</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Fecha</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-muted/50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.items.length}</td>
                    <td className="py-3 px-4 font-semibold">${order.total.toFixed(2)}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{order.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(order)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Detalles del Pedido {selectedOrder.id}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setSelectedOrder(null)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold mb-2">Información del Cliente</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Nombre:</span> {selectedOrder.customer}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span> {selectedOrder.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Dirección:</span> {selectedOrder.shippingAddress}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Artículos</h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 bg-muted rounded">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.quantity}</p>
                      </div>
                      <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>

                {/* Status Update */}
                <div>
                  <label className="text-sm font-medium block mb-2">Cambiar Estado</label>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order["status"])}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="completed">Completado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </div>
              </div>

              <Button onClick={() => setSelectedOrder(null)} className="w-full">
                Cerrar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
