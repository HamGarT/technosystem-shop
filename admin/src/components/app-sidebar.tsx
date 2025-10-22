"use client"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar"
import { Package, Tags, ShoppingCart, Settings } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { useState } from "react"
import { NavUser } from "./nav-user"
import { ThemeToggle } from "./theme-toggle"
import { Store } from "lucide-react"


const mainItems = [
  {
    title: "Productos",
    url: "/products",
    icon: Package,
  },
  {
    title: "Categorías",
    url: "/categories",
    icon: Tags,
  },
  {
    title: "Pedidos",
    url: "/orders",
    icon: ShoppingCart,
  },
]

const settingsItems = [
  {
    title: "Configuración",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar({...props}) {
  const userData = {
    name: "Pedro",
    email: "pedro@gmail.com",
    avatar: ""
  }


  return (
    <Sidebar {...props}>
       <div className="flex items-center justify-between px-2 py-1">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Store className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">TECHNOSYSTEM</span>
              <span className="text-xs text-sidebar-foreground/70">Admin Panel</span>
            </div>
          </div>
          <ThemeToggle />
        </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menú Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Otros</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>

        <NavUser user={userData}/>
        {/* <div className="flex items-center gap-3 rounded-lg border p-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>AC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin</p>
            <p className="text-xs text-muted-foreground truncate">admin@acme.com</p>
          </div>
        </div> */}
      </SidebarFooter>
    </Sidebar>
  )
}
