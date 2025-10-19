import { db } from '@/lib/db';

export async function seedProcessos() {
  try {
    // Dados de exemplo de processos para alguns associados
    const processosExemplo = [
      {
        autor: "ADRIANA MELO MESQUITA",
        processo: "0506704-43.2014.4.05.8103",
        vara: "1ª Vara",
        data: "15/10/2014",
        ultimoMov: "20/11/2014",
        situacao: "Em tramitação",
        proximoPasso: "Aguardar decisão",
        idaAoForum: "25/11/2014",
        advogado: "Dr. Bruno",
        anotacoes: ""
      },
      {
        autor: "ALICE MARIETA BRAGA DE OLIVEIRA",
        processo: "11687-79.2014.8.06.0053",
        vara: "2ª Vara",
        data: "27/02/2015",
        ultimoMov: "15/03/2015",
        situacao: "Concluso para decisão",
        proximoPasso: "Aguardar sentença",
        idaAoForum: "20/03/2015",
        advogado: "Dr. Augusto",
        anotacoes: ""
      },
      {
        autor: "ANA ANGELICA BENTO DE ANDRADE",
        processo: "0512980-90.2014.4.05.8103",
        vara: "3ª Vara",
        data: "10/01/2015",
        ultimoMov: "05/02/2015",
        situacao: "Aguardando manifestação",
        proximoPasso: "Apresentar documentos",
        idaAoForum: "10/02/2015",
        advogado: "Dr. Bruno",
        anotacoes: ""
      },
      {
        autor: "ANTONIA BENEDITA CELERO RODRIGUES",
        processo: "0514499-03.2014.4.05.8103",
        vara: "1ª Vara",
        data: "20/03/2015",
        ultimoMov: "25/03/2015",
        situacao: "Em análise",
        proximoPasso: "Complementar informações",
        idaAoForum: "30/03/2015",
        advogado: "Dr. Augusto",
        anotacoes: ""
      },
      {
        autor: "ANTONIO HILARIO DA SILVA",
        processo: "0510334-10.2014.4.05.8103",
        vara: "2ª Vara",
        data: "05/04/2015",
        ultimoMov: "10/04/2015",
        situacao: "Julgado procedente",
        proximoPasso: "Aguardar cálculos",
        idaAoForum: "15/04/2015",
        advogado: "Dr. Ítalo",
        anotacoes: ""
      }
    ];

    for (const processo of processosExemplo) {
      await db.processo.create({
        data: processo
      });
    }

    console.log('Processos de exemplo adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar processos:', error);
  }
}