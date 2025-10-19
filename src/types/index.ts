export interface Associado {
  id: number;
  nome: string;
  createdAt: Date;
  updatedAt: Date;
  processos?: Processo[];
  anotacoes?: Anotacao[];
}

export interface Processo {
  id: number;
  numero: string;
  vara?: string;
  data?: string;
  ultimoMov?: string;
  situacao?: string;
  proximoPasso?: string;
  idaAoForum?: string;
  advogado?: string;
  tipoAcao?: string;
  createdAt: Date;
  updatedAt: Date;
  associadoId: number;
  associado?: Associado;
}

export interface Anotacao {
  id: number;
  conteudo: string;
  autor: string;
  createdAt: Date;
  updatedAt: Date;
  associadoId: number;
  associado?: Associado;
}

export interface ProcessoLegado {
  autor: string;
  processo: string;
  vara?: string;
  data?: string;
  ultimoMov?: string;
  situacao?: string;
  proximoPasso?: string;
  idaAoForum?: string;
  advogado?: string;
  tipoAcao?: string;
}