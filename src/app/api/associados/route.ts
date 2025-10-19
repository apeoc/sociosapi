import { NextRequest, NextResponse } from 'next/server';
import { associados } from '@/data/associados';

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      data: associados,
      total: associados.length
    });
  } catch (error) {
    console.error('Erro ao buscar associados:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar associados' },
      { status: 500 }
    );
  }
}