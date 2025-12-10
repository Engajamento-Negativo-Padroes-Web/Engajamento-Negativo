// força o navegador a rolar para o topo ao carregar
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const inicioAcesso = Date.now(); 
console.log("Feed iniciado.");

// stats
const estatisticas = {
    reacao: { positivo: 0, negativo: 0, neutro: 0 },
    interacao: { positivo: 0, negativo: 0, neutro: 0 },
    visualizacao: { positivo: 0, negativo: 0, neutro: 0 }
};

let timersVisualizacao = new Map();

// logica de interação

function contabilizarInteracao(tipo, classificacao) {
    if (estatisticas[tipo] && estatisticas[tipo][classificacao] !== undefined) {
        estatisticas[tipo][classificacao] += 1;
        console.log(`+1 ${tipo} (${classificacao})`);
    }
}

function toggleContent(content, button, classificacao) {
    if (button.textContent === "Ver mais") {
        contabilizarInteracao('interacao', classificacao);
        content.classList.remove('hideContent');
        content.classList.add('showContent');
        button.textContent = "Ver menos";
    } else {
        content.classList.remove('showContent');
        content.classList.add('hideContent');
        button.textContent = "Ver mais";
    }
}

function toggleImagem(imagem, container, classificacao, blur) {
    const isExpanded = imagem.classList.contains('expandedImage');
    if (isExpanded) {
        fecharImagem(imagem, container, blur);
    } else {
        contabilizarInteracao('interacao', classificacao);
        if (imagem.classList.contains('heavyBlur')) imagem.classList.remove('heavyBlur');
        imagem.classList.add('expandedImage');
        
        const closeBtn = document.createElement('div');
        closeBtn.className = 'close-btn';
        closeBtn.innerHTML = 'X';
        closeBtn.onclick = (e) => {
            e.stopPropagation();
            fecharImagem(imagem, container, blur);
        };
        document.body.appendChild(closeBtn);
        imagem.dataset.closeBtnId = 'close-btn-active';
        closeBtn.id = 'close-btn-active';
    }
}

function fecharImagem(imagem, container, blur) {
    if (!imagem || !imagem.classList.contains('expandedImage')) return;
    if (blur) imagem.classList.add('heavyBlur');
    imagem.classList.remove('expandedImage');
    const closeBtn = document.getElementById('close-btn-active');
    if (closeBtn) closeBtn.remove();
}

function criarInteracoes(post) {
    const container = document.createElement('div');
    container.className = 'post_interacoes';

    const criarBotaoInteracao = (classe, icone, chaveObjeto) => {
        const span = document.createElement('span');
        span.className = `interacao ${classe}`;
        
        
        span.textContent = `${icone} ${post[chaveObjeto]}`;

        span.onclick = () => {
            const jaClicou = span.classList.contains('interacao-ativa');

            if (jaClicou) {
               
                post[chaveObjeto]--; 
                span.classList.remove('interacao-ativa'); 
                
                
            } else {
                
                post[chaveObjeto]++;
                span.classList.add('interacao-ativa'); 
                
               
                contabilizarInteracao('reacao', post.classificacao);
            }

           
            span.textContent = `${icone} ${post[chaveObjeto]}`;
        };
        return span;
    };

    container.appendChild(criarBotaoInteracao('likes', '👍', 'likes'));
    container.appendChild(criarBotaoInteracao('dislikes', '👎', 'dislikes'));
    
    container.appendChild(criarBotaoInteracao('comentarios', '💬', 'comentarios'));

    return container;
}

function postTextoCurto(el, post) {
    el.innerHTML = `<h2>${post.autor}</h2><p>${post.conteudo}</p>`;
    el.appendChild(criarInteracoes(post));
}
function postTextoLongo(el, post) {
    el.innerHTML = `<h2>${post.autor}</h2>`;
    const div = document.createElement('div'); div.className = 'hideContent'; div.innerText = post.conteudo;
    el.appendChild(div);
    const btn = document.createElement('button'); btn.innerText = "Ver mais";
    btn.onclick = () => toggleContent(div, btn, post.classificacao);
    el.appendChild(btn);
    el.appendChild(criarInteracoes(post));
}
function postImagem(el, post) {
    el.innerHTML = `<h2>${post.autor}</h2><p>${post.conteudo}</p>`;
    const imgCont = document.createElement('div'); imgCont.className = 'imageContainer';
    
    const imgSrc = post.imagem ? post.imagem.src : '';
    const imgAlt = post.imagem ? post.imagem.alt : 'Imagem';
    const imgBlur = post.imagem ? post.imagem.blur : false;
    
    const img = document.createElement('img'); 
    img.src = "arquivos/" + imgSrc; 
    img.alt = imgAlt;
    
    img.onclick = () => toggleImagem(img, imgCont, post.classificacao, imgBlur);
    if(imgBlur) img.classList.add('heavyBlur');
    img.onerror = function(){this.src="https://placehold.co/600x400?text=Imagem+Nao+Encontrada"};
    imgCont.appendChild(img);
    el.appendChild(imgCont);
    el.appendChild(criarInteracoes(post));
}
function postLink(el, post) {
    el.innerHTML = `<h2>${post.autor}</h2><p>${post.conteudo}</p>`;
    const linkDiv = document.createElement('div');
    linkDiv.style = "border:1px solid var(--color-border);padding:10px;border-radius:5px;cursor:pointer;margin-top:10px";
    linkDiv.innerHTML = `<strong>${post.link.titulo}</strong><p style="font-size:0.8em;color:gray">${post.link.url}</p>`;
    linkDiv.onclick = () => { contabilizarInteracao('interacao', post.classificacao); window.open(post.link.url, '_blank'); };
    el.appendChild(linkDiv);
    el.appendChild(criarInteracoes(post));
}

function construirPost(el, post) {
    el.id = "post_" + post.id;
    el.dataset.classificacao = post.classificacao;
    if (post.tipo === 'texto_curto') postTextoCurto(el, post);
    else if (post.tipo === 'texto_longo') postTextoLongo(el, post);
    else if (post.tipo === 'imagem') postImagem(el, post);
    else if (post.tipo === 'link') postLink(el, post);
}

// focus

function iniciarObservadorDeFoco() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const post = entry.target;
            const postId = post.id;
            
            if (entry.isIntersecting) {
                post.classList.add('post-visible');
                
                const timerId = setTimeout(() => {
                    const classif = post.dataset.classificacao;
                    if (classif) contabilizarInteracao('visualizacao', classif);
                }, 5000); 
                timersVisualizacao.set(postId, timerId);

            } else {
                post.classList.remove('post-visible');
                
                if (timersVisualizacao.has(postId)) {
                    clearTimeout(timersVisualizacao.get(postId));
                    timersVisualizacao.delete(postId);
                }

                const expandedImg = post.querySelector('.expandedImage');
                if (expandedImg) {
                    const container = post.querySelector('.imageContainer');
                    fecharImagem(expandedImg, container, true); 
                }
            }
        });
    }, {
        root: null,
        rootMargin: '-40% 0px -40% 0px', 
        threshold: 0
    });

    document.querySelectorAll('.post').forEach(post => observer.observe(post));
}

function popularFeed(posts) {
    const feedBody = document.getElementById('feed_body');
    feedBody.innerHTML = '';
    
    // adiciona os posts como divs
    posts.forEach((post) => {
        const div = document.createElement('div');
        construirPost(div, post);
        div.classList.add('post'); 
        feedBody.appendChild(div);
    });
    
    iniciarObservadorDeFoco();
    
    setTimeout(() => { window.scrollTo(0, 0); }, 50);
}

function irParaResultado() {
    const tempoTotalSegundos = Math.floor((Date.now() - inicioAcesso) / 1000);
    localStorage.setItem("menteConectada_stats", JSON.stringify(estatisticas));
    localStorage.setItem("menteConectada_tempoTotal", tempoTotalSegundos);
    window.location.href = "../results/index.html";
}

function sairDoExperimentoCedo() {
    localStorage.removeItem("menteConectada_stats");
    localStorage.removeItem("menteConectada_tempoTotal");
    window.location.href = "../home/index.html";
}

// fetch json
async function carregarPosts() {
    try {
        const response = await fetch('arquivos/conteudo_posts.json');
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const dados = await response.json();
        
        
        popularFeed(dados.posts);

    } catch (error) {
        console.error("Erro ao carregar os posts:", error);
        
        document.getElementById('feed_body').innerHTML = '<p style="color:white;text-align:center;">Erro ao carregar o feed.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    
    carregarPosts();
});