export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-blue-600">Partograma LCG</h1>
        <p className="mb-2 text-xl text-gray-600">WHO Labour Care Guide (OMS 2020)</p>
        <p className="text-gray-400">Ambiente de desenvolvimento configurado com sucesso.</p>
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h2 className="mb-3 text-lg font-semibold">Stack:</h2>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Frontend: Next.js 15 + React 19 + TypeScript</li>
            <li>Backend: NestJS + TypeScript</li>
            <li>Banco: PostgreSQL 16</li>
            <li>Cache/Filas: Redis + Bull</li>
            <li>Auth: Keycloak (OIDC)</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
