# Constancia

App de produtividade que une gestão de tarefas, hábitos e foco estilo
Pomodoro — você mantém uma sequência de dias consecutivos (constância),
enquanto amigos acompanham e comentam nas suas tarefas.

## Como rodar

1. Extraia este projeto numa pasta.
2. Se as pastas de plataforma (`android/`, `ios/`, `web/`...) ainda não
   existirem, rode `flutter create .` dentro da pasta (não sobrescreve
   `lib/` nem `pubspec.yaml` já existentes).
3. `flutter pub get`
4. `flutter run -d chrome` (ou escolha outro dispositivo/emulador conectado)

O app já vem configurado com as credenciais do Supabase do projeto
(`lib/data/supabase_config.dart`) — não precisa de nenhuma configuração
extra pra testar.

## Decisões técnicas desde o Checkpoint 4

- **Banco de dados: Supabase.** Escolhido em vez do Firebase porque os
  dados do app são relacionais por natureza (tarefas pertencem a um
  usuário, comentários pertencem a uma tarefa, o ranking cruza pontos
  entre usuários) — isso mapeia diretamente pra tabelas SQL. O setup no
  Flutter também é mais simples (só URL + chave, sem configuração nativa
  por plataforma).
- **Schema** (`supabase/schema.sql`): três tabelas — `profiles` (pessoas,
  streak, pontos), `tasks` (tarefas, ligadas a um dono) e
  `task_comments` (comentários de amigos numa tarefa).
- **Modo offline com fallback:** toda tela que busca dados do Supabase
  (`ConstanciaScreen`, `BoardScreen`, `CardDetailScreen`) começa já
  mostrando dados locais (`lib/data/sample_tasks.dart`) e troca pelos
  dados reais assim que a busca terminar. Se a busca falhar (sem
  internet, por exemplo), a tela continua funcional com os dados locais
  e mostra um aviso discreto — isso evita que a apresentação trave por
  causa da rede.
- **RLS aberta (protótipo):** as políticas de Row Level Security estão
  configuradas como leitura/escrita abertas, já que o app ainda não tem
  autenticação de usuário real — só o cadastro local (nome salvo em
  memória via `AppUser`). Dá pra restringir isso quando houver login de
  verdade.
- **Fluxo de telas:** Cadastro → Onboarding (escolha do ciclo de foco) →
  Constancia (tela principal, com tarefas do dia + streak + ranking) →
  Card (detalhe da tarefa, comentários) → Ciclo de foco (timer). Board e
  Travados são abas secundárias, acessíveis a qualquer momento pela
  barra inferior.

## Estrutura de pastas

```
lib/
  main.dart            # inicializa o Supabase e sobe o app
  data/                 # fontes de dados: Supabase, fallback local, AppUser
  models/                # modelos (TaskCardModel, FocusCycle)
  screens/                # uma tela por arquivo
  theme/                   # cores e tipografia centralizadas
  widgets/                  # componentes reutilizáveis
supabase/
  schema.sql             # schema + dados mockados do Supabase
```
