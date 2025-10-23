"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle, Clock, AlertCircle, X } from "lucide-react"
import axios from "axios"
import { toast } from "react-hot-toast"

interface OrderItem {
  producto: string
  cantidad: number
  total: number
}

interface Order {
  id: string | number
  usuario: string
  email: string
  precio_total: number
  cantidad_productos?: number
  estado: "pendiente" | "procesando" | "completado" | "cancelado"
  fecha_pedido: string
  items: OrderItem[]
  shippingAddress: string
}

export function Orders() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [estadoFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    axios.get(`${apiUrl}/api/pedidos`).then((response) => {
      console.log(response.data.data)
      setOrders([...orders, ...response.data.data])
    })
  }, [])

  const updateOrderStatus = async (orderId: string | number, newStatus: Order["estado"]) => {
    try {
      const response = await axios.put(`${apiUrl}/api/pedidos/${orderId}/status`, {
        estado: newStatus
      });

      if (response.status === 200) {
        setOrders(orders.map((o) => (o.id === orderId ? { ...o, estado: newStatus } : o)))
        setSelectedOrder({
          ...selectedOrder,
          estado: newStatus,
          id: String(selectedOrder!.id)
        } as Order);
        toast.success('Estado actualizado correctamente');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error('Error al actualizar el estado');
      }
    }
  };

  const handleGetOrder = (idOrder: any) => {
    axios.get(`${apiUrl}/api/pedidos/${idOrder}`).then((response) => {
      setSelectedOrder(response.data.data)
    })
  }

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      String(o.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.usuario?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = estadoFilter === "all" || o.estado === estadoFilter
    return matchesSearch && matchesStatus
  })


  const getStatusIcon = (estado: Order["estado"]) => {
    switch (estado) {
      case "completado":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "procesando":
        return <Clock className="w-4 h-4 text-blue-600" />
      case "pendiente":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />
    }
  }

  const getStatusLabel = (estado: Order["estado"]) => {
    const labels = {
      completado: "Completado",
      procesando: "Procesando",
      pendiente: "Pendiente",
      cancelado: "Cancelado",
    }
    return labels[estado]
  }

  const getStatusColor = (estado: Order["estado"]) => {
    switch (estado) {
      case "completado":
        return "bg-green-500/10 text-green-600"
      case "procesando":
        return "bg-blue-500/10 text-blue-600"
      case "pendiente":
        return "bg-yellow-500/10 text-yellow-600"
      default:
        return "bg-red-500/10 text-red-600"
    }
  }

  const upfecha_pedidoOrderStatus = (orderId: string, newStatus: Order["estado"]) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, estado: newStatus } : o)))
    if (selectedOrder?.id === orderId) {
      setSelectedOrder({ ...selectedOrder, estado: newStatus })
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
          value={estadoFilter}
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
                    <td className="py-3 px-4 font-medium">#00{order.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{order.usuario}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">{order.cantidad_productos}</td>
                    <td className="py-3 px-4 font-semibold">S/.{order.precio_total}</td>
                    <td className="py-3 px-4 text-sm text-muted-foreground">{order.fecha_pedido}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.estado)}
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(order.estado)}`}>
                          {getStatusLabel(order.estado)}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm" onClick={() => handleGetOrder(order.id)} >
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
              <CardTitle>Detalles del Pedido #00{selectedOrder.id}</CardTitle>
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
                    <span className="text-muted-foreground">Nombre:</span> {selectedOrder.usuario}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Email:</span> {selectedOrder.email}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Dirección:</span> Avenida Central 456, Barcelona
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
                        <p className="font-medium text-sm">{item.producto}</p>
                        <p className="text-xs text-muted-foreground">Cantidad: {item.cantidad}</p>
                      </div>
                      <p className="font-semibold">S/.{(item.total)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Total:</span>
                  <span className="text-2xl font-bold">${selectedOrder.precio_total.toFixed(2)}</span>
                </div>

                {/* Status Upfecha_pedido */}
                <div>
                  <label className="text-sm font-medium block mb-2">Cambiar Estado</label>
                  <select
                    value={selectedOrder.estado}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value as Order["estado"])}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="procesando">Procesando</option>
                    <option value="completado">Completado</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              <Button onClick={() => setSelectedOrder(null)} className="w-full">
                Aceptar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
