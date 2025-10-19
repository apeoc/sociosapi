'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Users, Filter, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

interface Associado {
  matricula: string;
  nome: string;
  referencia: string;
  valor: string;
  estado?: string;
  cargo?: string;
  aniversario?: string;
  categoria?: 'municipal' | 'estadual';
}

export default function Home() {
  const [associados, setAssociados] = useState<Associado[]>([])
  const [filteredAssociados, setFilteredAssociados] = useState<Associado[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'nome' | 'matricula' | 'valor' | 'estado' | 'cargo' | 'aniversario'>('nome')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const fetchAssociados = async () => {
      try {
        const response = await fetch('/api/associados')
        if (!response.ok) {
          throw new Error('Erro ao carregar dados')
        }
        const data = await response.json()
        setAssociados(data.data || data)
        setFilteredAssociados(data.data || data)
      } catch (error) {
        console.error('Erro ao buscar associados:', error)
        // Em caso de erro, carrega dados diretos do arquivo
        import('@/data/associados').then(({ associados }) => {
          setAssociados(associados)
          setFilteredAssociados(associados)
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAssociados()
  }, [])

  useEffect(() => {
    let filtered = associados.filter(associado =>
      associado.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      associado.matricula.includes(searchTerm) ||
      (associado.estado && associado.estado.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (associado.categoria && associado.categoria.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (associado.cargo && associado.cargo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (associado.aniversario && associado.aniversario.includes(searchTerm))
    )

    // Ordenação
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'nome':
          return a.nome.localeCompare(b.nome)
        case 'matricula':
          return a.matricula.localeCompare(b.matricula)
        case 'valor':
          return parseFloat(b.valor.replace(',', '.')) - parseFloat(a.valor.replace(',', '.'))
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

    setFilteredAssociados(filtered)
  }, [searchTerm, sortBy, associados])

  const getValorColor = (valor: string) => {
    const numValor = parseFloat(valor.replace(',', '.'))
    if (numValor > 35) return 'text-green-600 bg-green-50 border-green-200'
    if (numValor > 25) return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
  }

  const getTotalAssociados = () => associados.length
  const getEstadoCount = () => associados.filter(a => a.estado === 'estado' || a.categoria === 'estadual').length
  const getMunicipioCount = () => associados.filter(a => a.estado === 'município' || a.categoria === 'municipal').length
  
  const getAniversariantesOutubroCount = () => associados.filter(a => a.aniversario && a.aniversario.includes('-10-')).length
  const getMediaValor = () => {
    if (associados.length === 0) return 0
    const total = associados.reduce((sum, a) => sum + parseFloat(a.valor.replace(',', '.')), 0)
    return (total / associados.length).toFixed(2)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  const getCategoriaBadge = (associado: Associado) => {
    if (associado.estado === 'estado' || associado.categoria === 'estadual') {
      return (
        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
          Estadual
        </Badge>
      )
    }
    if (associado.estado === 'município' || associado.categoria === 'municipal') {
      return (
        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
          Municipal
        </Badge>
      )
    }
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(12)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2 mb-2" />
                  <Skeleton className="h-3 w-1/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Sistema de Membros APEOC
            </h1>
            <p className="text-gray-600">
              Pesquise por nome, matrícula, cargo, ou data de aniversário entre <span className="font-semibold text-blue-600">{associados.length}</span> membros
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalAssociados()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-sm font-bold">🏛️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estaduais</p>
                  <p className="text-2xl font-bold text-green-600">{getEstadoCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 text-sm font-bold">🏘️</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Municipais</p>
                  <p className="text-2xl font-bold text-blue-600">{getMunicipioCount()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Search className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Encontrados</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredAssociados.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <Card className="mb-6">
          <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por nome, matrícula, categoria, cargo ou data (ex: 10-01)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    ×
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={sortBy} onValueChange={(value: 'nome' | 'matricula' | 'valor' | 'estado' | 'cargo' | 'aniversario') => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nome">Nome (A-Z)</SelectItem>
                    <SelectItem value="matricula">Matrícula</SelectItem>
                    <SelectItem value="valor">Valor (maior)</SelectItem>
                    <SelectItem value="estado">Estado</SelectItem>
                    <SelectItem value="cargo">Cargo</SelectItem>
                    <SelectItem value="aniversario">Aniversário</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex items-center border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none border-r"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span>{filteredAssociados.length} associados encontrados</span>
              </div>
              {searchTerm && (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Buscando: "{searchTerm}"</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 text-xs">✓</span>
                </div>
                <span>Lista completa - Todos os associados visíveis</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Associados */}
        {filteredAssociados.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum associado encontrado
              </h3>
              <p className="text-gray-600">
                Tente buscar com outros termos ou limpe a busca para ver todos os associados.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Visualização em Grade */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mb-6">
                {filteredAssociados.map((associado) => (
                  <Card key={associado.matricula} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02] border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-900 text-sm leading-tight flex-1 mr-2">
                          {associado.nome}
                        </h3>
                        <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200 whitespace-nowrap">
                          {associado.matricula}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500">Ref: {associado.referencia}</span>
                        {getCategoriaBadge(associado)}
                      </div>
                      {/* Cargo e Aniversário */}
                      {(associado.cargo || associado.aniversario) && (
                        <div className="flex flex-col gap-1 mb-2">
                          {associado.cargo && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-purple-600 font-medium">💼</span>
                              <span className="text-xs text-gray-700">{associado.cargo}</span>
                            </div>
                          )}
                          {associado.aniversario && (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-orange-600">🎂</span>
                              <span className="text-xs text-gray-700">
                                {new Date(associado.aniversario).toLocaleDateString('pt-BR', { 
                                  day: '2-digit', 
                                  month: '2-digit' 
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      <div className="flex justify-end">
                        <Badge className={`text-xs font-medium border ${getValorColor(associado.valor)}`}>
                          {associado.valor}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Visualização em Lista */}
            {viewMode === 'list' && (
              <div className="mb-6">
                <Card>
                  <CardContent className="p-0">
                    <div className="max-h-[600px] overflow-y-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Matrícula
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nome
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Cargo
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Aniversário
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Referência
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Categoria
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Valor
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredAssociados.map((associado, index) => (
                            <tr key={associado.matricula} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                {associado.matricula}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {associado.nome}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {associado.cargo ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-purple-600">💼</span>
                                    <span>{associado.cargo}</span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                {associado.aniversario ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-orange-600">🎂</span>
                                    <span>
                                      {new Date(associado.aniversario).toLocaleDateString('pt-BR', { 
                                        day: '2-digit', 
                                        month: '2-digit' 
                                      })}
                                    </span>
                                  </div>
                                ) : (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {associado.referencia}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {getCategoriaBadge(associado) || (
                                  <span className="text-xs text-gray-400">-</span>
                                )}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Badge className={`text-xs font-medium border ${getValorColor(associado.valor)}`}>
                                  {associado.valor}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Informações da Lista */}
            <div className="text-center p-4 bg-white rounded-lg border">
              <p className="text-sm text-gray-600">
                Listando todos os <span className="font-semibold text-gray-900">{filteredAssociados.length}</span> associados encontrados
                {searchTerm && (
                  <span> para a busca "<span className="font-semibold">"{searchTerm}"</span>"</span>
                )}
                {viewMode === 'grid' && (
                  <span> • Visualização em grade</span>
                )}
                {viewMode === 'list' && (
                  <span> • Visualização em lista</span>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}