import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-aqui'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validação básica
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Nome de usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar usuário
    const user = await db.user.findUnique({
      where: { username }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      )
    }

    // Verificar se usuário está ativo
    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Usuário desativado' },
        { status: 401 }
      )
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Usuário ou senha incorretos' },
        { status: 401 }
      )
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Retornar resposta sem a senha
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword,
      token
    })

  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}