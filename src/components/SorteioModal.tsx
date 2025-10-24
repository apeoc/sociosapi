'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Shuffle, Trophy, Users, Sparkles, RotateCcw } from 'lucide-react'

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

interface SorteioModalProps {
  associados: Associado[];
  filteredAssociados: Associado[];
}

export function SorteioModal({ associados, filteredAssociados }: SorteioModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSorteando, setIsSorteando] = useState(false)
  const [sorteado, setSorteado] = useState<Associado | null>(null)
  const [historico, setHistorico] = useState<Associado[]>([])
  const [usarFiltro, setUsarFiltro] = useState(false)

  const realizarSorteio = () => {
    if (isSorteando) return

    const conjuntoParaSortear = usarFiltro ? filteredAssociados : associados

    if (conjuntoParaSortear.length === 0) {
      alert('Não há associados disponíveis para o sorteio!')
      return
    }

    setIsSorteando(true)
    setSorteado(null)

    // Animação de sorteio
    let contador = 0
    const maxContador = 20
    const intervalo = setInterval(() => {
      const indiceAleatorio = Math.floor(Math.random() * conjuntoParaSortear.length)
      setSorteado(conjuntoParaSortear[indiceAleatorio])
      contador++

      if (contador >= maxContador) {
        clearInterval(intervalo)
        const sorteadoFinal = conjuntoParaSortear[Math.floor(Math.random() * conjuntoParaSortear.length)]
        setSorteado(sorteadoFinal)
        setHistorico(prev => [sorteadoFinal, ...prev.slice(0, 9)]) // Mantém últimos 10
        setIsSorteando(false)
      }
    }, 100)
  }

  const limparHistorico = () => {
    setHistorico([])
    setSorteado(null)
  }

  const getTotalParaSortear = () => usarFiltro ? filteredAssociados.length : associados.length

  const getValorColor = (valor: string) => {
    const numValor = parseFloat(valor.replace(',', '.'))
    if (numValor > 35) return 'text-green-600 bg-green-50 border-green-200'
    if (numValor > 25) return 'text-blue-600 bg-blue-50 border-blue-200'
    return 'text-gray-600 bg-gray-50 border-gray-200'
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg">
          <Shuffle className="h-4 w-4 mr-2" />
          Sorteio Aleatório
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-8 w-8 text-yellow-500" />
            Sorteio de Associados
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Configuração do Sorteio */}
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Configuração do Sorteio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">Total de participantes:</p>
                  <p className="text-3xl font-bold text-purple-600">{getTotalParaSortear()}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={usarFiltro}
                      onChange={(e) => setUsarFiltro(e.target.checked)}
                      className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm">Usar associados filtrados ({filteredAssociados.length})</span>
                  </label>
                  <Button
                    onClick={realizarSorteio}
                    disabled={isSorteando || getTotalParaSortear() === 0}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isSorteando ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-2 animate-spin" />
                        Sorteando...
                      </>
                    ) : (
                      <>
                        <Shuffle className="h-4 w-4 mr-2" />
                        Realizar Sorteio
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resultado do Sorteio */}
          {sorteado && (
            <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-center text-yellow-700">
                  🎉 Sorteado! 🎉
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className={`p-6 rounded-lg ${isSorteando ? 'animate-pulse' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {isSorteando ? 'Sorteando...' : sorteado.nome}
                    </h3>
                    {!isSorteando && (
                      <>
                        <div className="flex justify-center gap-2 mb-3">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {sorteado.matricula}
                          </Badge>
                          {getCategoriaBadge(sorteado)}
                        </div>
                        {sorteado.cargo && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">Cargo:</span> {sorteado.cargo}
                          </p>
                        )}
                        <div className="flex justify-center">
                          <Badge className={`text-sm font-medium border ${getValorColor(sorteado.valor)}`}>
                            {sorteado.valor}
                          </Badge>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Histórico de Sorteios */}
          {historico.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Histórico de Sorteios
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={limparHistorico}
                  >
                    Limpar Histórico
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {historico.map((associado, index) => (
                    <div
                      key={`${associado.matricula}-${index}`}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{associado.nome}</p>
                          <p className="text-sm text-gray-500">{associado.matricula}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getCategoriaBadge(associado)}
                        <Badge className={`text-xs font-medium border ${getValorColor(associado.valor)}`}>
                          {associado.valor}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}