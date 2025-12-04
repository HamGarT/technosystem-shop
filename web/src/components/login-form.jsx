"use client"

import { useState } from "react"
import { Mail, Lock, CheckCircle2, ArrowRight, User, Eye, EyeOff, X } from "lucide-react"
import { OtpInput } from "./otp-input"
import axios from "axios"
import { useAuth } from "../contexts/AuthContext"

export function LoginForm({ isOpen, onClose }) {
    const {
        user,
        loading,
        error,
        isAuthenticated,
        loginWithEmail,
        emailExists,
        register,
        login,
        logout,
        clearError,
        verifyOtp
    } = useAuth();
    const [step, setStep] = useState("email")
    const [email, setEmail] = useState("")
    const [otp, setOtp] = useState("")
    const [password, setPassword] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [registerPassword, setRegisterPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState("")
    const [userExists, setUserExists] = useState(false)
    const [success, setSuccess] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showRegisterPassword, setShowRegisterPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

   

  

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            const exists = await loginWithEmail(email);
            // Si existe → password (login)
            // Si no existe → otp (registro)
            setStep(exists ? "password" : "otp");
        } catch (err) {
            // El error ya está en el contexto
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await verifyOtp(email, otp);
            setStep("register");
        } catch (err) {
            // El error ya está en el contexto
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await login(email, password);
            // Aquí redirigir al dashboard
            console.log("Login exitoso");
            setSuccess(true)
        } catch (err) {
            console.log(err)
            // El error ya está en el contexto
        }
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        clearError();
        try {
            await register(firstName, lastName, email, registerPassword, confirmPassword, otp);
            console.log("Registro exitoso");
            setSuccess(true);
        } catch (err) {
            console. log(err)
        }
    };

    const handleLogout = async () => {
        await logout();
    };


    const handleReset = () => {
        setStep("email")
        setEmail("")
        setOtp("")
        setPassword("")
        setFirstName("")
        setLastName("")
        setRegisterPassword("")
        setConfirmPassword("")
        // // // setError("")
        setUserExists(false)
        setSuccess(false)
    }

    const closeModal = () => {
        onClose()
        handleReset()
    }


    const formContent = (
        <>
            {success ?  (
                <div className="w-full max-w-md">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-12 border border-white/20 text-center">
                        <div className="mb-6">
                            <div className="flex justify-center mb-4">
                                <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center animate-pulse">
                                    <CheckCircle2 className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {emailExists ? "Bienvenido de vuelta" : "Cuenta creada"}
                            </h2>
                            <p className="text-slate-600 mb-1">
                                {emailExists ? "Has iniciado sesión correctamente" : "Tu cuenta ha sido creada exitosamente"}
                            </p>
                            {! emailExists && (
                                <p className="text-sm text-slate-500">
                                    Hola {firstName} {lastName}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={handleReset}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                        >
                            Volver a login
                        </button>
                    </div>
                </div>
            ) : (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 text-black">
                    <div className="mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 mb-2 text-balance">
                                {step === "email" && "Acceso a tu cuenta"}
                                {step === "otp" && "Verifica tu identidad"}
                                {step === "password" && "Contraseña"}
                                {step === "register" && "Completa tu perfil"}
                            </h1>
                            <p className="text-slate-600 text-sm">
                                {step === "email" && "Ingresa tu email para continuar"}
                                {step === "otp" && `Se ha enviado un código a ${email}`}
                                {step === "password" && "Ingresa tu contraseña"}
                                {step === "register" && "Crea tu cuenta con tus datos"}
                            </p>

                            <div className="mt-4 flex gap-2 ">
                                <div
                                    className={`h-1 flex-1 rounded-full transition-all ${step !== "email" ? "bg-blue-600" : "bg-blue-200"}`}
                                />
                                <div
                                    className={`h-1 flex-1 rounded-full transition-all ${["otp", "password", "register"].includes(step) ? "bg-blue-600" : "bg-slate-200"}`}
                                />
                                <div
                                    className={`h-1 flex-1 rounded-full transition-all ${step === "register" ? "bg-blue-600" : "bg-slate-200"}`}
                                />
                                <div
                                    className={`h-1 flex-1 rounded-full transition-all ${step === "register" ? "bg-blue-600" : "bg-slate-200"}`}
                                />
                            </div>
                        </div>
                        {/* <button
                            onClick={closeModal}
                            className="text-slate-400 hover:text-slate-600 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button> */}
                    </div>

                    {step === "email" && (
                        <form onSubmit={handleEmailSubmit} className="space-y-5 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="usuario@ejemplo.com"
                                        value={email}
                                        onChange={(e) => {
                                            setEmail(e.target.value)
                                            // // // // setError("")
                                        }}
                                        required
                                        autoComplete="email"
                                        className="w-full pl-12 pr-4 h-12 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in shake">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !email}
                                className="w-full h-12 bg-blue-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Continuar
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}

                    {step === "otp" && (
                        <form onSubmit={handleOtpSubmit} className="space-y-5 animate-in fade-in duration-300">
                            <div className="space-y-3">
                                <label className="block text-sm font-semibold text-slate-700">Código de verificación</label>
                                <p className="text-xs text-slate-500">Ingresa los 6 dígitos que recibiste</p>
                                <OtpInput value={otp} onChange={setOtp} />
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in shake">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || otp.length < 6}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Verificando...
                                    </>
                                ) : (
                                    <>
                                        Verificar
                                        <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full h-11 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-all"
                            >
                                Usar otro email
                            </button>
                        </form>
                    )}

                    {step === "password" && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-5 animate-in fade-in duration-300">
                            <div className="space-y-2">
                                <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value)
                                            // // setError("")
                                        }}
                                        autoComplete="current-password"
                                        className="w-full pl-12 pr-12 h-12 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in shake">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                            >
                                {loading ?  (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Iniciando sesión... 
                                    </>
                                ) : (
                                    <>
                                        Iniciar sesión
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full h-11 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-all"
                            >
                                Usar otro email
                            </button>
                        </form>
                    )}

                    {step === "register" && (
                        <form onSubmit={handleRegisterSubmit} className="space-y-4 animate-in fade-in duration-300">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label htmlFor="firstName" className="block text-sm font-semibold text-slate-700">
                                        Nombre
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            id="firstName"
                                            type="text"
                                            placeholder="Juan"
                                            value={firstName}
                                            onChange={(e) => {
                                                setFirstName(e. target.value)
                                                // // setError("")
                                            }}
                                            required
                                            className="w-full pl-12 pr-4 h-12 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="lastName" className="block text-sm font-semibold text-slate-700">
                                        Apellido
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                        <input
                                            id="lastName"
                                            type="text"
                                            placeholder="Pérez"
                                            value={lastName}
                                            onChange={(e) => {
                                                setLastName(e. target.value)
                                                // // setError("")
                                            }}
                                            required
                                            className="w-full pl-12 pr-4 h-12 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="registerPassword" className="block text-sm font-semibold text-slate-700">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                        id="registerPassword"
                                        type={showRegisterPassword ? "text" : "password"}
                                        placeholder="Mínimo 8 caracteres"
                                        value={registerPassword}
                                        onChange={(e) => {
                                            setRegisterPassword(e.target. value)
                                            // // setError("")
                                        }}
                                        required
                                        className="w-full pl-12 pr-12 h-12 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showRegisterPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500">
                                    {registerPassword.length === 0
                                        ? "Mínimo 8 caracteres"
                                        : registerPassword.length < 8
                                            ? `${8 - registerPassword.length} caracteres faltantes`
                                            : "Contraseña fuerte"}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Repite tu contraseña"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value)
                                            // // setError("")
                                        }}
                                        required
                                        className="w-full pl-12 pr-12 h-12 bg-slate-50 border-2 border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(! showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        {showConfirmPassword ?  <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {confirmPassword && registerPassword !== confirmPassword && (
                                    <p className="text-xs text-amber-600">Las contraseñas no coinciden</p>
                                )}
                                {confirmPassword && registerPassword === confirmPassword && (
                                    <p className="text-xs text-green-600">Las contraseñas coinciden</p>
                                )}
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-3 animate-in shake">
                                    <p className="text-sm text-red-700 font-medium">{error}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={
                                    loading ||
                                    ! firstName ||
                                    !lastName ||
                                    registerPassword.length < 8 ||
                                    registerPassword !== confirmPassword
                                }
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creando cuenta...
                                    </>
                                ) : (
                                    <>
                                        Crear cuenta
                                        <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full h-11 text-slate-600 font-medium hover:bg-slate-100 rounded-lg transition-all"
                            >
                                Usar otro email
                            </button>
                        </form>
                    )}

                    <p className="text-xs text-slate-500 text-center mt-8 leading-relaxed">
                        Al continuar, aceptas nuestros{" "}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                            Términos de Servicio
                        </a>{" "}
                        y{" "}
                        <a href="#" className="text-blue-600 hover:underline font-medium">
                            Política de Privacidad
                        </a>
                    </p>
                </div>
            )}
        </>
    )

    if (! isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm transition-all duration-300"
            onClick={(e) => {
                if (e.target === e. currentTarget) {
                    closeModal()
                }
            }}
        >
            <div className="w-full max-w-md scale-100 transition-transform duration-300">
                {formContent}
            </div>
        </div>
    )
}