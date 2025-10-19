import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const processoId = parseInt(params.id);
    const { anotacoes, autor } = await request.json();

    if (!anotacoes || !autor) {
      return NextResponse.json(
        { error: 'Anotação e autor são obrigatórios' },
        { status: 400 }
      );
    }

    // Atualizar o processo com a nova anotação
    const processo = await db.processo.update({
      where: { id: processoId },
      data: { 
        anotacoes: anotacoes,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(processo, { status: 200 });
  } catch (error) {
    console.error('Erro ao adicionar anotação:', error);
    return NextResponse.json(
      { error: 'Erro ao adicionar anotação' },
      { status: 500 }
    );
  }
}