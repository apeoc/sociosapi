'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Users, Filter, Grid, List, Eye, Scale, FileText, Calendar, User, MessageSquare, Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'

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

interface Processo {
  id: number;
  autor: string;
  processo: string;
  vara?: string;
  data?: string;
  ultimoMov?: string;
  situacao?: string;
  proximoPasso?: string;
  idaAoForum?: string;
  advogado?: string;
  anotacoes?: string;
}

// Componente para exibir informações de processos
function ProcessosInfo({ associadoNome }: { associadoNome: string }) {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [novaAnotacao, setNovaAnotacao] = useState('')
  const [isAddingAnotacao, setIsAddingAnotacao] = useState(false)

  useEffect(() => {
    const fetchProcessos = async () => {
      if (!associadoNome) return
      
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/processos?autor=${encodeURIComponent(associadoNome)}`)
        if (!response.ok) {
          throw new Error('Erro ao buscar processos')
        }
        const data = await response.json()
        setProcessos(data.processos || [])
      } catch (err) {
        console.error('Erro ao buscar processos:', err)
        setError('Não foi possível carregar as informações de processos')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProcessos()
  }, [associadoNome])

  const adicionarAnotacao = async (processoId: number) => {
    if (!novaAnotacao.trim()) return

    setIsAddingAnotacao(true)
    try {
      const response = await fetch(`/api/processos/${processoId}/anotacoes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          anotacoes: novaAnotacao,
          autor: 'Usuário Sistema' // Em um sistema real, isso viria da autenticação
        }),
      })

      if (response.ok) {
        // Atualizar a lista de processos
        const updatedProcessos = processos.map(p => 
          p.id === processoId 
            ? { ...p, anotacoes: novaAnotacao }
            : p
        )
        setProcessos(updatedProcessos)
        setNovaAnotacao('')
      }
    } catch (error) {
      console.error('Erro ao adicionar anotação:', error)
    } finally {
      setIsAddingAnotacao(false)
    }
  }

  const getSituacaoColor = (situacao: string) => {
    if (situacao.toLowerCase().includes('concluso')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (situacao.toLowerCase().includes('julgada')) return 'bg-red-50 text-red-700 border-red-200'
    if (situacao.toLowerCase().includes('juntada')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (situacao.toLowerCase().includes('expedição')) return 'bg-green-50 text-green-700 border-green-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  const getTipoAcaoColor = (tipoAcao: string) => {
    if (tipoAcao.toLowerCase().includes('inss')) return 'bg-purple-50 text-purple-700 border-purple-200'
    if (tipoAcao.toLowerCase().includes('adicional')) return 'bg-orange-50 text-orange-700 border-orange-200'
    if (tipoAcao.toLowerCase().includes('projeto')) return 'bg-pink-50 text-pink-700 border-pink-200'
    return 'bg-blue-50 text-blue-700 border-blue-200'
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-600" />
            Informações de Processos
          </h3>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border rounded-lg p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-1" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-600" />
            Informações de Processos
          </h3>
          <div className="text-center py-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (processos.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-600" />
            Informações de Processos
          </h3>
          <div className="text-center py-4 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">
              Nenhum processo encontrado para este associado
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Verifique se o nome está correto ou se há processos em andamento
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Scale className="h-5 w-5 text-indigo-600" />
          Informações de Processos ({processos.length})
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {processos.map((processo) => (
            <div key={processo.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-colors">
              {/* Cabeçalho do Processo */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="font-medium text-gray-900 text-sm">
                      {processo.processo}
                    </span>
                  </div>
                  {processo.advogado && (
                    <Badge className={`text-xs font-medium border ${getTipoAcaoColor(processo.advogado)}`}>
                      {processo.advogado}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Detalhes do Processo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {processo.vara && (
                  <div className="flex items-center gap-1">
                    <span className="text-gray-500">🏛️</span>
                    <span className="text-gray-700">{processo.vara}</span>
                  </div>
                )}
                {processo.data && (
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-gray-500" />
                    <span className="text-gray-700">{processo.data}</span>
                  </div>
                )}
              </div>

              {/* Situação Atual */}
              {processo.situacao && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-medium text-gray-600">Situação:</span>
                  </div>
                  <Badge className={`text-xs font-medium border ${getSituacaoColor(processo.situacao)}`}>
                    {processo.situacao}
                  </Badge>
                </div>
              )}

              {/* Próximo Passo */}
              {processo.proximoPasso && (
                <div className="mt-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-medium text-gray-600">Próximo Passo:</span>
                  </div>
                  <p className="text-xs text-gray-700 bg-blue-50 p-2 rounded border border-blue-200">
                    {processo.proximoPasso}
                  </p>
                </div>
              )}

              {/* Anotações */}
              <div className="mt-3 pt-3 border-t">
                <div className="flex items-center gap-1 mb-2">
                  <MessageSquare className="h-4 w-4 text-yellow-600" />
                  <span className="text-xs font-medium text-gray-600">Anotações:</span>
                </div>
                
                {processo.anotacoes ? (
                  <div className="bg-yellow-50 p-2 rounded border border-yellow-200">
                    <p className="text-xs text-gray-700 mb-2">{processo.anotacoes}</p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic mb-2">Nenhuma anotação ainda</p>
                )}
                
                {/* Formulário para adicionar anotação */}
                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Adicione uma anotação sobre este processo..."
                    value={novaAnotacao}
                    onChange={(e) => setNovaAnotacao(e.target.value)}
                    className="min-h-[60px] text-xs"
                  />
                  <Button 
                    onClick={() => adicionarAnotacao(processo.id)}
                    disabled={!novaAnotacao.trim() || isAddingAnotacao}
                    size="sm"
                    className="w-full"
                  >
                    {isAddingAnotacao ? (
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        Adicionando...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Plus className="h-3 w-3" />
                        Adicionar Anotação
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function HomePage() {
  const [associados, setAssociados] = useState<Associado[]>([])
  const [filteredAssociados, setFilteredAssociados] = useState<Associado[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'nome' | 'matricula' | 'valor' | 'estado' | 'cargo' | 'aniversario'>('nome')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedAssociado, setSelectedAssociado] = useState<Associado | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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

  const openDetalhesDialog = (associado: Associado) => {
    setSelectedAssociado(associado)
    setIsDialogOpen(true)
  }

  const closeDetalhesDialog = () => {
    setIsDialogOpen(false)
    setSelectedAssociado(null)
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
      <Header subtitle="Pesquise por nome, matrícula, cargo, ou data de aniversário entre os membros" />

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getTotalAssociados()}</p>
                  <p className="text-sm text-gray-600">Total de Associados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getEstadoCount()}</p>
                  <p className="text-sm text-gray-600">Estaduais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getMunicipioCount()}</p>
                  <p className="text-sm text-gray-600">Municipais</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{getAniversariantesOutubroCount()}</p>
                  <p className="text-sm text-gray-600">Aniversariantes Outubro</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-indigo-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{filteredAssociados.length}</p>
                  <p className="text-sm text-gray-600">Filtrados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar associado por nome, matrícula, cargo, ou data de aniversário..."
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
            </div>
            
            <div className="flex gap-2">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="matricula">Matrícula</SelectItem>
                  <SelectItem value="valor">Valor</SelectItem>
                  <SelectItem value="estado">Estado</SelectItem>
                  <SelectItem value="cargo">Cargo</SelectItem>
                  <SelectItem value="aniversario">Aniversário</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
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
        </div>

        {/* Lista de Associados */}
        {filteredAssociados.length === 0 ? (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum associado encontrado</h3>
            <p className="text-gray-600 mb-4">Tente ajustar sua busca ou filtros</p>
            <Button onClick={clearSearch}>Limpar Filtros</Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
            {filteredAssociados.map((associado) => (
              <Card key={associado.matricula} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{associado.nome}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="font-medium">Matrícula:</span>
                        <span>{associado.matricula}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDetalhesDialog(associado)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Referência:</span>
                      <span className="text-xs font-medium">{associado.referencia}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Valor:</span>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full border ${getValorColor(associado.valor)}`}>
                        R$ {associado.valor}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {getCategoriaBadge(associado)}
                    {associado.cargo && (
                      <Badge variant="outline" className="text-xs">
                        {associado.cargo}
                      </Badge>
                    )}
                    {associado.aniversario && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                        🎂 {associado.aniversario}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de Detalhes */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {selectedAssociado?.nome}
              </DialogTitle>
            </DialogHeader>
            
            {selectedAssociado && (
              <div className="space-y-6">
                {/* Informações do Associado */}
                <Card>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Informações do Associado</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm text-gray-500">Matrícula:</span>
                        <p className="font-medium">{selectedAssociado.matricula}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Referência:</span>
                        <p className="font-medium">{selectedAssociado.referencia}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Valor:</span>
                        <p className="font-medium">R$ {selectedAssociado.valor}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-500">Categoria:</span>
                        <div className="mt-1">
                          {getCategoriaBadge(selectedAssociado)}
                        </div>
                      </div>
                      {selectedAssociado.cargo && (
                        <div>
                          <span className="text-sm text-gray-500">Cargo:</span>
                          <p className="font-medium">{selectedAssociado.cargo}</p>
                        </div>
                      )}
                      {selectedAssociado.aniversario && (
                        <div>
                          <span className="text-sm text-gray-500">Aniversário:</span>
                          <p className="font-medium">🎂 {selectedAssociado.aniversario}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Processos e Anotações */}
                <ProcessosInfo associadoNome={selectedAssociado.nome} />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default function ProtectedHomePage() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  )
}