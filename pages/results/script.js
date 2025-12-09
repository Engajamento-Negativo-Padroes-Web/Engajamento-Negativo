
document.addEventListener("DOMContentLoaded", () => {
  carregarResultados();
});

function carregarResultados() {
  const statsRaw = localStorage.getItem("menteConectada_stats");
  const tempoTotal = parseInt(localStorage.getItem("menteConectada_tempoTotal") || 0);

  const stats = statsRaw ? JSON.parse(statsRaw) : { 
    interacao: { positivo: 0, negativo: 0, neutro: 0 },
    reacao: { positivo: 0, negativo: 0, neutro: 0 },
    visualizacao: { positivo: 0, negativo: 0, neutro: 0 }
  };

  
  const timeElement = document.getElementById("time-wasted");
  if (timeElement) {
    animateValue(timeElement, 0, tempoTotal, 1500, " seg");
  }

  
  
  const calcPeso = (tipo, cat) => (stats[tipo] && stats[tipo][cat] ? stats[tipo][cat] : 0);

  const pontosNegativos = calcPeso('visualizacao', 'negativo') + (calcPeso('interacao', 'negativo') * 2) + (calcPeso('reacao', 'negativo') * 2);
  const pontosPositivos = calcPeso('visualizacao', 'positivo') + (calcPeso('interacao', 'positivo') * 2) + (calcPeso('reacao', 'positivo') * 2);
  const pontosNeutros = calcPeso('visualizacao', 'neutro') + (calcPeso('interacao', 'neutro') * 2) + (calcPeso('reacao', 'neutro') * 2);

  const totalPontos = pontosNegativos + pontosPositivos + pontosNeutros;

  
  const pctNegativo = totalPontos > 0 ? Math.round((pontosNegativos / totalPontos) * 100) : 0;
  const pctPositivo = totalPontos > 0 ? Math.round((pontosPositivos / totalPontos) * 100) : 0;
  const pctNeutro = totalPontos > 0 ? Math.round((pontosNeutros / totalPontos) * 100) : 0;

  atualizarListaConteudo(pctNegativo, pctPositivo, pctNeutro);

  
  let nivelEstresse = pctNegativo;
  const progressBar = document.querySelector(".progress-bar");
  
  if (progressBar) {
    setTimeout(() => {
      progressBar.style.width = `${nivelEstresse}%`;
      progressBar.parentElement.setAttribute("aria-valuenow", nivelEstresse);
      
      if (nivelEstresse < 30) progressBar.style.backgroundColor = "#00ff7f"; 
      else if (nivelEstresse < 60) progressBar.style.backgroundColor = "#ffd700"; 
      else progressBar.style.backgroundColor = "#ff4d4d"; 
    }, 300);
  }

  
  let score = 0;

  if (totalPontos > 0) {
      const tetoTempo = 60; 
      let fatorProgressao = Math.min(tempoTotal, tetoTempo) / tetoTempo;
      
      
      score = pctNegativo * fatorProgressao;
      
      
      if (tempoTotal < 10) score = score * 0.5;

  } else if (tempoTotal > 15) {
      
      score = Math.min((tempoTotal / 60) * 100, 100);
  }

  score = Math.round(score);

  const scoreElement = document.getElementById("score-value");
  
  if (scoreElement) animateValue(scoreElement, 0, score, 2000, "%");
}

function atualizarListaConteudo(neg, pos, neu) {
  const lista = document.querySelector(".stat-list");
  if (lista) {
    lista.innerHTML = `
      <li><span aria-hidden="true">🔴</span> ${neg}% Conteúdo Negativo</li>
      <li><span aria-hidden="true">🟡</span> ${pos}% Conteúdo Positivo</li>
      <li><span aria-hidden="true">🟢</span> ${neu}% Conteúdo Neutro</li>
    `;
  }
}

function animateValue(obj, start, end, duration, suffix = "") {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start) + suffix;
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}
