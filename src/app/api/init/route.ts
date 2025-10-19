import { NextRequest, NextResponse } from 'next/server'

export async function POST() {
  try {
    // Chamar a API de inicialização de autenticação
    const authResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!authResponse.ok) {
      const errorData = await authResponse.json()
      return NextResponse.json(
        { error: errorData.error || 'Erro ao inicializar autenticação' },
        { status: authResponse.status }
      )
    }

    const authData = await authResponse.json()

    // Chamar a API de seed de processos
    const processosResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/processos/seed`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    let processosData = { message: 'Seed de processos não executado' }
    if (processosResponse.ok) {
      processosData = await processosResponse.json()
    }

    return NextResponse.json({
      message: 'Sistema inicializado com sucesso',
      auth: authData,
      processos: processosData
    })

  } catch (error) {
    console.error('Erro ao inicializar sistema:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Verificar se o sistema já foi inicializado
    const authResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/init`)
    const authData = await authResponse.json()

    return NextResponse.json({
      initialized: authData.initialized,
      auth: authData
    })

  } catch (error) {
    console.error('Erro ao verificar inicialização:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}