// Test page to check environment variables
export default function TestEnv() {
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Variables Test</h1>
      <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'NOT SET'}</p>
      <p><strong>Project ID:</strong> {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'NOT SET'}</p>
      <p><strong>Auth Domain:</strong> {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'NOT SET'}</p>
      <p><strong>Together API Key:</strong> {process.env.TOGETHER_API_KEY ? 'SET' : 'NOT SET'}</p>
    </div>
  );
} 