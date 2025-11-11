<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use App\Mail\SendOTP;
use App\Models\EmailVerification;
class AuthController extends Controller
{

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        try {

            $verification = EmailVerification::where('email', $request->email)
                ->where('verified', true)
                ->latest()
                ->first();

            if (!$verification) {
                return response()->json([
                    'success' => false,
                    'message' => 'Debes verificar tu email antes de registrarte'
                ], 403);
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'user',
                'email_verified_at' => now(),
            ]);

            EmailVerification::where('email', $request->email)->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ],
                
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'El registro falló',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email|max:255'
        ]);

        $email = $request->email;
        if (User::where('email', $email)->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Este correo ya ha sido registrado',
                'email_exists' => true
            ], 409);
        }

        try {
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            EmailVerification::where('email', $email)->delete();
            EmailVerification::create([
                'email' => $email,
                'code' => $otp,
                'expires_at' => now()->addMinutes(10),
            ]);
            Mail::to($email)->send(new SendOTP($otp, 'Usuario'));

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


    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $credentials = $request->only('email', 'password');

        try {
            // Use JWTAuth::attempt() instead of auth('api')->attempt()
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password'
                ], 401);
            }

            return $this->respondWithToken($token);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not create token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the authenticated user
     */
    public function me(Request $request)
    {
        try {
            // Use JWTAuth::parseToken()->authenticate() instead of auth('api')->user()
            $user = JWTAuth::parseToken()->authenticate();

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'user' => $user
            ], 200);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired',
                'error' => $e->getMessage()
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token is invalid',
                'error' => $e->getMessage()
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token not provided',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    /**
     * Log the user out
     * FIX: Use JWTAuth::invalidate() instead of auth('api')->logout()
     */
    public function logout(Request $request)
    {
        try {
            // Use JWTAuth::invalidate() instead of auth('api')->logout()
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Successfully logged out'
            ], 200);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to logout',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refresh the JWT token
     * FIX: Use JWTAuth::refresh() instead of auth('api')->refresh()
     */
    public function refresh(Request $request)
    {
        try {
            // Use JWTAuth::refresh() instead of auth('api')->refresh()
            $token = JWTAuth::refresh(JWTAuth::getToken());
            return $this->respondWithToken($token);
        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token has expired and cannot be refreshed',
                'error' => $e->getMessage()
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Could not refresh token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Return the token response structure
     */
    protected function respondWithToken($token)
    {
        $ttl = (int) config('jwt.ttl', 60);  // ✅ Cast to int
        $user = auth('api')->user();
        return response()->json([
            'success' => true,
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => $ttl * 60,
            'user' => $user
        ], 200);
    }


    // Send OTP
    private function sendOTP($user)
    {
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        EmailVerification::where('user_id', $user->id)->delete();

        EmailVerification::create([
            'user_id' => $user->id,
            'code' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        Mail::to($user->email)->send(new SendOTP($otp, $user->name));
    }

    // Verify OTP
    public function verifyOTP(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'code' => 'required|string|digits:6',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $otp = EmailVerification::where('user_id', $user->id)->latest()->first();

        if (!$otp) {
            return response()->json(['message' => 'Código no encontrado.'], 404);
        }

        if ($otp->isExpired()) {
            return response()->json(['message' => 'Código expirado. Solicita uno nuevo.'], 400);
        }

        if ($otp->attempts >= 5) {
            return response()->json(['message' => 'Demasiados intentos. Solicita un nuevo código.'], 429);
        }

        if ($otp->code !== $validated['code']) {
            $otp->increment('attempts');
            return response()->json([
                'message' => 'Código inválido.',
                'attempts_left' => 5 - $otp->attempts,
            ], 400);
        }

        $otp->update(['verified' => true]);
        $user->update(['email_verified_at' => now()]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => '¡Email verificado exitosamente!',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'auth_token' => $token,
        ], 200);
    }

    // Resend OTP
    public function resendOTP(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::findOrFail($validated['user_id']);

        if ($user->hasVerifiedEmail()) {
            return response()->json(['message' => 'Email ya verificado.'], 400);
        }

        $recent = EmailVerification::where('user_id', $user->id)
            ->where('created_at', '>', now()->subMinute())
            ->first();

        if ($recent) {
            return response()->json(['message' => 'Espera antes de solicitar otro código.'], 429);
        }

        $this->sendOTP($user);

        return response()->json(['message' => '¡Nuevo código enviado!'], 200);
    }
}