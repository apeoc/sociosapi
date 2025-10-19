import { NextRequest, NextResponse } from 'next/server';
import { processos, getProcessosPorAutor, getProcessosPorTipoAcao, getTiposAcoes, getAutores, getProcessosPorPesquisa } from '@/data/processos';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const autor = searchParams.get('autor');
    const tipoAcao = searchParams.get('tipoAcao');
    const pesquisa = searchParams.get('pesquisa');

    let filteredProcessos = processos;

    if (autor) {
      filteredProcessos = getProcessosPorAutor(autor);
    } else if (tipoAcao) {
      filteredProcessos = getProcessosPorTipoAcao(tipoAcao);
    } else if (pesquisa) {
      filteredProcessos = getProcessosPorPesquisa(pesquisa);
    }

    return NextResponse.json({
      processos: filteredProcessos,
      tiposAcoes: getTiposAcoes(),
      autores: getAutores(),
      total: filteredProcessos.length
    });
  } catch (error) {
    console.error('Erro ao buscar processos:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar processos' },
      { status: 500 }
    );
  }
}