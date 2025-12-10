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
  if (timeElement) animateValue(timeElement, 0, tempoTotal, 1500, " seg");

  
  const calcPeso = (tipo, cat) => (stats[tipo] && stats[tipo][cat] ? stats[tipo][cat] : 0);

  const ptsNegativos = calcPeso('visualizacao', 'negativo') + (calcPeso('interacao', 'negativo') * 2) + (calcPeso('reacao', 'negativo') * 2);
  const ptsPositivos = calcPeso('visualizacao', 'positivo') + (calcPeso('interacao', 'positivo') * 2) + (calcPeso('reacao', 'positivo') * 2);
  const ptsNeutros = calcPeso('visualizacao', 'neutro') + (calcPeso('interacao', 'neutro') * 2) + (calcPeso('reacao', 'neutro') * 2);

  const totalGeral = ptsNegativos + ptsPositivos + ptsNeutros;

  
  const pctNegativo = totalGeral > 0 ? Math.round((ptsNegativos / totalGeral) * 100) : 0;
  const pctPositivo = totalGeral > 0 ? Math.round((ptsPositivos / totalGeral) * 100) : 0;
  const pctNeutro = totalGeral > 0 ? Math.round((ptsNeutros / totalGeral) * 100) : 0;

  
  atualizarCarinhas(pctPositivo, pctNeutro, pctNegativo);
  atualizarGrafico(pctPositivo, pctNeutro, pctNegativo, totalGeral);
  
  
  atualizarComparativo(pctNegativo);

  
  let emocionalScore = 0;
  if (totalGeral > 0) {
      
      const saldoLiquido = ptsPositivos - ptsNegativos;
      
      emocionalScore = (saldoLiquido / totalGeral) * 10;
  }
  
  const scoreFormatado = emocionalScore.toFixed(1);
  const scoreFinal = (emocionalScore > 0 ? "+" : "") + scoreFormatado;

  const scoreElement = document.getElementById("score-value");
  
  if (scoreElement) animateValue(scoreElement, 0, emocionalScore, 2000, "", scoreFinal);
}

function atualizarCarinhas(pos, neu, neg) {
    const elPos = document.getElementById('pct-pos');
    const elNeu = document.getElementById('pct-neu');
    const elNeg = document.getElementById('pct-neg');

    if (elPos) elPos.innerText = `${pos}%`;
    if (elNeu) elNeu.innerText = `${neu}%`;
    if (elNeg) elNeg.innerText = `${neg}%`;
}


function atualizarGrafico(pos, neu, neg, total) {
    const chart = document.getElementById('consumption-chart');
    const totalEl = document.getElementById('total-interactions');
    
    if (chart && totalEl) {
        totalEl.innerText = total;

        const degPos = (pos / 100) * 360;
        const degNeu = (neu / 100) * 360;
        

        const gradient = `conic-gradient(
            #00ff7f 0deg ${degPos}deg,
            #aaaaaa ${degPos}deg ${degPos + degNeu}deg,
            #ff4d4d ${degPos + degNeu}deg 360deg
        )`;

        setTimeout(() => {
            chart.style.background = gradient;
        }, 100);
    }
}


function atualizarComparativo(pctNegativoUsuario) {
    const userBar = document.getElementById('user-comp-bar');
    const userVal = document.getElementById('user-comp-val');
    const message = document.getElementById('comp-message');
    
    const MEDIA_GERAL = 55; 

    if (userBar && userVal) {
        setTimeout(() => {
            userBar.style.width = `${pctNegativoUsuario}%`;
        }, 300);
        userVal.innerText = `${pctNegativoUsuario}%`;

        if (pctNegativoUsuario > MEDIA_GERAL) {
            userBar.style.background = "linear-gradient(90deg, #ff4d4d, #ff1a1a)";
            message.innerText = ` Você consumiu mais conteúdo negativo (${pctNegativoUsuario}%) do que a média (${MEDIA_GERAL}%).`;
            message.style.color = "#ff8080";
        } else if (pctNegativoUsuario < (MEDIA_GERAL - 10)) {
            userBar.style.background = "linear-gradient(90deg, #00b359, #00ff7f)";
            message.innerText = ` Ótimo! Seu consumo negativo (${pctNegativoUsuario}%) é bem menor que a média.`;
            message.style.color = "#80ffbf";
        } else {
            userBar.style.background = "linear-gradient(90deg, #5A2E8C, #8A4FD1)";
            message.innerText = `Você está na média (${MEDIA_GERAL}%) de consumo das redes sociais.`;
            message.style.color = "#aaa";
        }
    }
}

function animateValue(obj, start, end, duration, suffix = "", finalString = null) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        if (progress < 1) {
            let currentValue = (progress * (end - start) + start);
            let displayValue = currentValue.toFixed(0); 
            
            if (finalString) displayValue = currentValue.toFixed(1);
            
            
            let sign = (finalString && currentValue > 0) ? "+" : "";
            
            obj.innerHTML = sign + displayValue + suffix;
            window.requestAnimationFrame(step);
        } else {
            
            obj.innerHTML = finalString || Math.round(end) + suffix;
        }
    };
    window.requestAnimationFrame(step);
}