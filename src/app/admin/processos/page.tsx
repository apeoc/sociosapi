'use client'

import { useState, useEffect } from 'react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Header } from '@/components/layout/Header'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Scale, Plus, Edit, Trash2, Save, X, FileText, Calendar, User } from 'lucide-react'

interface Processo {
  id?: number
  autor: string
  processo: string
  vara: string
  data: string
  ultimoMov: string
  situacao: string
  proximoPasso: string
  idaAoForum: string
  advogado: string
  anotacoes?: string
}

export default function ProcessosAdmin() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingProcesso, setEditingProcesso] = useState<Processo | null>(null)
  const [formData, setFormData] = useState<Processo>({
    autor: '',
    processo: '',
    vara: '',
    data: '',
    ultimoMov: '',
    situacao: '',
    proximoPasso: '',
    idaAoForum: '',
    advogado: '',
    anotacoes: ''
  })

  useEffect(() => {
    fetchProcessos()
  }, [])

  const fetchProcessos = async () => {
    try {
      const response = await fetch('/api/processos')
      if (!response.ok) {
        throw new Error('Erro ao carregar processos')
      }
      const data = await response.json()
      
      // Transformar dados do formato da API para o formulário
      const transformedProcessos = data.processos.map((p: any, index: number) => ({
        id: index + 1,
        autor: p.autor,
        processo: p.processo,
        vara: p.vara || '',
        data: p.dataUltimoMovimento || '',
        ultimoMov: p.horaUltimoMovimento || '',
        situacao: p.situacaoAtual || '',
        proximoPasso: p.proximoPasso || '',
        idaAoForum: p.idaAoForum || '',
        advogado: p.advogado || '',
        anotacoes: p.anotacoes || ''
      }))
      
      setProcessos(transformedProcessos)
    } catch (err) {
      console.error('Erro ao buscar processos:', err)
      setError('Não foi possível carregar os processos')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingProcesso ? '/api/processos/update' : '/api/processos/create'
      const method = editingProcesso ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar processo')
      }

      // Resetar formulário
      setFormData({
        autor: '',
        processo: '',
        vara: '',
        data: '',
        ultimoMov: '',
        situacao: '',
        proximoPasso: '',
        idaAoForum: '',
        advogado: '',
        anotacoes: ''
      })
      setShowForm(false)
      setEditingProcesso(null)
      fetchProcessos()
    } catch (err) {
      console.error('Erro ao salvar processo:', err)
      setError('Não foi possível salvar o processo')
    }
  }

  const handleEdit = (processo: Processo) => {
    setEditingProcesso(processo)
    setFormData(processo)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este processo?')) {
      return
    }

    try {
      const response = await fetch(`/api/processos/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir processo')
      }

      fetchProcessos()
    } catch (err) {
      console.error('Erro ao excluir processo:', err)
      setError('Não foi possível excluir o processo')
    }
  }

  const cancelForm = () => {
    setFormData({
      autor: '',
      processo: '',
      vara: '',
      data: '',
      ultimoMov: '',
      situacao: '',
      proximoPasso: '',
      idaAoForum: '',
      advogado: '',
      anotacoes: ''
    })
    setShowForm(false)
    setEditingProcesso(null)
  }

  const getSituacaoColor = (situacao: string) => {
    if (situacao.toLowerCase().includes('concluso')) return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    if (situacao.toLowerCase().includes('julgada')) return 'bg-red-50 text-red-700 border-red-200'
    if (situacao.toLowerCase().includes('juntada')) return 'bg-blue-50 text-blue-700 border-blue-200'
    if (situacao.toLowerCase().includes('expedição')) return 'bg-green-50 text-green-700 border-green-200'
    return 'bg-gray-50 text-gray-700 border-gray-200'
  }

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header subtitle="Gerencie os processos jurídicos" />
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header subtitle="Gerencie os processos jurídicos e anotações" />

        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Cabeçalho com botão de adicionar */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Administração de Processos</h1>
              <p className="text-gray-600 mt-1">Total de processos: {processos.length}</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Processo
            </Button>
          </div>

          {/* Erro */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Formulário */}
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {editingProcesso ? 'Editar Processo' : 'Novo Processo'}
                  <Button variant="ghost" size="sm" onClick={cancelForm}>
                    <X className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="autor">Autor</Label>
                      <Input
                        id="autor"
                        value={formData.autor}
                        onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="processo">Número do Processo</Label>
                      <Input
                        id="processo"
                        value={formData.processo}
                        onChange={(e) => setFormData({ ...formData, processo: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="vara">Vara</Label>
                      <Input
                        id="vara"
                        value={formData.vara}
                        onChange={(e) => setFormData({ ...formData, vara: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="advogado">Advogado</Label>
                      <Input
                        id="advogado"
                        value={formData.advogado}
                        onChange={(e) => setFormData({ ...formData, advogado: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="data">Data</Label>
                      <Input
                        id="data"
                        type="date"
                        value={formData.data}
                        onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="ultimoMov">Último Movimento</Label>
                      <Input
                        id="ultimoMov"
                        value={formData.ultimoMov}
                        onChange={(e) => setFormData({ ...formData, ultimoMov: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="situacao">Situação Atual</Label>
                      <Input
                        id="situacao"
                        value={formData.situacao}
                        onChange={(e) => setFormData({ ...formData, situacao: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="idaAoForum">Ida ao Fórum</Label>
                      <Input
                        id="idaAoForum"
                        value={formData.idaAoForum}
                        onChange={(e) => setFormData({ ...formData, idaAoForum: e.target.value })}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="proximoPasso">Próximo Passo</Label>
                    <Input
                      id="proximoPasso"
                      value={formData.proximoPasso}
                      onChange={(e) => setFormData({ ...formData, proximoPasso: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="anotacoes">Anotações</Label>
                    <Textarea
                      id="anotacoes"
                      value={formData.anotacoes}
                      onChange={(e) => setFormData({ ...formData, anotacoes: e.target.value })}
                      placeholder="Adicione anotações importantes sobre este processo..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {editingProcesso ? 'Atualizar' : 'Salvar'}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelForm}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Lista de Processos */}
          <div className="space-y-4">
            {processos.map((processo) => (
              <Card key={processo.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {/* Cabeçalho */}
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">
                          {processo.processo}
                        </span>
                        <Badge className={`text-xs ${getSituacaoColor(processo.situacao)}`}>
                          {processo.situacao}
                        </Badge>
                      </div>

                      {/* Informações principais */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{processo.autor}</span>
                        </div>
                        {processo.vara && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">🏛️</span>
                            <span>{processo.vara}</span>
                          </div>
                        )}
                        {processo.advogado && (
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">⚖️</span>
                            <span>{processo.advogado}</span>
                          </div>
                        )}
                        {processo.data && (
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{processo.data}</span>
                          </div>
                        )}
                      </div>

                      {/* Anotações */}
                      {processo.anotacoes && (
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                          <span className="font-medium text-gray-700">Anotações: </span>
                          <span className="text-gray-600 italic">{processo.anotacoes}</span>
                        </div>
                      )}

                      {/* Próximo Passo */}
                      {processo.proximoPasso && (
                        <div className="mt-2 text-xs">
                          <span className="font-medium text-gray-700">Próximo Passo: </span>
                          <span className="text-gray-600">{processo.proximoPasso}</span>
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(processo)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(processo.id!)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {processos.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Scale className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum processo encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Comece adicionando um novo processo para gerenciar.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeiro Processo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}