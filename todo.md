# Sala de Aula Interativa - Compliance
## TODO

### Banco de Dados / Schema
- [x] Tabela `sessions` - sessão da aula (ativa/inativa, slide atual, modo projetor)
- [x] Tabela `activities` - atividades por slide (quiz, votação, análise, resposta aberta)
- [x] Tabela `team_responses` - respostas das equipes por atividade
- [x] Tabela `scores` - placar das equipes

### Backend (tRPC)
- [x] Procedure: criar/obter sessão ativa da aula
- [x] Procedure: login do professor (senha protegida)
- [x] Procedure: controlar slide atual e modo projetor
- [x] Procedure: liberar/ocultar respostas no projetor
- [x] Procedure: registrar resposta de equipe
- [x] Procedure: obter respostas de todas as equipes
- [x] Procedure: calcular e atualizar placar
- [x] Procedure: resetar sessão/atividade

### Frontend - Tela dos Alunos
- [x] Tela de entrada: seleção de equipe (Equipe 1 a 5) sem cadastro
- [x] Interface mobile-first para responder atividades
- [x] Quiz de múltipla escolha
- [x] Votação
- [x] Análise de caso
- [x] Resposta aberta por equipe
- [x] Feedback visual após envio de resposta
- [x] Polling para atualizar atividade atual em tempo real

### Frontend - Dashboard do Professor
- [x] Tela de login protegida por senha
- [x] Navegação entre slides da aula
- [x] Controle: liberar/ocultar respostas no projetor
- [x] Controle: ativar/desativar modo projetor
- [x] Visualização das respostas das 5 equipes
- [x] Controle do placar
- [x] Botão para resetar atividade
- [x] Link para abrir modo projetor em nova aba

### Frontend - Modo Projetor
- [x] Tela cheia com respostas das 5 equipes lado a lado
- [x] Placar em tempo real
- [x] Slide de conteúdo atual visível
- [x] Polling para atualizar em tempo real

### Conteúdo da Aula (Slides Embutidos)
- [x] Slide 1: Capa - Compliance Público vs. Privado
- [x] Slide 2: Objetivos da Aula
- [x] Slide 3: O que é Compliance?
- [x] Slide 4: Marco Legal - Setor Público (Lei 12.846/13, 14.133/21)
- [x] Slide 5: Marco Legal - Setor Privado (Lei Anticorrupção, LGPD)
- [x] Slide 6: Comparativo: Público vs. Privado (tabela)
- [x] Slide 7: ATIVIDADE 1 - Quiz: Qual é a diferença?
- [x] Slide 8: Editais e Transparência - Conceitos
- [x] Slide 9: Análise de Edital Público Real
- [x] Slide 10: ATIVIDADE 2 - Votação: Maior desafio
- [x] Slide 11: Estudo de Caso - Petrobras (compliance privado)
- [x] Slide 12: Estudo de Caso - Prefeitura de SP (compliance público)
- [x] Slide 13: ATIVIDADE 3 - Análise de Caso Comparativo
- [x] Slide 14: Boas Práticas de Compliance
- [x] Slide 15: ATIVIDADE 4 - Resposta Aberta: Proposta de Melhoria
- [x] Slide 16: Conclusão e Referências

### Estilo Visual
- [x] Fundo branco (#FFFFFF) em toda a aplicação
- [x] Fontes e elementos em azul marinho (#001F3F)
- [x] Aplicar paleta consistente: professor, aluno e projetor
- [x] Responsividade mobile-first
