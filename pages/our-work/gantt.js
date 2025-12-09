// ====== Seus dados (com ordenação por início, depois fim, depois nome) ======
const sampleTasks = [
  { nome: 'Configuração do ambiente', inicio: '2025-10-01', fim: '2025-10-10', responsavel: 'Artur Yamada e Thiago Marcelino', tipo: 'Infraestrutura' },
  { nome: 'Revisão por pares - Conteúdo', inicio: '2025-11-19', fim: '2025-11-23', responsavel: 'Letícia Amaro', tipo: 'Revisão' },
  { nome: 'Revisão por pares - Código', inicio: '2025-11-19', fim: '2025-11-23', responsavel: 'Artur Yamada e Thiago Marcelino', tipo: 'Revisão' },
  { nome: 'Revisão por pares - Estilo', inicio: '2025-11-19', fim: '2025-11-23', responsavel: 'Roberto Vieira', tipo: 'Revisão' },
  { nome: 'Revisão por pares - Relatório', inicio: '2025-11-22', fim: '2025-11-26', responsavel: 'Eduardo Kendy e Vinicius Kureishi', tipo: 'Documentação' },
  { nome: 'Desenvolvimento parcial - Relatório', inicio: '2025-11-07', fim: '2025-11-12', responsavel: 'Artur Yamada, Eduardo Kendy, Leticia Amaro, Roberto Vieira, Thiago Marcelino e Vinicius Kureishi', tipo: 'Documentação' },
  { nome: 'Design do Header/Footer', inicio: '2025-10-10', fim: '2025-10-13', responsavel: 'Thiago Marcelino', tipo: 'Design' },
  { nome: 'Página Home', inicio: '2025-10-10', fim: '2025-11-10', responsavel: 'Thiago Marcelino', tipo: 'Desenvolvimento' },
  { nome: 'Página informação adicional', inicio: '2025-10-15', fim: '2025-11-05', responsavel: 'Letícia Amaro e Vinicius Kureishi', tipo: 'Desenvolvimento' },
  { nome: 'Página de feedback', inicio: '2025-10-15', fim: '2025-11-15', responsavel: 'Artur Yamada', tipo: 'Desenvolvimento' },
  { nome: 'Página Nosso Trabalho', inicio: '2025-10-15', fim:'2025-11-15', responsavel: 'Roberto Vieira', tipo: 'Desenvolvimento' },
  { nome: 'Página Sobre Nós', inicio: '2025-10-15', fim: '2025-11-15', responsavel: 'Eduardo Kendy', tipo: 'Desenvolvimento' },
  { nome: 'População do Feed', inicio:'2025-12-03', fim:'2025-12-10', responsavel: 'Artur Yamada e Roberto Vieira', tipo: 'Conteúdo' },
  { nome: 'Página Feed', inicio: '2025-11-01', fim: '2025-12-07', responsavel: 'Artur Yamada, Eduardo Kendy e Thiago Marcelino', tipo: 'Desenvolvimento' },
  { nome: 'Página de Resultados', inicio: '2025-11-15', fim: '2025-12-10', responsavel: 'Letícia Amaro e Vinicius Kureishi', tipo: 'Desenvolvimento' },
  { nome: 'Relatório Final', inicio: '2025-12-03', fim: '2025-12-10', responsavel: 'Eduardo Kendy e Roberto Vieira', tipo: 'Documentação' },
];
sampleTasks.sort((a, b) =>
  a.inicio.localeCompare(b.inicio) ||
  a.fim.localeCompare(b.fim) ||
  a.nome.localeCompare(b.nome)
);

const VISIBLE_RANGE = window.__VISIBLE_RANGE__ || { start: '2025-10-01', end: '2025-12-13' };

const PERSON_COLORS = {};
const getCssVar = (name, fallback) =>
  (getComputedStyle(document.documentElement).getPropertyValue(name) || '').trim() || fallback;
const ACCENT = getCssVar('--color-accent', '#0ea5e9');

const TYPE_COLORS = {
  'Desenvolvimento': '#3b82f6',
  'Design':          '#a855f7',
  'Infraestrutura':  '#475569',
  'Revisão':         '#10b981',
  'Conteúdo':        '#f43f5e',
  'Documentação':    '#f59e0b',
};

// Cor de fallback (cinza claro) para tipos desconhecidos
const DEFAULT_COLOR = '#94a3b8'; 

function colorFor(type) {
  const key = String(type || '').trim();
  
  // Retorna a cor mapeada OU a cor padrão se não encontrar
  return TYPE_COLORS[key] || DEFAULT_COLOR;
}

// Helper atualizado para definir cor por TIPO manualmente se quiser
window.setTypeColor = (type, hex)=>{ TYPE_COLORS[type]=hex; };
// =========================
// Datas / helpers
// =========================
const DAY=86400000;
const parseISO = (d)=> new Date(d+'T00:00:00');
const startOfDay = (d)=>{ const x=new Date(d); x.setHours(0,0,0,0); return x; };
const addDays = (d,n)=>{ const x=new Date(d); x.setDate(x.getDate()+n); return x; };
const startOfWeekMonday = (d)=>{ const x=new Date(d); const w=(x.getDay()+6)%7; x.setDate(x.getDate()-w); x.setHours(0,0,0,0); return x; };
const endOfWeekSunday   = (d)=>{ const s=startOfWeekMonday(d); const e=new Date(s); e.setDate(s.getDate()+6); e.setHours(23,59,59,999); return e; };
const daysDiff = (a,b)=> Math.floor((startOfDay(a)-startOfDay(b))/DAY);
const monthStart = (d)=> new Date(d.getFullYear(), d.getMonth(), 1);
const monthEnd   = (d)=> new Date(d.getFullYear(), d.getMonth()+1, 0);
const monthLabel = (d)=> d.toLocaleDateString('pt-BR',{month:'long'});
const cap = (s)=> s.charAt(0).toUpperCase()+s.slice(1);

//quantas semanas tem entre as duas datas
function weeksBetween(rangeStart, rangeEnd){
  const start = startOfWeekMonday(rangeStart);
  const end   = endOfWeekSunday(rangeEnd);
  const out=[];
  for(let i=0,cur=start; cur<=end; i++, cur=addDays(cur,7)){
    out.push({ index:i, start:new Date(cur), end:addDays(cur,6) });
  }
  return out;
}
//quantos meses tem entre as duas datas

function monthsBetweenDays(firstDay, lastDay){
  const out=[];
  let cur = monthStart(firstDay);
  while (cur <= lastDay){
    const mStart = new Date(Math.max(monthStart(cur), firstDay));
    const mEnd   = new Date(Math.min(monthEnd(cur),   lastDay));
    out.push({ month: new Date(cur), start:mStart, end:mEnd });
    cur = new Date(cur.getFullYear(), cur.getMonth()+1, 1);
  }
  return out;
}

function renderGantt(tasks){
  const header = document.getElementById('header');
  const body   = document.getElementById('body');
  const legend = document.getElementById('legend');

  if(!Array.isArray(tasks) || tasks.length===0){
    header.innerHTML = '';
    body.innerHTML   = '<div style="padding:16px;color:#64748b">Sem tarefas</div>';
    if (legend) legend.innerHTML='';
    return;
  }

  const data = tasks.map(t => {
    const tipoItem = String(t.tipo ?? 'Geral').trim();
    return {
      nome: String(t.nome ?? t.name ?? '').trim(),
      inicio: parseISO(t.inicio ?? t.start),
      fim:    parseISO(t.fim    ?? t.end),
      responsavel: String(t.responsavel ?? t.pessoa ?? t.owner ?? 'Responsável').trim(),
      tipo: tipoItem,
      color: colorFor(tipoItem) 
    };
  });

  // Janela visível
  const rangeStart = startOfDay(parseISO(VISIBLE_RANGE.start));
  const rangeEnd   = startOfDay(parseISO(VISIBLE_RANGE.end));
  const firstDay   = rangeStart;
  const lastDay    = rangeEnd;
  const totalDays  = daysDiff(lastDay, firstDay) + 1;

  // Constrói Grid
  const cols = `var(--col-task) repeat(${totalDays}, var(--day-width, 1fr))`;
  header.style.gridTemplateColumns = cols;
  header.style.gridTemplateRows    = '64px 40px';
  header.innerHTML = '';

  const left = document.createElement('div');
  left.className = 'head-tasks sticky-left';
  left.textContent = 'Tarefas';
  header.appendChild(left);

  const monthBlocks = monthsBetweenDays(firstDay, lastDay);

  const monthColors = ['#e0f2fe', '#f0f9ff', '#e0e7ff', '#ecfeff']; 
  const monthText   = ['#0369a1', '#0c4a6e', '#3730a3', '#0e7490'];

  monthBlocks.forEach((m,i)=>{
    const startIdx = Math.max(0, daysDiff(m.start, firstDay));
    const endIdx   = Math.min(totalDays-1, daysDiff(m.end, firstDay));
    
    const el = document.createElement('div');
    el.className = 'month-badge';
    el.style.background = monthColors[i % monthColors.length];
    el.style.color      = monthText[i % monthText.length];
    
    el.style.gridRow = '1 / 2';
    el.style.gridColumn = `${2+startIdx} / ${2+endIdx+1}`;
    el.textContent = cap(monthLabel(m.month));
    header.appendChild(el);
  });

  // Semanas
  const weeks = weeksBetween(firstDay, lastDay);
  weeks.forEach((w, i) => {
    const sIdx = Math.max(0, Math.min(totalDays-1, daysDiff(w.start, firstDay)));
    const eIdx = Math.max(0, Math.min(totalDays-1, daysDiff(w.end,   firstDay)));
    if (eIdx < 0 || sIdx > totalDays-1 || eIdx < sIdx) return;
    
    const wk = document.createElement('div');
    wk.className = 'tw-badge';
    wk.style.gridRow = '2 / 3';
    wk.style.gridColumn = `${2+sIdx} / ${2+eIdx+1}`;
    wk.textContent = `Wk${i+1}`;
    header.appendChild(wk);
  });

  // Corpo
  body.style.gridTemplateColumns = cols;
  body.innerHTML = '';

  data.forEach((t, idx) => {
    const rowStart = idx+1, rowEnd = idx+2;

    // Nome da Tarefa
    const chip = document.createElement('div');
    chip.className = 'task-chip';
    chip.style.gridColumn = '1 / 2';
    chip.style.gridRow    = `${rowStart} / ${rowEnd}`;
    chip.textContent = t.nome;
    chip.title = t.nome;
    body.appendChild(chip);

    // Lógica de posição
    const s = startOfDay(t.inicio);
    const e = startOfDay(t.fim);
    if (e < firstDay || s > lastDay) return;

    const start = s < firstDay ? firstDay : s;
    const end   = e > lastDay  ? lastDay  : e;

    const startIdx = Math.max(0, Math.min(totalDays-1, daysDiff(start, firstDay)));
    const endIdx   = Math.max(0, Math.min(totalDays-1, daysDiff(end,   firstDay)));
    if (endIdx < startIdx) return;

    const gcStart = 2 + startIdx;
    const gcEnd   = 2 + endIdx + 1;
    
    // --- CORREÇÃO 2: Usar a cor do TIPO (que já calculamos) ---
    const color = t.color; 

    const durationDays = endIdx - startIdx + 1;
    
    // Renderiza Ponto ou Barra
    const el = document.createElement('div');
    el.style.background = color;
    el.style.gridRow    = `${rowStart} / ${rowEnd}`;
    el.title = `[${t.tipo}] ${t.nome} (${t.responsavel})`; // Tooltip útil

    if (durationDays === 1){
      el.className = 'dot';
      el.style.gridColumn = `${gcStart} / ${gcStart+1}`;
    } else {
      el.className = 'bar';
      el.style.gridColumn = `${gcStart} / ${gcEnd}`;
    }
    body.appendChild(el);
  });

  // Colunas de fundo (semanas)
  weeks.forEach((w,i)=>{
    const sIdx = Math.max(0, Math.min(totalDays-1, daysDiff(w.start, firstDay)));
    const eIdx = Math.max(0, Math.min(totalDays-1, daysDiff(w.end,   firstDay)));
    if (eIdx < 0 || sIdx > totalDays-1 || eIdx < sIdx) return;
    const col = document.createElement('div');
    col.className = 'wk-col' + (i%2 ? ' alt' : '');
    col.style.gridColumn = `${2+sIdx} / ${2+eIdx+1}`;
    col.style.gridRow    = `1 / span ${data.length}`;
    body.appendChild(col);
  });

  // --- CORREÇÃO 3: Legenda baseada em TIPOS, não pessoas ---
  if (legend){
    // Pega lista única de tipos
    const tipos = Array.from(new Set(data.map(t=>t.tipo))).sort();
    
    legend.innerHTML = '';
    tipos.forEach(tipo => {
      const item = document.createElement('div');
      item.className = 'legend-item';
      
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = colorFor(tipo); // Cor do tipo
      
      const tx = document.createElement('div');
      tx.textContent = tipo;
      
      item.appendChild(sw); item.appendChild(tx);
      legend.appendChild(item);
    });
  }
}

// API
window.renderGantt = renderGantt;
window.setTasks    = (tasks)=> renderGantt(tasks);

// Render inicial
renderGantt(window.__TASKS__ || sampleTasks);