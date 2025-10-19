import { db } from '@/lib/db';
import { ProcessoLegado } from '@/types';

// Dados existentes para migração
const dadosLegados: ProcessoLegado[] = [
  {
    autor: "Neudson Carvalho das Chagas e Antonio da Silva Gomes Júnior",
    processo: "10309-88.2014.8.06.0053",
    vara: "1ª VARA",
    data: "04/12/2014 11:37",
    ultimoMov: "04/12/2014 11:37",
    situacao: "CONCLUSÃO AO JUIZ",
    advogado: "Dr. Ítalo",
    tipoAcao: "COBRANÇA - ABONOS"
  },
  {
    autor: "Ricardo Ferro de Oliveira",
    processo: "11456-86.2013.8.06.0053",
    vara: "2ª vara",
    data: "24/07/2015",
    ultimoMov: "24/07/2015 13:40",
    situacao: "JUNTADA DE DOCUMENTO - TIPO DE DOCUMENTO: DESPACHO",
    advogado: "Dr. Ítalo",
    tipoAcao: "AÇÃO DE COBRANÇA ATS ( SALÁRIO)"
  },
  {
    autor: "Rosa Helena Fontenele Vieira Rodrigues",
    processo: "11457-71.2013.8.06.0053",
    vara: "1ª vara",
    data: "11/09/2014",
    ultimoMov: "11/09/2014 10:20",
    situacao: "CONCLUSO AO JUIZ",
    advogado: "Dr. Ítalo",
    tipoAcao: "AÇÃO DE COBRANÇA ATS ( SALÁRIO)"
  },
  // INSS (ADICIONAL DE FÉRIAS) - DR. BRUNO/AUGUSTO
  {
    autor: "Adriana Melo Mesquita",
    processo: "0506704-43.2014.4.05.8103",
    vara: "",
    data: "",
    ultimoMov: "",
    situacao: "",
    advogado: "Dr. Bruno/Augusto",
    tipoAcao: "COBRANÇA - INSS (ADICIONAL DE FÉRIAS)"
  },
  {
    autor: "Aldacy do Nascimento Pereira",
    processo: "0501456-62.2015.4.05.8103",
    vara: "",
    data: "",
    ultimoMov: "",
    situacao: "",
    advogado: "Dr. Bruno/Augusto",
    tipoAcao: "COBRANÇA - INSS (ADICIONAL DE FÉRIAS)"
  },
  {
    autor: "Alissandra José de Almeida",
    processo: "0512872-61.2014.4.05.8103",
    vara: "",
    data: "",
    ultimoMov: "",
    situacao: "",
    advogado: "Dr. Bruno/Augusto",
    tipoAcao: "COBRANÇA - INSS (ADICIONAL DE FÉRIAS)"
  },
  {
    autor: "Ana Angélica Bento de Andrade",
    processo: "0512980-90.2014.4.05.8103",
    vara: "",
    data: "",
    ultimoMov: "",
    situacao: "",
    advogado: "Dr. Bruno/Augusto",
    tipoAcao: "COBRANÇA - INSS (ADICIONAL DE FÉRIAS)"
  },
  {
    autor: "João Paulo Ferreira da Costa",
    processo: "11765-73.2014.8.06.0053",
    vara: "2ª vara",
    data: "30/04/2015",
    ultimoMov: "30/04/2015 08:39",
    situacao: "JUNTADA DE DOCUMENTO",
    advogado: "Dr. Bruno/Augusto",
    tipoAcao: "ADICIONAL NOTURNO"
  },
  // PROJETO AMOR Á VIDA - DR. ÍTALO
  {
    autor: "Aglaís Felipe de Oliveira",
    processo: "354-43.2008.8.06.0053/0",
    vara: "",
    data: "19/08/2015 10:00",
    ultimoMov: "",
    situacao: "JULGADA IMPROCEDENTE A AÇÃO",
    advogado: "Dr. Ítalo",
    tipoAcao: "COBRANÇA - PROJETO AMOR Á VIDA"
  },
  {
    autor: "Maciline Silva dos Reis Vasconcelos",
    processo: "12547-80.2014.8.06.0053/0",
    vara: "",
    data: "22/10/2015 10:13",
    ultimoMov: "",
    situacao: "JUNTADA DE DOCUMENTO DECORRENDO PRAZO ATÉ 21/12/2015",
    advogado: "Dr. Bruno/Augusto",
    tipoAcao: "COBRANÇA ADICIONAL POR TEMPO DE SERVIÇO (ANUÊNIO)"
  }
];

export async function migrarDados() {
  try {
    console.log('Iniciando migração de dados...');
    
    for (const dado of dadosLegados) {
      // Verificar se o associado já existe
      let associado = await db.associado.findFirst({
        where: { nome: dado.autor }
      });
      
      // Se não existir, criar
      if (!associado) {
        associado = await db.associado.create({
          data: { nome: dado.autor }
        });
        console.log(`Associado criado: ${dado.autor}`);
      }
      
      // Verificar se o processo já existe
      const processoExistente = await db.processo.findFirst({
        where: { numero: dado.processo }
      });
      
      // Se não existir, criar
      if (!processoExistente) {
        await db.processo.create({
          data: {
            numero: dado.processo,
            vara: dado.vara,
            data: dado.data,
            ultimoMov: dado.ultimoMov,
            situacao: dado.situacao,
            proximoPasso: dado.proximoPasso,
            idaAoForum: dado.idaAoForum,
            advogado: dado.advogado,
            tipoAcao: dado.tipoAcao,
            associadoId: associado.id
          }
        });
        console.log(`Processo criado: ${dado.processo}`);
      }
    }
    
    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro na migração:', error);
  }
}

// Função para uso no cliente
export async function popularDadosIniciais() {
  try {
    const response = await fetch('/api/migrar-dados', {
      method: 'POST'
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(result.message);
    } else {
      console.error('Erro na migração');
    }
  } catch (error) {
    console.error('Erro ao popular dados:', error);
  }
}