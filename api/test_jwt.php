<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== JWT KEY TEST ===\n";

// Test 1: Check config
$privateKeyPath = config('jwt.keys.private');
$publicKeyPath = config('jwt.keys.public');

echo "Private Key Path: " . $privateKeyPath . "\n";
echo "Public Key Path: " . $publicKeyPath . "\n";
echo "Private Key Exists: " . (file_exists($privateKeyPath) ? 'YES' : 'NO') . "\n";
echo "Public Key Exists: " . (file_exists($publicKeyPath) ? 'YES' : 'NO') . "\n";

// Test 2: Read key content
$privateKey = file_get_contents($privateKeyPath);
echo "\nPrivate Key Size: " . strlen($privateKey) . " bytes\n";
echo "Private Key First 50 chars: " . substr($privateKey, 0, 50) . "\n";

// Test 3: Try to load with OpenSSL
$keyResource = openssl_pkey_get_private($privateKey);
echo "OpenSSL Load: " . ($keyResource ? 'SUCCESS' : 'FAILED') . "\n";

if (!$keyResource) {
    echo "OpenSSL Error: " . openssl_error_string() . "\n";
}

// Test 4: Try to create a token
try {
    $user = \App\Models\User::first();
    if ($user) {
        echo "\nAttempting to create token for user: " . $user->email . "\n";
        $token = \Tymon\JWTAuth\Facades\JWTAuth::fromUser($user);
        echo "Token Created: SUCCESS\n";
        echo "Token: " . substr($token, 0, 50) . "...\n";
    } else {
        echo "No user found\n";
    }
} catch (\Exception $e) {
    echo "Token Creation Failed: " . $e->getMessage() . "\n";
    echo "Error Class: " . get_class($e) . "\n";
}

?>
