import { initializeApp, cert, getApps, App } from 'npm:firebase-admin@12.0.0/app';
import { getAuth } from 'npm:firebase-admin@12.0.0/auth';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

let firebaseApp: App | null = null;

function getFirebaseApp(): App {
  if (firebaseApp) {
    return firebaseApp;
  }

  // Inicializar Firebase Admin solo si no está inicializado
  const existingApps = getApps();
  if (existingApps.length > 0) {
    firebaseApp = existingApps[0];
    return firebaseApp;
  }

  // Verificar que las variables de entorno estén configuradas
  const requiredEnvVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_CLIENT_ID',
    'FIREBASE_CERT_URL',
  ];

  const missingVars = requiredEnvVars.filter(varName => !Deno.env.get(varName));
  if (missingVars.length > 0) {
    throw new Error(`Faltan variables de entorno: ${missingVars.join(', ')}`);
  }

  // El private_key puede venir con \\n literales, necesitamos reemplazarlos
  const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')!.replace(/\\n/g, '\n');

  const serviceAccount = {
    type: 'service_account',
    project_id: Deno.env.get('FIREBASE_PROJECT_ID'),
    private_key_id: Deno.env.get('FIREBASE_PRIVATE_KEY_ID'),
    private_key: privateKey,
    client_email: Deno.env.get('FIREBASE_CLIENT_EMAIL'),
    client_id: Deno.env.get('FIREBASE_CLIENT_ID'),
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: Deno.env.get('FIREBASE_CERT_URL'),
  };

  console.log('🔧 Inicializando Firebase Admin con proyecto:', serviceAccount.project_id);

  firebaseApp = initializeApp({
    credential: cert(serviceAccount as any),
  });

  return firebaseApp;
}

export default async function handler(req: Request) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Parsear el body
    const { userId, newPassword } = await req.json();

    console.log('🔑 Solicitud de actualización de contraseña para userId:', userId);

    // Validar parámetros
    if (!userId || !newPassword) {
      return new Response(
        JSON.stringify({ 
          error: 'userId y newPassword son requeridos' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Validar que la contraseña tenga al menos 6 caracteres (requisito de Firebase)
    if (newPassword.length < 6) {
      return new Response(
        JSON.stringify({ 
          error: 'La contraseña debe tener al menos 6 caracteres' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Inicializar Firebase y actualizar contraseña
    console.log('🔧 Inicializando Firebase Admin...');
    const app = getFirebaseApp();
    
    console.log('📝 Actualizando contraseña en Firebase Auth...');
    await getAuth(app).updateUser(userId, {
      password: newPassword,
    });

    console.log('✅ Contraseña actualizada correctamente');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Contraseña actualizada correctamente' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
    );
  } catch (error: any) {
    console.error('❌ Error actualizando contraseña:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error name:', error.name);
    console.error('❌ Error code:', error.code);
    
    // Construir mensaje de error más descriptivo
    let errorMessage = error.message || 'Error desconocido al actualizar la contraseña';
    
    // Errores comunes de Firebase Admin
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'Usuario no encontrado en Firebase Auth';
    } else if (error.code === 'auth/invalid-password') {
      errorMessage = 'La contraseña no cumple con los requisitos de Firebase';
    } else if (error.message?.includes('private_key')) {
      errorMessage = 'Error de configuración: private_key inválido o mal formateado';
    } else if (error.message?.includes('service account')) {
      errorMessage = 'Error de configuración: credenciales de service account inválidas';
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.code || error.name,
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}
