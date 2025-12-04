
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import  Image401 from "@/assets/401.png"
export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <img src={Image401} alt="Acceso no autorizado" width={280} height={200} className="dark:invert" />

        <div className="flex flex-col gap-2">
          <h1 className="text-9xl font-black tracking-tighter text-foreground">401</h1>
          <h2 className="text-xl font-medium text-foreground">Acceso no autorizado</h2>
          <p className="text-muted-foreground text-pretty">No tienes permisos para acceder a esta página.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Button asChild variant="default">
            <Link to="/login">Iniciar sesión</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Volver al inicio</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}