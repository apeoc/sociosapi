import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { db } from '@/lib/db'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-aqui'

export async function GET(request: NextRequest) {
  try {
    // Buscar token do header Authorization
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { error: 'Token não fornecido' },
        { status: 401 }
      )
    }

    // Verificar token
    const decoded = jwt.verify(token, JWT_SECRET) as any

    // Buscar usuário no banco
    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      }
    })

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Usuário não encontrado ou inativo' },
        { status: 401 }
      )
    }

    return NextResponse.json({ user })

  } catch (error) {
    console.error('Erro ao verificar usuário:', error)
    return NextResponse.json(
      { error: 'Token inválido' },
      { status: 401 }
    )
  }
}