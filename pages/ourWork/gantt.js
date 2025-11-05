// ====== Dados (com ordenação por início, depois fim, depois nome) ======
const sampleTasks = [
 // { nome: 'Especificação do projeto', inicio: '2025-09-01', fim: '2025-09-20', responsavel: 'Todos' },
  { nome: 'Configuração do ambiente', inicio: '2025-10-15', fim: '2025-10-18', responsavel: 'Artur Yamada e Thiago Marcelino' },
  //{ nome: 'Design dos layouts inicial', inicio: '2025-09-01', fim: '2025-09-10', responsavel: 'Artur Yamada' },
  { nome: 'Design do Header/Footer', inicio: '2025-10-10', fim: '2025-10-13', responsavel: 'Thiago Marcelino' },
  { nome: 'Página inicial', inicio: '2025-10-10', fim: '2025-10-29', responsavel: 'Thiago Marcelino' },
  { nome: 'Página informação adicional', inicio: '2025-10-15', fim: '2025-10-29', responsavel: 'Letícia Amaro e Vinicius Kureishi' },
  { nome: 'Página de feedback', inicio: '2025-10-15', fim: '2025-10-22', responsavel: 'Artur Yamada' },
  { nome: 'Página Nosso Trabalho', inicio: '2025-10-15', fim:'2025-11-01', responsavel: 'Roberto'},
  { nome: 'Página Sobre Nós', inicio: '2025-10-15', fim: '2025-10-25', responsavel: 'Eduardo Kendy' },
];
//sorted array
sampleTasks.sort((a, b) =>
  a.inicio.localeCompare(b.inicio) ||
  a.fim.localeCompare(b.fim) ||
  a.nome.localeCompare(b.nome)
);

// Faixa fixa (pode sobrescrever via window.__VISIBLE_RANGE__ antes de carregar este arquivo)
const VISIBLE_RANGE = window.__VISIBLE_RANGE__ || { start: '2025-10-01', end: '2025-11-30' };

// =========================
// Paleta (derivada do --color-accent do seu tema)
// =========================
const PERSON_COLORS = {};
const getCssVar = (name, fallback) =>
  (getComputedStyle(document.documentElement).getPropertyValue(name) || '').trim() || fallback;
const ACCENT = getCssVar('--color-accent', '#0ea5e9');

function parseColorToRgb(color){
  if(!color) return {r:14,g:165,b:233};
  const c = color.trim().toLowerCase();
  if(c.startsWith('#')){
    const hex = c.length===4 ? '#' + c[1]+c[1]+c[2]+c[2]+c[3]+c[3] : c;
    const n = parseInt(hex.slice(1), 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  }
  if(c.startsWith('rgb')){
    const s=c.indexOf('('), e=c.indexOf(')', s+1);
    const [r,g,b] = c.slice(s+1,e).split(',').map(v=>parseInt(v.trim(),10));
    return { r:r||0, g:g||0, b:b||0 };
  }
  return {r:14,g:165,b:233};
}
function rgbToHsl({r,g,b}){
  r/=255; g/=255; b/=255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0; const l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      default: h=(r-g)/d+4;
    }
    h/=6;
  }
  return {h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100)};
}
function hslToHex(h,s,l){
  s/=100; l/=100;
  const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
  let r=0,g=0,b=0;
  if(h<60){r=c;g=x;b=0}
  else if(h<120){r=x;g=c;b=0}
  else if(h<180){r=0;g=c;b=x}
  else if(h<240){r=0;g=x;b=c}
  else if(h<300){r=x;g=0;b=c}
  else {r=c;g=0;b=x}
  r=Math.round((r+m)*255).toString(16).padStart(2,'0');
  g=Math.round((g+m)*255).toString(16).padStart(2,'0');
  b=Math.round((b+m)*255).toString(16).padStart(2,'0');
  return `#${r}${g}${b}`;
}
function genPaletteFromAccent(n=12){
  const {h,s,l}=rgbToHsl(parseColorToRgb(ACCENT));
  const out=[]; const shifts=[-40,-20,0,20,40,70,140,200];
  for(let i=0;i<n;i++){
    const hh=(h+shifts[i%shifts.length]+360)%360;
    const ll=Math.min(80, Math.max(35, l + (i%2? -10: +5)));
    const ss=Math.min(90, Math.max(45, s + (i%3===0? 5: -5)));
    out.push(hslToHex(hh, ss, ll));
  }
  return out;
}
const PALETTE = genPaletteFromAccent(12);
function colorFor(person){
  if (PERSON_COLORS[person]) return PERSON_COLORS[person];
  let h=0; for(let i=0;i<person.length;i++) h=(h*31+person.charCodeAt(i))>>>0;
  const c = PALETTE[h % PALETTE.length];
  PERSON_COLORS[person] = c;
  return c;
}
window.setPersonColor = (p, hex)=>{ PERSON_COLORS[p]=hex; };

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

// =========================
// Render Gantt (grade DIÁRIA + cabeçalho por mês/semana)
// =========================
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

  // Normaliza dados
  const data = tasks.map(t => ({
    nome: String(t.nome ?? t.name ?? '').trim(),
    inicio: parseISO(t.inicio ?? t.start),
    fim:    parseISO(t.fim    ?? t.end),
    responsavel: String(t.responsavel ?? t.pessoa ?? t.owner ?? t.dono ?? 'Responsável').trim()
  }));

  // Janela visível (respeita exatamente as datas pedidas; grade DIÁRIA)
  const rangeStart = startOfDay(parseISO(VISIBLE_RANGE.start));
  const rangeEnd   = startOfDay(parseISO(VISIBLE_RANGE.end));
  const firstDay   = rangeStart;
  const lastDay    = rangeEnd;
  const totalDays  = daysDiff(lastDay, firstDay) + 1;

  // Constrói cabeçalho
  const cols = `var(--col-task) repeat(${totalDays}, 1fr)`;
  header.style.gridTemplateColumns = cols;
  header.style.gridTemplateRows    = '64px 40px';
  header.innerHTML = '';

  // Coluna "Tarefas"
  const left = document.createElement('div');
  left.className = 'head-tasks sticky-left';
  left.textContent = 'Tarefas';
  header.appendChild(left);

  // Meses (primeira linha do header)
  const monthBlocks = monthsBetweenDays(firstDay, lastDay);
  const themesHues = (() => {
    const base = rgbToHsl(parseColorToRgb(ACCENT)).h;
    const hues = [base, (base+40)%360, (base+80)%360, (base+120)%360];
    return hues.map(h=>({ bg:hslToHex(h,75,55), text:'#fff' }));
  })();
  monthBlocks.forEach((m,i)=>{
    const startIdx = Math.max(0, daysDiff(m.start, firstDay));
    const endIdx   = Math.min(totalDays-1, daysDiff(m.end, firstDay));
    const el = document.createElement('div');
    el.className = 'month-badge';
    const th = themesHues[i % themesHues.length];
    el.style.background = th.bg; el.style.color = th.text;
    el.style.gridRow = '1 / 2';
    el.style.gridColumn = `${2+startIdx} / ${2+endIdx+1}`;
    el.textContent = cap(monthLabel(m.month));
    header.appendChild(el);
  });

  // Semanas (segunda linha do header): cada badge = 1 semana (7 dias)
  const weeks = weeksBetween(firstDay, lastDay);
  weeks.forEach((w, i) => {
    // Clamp para o range exato (firstDay..lastDay)
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

  // Corpo (linhas = tarefas, colunas = DIAS)
  body.style.gridTemplateColumns = cols;
  body.innerHTML = '';

  data.forEach((t, idx) => {
    const rowStart = idx+1, rowEnd = idx+2;

    // Chip com o nome da tarefa, col fixa
    const chip = document.createElement('div');
    chip.className = 'task-chip';
    chip.style.gridColumn = '1 / 2';
    chip.style.gridRow    = `${rowStart} / ${rowEnd}`;
    chip.textContent = t.nome;
    chip.title = t.nome;
    body.appendChild(chip);

    // Clamp da tarefa à janela
    const s = startOfDay(t.inicio);
    const e = startOfDay(t.fim);
    if (e < firstDay || s > lastDay) return;

    const start = s < firstDay ? firstDay : s;
    const end   = e > lastDay  ? lastDay  : e;

    const startIdx = Math.max(0, Math.min(totalDays-1, daysDiff(start, firstDay)));
    const endIdx   = Math.max(0, Math.min(totalDays-1, daysDiff(end,   firstDay)));
    if (endIdx < startIdx) return;

    const gcStart = 2 + startIdx;
    const gcEnd   = 2 + endIdx + 1; // exclusivo
    const color   = colorFor(t.responsavel);

    const durationDays = endIdx - startIdx + 1;
    if (durationDays === 1){
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.style.background  = color;
      dot.style.gridColumn  = `${gcStart} / ${gcStart+1}`;
      dot.style.gridRow     = `${rowStart} / ${rowEnd}`;
      dot.title = `${t.responsavel} • ${t.nome}`;
      body.appendChild(dot);
    } else {
      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.style.background = color;
      bar.style.gridColumn = `${gcStart} / ${gcEnd}`;
      bar.style.gridRow    = `${rowStart} / ${rowEnd}`;
      bar.title = `${t.responsavel} • ${t.nome}`;
      body.appendChild(bar);
    }
  });

  // Colunas de fundo por semana (faixas alternadas)
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

  // Legenda (responsáveis)
  if (legend){
    const pessoas = Array.from(new Set(data.map(t=>t.responsavel)));
    legend.innerHTML = '';
    pessoas.forEach(p=>{
      const item = document.createElement('div');
      item.className = 'legend-item';
      const sw = document.createElement('div');
      sw.className = 'legend-swatch';
      sw.style.background = colorFor(p);
      const tx = document.createElement('div');
      tx.textContent = p;
      item.appendChild(sw); item.appendChild(tx);
      legend.appendChild(item);
    });
  }
}

// API simples
window.renderGantt = renderGantt;
window.setTasks   = (tasks)=> renderGantt(tasks);

// Render inicial com seus dados
renderGantt(window.__TASKS__ || sampleTasks);
