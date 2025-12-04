<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmailVerification;
use App\Mail\SendOTP;
use App\Models\User;
use Resend\Laravel\Facades\Resend;

class EmailVerificationController extends Controller
{
    /**
     * Verifica si un email existe y envía OTP
     */
    public function verifyEmail(Request $request)
    {
        set_time_limit(120);
        $request->validate([
            'email' => 'required|string|email|max:255'
        ]);

        $email = $request->email;
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Este correo ya ha sido registrado',
                'email_exists' => true
            ], 200);
        }

        try {
            // Generar y guardar OTP temporal (sin usuario creado aún)
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            // Limpiar códigos anteriores para este email
            EmailVerification::where('email', $email)->delete();
            // Crear registro temporal de verificación
            EmailVerification::create([
                'email' => $email,
                'code' => $otp,
                'expires_at' => now()->addMinutes(10),
            ]);
            
            // Enviar OTP por email usando Resend
            Resend::emails()->send([
                'from' => config('mail.from.address', 'Acme <onboarding@resend.dev>'),
                'to' => [$email],
                'subject' => 'Código de Verificación OTP',
                'html' => (new SendOTP($otp, 'Usuario'))->render(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Código OTP enviado al correo',
                'email' => $email
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar OTP',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function verifyOTP(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
            'code' => 'required|string|digits:6',
        ]);

        $email = $validated['email'];
        $otp = EmailVerification::where('email', $email)->latest()->first();

        if (!$otp) {
            return response()->json([
                'success' => false,
                'message' => 'Código no encontrado.'
            ], 404);
        }

        if ($otp->isExpired()) {
            return response()->json([
                'success' => false,
                'message' => 'Código expirado. Solicita uno nuevo.'
            ], 400);
        }

        if ($otp->attempts >= 5) {
            return response()->json([
                'success' => false,
                'message' => 'Demasiados intentos. Solicita un nuevo código.'
            ], 429);
        }

        if ($otp->code !== $validated['code']) {
            $otp->increment('attempts');
            return response()->json([
                'success' => false,
                'message' => 'Código inválido.',
                'attempts_left' => 5 - $otp->attempts,
            ], 400);
        }

        // Marcar como verificado
        $otp->update(['verified' => true]);

        return response()->json([
            'success' => true,
            'message' => '¡Email verificado! Puedes proceder con el registro.',
            'email' => $email,
            'verification_token' => $otp->id // Token temporal para validar en registro
        ], 200);
    }

    /**
     * Reenvía OTP
     */
    public function resendOTP(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email|max:255',
        ]);

        $email = $validated['email'];

        // Verificar si el email ya existe
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Este correo ya ha sido registrado.'
            ], 409);
        }

        // Verificar si hace poco se envió un código
        $recent = EmailVerification::where('email', $email)
            ->where('created_at', '>', now()->subMinute())
            ->first();

        if ($recent) {
            return response()->json([
                'success' => false,
                'message' => 'Espera un minuto antes de solicitar otro código.'
            ], 429);
        }

        try {
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

            EmailVerification::where('email', $email)->delete();

            EmailVerification::create([
                'email' => $email,
                'code' => $otp,
                'expires_at' => now()->addMinutes(10),
            ]);

            // Enviar OTP por email usando Resend
            Resend::emails()->send([
                'from' => config('mail.from.address', 'noreply@tudominio. com'),
                'to' => [$email],
                'subject' => 'Código de Verificación OTP',
                'html' => (new SendOTP($otp, 'Usuario'))->render(),
            ]);

            return response()->json([
                'success' => true,
                'message' => '¡Nuevo código enviado!'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar OTP',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}