import { NextRequest, NextResponse } from 'next/server';
import { seedAnotacoes } from '@/lib/seed';

export async function POST(request: NextRequest) {
  try {
    await seedAnotacoes();
    return NextResponse.json({ 
      success: true, 
      message: 'Anotações de exemplo adicionadas com sucesso!' 
    });
  } catch (error) {
    console.error('Erro ao adicionar anotações:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro ao adicionar anotações de exemplo' 
    }, { status: 500 });
  }
}