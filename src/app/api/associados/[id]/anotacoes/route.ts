import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const associadoId = parseInt(params.id);
    const { conteudo, autor } = await request.json();

    if (!conteudo || !autor) {
      return NextResponse.json(
        { error: 'Conteúdo e autor são obrigatórios' },
        { status: 400 }
      );
    }

    const anotacao = await db.anotacao.create({
      data: {
        conteudo,
        autor,
        associadoId
      },
      include: {
        associado: true
      }
    });

    return NextResponse.json(anotacao, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar anotação:', error);
    return NextResponse.json(
      { error: 'Erro ao criar anotação' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const associadoId = parseInt(params.id);
    
    const anotacoes = await db.anotacao.findMany({
      where: { associadoId },
      orderBy: { createdAt: 'desc' },
      include: {
        associado: true
      }
    });

    return NextResponse.json(anotacoes);
  } catch (error) {
    console.error('Erro ao buscar anotações:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar anotações' },
      { status: 500 }
    );
  }
}