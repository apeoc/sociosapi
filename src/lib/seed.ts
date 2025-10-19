import { db } from '@/lib/db';

export async function seedAnotacoes() {
  try {
    // Buscar associados existentes
    const associados = await db.associado.findMany();
    
    if (associados.length === 0) {
      console.log('Nenhum associado encontrado');
      return;
    }

    // Adicionar anotações de exemplo para alguns associados
    const anotacoesExemplo = [
      {
        associadoId: associados[0]?.id,
        conteudo: "Associado entrou em contato para informar mudança de telefone. Novo número: (88) 99999-8888",
        autor: "Secretária Maria"
      },
      {
        associadoId: associados[0]?.id,
        conteudo: "Documentação atualizada e entregue no escritório",
        autor: "Advogado João"
      },
      {
        associadoId: associados[1]?.id,
        conteudo: "Audiência marcada para dia 15/12/2024 às 14h",
        autor: "Advogado Pedro"
      },
      {
        associadoId: associados[2]?.id,
        conteudo: "Associado solicitou informações sobre andamento do processo",
        autor: "Atendente Ana"
      }
    ];

    for (const anotacao of anotacoesExemplo) {
      if (anotacao.associadoId) {
        await db.anotacao.create({
          data: {
            conteudo: anotacao.conteudo,
            autor: anotacao.autor,
            associadoId: anotacao.associadoId
          }
        });
      }
    }

    console.log('Anotações de exemplo adicionadas com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar anotações:', error);
  }
}