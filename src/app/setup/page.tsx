'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Scale, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

interface SetupStatus {
  initialized: boolean
  userCount: number
}

export default function SetupPage() {
  const [status, setStatus] = useState<SetupStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitializing, setIsInitializing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const router = useRouter()

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/init')
      const data = await response.json()
      setStatus(data)
      
      if (data.initialized) {
        setSuccess('Sistema já está inicializado. Redirecionando para o login...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      }
    } catch (error) {
      setError('Erro ao verificar status do sistema')
    } finally {
      setIsLoading(false)
    }
  }

  const initializeSystem = async () => {
    setIsInitializing(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess('Sistema inicializado com sucesso!')
        setStatus({
          initialized: true,
          userCount: 1
        })
        
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setError(data.error || 'Erro ao inicializar sistema')
      }
    } catch (error) {
      setError('Erro de conexão com o servidor')
    } finally {
      setIsInitializing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-96">
          <CardContent className="p-6 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Verificando sistema...
            </h2>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Scale className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Sistema APEOC
          </h1>
          <p className="text-gray-600">
            Configuração Inicial
          </p>
        </div>

        {/* Card de Status */}
        <Card className="shadow-lg mb-6">
          <CardHeader>
            <CardTitle className="text-center text-lg">
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            {status && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm font-medium">Sistema Inicializado</span>
                  {status.initialized ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-600" />
                  )}
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm font-medium">Usuários Criados</span>
                  <span className="text-sm font-bold text-blue-600">
                    {status.userCount}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mensagens */}
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-4 border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        {/* Ações */}
        {!status?.initialized && (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Configuração Necessária
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    O sistema precisa ser configurado pela primeira vez. 
                    Isso criará o usuário administrador padrão.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800 mb-2">
                    Usuário Administrador:
                  </p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <p><strong>Usuário:</strong> rocha</p>
                    <p><strong>Senha:</strong> 4884</p>
                  </div>
                  <p className="text-xs text-blue-600 mt-2">
                    Anote estas credenciais para acesso futuro.
                  </p>
                </div>

                <Button
                  onClick={initializeSystem}
                  disabled={isInitializing}
                  className="w-full"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Inicializando...
                    </>
                  ) : (
                    'Inicializar Sistema'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Rodapé */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 - Sistema de Gestão APEOC</p>
        </div>
      </div>
    </div>
  )
}