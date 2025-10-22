"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, FolderOpen, ShoppingCart, Users, DollarSign, AlertCircle } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

export function Dashboard() {
  const stats = [
    {
      title: "Total Productos",
      value: "1,234",
      description: "Productos activos",
      icon: Package,
      color: "bg-blue-500/10 text-blue-600",
      trend: "+12%",
    },
    {
      title: "Categorías",
      value: "24",
      description: "Categorías disponibles",
      icon: FolderOpen,
      color: "bg-purple-500/10 text-purple-600",
      trend: "+3%",
    },
    {
      title: "Pedidos Pendientes",
      value: "42",
      description: "Esperando procesamiento",
      icon: ShoppingCart,
      color: "bg-orange-500/10 text-orange-600",
      trend: "-5%",
    },
    {
      title: "Ingresos Hoy",
      value: "$2,450",
      description: "Incremento del 12%",
      icon: DollarSign,
      color: "bg-green-500/10 text-green-600",
      trend: "+18%",
    },
    {
      title: "Clientes Activos",
      value: "856",
      description: "Usuarios registrados",
      icon: Users,
      color: "bg-indigo-500/10 text-indigo-600",
      trend: "+8%",
    },
    {
      title: "Stock Bajo",
      value: "12",
      description: "Productos con stock bajo",
      icon: AlertCircle,
      color: "bg-red-500/10 text-red-600",
      trend: "-2%",
    },
  ]

  const salesData = [
    { date: "Lun", ventas: 2400, pedidos: 24 },
    { date: "Mar", ventas: 1398, pedidos: 22 },
    { date: "Mié", ventas: 9800, pedidos: 29 },
    { date: "Jue", ventas: 3908, pedidos: 20 },
    { date: "Vie", ventas: 4800, pedidos: 35 },
    { date: "Sab", ventas: 3800, pedidos: 28 },
    { date: "Dom", ventas: 4300, pedidos: 31 },
  ]

  const categoryData = [
    { name: "Electrónica", productos: 45, ventas: 12500 },
    { name: "Accesorios", productos: 120, ventas: 8900 },
    { name: "Software", productos: 30, ventas: 6200 },
    { name: "Periféricos", productos: 85, ventas: 7800 },
    { name: "Cables", productos: 60, ventas: 3400 },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "order",
      description: "Nuevo pedido #001 de Juan García",
      time: "Hace 5 minutos",
      status: "Completado",
    },
    {
      id: 2,
      type: "product",
      description: "Producto 'Laptop Pro' actualizado",
      time: "Hace 15 minutos",
      status: "Actualizado",
    },
    {
      id: 3,
      type: "order",
      description: "Nuevo pedido #002 de María López",
      time: "Hace 25 minutos",
      status: "Procesando",
    },
    {
      id: 4,
      type: "category",
      description: "Nueva categoría 'Monitores' creada",
      time: "Hace 1 hora",
      status: "Creado",
    },
    { id: 5, type: "order", description: "Pedido #003 cancelado", time: "Hace 2 horas", status: "Cancelado" },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel de administración</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className="text-xs text-green-600 font-semibold mt-2">{stat.trend}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Sales Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas Semanales</CardTitle>
            <CardDescription>Ingresos y número de pedidos por día</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="ventas" stroke="#3b82f6" name="Ventas ($)" />
                <Line type="monotone" dataKey="pedidos" stroke="#10b981" name="Pedidos" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Desempeño por Categoría</CardTitle>
            <CardDescription>Ventas totales por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="ventas" fill="#8b5cf6" name="Ventas ($)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
          <CardDescription>Últimas acciones en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded font-medium ${
                    activity.status === "Completado"
                      ? "bg-green-500/10 text-green-600"
                      : activity.status === "Procesando"
                        ? "bg-blue-500/10 text-blue-600"
                        : activity.status === "Cancelado"
                          ? "bg-red-500/10 text-red-600"
                          : "bg-purple-500/10 text-purple-600"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
