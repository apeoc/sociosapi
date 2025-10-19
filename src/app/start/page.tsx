'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function StartPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSystem = async () => {
      try {
        const response = await fetch('/api/init')
        const data = await response.json()

        if (data.initialized) {
          router.push('/login')
        } else {
          router.push('/setup')
        }
      } catch (error) {
        console.error('Erro ao verificar sistema:', error)
        router.push('/setup')
      }
    }

    checkSystem()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">
          Verificando sistema...
        </h2>
      </div>
    </div>
  )
}