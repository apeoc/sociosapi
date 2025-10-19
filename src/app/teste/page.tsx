'use client'

import { useState } from 'react'

export default function TestePage() {
  const [result, setResult] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const testLogin = async () => {
    setIsLoading(true)
    setResult('Testando...')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          username: 'rocha', 
          password: '4884' 
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setResult(`
          ✅ Login Sucesso!
          Usuário: ${data.user.name}
          Token: ${data.token.substring(0, 50)}...
        `)
      } else {
        setResult(`
          ❌ Erro no Login
          Status: ${response.status}
          Erro: ${data.error}
        `)
      }
    } catch (error) {
      setResult(`❌ Erro: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Teste de Login</h1>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="mb-4 text-gray-600">
            Testando login automático com:<br/>
            Usuário: <strong>rocha</strong><br/>
            Senha: <strong>4884</strong>
          </p>
          
          <button
            onClick={testLogin}
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Testando...' : 'Testar Login'}
          </button>
          
          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="whitespace-pre-wrap text-sm">{result}</pre>
            </div>
          )}
        </div>
        
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Instruções</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Clique no botão "Testar Login" para verificar se a API está funcionando</li>
            <li>Se funcionar, acesse <a href="/login" className="text-blue-600 hover:underline">/login</a></li>
            <li>Use as credenciais: usuário <strong>rocha</strong> e senha <strong>4884</strong></li>
            <li>Se ainda não funcionar, limpe o cache do navegador (Ctrl+F5)</li>
          </ol>
        </div>
      </div>
    </div>
  )
}