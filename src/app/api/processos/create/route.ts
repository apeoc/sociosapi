import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      autor,
      processo,
      vara,
      data,
      ultimoMov,
      situacao,
      proximoPasso,
      idaAoForum,
      advogado,
      anotacoes
    } = body

    // Validar campos obrigatórios
    if (!autor || !processo || !situacao) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: autor, processo, situacao' },
        { status: 400 }
      )
    }

    // Criar novo processo no banco de dados
    const novoProcesso = await db.processo.create({
      data: {
        autor,
        processo,
        vara: vara || null,
        data: data || null,
        ultimoMov: ultimoMov || null,
        situacao,
        proximoPasso: proximoPasso || null,
        idaAoForum: idaAoForum || null,
        advogado: advogado || null,
        anotacoes: anotacoes || null
      }
    })

    return NextResponse.json({
      success: true,
      processo: novoProcesso,
      message: 'Processo criado com sucesso'
    })
  } catch (error) {
    console.error('Erro ao criar processo:', error)
    return NextResponse.json(
      { error: 'Erro ao criar processo' },
      { status: 500 }
    )
  }
}