import { NextRequest, NextResponse } from 'next/server'
import { associados } from '@/data/associados'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'nome'

    let filteredAssociados = associados

    // Aplicar filtro de busca
    if (search) {
      const searchLower = search.toLowerCase()
      filteredAssociados = associados.filter(associado =>
        associado.nome.toLowerCase().includes(searchLower) ||
        associado.matricula.includes(search) ||
        (associado.estado && associado.estado.toLowerCase().includes(searchLower)) ||
        (associado.categoria && associado.categoria.toLowerCase().includes(searchLower)) ||
        (associado.cargo && associado.cargo.toLowerCase().includes(searchLower)) ||
        (associado.aniversario && associado.aniversario.includes(search))
      )
    }

    // Aplicar ordenação
    filteredAssociados.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'matricula':
          return a.matricula.localeCompare(b.matricula)
        case 'valor':
          const valorA = parseFloat(a.valor.replace(',', '.'))
          const valorB = parseFloat(b.valor.replace(',', '.'))
          return valorB - valorA
        case 'estado':
          const estadoA = a.estado || ''
          const estadoB = b.estado || ''
          return estadoA.localeCompare(estadoB)
        case 'cargo':
          const cargoA = a.cargo || ''
          const cargoB = b.cargo || ''
          return cargoA.localeCompare(cargoB)
        case 'aniversario':
          const aniversarioA = a.aniversario || ''
          const aniversarioB = b.aniversario || ''
          return aniversarioA.localeCompare(aniversarioB)
        default:
          return 0
      }
    })

    // Calcular estatísticas
    const estaduais = filteredAssociados.filter(a => a.estado === 'estado' || a.categoria === 'estadual').length
    const municipais = filteredAssociados.filter(a => a.estado === 'município' || a.categoria === 'municipal').length
    const aniversariantesOutubro = filteredAssociados.filter(a => a.aniversario && a.aniversario.includes('10')).length

    // Retornar todos os dados sem paginação
    const response = {
      data: filteredAssociados,
      total: filteredAssociados.length,
      estaduais,
      municipais,
      aniversariantesOutubro,
      filters: {
        search,
        sortBy
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro na API de associados:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}