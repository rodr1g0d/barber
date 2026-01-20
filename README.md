# BarberX - Sistema de Gestão para Barbearias

Sistema SaaS multi-tenant completo para barbearias.

## 🚀 Visão Geral

| Módulo | Descrição |
|--------|-----------|
| **Landing Page** | Conversão de novos clientes (barbearias) |
| **WebAdmin** | Gestão completa do estabelecimento |
| **App Cliente** | Agendamentos, histórico, promoções |
| **App Profissional** | Agenda, comissões, clientes |

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Motivo |
|--------|------------|--------|
| Frontend | HTML5 + CSS3 + JS Vanilla | Design único, sem frameworks genéricos |
| Backend | Node.js + Express | Simples, rápido |
| Banco de Dados | Supabase (PostgreSQL) | Gratuito, RLS, Auth integrado |
| Auth | Google + Facebook OAuth | Gratuito, fácil para usuários |
| Email | Resend | 100 emails/mês grátis |
| Pagamento | PIX (chave do admin) | Sem gateway, sem taxas |
| Localização | Google Maps API | Navegação até a barbearia |
| Ícones | Lucide Icons | SVG profissionais |

## 📁 Estrutura do Projeto

```
barber/
├── index.html              # Landing page principal
├── css/
│   └── landing.css         # Estilos (tema escuro + dourado)
├── js/
│   └── landing.js          # Interações, smooth scroll, FAQ
├── assets/
│   ├── images/             # Fotos, ícones
│   └── logo/               # Logo BarberX
├── server.js               # Servidor Express
├── package.json            # Dependências
├── .env                    # Variáveis de ambiente (NÃO commitar)
├── .env.example            # Exemplo de variáveis
└── .gitignore              # Arquivos ignorados
```

## 🎨 Design

- **Cores**: Tema escuro (#0a0a0a) + Dourado (#d4a853)
- **Fontes**: Bebas Neue (títulos) + Inter (corpo)
- **Ícones**: Lucide Icons (SVG)

## 💰 Planos

| Plano | Preço | Recursos |
|-------|-------|----------|
| Básico | R$ 49/mês | 1 profissional, funções essenciais |
| Pro | R$ 99/mês | Ilimitado, todas as funções |

## 🔧 Configuração Local

```bash
# Clonar repositório
git clone https://github.com/rodr1g0d/barber.git
cd barber

# Instalar dependências
npm install

# Criar arquivo .env
cp .env.example .env

# Rodar servidor
npm start
```

Acesse: http://localhost:5901

## 🚀 Deploy (VPS)

```bash
# No VPS
cd ~/barber
git pull origin main
npm install
pm2 restart barber
```

**URL**: https://barber.xrtec1.com

## 📋 Funcionalidades

### Landing Page ✅
- [x] Hero Section com mockup de celular
- [x] Seção de problemas/soluções
- [x] Grid de funcionalidades (12 cards)
- [x] Como funciona (3 passos)
- [x] Planos e preços
- [x] Depoimentos
- [x] FAQ accordion
- [x] Formulário de contato
- [x] Footer com redes sociais
- [x] Design responsivo (mobile/tablet/desktop)
- [x] Ícones SVG profissionais (Lucide)
- [x] Animações no scroll

### Próximas Fases (TODO)

#### Fase 2: Auth + Cadastro
- [ ] Login com Google OAuth
- [ ] Login com Facebook OAuth
- [ ] Cadastro de barbearias
- [ ] Verificação de email

#### Fase 3: WebAdmin - Dashboard
- [ ] Dashboard principal
- [ ] Gestão de serviços (CRUD)
- [ ] Gestão de profissionais (CRUD)
- [ ] Horários de funcionamento

#### Fase 4: Sistema de Agendamentos
- [ ] Calendário de agendamentos
- [ ] Seleção de profissional
- [ ] Seleção de serviço
- [ ] Confirmação de horário
- [ ] Bloqueio de horários

#### Fase 5: App Cliente (PWA)
- [ ] Busca de barbearias
- [ ] Localização no mapa
- [ ] Agendamento online
- [ ] Meus agendamentos
- [ ] Histórico

#### Fase 6: Gestão Financeira
- [ ] Entradas e saídas
- [ ] Relatórios de faturamento
- [ ] Comissões por profissional
- [ ] Exportar relatórios

#### Fase 7: Controle de Estoque
- [ ] Cadastro de produtos
- [ ] Controle de quantidade
- [ ] Alertas de estoque baixo

#### Fase 8: Notificações
- [ ] Lembretes por email (Resend)
- [ ] Confirmação de agendamento
- [ ] Lembrete 24h antes
- [ ] (Futuro) WhatsApp

#### Fase 9: Avaliações + Portfólio
- [ ] Sistema de avaliações (1-5 estrelas)
- [ ] Comentários de clientes
- [ ] Upload de fotos (portfólio)

#### Fase 10: Assinaturas
- [ ] Planos de assinatura
- [ ] Cobrança via PIX
- [ ] Controle de inadimplência

## 🔐 Variáveis de Ambiente

```env
# Ambiente
NODE_ENV=development
PORT=5901

# URL
APP_URL=https://barber.xrtec1.com

# Supabase
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=

# Resend (emails)
RESEND_API_KEY=

# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Facebook OAuth
FACEBOOK_APP_ID=
FACEBOOK_APP_SECRET=
```

## 📱 Responsividade

- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

## 🎯 Funcionalidades do Sistema

1. **Agendamento Online** - Clientes agendam 24h pelo celular
2. **Localização no Mapa** - Navegação até a barbearia
3. **Gestão Financeira** - Controle de entradas e saídas
4. **Controle de Estoque** - Alertas de reposição
5. **Relatórios Completos** - Dashboards visuais
6. **Gestão de Clientes** - Histórico e preferências
7. **Controle por Profissional** - Agenda e comissões individuais
8. **Lembretes Automáticos** - Email antes do horário
9. **Avaliações** - Sistema de reviews
10. **Portfólio** - Galeria de trabalhos
11. **Pagamento via PIX** - Sem gateway
12. **Lista de Espera** - Fila quando lotado

## 👨‍💻 Autor

XRTEC1 - [xrtec1.com](https://xrtec1.com)

## 📄 Licença

Proprietário - Todos os direitos reservados
