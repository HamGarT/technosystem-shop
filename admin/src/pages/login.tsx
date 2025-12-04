import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Mail, Lock, ArrowRight } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "react-router-dom"

export default function Login() {
    const {login, clearError, error, loading} = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const [isLoading, setIsLoading] = useState(false)
    // const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        clearError();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background to-slate-50 dark:from-background dark:to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Contenedor principal */}
                <Card className="border-0 shadow-lg">
                    <div className="p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mb-4">
                                <div className="text-white font-bold text-xl">A</div>
                            </div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">TECHNOSYSTEM</h1>
                            <p className="text-muted-foreground text-sm">Accede a tu panel de control</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-2">
                                <label htmlFor="email" className="sr-only">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="pl-10 bg-slate-50 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-2">
                                <label htmlFor="password" className="sr-only">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="pl-10 bg-slate-50 dark:bg-slate-800 border-0 focus-visible:ring-2 focus-visible:ring-blue-600"
                                    />
                                </div>
                            </div>

                            {/* Error message */}
                            {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950 p-3 rounded-md">{error}</div>}

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 font-medium gap-2"
                            >
                                {loading ? (
                                    "Iniciando sesión..."
                                ) : (
                                    <>
                                        Iniciar sesión
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Forgot password link */}
                        <div className="mt-4 text-center">
                            <a
                                href="#"
                                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                        </div>
                    </div>
                </Card>

                {/* Footer */}
                <div className="mt-6 text-center text-xs text-muted-foreground">
                    <p>© 2025 Admin Panel. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    )
}
