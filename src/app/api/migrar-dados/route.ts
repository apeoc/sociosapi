import { NextRequest, NextResponse } from 'next/server';
import { migrarDados } from '@/lib/migracao';

export async function POST(request: NextRequest) {
  try {
    await migrarDados();
    return NextResponse.json({ 
      success: true, 
      message: 'Dados migrados com sucesso!' 
    });
  } catch (error) {
    console.error('Erro na migração:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Erro na migração dos dados' 
    }, { status: 500 });
  }
}