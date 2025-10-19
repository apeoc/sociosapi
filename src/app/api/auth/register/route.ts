import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { username, password, name, email } = await request.json()

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nome de usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar se usuário já existe
    const existingUser = await db.user.findUnique({
      where: { username }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Nome de usuário já existe' },
        { status: 400 }
      )
    }

    // Verificar se email já existe (se fornecido)
    if (email) {
      const existingEmail = await db.user.findUnique({
        where: { email }
      })

      if (existingEmail) {
        return NextResponse.json(
          { error: 'Email já está em uso' },
          { status: 400 }
        )
      }
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10)

    // Criar usuário
    const user = await db.user.create({
      data: {
        username,
        password: hashedPassword,
        name,
        email,
        role: username === 'rocha' ? 'admin' : 'user'
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
      message: 'Usuário criado com sucesso',
      user
    })

  } catch (error) {
    console.error('Erro ao registrar usuário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}