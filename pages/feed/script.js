estatisticas = {
    // reacao se refere a like/dislike
    reacao: {
        positivo: 0,
        negativo: 0,
        neutro: 0,
    },
    // tempo se refere ao tempo em cada post
    tempo: {
        positivo: 0,
        negativo: 0,
        neutro: 0,
    },
    // interacao se refere a acao esperada para cada tipo de post (ver mais, clicar no link, abrir imagem, etc)
    interacao: {
        positivo: 0,
        negativo: 0,
        neutro: 0,
    }
}
// TODO finalizar contabilizacao das estatisticas

function toggleContent(content, button, classificacao) {
    if (button.textContent === "Ver mais") {
        // exemplo de contabilizacao de interacao
        estatisticas.interacao[classificacao] += 1;
        console.log(estatisticas.interacao);
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
    if (imagem.classList.contains('expandedImage')) {
        if (blur) {
            imagem.classList.add('heavyBlur');
        }
        imagem.classList.remove('expandedImage');
        container.classList.remove('expandedImage');
    } else {
        estatisticas.interacao[classificacao] += 1;
        console.log(estatisticas.interacao);
        if (imagem.classList.contains('heavyBlur')) {
            imagem.classList.remove('heavyBlur');
        }
        imagem.classList.add('expandedImage');
        container.classList.add('expandedImage');
    }
}

function criarInteracoes(post) {
    const container = document.createElement('div');
    container.className = 'post_interacoes';

    const likes = document.createElement('span');
    likes.className = 'interacao likes';
    likes.textContent = `👍 ${post.likes}`;

    const dislikes = document.createElement('span');
    dislikes.className = 'interacao dislikes';
    dislikes.textContent = `👎 ${post.dislikes}`;

    const comentarios = document.createElement('span');
    comentarios.className = 'interacao comentarios';
    comentarios.textContent = `💬 ${post.comentarios}`;

    container.appendChild(likes);
    container.appendChild(dislikes);
    container.appendChild(comentarios);
    return container;
}

function postTextoCurto(postElement, post) {
    const autor = document.createElement('h2');
    autor.textContent = post.autor;
    postElement.appendChild(autor);

    const conteudo = document.createElement('p');
    conteudo.textContent = post.conteudo;
    postElement.appendChild(conteudo);

    postElement.appendChild(criarInteracoes(post));
}

function postTextoLongo(postElement, post) {
    const autor = document.createElement('h2');
    autor.textContent = post.autor;
    postElement.appendChild(autor);

    const conteudo = document.createElement('div');
    conteudo.classList.add('hideContent');
    conteudo.textContent = post.conteudo;
    postElement.appendChild(conteudo);

    const expandir = document.createElement('button');
    expandir.textContent = "Ver mais";
    expandir.onclick = () => toggleContent(conteudo, expandir, post.classificacao);
    postElement.appendChild(expandir);

    postElement.appendChild(criarInteracoes(post));
}

function postImagem(postElement, post) {
    const autor = document.createElement('h2');
    autor.textContent = post.autor;
    postElement.appendChild(autor);

    const conteudo = document.createElement('p');
    conteudo.textContent = post.conteudo;
    postElement.appendChild(conteudo);

    const imageContainer = document.createElement('div');
    imageContainer.classList.add("imageContainer")
    const imagem = document.createElement('img');
    imagem.setAttribute("src", "arquivos/"+post.imagem.src);
    imagem.setAttribute("alt", post.imagem.alt);
    imagem.onclick = () => toggleImagem(imagem, imageContainer, post.classificacao, post.imagem.blur);
    if (post.imagem.blur) {
        imagem.classList.add("heavyBlur");
    }
    imageContainer.appendChild(imagem);
    postElement.appendChild(imageContainer);

    postElement.appendChild(criarInteracoes(post));
}

function construirPost(postElement, post) {
    postElement.setAttribute("id", "post_" + post.id);
    if (post.tipo === 'texto_curto') {
        return postTextoCurto(postElement, post)
    }
    else if (post.tipo === 'texto_longo') {
        return postTextoLongo(postElement, post)
    }
    else if (post.tipo === 'imagem') {
        return postImagem(postElement, post)
    }
    // TODO implementar outros tipos de post
}

function popularFeed(posts) {
    console.log(posts);
    const feedBody = document.getElementById('feed_body');

    posts.forEach(post => {
        const postElement = document.createElement('div');
        construirPost(postElement, post);
        postElement.classList.add('post');
        feedBody.appendChild(postElement);
    });
}

function irParaResultado() {
    // TODO passar estatisticas para pagina de resultado (localStorage?)
    window.location.href = "../resultado/index.html";
}


fetch('arquivos/conteudo_posts.json')
.then(response => response.json()) // Parse JSON
.then(data => popularFeed(data.posts)) // Work with JSON data
.catch(error => console.error('Error fetching JSON:', error));