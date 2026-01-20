// ============================================
// BARBERX - App Cliente (Agendamento)
// ============================================

// Configuração Supabase (substituir pelas suas credenciais)
const SUPABASE_URL = 'SUA_SUPABASE_URL';
const SUPABASE_ANON_KEY = 'SUA_SUPABASE_ANON_KEY';

// Inicializar Supabase (quando configurado)
// const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Estado do app
const state = {
    currentStep: 1,
    barbearia: null,
    servico: null,
    profissional: null,
    data: null,
    horario: null,
    cliente: {
        nome: '',
        telefone: '',
        email: ''
    }
};

// Dados mockados (substituir por dados do Supabase)
const mockData = {
    barbearia: {
        id: '1',
        nome: 'Barbearia do João',
        slug: 'barbearia-do-joao',
        endereco: 'Rua das Flores, 123 - Centro',
        cidade: 'São Paulo',
        estado: 'SP',
        telefone: '11999999999',
        horario_abertura: '08:00',
        horario_fechamento: '20:00',
        intervalo: 30
    },
    servicos: [
        { id: '1', nome: 'Corte Masculino', preco: 45, duracao: 30, icone: 'scissors' },
        { id: '2', nome: 'Barba', preco: 30, duracao: 20, icone: 'smile' },
        { id: '3', nome: 'Corte + Barba', preco: 65, duracao: 45, icone: 'sparkles' },
        { id: '4', nome: 'Platinado', preco: 150, duracao: 90, icone: 'palette' },
        { id: '5', nome: 'Pigmentação', preco: 80, duracao: 60, icone: 'paintbrush' }
    ],
    profissionais: [
        { id: '1', nome: 'João Silva', apelido: 'João', rating: 4.9 },
        { id: '2', nome: 'Pedro Santos', apelido: 'Pedrão', rating: 4.8 },
        { id: '3', nome: 'Carlos Oliveira', apelido: 'Carlão', rating: 4.7 }
    ],
    horariosOcupados: [
        { data: '2025-01-20', horarios: ['09:00', '10:30', '14:00'] },
        { data: '2025-01-21', horarios: ['08:00', '11:00', '15:30'] }
    ]
};

// Elementos DOM
const elements = {
    steps: document.querySelectorAll('.step-item'),
    stepContents: document.querySelectorAll('.step-content'),
    btnVoltar: document.getElementById('btnVoltar'),
    btnAvancar: document.getElementById('btnAvancar'),
    modalSucesso: document.getElementById('modalSucesso'),
    loadingOverlay: document.getElementById('loadingOverlay'),
    calendarDays: document.getElementById('calendarDays'),
    horariosContainer: document.getElementById('horariosContainer'),
    horariosGrid: document.getElementById('horariosGrid')
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initCalendar();
    initEventListeners();
});

function initApp() {
    // Carregar dados da barbearia
    loadBarbeariaInfo();
    loadServicos();
    loadProfissionais();
}

function loadBarbeariaInfo() {
    const barbearia = mockData.barbearia;
    state.barbearia = barbearia;

    document.getElementById('barbeariaNome').textContent = barbearia.nome;
    document.getElementById('barbeariaEndereco').textContent = `${barbearia.endereco} - ${barbearia.cidade}`;
    document.getElementById('barbeariaAvatar').textContent = barbearia.nome.substring(0, 2).toUpperCase();

    // Link para ligar
    document.getElementById('btnLigar').href = `tel:${barbearia.telefone}`;

    // Link para rota (Google Maps)
    const endereco = encodeURIComponent(`${barbearia.endereco}, ${barbearia.cidade}, ${barbearia.estado}`);
    document.getElementById('btnRota').href = `https://www.google.com/maps/search/?api=1&query=${endereco}`;
}

function loadServicos() {
    const grid = document.getElementById('servicosGrid');
    grid.innerHTML = '';

    mockData.servicos.forEach(servico => {
        const card = document.createElement('div');
        card.className = 'servico-card';
        card.dataset.id = servico.id;
        card.innerHTML = `
            <div class="servico-icon">
                <i data-lucide="${servico.icone}"></i>
            </div>
            <div class="servico-info">
                <h3>${servico.nome}</h3>
                <p>${servico.duracao} min</p>
            </div>
            <div class="servico-preco">R$ ${servico.preco}</div>
        `;
        card.addEventListener('click', () => selectServico(servico));
        grid.appendChild(card);
    });

    lucide.createIcons();
}

function loadProfissionais() {
    const grid = document.getElementById('profissionaisGrid');
    grid.innerHTML = '';

    // Opção "Qualquer profissional"
    const anyCard = document.createElement('div');
    anyCard.className = 'profissional-card';
    anyCard.dataset.id = 'any';
    anyCard.innerHTML = `
        <div class="profissional-avatar">
            <i data-lucide="shuffle"></i>
        </div>
        <div class="profissional-info">
            <h3>Qualquer Profissional</h3>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Primeiro disponível</p>
        </div>
    `;
    anyCard.addEventListener('click', () => selectProfissional({ id: 'any', nome: 'Qualquer Profissional' }));
    grid.appendChild(anyCard);

    // Profissionais
    mockData.profissionais.forEach(prof => {
        const card = document.createElement('div');
        card.className = 'profissional-card';
        card.dataset.id = prof.id;
        card.innerHTML = `
            <div class="profissional-avatar">${prof.nome.split(' ').map(n => n[0]).join('')}</div>
            <div class="profissional-info">
                <h3>${prof.nome}</h3>
                <div class="profissional-rating">
                    <i data-lucide="star" class="star-filled"></i>
                    <span>${prof.rating}</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => selectProfissional(prof));
        grid.appendChild(card);
    });

    lucide.createIcons();
}

function selectServico(servico) {
    state.servico = servico;

    document.querySelectorAll('.servico-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.servico-card[data-id="${servico.id}"]`).classList.add('selected');
}

function selectProfissional(profissional) {
    state.profissional = profissional;

    document.querySelectorAll('.profissional-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`.profissional-card[data-id="${profissional.id}"]`).classList.add('selected');
}

// Calendário
let currentDate = new Date();

function initCalendar() {
    renderCalendar();

    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Título do mês
    const months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    document.getElementById('currentMonth').textContent = `${months[month]} ${year}`;

    // Dias do mês
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let html = '';

    // Dias vazios no início
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // Dias do mês
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDate(date);
        const isToday = date.getTime() === today.getTime();
        const isPast = date < today;
        const isSelected = state.data === dateStr;

        let classes = 'calendar-day';
        if (isToday) classes += ' today';
        if (isPast) classes += ' disabled';
        if (isSelected) classes += ' selected';

        html += `<button class="${classes}" data-date="${dateStr}" ${isPast ? 'disabled' : ''}>${day}</button>`;
    }

    elements.calendarDays.innerHTML = html;

    // Event listeners para os dias
    document.querySelectorAll('.calendar-day:not(.empty):not(.disabled)').forEach(day => {
        day.addEventListener('click', () => selectDate(day.dataset.date));
    });
}

function formatDate(date) {
    return date.toISOString().split('T')[0];
}

function selectDate(dateStr) {
    state.data = dateStr;

    // Atualizar visual
    document.querySelectorAll('.calendar-day').forEach(day => {
        day.classList.remove('selected');
    });
    document.querySelector(`.calendar-day[data-date="${dateStr}"]`)?.classList.add('selected');

    // Carregar horários
    loadHorarios(dateStr);
}

function loadHorarios(dateStr) {
    elements.horariosContainer.style.display = 'block';
    elements.horariosGrid.innerHTML = '';

    const barbearia = state.barbearia;
    const servico = state.servico;

    // Gerar horários disponíveis
    const horaInicio = parseInt(barbearia.horario_abertura.split(':')[0]);
    const horaFim = parseInt(barbearia.horario_fechamento.split(':')[0]);
    const intervalo = barbearia.intervalo;
    const duracao = servico?.duracao || 30;

    // Horários ocupados do dia
    const ocupados = mockData.horariosOcupados.find(h => h.data === dateStr)?.horarios || [];

    for (let hora = horaInicio; hora < horaFim; hora++) {
        for (let min = 0; min < 60; min += intervalo) {
            const horario = `${hora.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
            const isOcupado = ocupados.includes(horario);
            const isSelected = state.horario === horario;

            const btn = document.createElement('button');
            btn.className = `horario-btn${isOcupado ? ' disabled' : ''}${isSelected ? ' selected' : ''}`;
            btn.textContent = horario;
            btn.disabled = isOcupado;

            if (!isOcupado) {
                btn.addEventListener('click', () => selectHorario(horario));
            }

            elements.horariosGrid.appendChild(btn);
        }
    }
}

function selectHorario(horario) {
    state.horario = horario;

    document.querySelectorAll('.horario-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    event.target.classList.add('selected');
}

// Navegação
function initEventListeners() {
    elements.btnVoltar.addEventListener('click', prevStep);
    elements.btnAvancar.addEventListener('click', nextStep);

    // Modal
    document.getElementById('btnNovoAgendamento').addEventListener('click', () => {
        elements.modalSucesso.classList.remove('active');
        resetState();
        goToStep(1);
    });

    // Inputs do cliente
    document.getElementById('clienteNome').addEventListener('input', (e) => {
        state.cliente.nome = e.target.value;
    });
    document.getElementById('clienteTelefone').addEventListener('input', (e) => {
        state.cliente.telefone = formatPhone(e.target.value);
        e.target.value = state.cliente.telefone;
    });
    document.getElementById('clienteEmail').addEventListener('input', (e) => {
        state.cliente.email = e.target.value;
    });
}

function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

function nextStep() {
    if (!validateStep(state.currentStep)) return;

    if (state.currentStep === 4) {
        submitAgendamento();
        return;
    }

    goToStep(state.currentStep + 1);
}

function prevStep() {
    if (state.currentStep > 1) {
        goToStep(state.currentStep - 1);
    }
}

function goToStep(step) {
    state.currentStep = step;

    // Atualizar indicadores
    elements.steps.forEach((el, index) => {
        el.classList.remove('active', 'completed');
        if (index + 1 < step) el.classList.add('completed');
        if (index + 1 === step) el.classList.add('active');
    });

    // Atualizar conteúdo
    elements.stepContents.forEach((el, index) => {
        el.classList.remove('active');
        if (index + 1 === step) el.classList.add('active');
    });

    // Atualizar botões
    elements.btnVoltar.style.display = step === 1 ? 'none' : 'flex';
    elements.btnAvancar.querySelector('span').textContent = step === 4 ? 'Confirmar Agendamento' : 'Continuar';

    // Atualizar resumo no step 4
    if (step === 4) {
        updateResumo();
    }

    // Reinicializar ícones
    lucide.createIcons();
}

function validateStep(step) {
    switch (step) {
        case 1:
            if (!state.servico) {
                alert('Selecione um serviço');
                return false;
            }
            break;
        case 2:
            if (!state.profissional) {
                alert('Selecione um profissional');
                return false;
            }
            break;
        case 3:
            if (!state.data || !state.horario) {
                alert('Selecione uma data e horário');
                return false;
            }
            break;
        case 4:
            if (!state.cliente.nome || !state.cliente.telefone) {
                alert('Preencha seu nome e telefone');
                return false;
            }
            break;
    }
    return true;
}

function updateResumo() {
    document.getElementById('resumoServico').textContent = state.servico?.nome || '-';
    document.getElementById('resumoProfissional').textContent = state.profissional?.nome || '-';

    // Formatar data
    if (state.data) {
        const date = new Date(state.data + 'T00:00:00');
        const options = { weekday: 'long', day: 'numeric', month: 'long' };
        document.getElementById('resumoData').textContent = date.toLocaleDateString('pt-BR', options);
    }

    document.getElementById('resumoHorario').textContent = state.horario || '-';
    document.getElementById('resumoPreco').textContent = `R$ ${state.servico?.preco || 0}`;
}

async function submitAgendamento() {
    showLoading(true);

    try {
        // Simular envio (substituir por chamada real ao Supabase)
        await new Promise(resolve => setTimeout(resolve, 2000));

        /*
        // Código real para Supabase:
        const { data, error } = await supabase
            .from('agendamentos')
            .insert({
                barbearia_id: state.barbearia.id,
                profissional_id: state.profissional.id === 'any' ? null : state.profissional.id,
                servico_id: state.servico.id,
                data: state.data,
                hora_inicio: state.horario,
                hora_fim: calcularHoraFim(state.horario, state.servico.duracao),
                preco: state.servico.preco,
                cliente_nome: state.cliente.nome,
                cliente_telefone: state.cliente.telefone,
                cliente_email: state.cliente.email,
                status: 'pendente'
            });

        if (error) throw error;
        */

        showLoading(false);
        showSuccessModal();

    } catch (error) {
        showLoading(false);
        alert('Erro ao agendar. Tente novamente.');
        console.error(error);
    }
}

function calcularHoraFim(horaInicio, duracao) {
    const [h, m] = horaInicio.split(':').map(Number);
    const totalMinutos = h * 60 + m + duracao;
    const horaFim = Math.floor(totalMinutos / 60);
    const minFim = totalMinutos % 60;
    return `${horaFim.toString().padStart(2, '0')}:${minFim.toString().padStart(2, '0')}`;
}

function showLoading(show) {
    elements.loadingOverlay.classList.toggle('active', show);
}

function showSuccessModal() {
    // Preencher modal
    const date = new Date(state.data + 'T00:00:00');
    const options = { weekday: 'long', day: 'numeric', month: 'long' };

    document.getElementById('modalData').textContent = date.toLocaleDateString('pt-BR', options);
    document.getElementById('modalHora').textContent = state.horario;
    document.getElementById('modalProfissional').textContent = state.profissional?.nome || '-';

    elements.modalSucesso.classList.add('active');
    lucide.createIcons();
}

function resetState() {
    state.servico = null;
    state.profissional = null;
    state.data = null;
    state.horario = null;
    state.cliente = { nome: '', telefone: '', email: '' };

    // Limpar seleções visuais
    document.querySelectorAll('.servico-card, .profissional-card, .calendar-day, .horario-btn').forEach(el => {
        el.classList.remove('selected');
    });

    // Limpar inputs
    document.getElementById('clienteNome').value = '';
    document.getElementById('clienteTelefone').value = '';
    document.getElementById('clienteEmail').value = '';

    // Esconder horários
    elements.horariosContainer.style.display = 'none';
}
