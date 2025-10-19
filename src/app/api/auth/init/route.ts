import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Verificar se já existe algum usuário
    const existingUsers = await db.user.count()
    
    if (existingUsers > 0) {
      return NextResponse.json(
        { error: 'Sistema já foi inicializado' },
        { status: 400 }
      )
    }

    // Criar usuário padrão "rocha" com senha "4884"
    const hashedPassword = await bcrypt.hash('4884', 10)

    const user = await db.user.create({
      data: {
        username: 'rocha',
        password: hashedPassword,
        name: 'Administrador',
        email: 'admin@apeoc.com',
        role: 'admin'
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'Usuário administrador criado com sucesso',
      user,
      credentials: {
        username: 'rocha',
        password: '4884'
      }
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
    const userCount = await db.user.count()
    
    return NextResponse.json({
      initialized: userCount > 0,
      userCount
    })
  } catch (error) {
    console.error('Erro ao verificar inicialização:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}