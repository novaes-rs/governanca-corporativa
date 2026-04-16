export type ActivityType = "quiz" | "vote" | "case" | "open" | null;

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface SlideActivity {
  type: ActivityType;
  question: string;
  options?: QuizOption[];
  correctAnswer?: string;
  points?: number;
  hint?: string;
}

export interface Slide {
  index: number;
  title: string;
  type: "content" | "activity" | "cover" | "closing";
  content: string[];
  activity?: SlideActivity;
  icon?: string;
  highlight?: string;
}

export const TEAMS = ["Equipe 1", "Equipe 2", "Equipe 3", "Equipe 4", "Equipe 5"];

export const SLIDES: Slide[] = [
  {
    index: 1,
    type: "cover",
    title: "Compliance no Setor Público vs. Privado",
    icon: "shield",
    highlight: "Estudo de Caso Comparativo — Análise de Editais e Transparência",
    content: [
      "Disciplina: Governança Corporativa",
      "Aula dinâmica com estudo de caso e atividades em equipe",
    ],
  },
  {
    index: 2,
    type: "content",
    title: "Objetivos da Aula",
    icon: "target",
    content: [
      "Compreender as diferenças e semelhanças entre compliance público e privado",
      "Analisar a importância da transparência em editais e contratações",
      "Identificar riscos de compliance em processos licitatórios",
      "Desenvolver propostas práticas de melhoria em programas de integridade",
    ],
  },
  {
    index: 3,
    type: "content",
    title: "O que é Compliance?",
    icon: "check-circle",
    highlight: "Estar em conformidade com leis, regulamentos, normas internas e princípios éticos",
    content: [
      "Origem: do inglês 'to comply' — agir de acordo com regras e padrões",
      "Vai além do cumprimento legal: envolve cultura organizacional e ética",
      "Pilares: Prevenção, Detecção e Resposta a irregularidades",
      "Instrumento essencial de Governança Corporativa e gestão de riscos",
    ],
  },
  {
    index: 4,
    type: "content",
    title: "Marco Legal — Setor Público",
    icon: "university",
    content: [
      "Lei Anticorrupção (12.846/2013): responsabilização objetiva de pessoas jurídicas por atos lesivos à administração pública",
      "Nova Lei de Licitações (14.133/2021): exige programa de integridade para contratos acima de R$ 200 milhões",
      "Lei de Acesso à Informação (12.527/2011): obrigatoriedade de transparência ativa e passiva",
      "Decreto 9.203/2017: institui a Política de Governança da Administração Pública Federal",
      "CGU: órgão central de controle e promoção da integridade pública",
    ],
  },
  {
    index: 5,
    type: "content",
    title: "Marco Legal — Setor Privado",
    icon: "building",
    content: [
      "Lei Anticorrupção (12.846/2013): aplica-se também a empresas privadas que se relacionam com o poder público",
      "Decreto 11.129/2022: regulamenta programas de integridade para empresas privadas",
      "LGPD (13.709/2018): proteção de dados pessoais como componente de compliance",
      "Normas internacionais: FCPA (EUA), UK Bribery Act, ISO 37001 (antissuborno)",
      "Incentivos: redução de sanções para empresas com programas de integridade certificados",
    ],
  },
  {
    index: 6,
    type: "content",
    title: "Comparativo: Público vs. Privado",
    icon: "balance-scale",
    content: [
      "MOTIVAÇÃO — Público: obrigação legal e controle social | Privado: reputação, acesso a mercados e redução de riscos",
      "FISCALIZAÇÃO — Público: CGU, TCU, MP, Tribunais | Privado: autorregulação, auditoria externa, CVM",
      "TRANSPARÊNCIA — Público: obrigatória (LAI) | Privado: voluntária ou exigida por contratos",
      "SANÇÕES — Público: responsabilização do agente e da entidade | Privado: multas, suspensão, leniência",
      "CULTURA — Público: desafio de resistência burocrática | Privado: desafio de comprometimento da alta liderança",
    ],
  },
  {
    index: 7,
    type: "activity",
    title: "Atividade 1 — Quiz: Fundamentos de Compliance",
    icon: "question-circle",
    content: ["Cada equipe responde individualmente. O professor libera o gabarito após todas as equipes responderem."],
    activity: {
      type: "quiz",
      question: "Qual das alternativas representa corretamente uma diferença fundamental entre o compliance no setor público e no setor privado?",
      points: 20,
      options: [
        { id: "a", text: "No setor privado, o compliance é obrigatório por lei para todas as empresas, enquanto no público é opcional", isCorrect: false },
        { id: "b", text: "No setor público, a transparência é uma obrigação legal (LAI), enquanto no privado ela é majoritariamente voluntária ou contratual", isCorrect: true },
        { id: "c", text: "O setor público não possui órgãos de fiscalização de compliance, ao contrário do privado", isCorrect: false },
        { id: "d", text: "A Lei Anticorrupção (12.846/2013) aplica-se exclusivamente ao setor privado", isCorrect: false },
      ],
      correctAnswer: "b",
      hint: "Pense na Lei de Acesso à Informação e nas obrigações de transparência ativa.",
    },
  },
  {
    index: 8,
    type: "content",
    title: "Editais e Transparência — Conceitos",
    icon: "file-alt",
    content: [
      "Edital: instrumento convocatório que define as regras de uma licitação pública",
      "Transparência ativa: publicação proativa de informações (Portal da Transparência, PNCP)",
      "Transparência passiva: atendimento a pedidos de informação via LAI",
      "Critérios de compliance em editais: habilitação jurídica, regularidade fiscal, qualificação técnica e econômica",
      "Cláusula de integridade: exigência crescente em contratos públicos de grande porte",
    ],
  },
  {
    index: 9,
    type: "content",
    title: "Análise de Edital Público — Caso Real",
    icon: "search",
    highlight: "Pregão Eletrônico nº 001/2023 — Ministério da Saúde (Aquisição de Equipamentos Hospitalares)",
    content: [
      "Valor estimado: R$ 48 milhões | Modalidade: Pregão Eletrônico (Lei 14.133/2021)",
      "Exigências de compliance: certidões negativas, CNEP, CEIS, declaração de integridade",
      "Transparência: publicado no PNCP, Diário Oficial e Portal da Transparência",
      "Ponto crítico identificado: ausência de cláusula de programa de integridade para fornecedores",
      "Resultado: contratação questionada pelo TCU por sobrepreço — investigação em andamento",
    ],
  },
  {
    index: 10,
    type: "activity",
    title: "Atividade 2 — Votação: Maior Desafio",
    icon: "poll",
    content: ["Cada equipe vota em um único item. Respostas ficam ocultas até o professor liberar."],
    activity: {
      type: "vote",
      question: "Na sua avaliação, qual é o MAIOR desafio para implementar compliance efetivo em editais públicos no Brasil?",
      points: 10,
      options: [
        { id: "a", text: "Falta de cultura de integridade nos órgãos públicos" },
        { id: "b", text: "Legislação complexa e fragmentada" },
        { id: "c", text: "Ausência de capacitação dos servidores" },
        { id: "d", text: "Pressão política sobre processos licitatórios" },
        { id: "e", text: "Falta de recursos tecnológicos para fiscalização" },
      ],
    },
  },
  {
    index: 11,
    type: "content",
    title: "Estudo de Caso — Petrobras (Setor Privado)",
    icon: "industry",
    highlight: "Operação Lava Jato (2014–2021): maior caso de corrupção corporativa da história brasileira",
    content: [
      "Esquema: pagamento de propinas a executivos e partidos políticos em contratos superfaturados",
      "Falha de compliance: ausência de programa de integridade, conflito de interesses, captura política",
      "Consequências: perda de R$ 6,2 bilhões, rebaixamento de rating, saída da NYSE temporariamente",
      "Resposta: criação da Diretoria de Governança e Conformidade, adoção da ISO 37001",
      "Lição: compliance não é custo — é proteção do valor da empresa e da confiança pública",
    ],
  },
  {
    index: 12,
    type: "content",
    title: "Estudo de Caso — Prefeitura de São Paulo (Setor Público)",
    icon: "city",
    highlight: "Programa de Integridade SP (2019–presente): referência nacional em compliance público municipal",
    content: [
      "Contexto: São Paulo foi a primeira capital a implementar programa de integridade estruturado",
      "Ações: mapeamento de riscos, canal de denúncias, treinamentos obrigatórios para servidores",
      "Transparência: 100% dos contratos acima de R$ 1 milhão publicados com dados abertos",
      "Resultado: redução de 34% em impugnações de editais entre 2019 e 2022",
      "Desafio persistente: rotatividade de servidores e manutenção da cultura de integridade",
    ],
  },
  {
    index: 13,
    type: "activity",
    title: "Atividade 3 — Análise de Caso Comparativo",
    icon: "balance-scale",
    content: ["Cada equipe analisa os dois casos e responde com base na comparação. Professor libera as análises para debate."],
    activity: {
      type: "case",
      question: "Comparando os casos Petrobras e Prefeitura de SP: identifique UMA falha crítica de compliance em cada caso e proponha UMA medida preventiva específica que poderia ter evitado ou mitigado o problema. Seja objetivo e use conceitos da aula.",
      points: 30,
      hint: "Considere: cultura organizacional, estrutura de controles, transparência e responsabilização.",
    },
  },
  {
    index: 14,
    type: "content",
    title: "Boas Práticas de Compliance",
    icon: "star",
    content: [
      "Tone at the top: comprometimento visível da alta liderança é o fator mais crítico de sucesso",
      "Canal de denúncias: anônimo, independente e com proteção ao denunciante (Lei 13.608/2018)",
      "Treinamentos periódicos: adaptados ao nível hierárquico e às funções de risco",
      "Due diligence de terceiros: avaliação de fornecedores, parceiros e intermediários",
      "Monitoramento contínuo: indicadores de risco, auditorias internas e revisão periódica do programa",
      "Transparência proativa: publicação voluntária além do exigido como diferencial competitivo",
    ],
  },
  {
    index: 15,
    type: "activity",
    title: "Atividade 4 — Proposta de Melhoria",
    icon: "lightbulb",
    content: ["Atividade final em equipe. O professor libera todas as propostas para comparação e debate coletivo."],
    activity: {
      type: "open",
      question: "Sua equipe foi contratada como consultora de compliance. Escolha UMA das situações abaixo e elabore uma proposta de melhoria com no mínimo 3 ações concretas:\n\n(A) Uma autarquia federal que nunca teve programa de integridade e precisa se adequar à Nova Lei de Licitações\n\n(B) Uma empresa de médio porte que quer participar de licitações públicas e precisa estruturar seu compliance",
      points: 40,
      hint: "Inclua: diagnóstico, ações prioritárias, responsáveis e indicadores de resultado.",
    },
  },
  {
    index: 16,
    type: "closing",
    title: "Conclusão e Referências",
    icon: "graduation-cap",
    highlight: "Compliance não é burocracia — é a base da confiança institucional",
    content: [
      "BRASIL. Lei nº 12.846/2013 — Lei Anticorrupção",
      "BRASIL. Lei nº 14.133/2021 — Nova Lei de Licitações e Contratos",
      "BRASIL. Lei nº 12.527/2011 — Lei de Acesso à Informação",
      "CGU. Manual de Programa de Integridade para Empresas. Brasília, 2021",
      "FIESP. Relatório Corrupção: custos econômicos e propostas de combate. 2010",
      "TRANSPARÊNCIA INTERNACIONAL. Índice de Percepção da Corrupção, 2023",
      "COIMBRA, M.; MANZI, V. Manual de Compliance. São Paulo: Atlas, 2010",
    ],
  },
];
