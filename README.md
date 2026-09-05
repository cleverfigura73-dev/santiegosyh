# 🎮 13SHIBIRU - LOJA ONLINE OFICIAL FREE FIRE

Bem-vindo ao repositório oficial da **13SHIBIRU**, a plataforma e-commerce gamer moderna, rápida e segura para venda de diamantes, passes, skins, contas e sensibilidades Free Fire.

---

## ⚡ Sumário de Recursos
- **Identidade Gamer Premium**: Design Free Fire com tema escuro neon, azul elétrico e visual futurista.
- **Autenticação Segura & Persistente**: Cadastro e login de clientes, controle de sessão persistente no recarregamento.
- **Área Administrativa Exclusiva**: Painel restrito (`/admin`) protegido no backend/banco de dados com credenciais administrativas seguras.
- **Pacotes de Diamantes**: Tabela com pacotes oficiais (100 a 5600 💎, Semanal, Mensal, Passe) com valores em Kwanzas (KZ).
- **Processo de Pagamento Completo**: Resumo da compra, dados de pagamento formatados com botão de cópia de 1 clique (Multicaixa Express, Pay Pay, BIC IBAN, PIX).
- **Envio e Validação de Comprovativo**: Upload de imagem, captura de ID do jogador, geração de código de pedido único (#SHB-XXXX).
- **Atendimento WhatsApp Integrado**: Redirecionamento com mensagem pré-formatada para acelerar a validação do pedido (+244 952 778 374).
- **Notificações em Tempo Real**: Alertas de pedidos pendentes, em análise e concluídos.
- **Galeria de Feedbacks**: Provas reais de compra gerenciadas pelo admin.
- **Pronto para Netlify & Supabase**: Arquivo `netlify.toml`, schema SQL (`supabase-schema.sql`) e RLS habilitado.

---

## 🚀 1. Instalação Local

### Pré-requisitos
- Node.js 18+ ou 20+
- Gerenciador de pacotes npm, yarn ou pnpm

### Passos
```bash
# 1. Clonar o repositório
git clone https://github.com/seu-usuario/13shibiru-store.git
cd 13shibiru-store

# 2. Instalar dependências
npm install

# 3. Criar arquivo de variáveis de ambiente
cp .env.example .env

# 4. Iniciar servidor de desenvolvimento
npm run dev
```
O servidor estará disponível em `http://localhost:3000`.

---

## 🗄️ 2. Configuração do Supabase (Banco de Dados, Auth & Storage)

### 2.1. Criar Projeto no Supabase
1. Acesse [Supabase](https://supabase.com) e crie uma conta gratuita.
2. Clique em **"New project"** e defina:
   - Nome: `13shibiru-store`
   - Senha do banco de dados (guarde em local seguro)
   - Região mais próxima (ex: Frankfurt, São Paulo, etc.)

### 2.2. Executar o Script SQL
1. No painel do Supabase, clique em **SQL Editor** no menu lateral esquerdo.
2. Abra o arquivo `supabase-schema.sql` deste projeto.
3. Copie todo o conteúdo, cole no editor SQL do Supabase e clique em **Run**.
4. Este script cria automaticamente:
   - Tabela `profiles` (com trigger para novos usuários e cargo admin)
   - Tabela `services` e `service_packages`
   - Tabela `orders`
   - Tabela `feedbacks`
   - Tabela `notifications`
   - Políticas de segurança Row Level Security (RLS)
   - Buckets de storage: `proofs`, `feedbacks`, `services`

### 2.3. Configurar os Buckets de Storage
Se os buckets não tiverem sido criados via SQL:
1. Vá em **Storage** > **New bucket**.
2. Crie:
   - `proofs` (Público ou autenticado)
   - `feedbacks` (Público)
   - `services` (Público)

### 2.4. Criação do Usuário Administrador
Para criar o administrador no Supabase:
1. Vá em **Authentication** > **Users** > **Add user** > **Create user**.
2. Preencha:
   - Email: `13Shibiru@gmail.com`
   - Senha: `Santiegoadmin13` (ou a senha forte de sua preferência)
   - Marque **Auto Confirm User?** como SIM.
3. O trigger automático definirá o cargo deste email como `'admin'`.

---

## ⚙️ 3. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto com as seguintes chaves obtidas em **Supabase Project Settings > API**:

```env
# URL do projeto Supabase
VITE_SUPABASE_URL="https://seu-id-de-projeto.supabase.co"

# Chave pública anon do Supabase
VITE_SUPABASE_ANON_KEY="sua-chave-anon-publica-aqui"

# WhatsApp de suporte da loja
VITE_WHATSAPP_NUMBER="+244952778374"
```

> **Nota de Resiliência**: Caso você teste o aplicativo antes de conectar as chaves do Supabase, o sistema utiliza automaticamente uma camada de persistência local segura (IndexedDB/Storage) com o administrador pré-configurado, permitindo testar e demonstrar 100% dos fluxos imediatamente!

---

## 🌐 4. Deploy na Netlify

### 4.1. Deploy via Git (Recomendado)
1. Faça push do código para o GitHub/GitLab.
2. Acesse [Netlify](https://app.netlify.com/) e clique em **"Add new site" > "Import an existing project"**.
3. Selecione o repositório.
4. As configurações de build já estão definidas no `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
5. Em **Environment variables**, adicione:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
6. Clique em **Deploy Site**.

### 4.2. Configuração de Domínio Personalizado
1. No painel da Netlify, vá em **Domain management**.
2. Clique em **Add a domain** (ex: `13shibiru.com` ou `loja13shibiru.com`).
3. Siga as instruções para configurar os registros DNS (tipo CNAME ou A apontando para a Netlify).
4. O certificado SSL HTTPS gratuito da Let's Encrypt será provisionado automaticamente em poucos minutos.

---

## 🛡️ 5. Políticas de Segurança (Row Level Security - RLS)

- **Serviços**: Clientes podem apenas ler serviços ativos. Somente o administrador autenticado pode criar, editar, ativar/desativar ou excluir serviços.
- **Pedidos**: Clientes podem visualizar e criar apenas os seus próprios pedidos. O administrador pode visualizar todos os pedidos e atualizar o status.
- **Feedbacks**: Público geral pode visualizar feedbacks aprovados. Apenas o administrador pode publicar ou excluir feedbacks.
- **Comprovativos**: O upload é restrito ao cliente autenticado ou admin, protegendo a privacidade dos dados bancários.

---

## 📋 6. Guia Operacional do Administrador

### Acessando o Painel Admin
1. Clique em **"Entrar"** no cabeçalho ou navegue até `/admin`.
2. Entre com o email do administrador (`13Shibiru@gmail.com`).
3. Uma vez logado, a opção **"ADMIN"** ficará visível no menu superior.

### Gerenciar Pedidos
1. No menu Admin, clique na aba **"Pedidos"**.
2. Você verá a lista de pedidos com:
   - Número do pedido (#SHB-XXXX)
   - Email do cliente
   - ID do Free Fire informado
   - Serviço e valor em KZ
   - Miniatura do comprovativo (clique para ampliar e inspecionar)
3. Altere o status conforme o fluxo:
   - `Em análise`: Comprovativo sendo conferido na conta bancária.
   - `Aprovado`: Pagamento confirmado.
   - `Concluído`: Diamantes/itens entregues no jogo. (O cliente receberá notificação visual imediata no site).
   - `Cancelado`: Comprovativo inválido ou divergente.

### Adicionar Novos Serviços
1. No menu Admin, clique na aba **"Serviços"**.
2. Clique no botão **"+ Novo Serviço"**.
3. Preencha:
   - Nome do serviço (ex: *Recarga 1060 Diamantes*)
   - Preço em KZ
   - Categoria (*Diamantes, Passe Booyah, Skins, Contas, Sensibilidade 13SHIBIRU, Outros*)
   - URL ou upload da imagem
   - Descrição detalhada
4. Clique em **Salvar**. O serviço aparece instantaneamente na vitrine da loja!

### Adicionar Feedbacks de Clientes
1. No menu Admin, clique na aba **"Feedbacks"**.
2. Clique em **"+ Novo Feedback"**.
3. Faça upload da captura de tela do cliente (conversa no WhatsApp ou tela do jogo com os diamantes recebidos).
4. Insira uma legenda opcional (ex: *"Recarga de 2180 diamantes entregue em 3 minutos!"*).
5. Clique em **Publicar**. O feedback entra imediatamente na galeria pública.

---

## 📞 Suporte e Contato
- WhatsApp Oficial: `+244 952 778 374`
- Suporte 24/7 para entregas e dúvidas de clientes.
