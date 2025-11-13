
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Route, Routes } from "react-router-dom"
import { Dashboard } from "./dashboard"
import { Categories } from "./categories"
import { Products } from "./products"
import { Orders } from "./orders"


export default function RootLayout() {
    return (

        <div className="min-h-screen">
            <SidebarProvider style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }>
                <AppSidebar variant="inset"/>
                <SidebarInset>
                    <Routes>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/categories" element={<Categories />} />
                        <Route path="/orders" element={<Orders />} />
                        <Route path="/products" element={<Products />} />
                    </Routes>
                </SidebarInset>
            </SidebarProvider>
        </div>

    )
}