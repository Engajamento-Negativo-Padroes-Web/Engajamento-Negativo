const statistics = {
  reaction: {
    positive: 0,
    negative: 0,
    neutral: 0,
  },
  time: {
    positive: 0,
    negative: 0,
    neutral: 0,
  },
  interaction: {
    positive: 0,
    negative: 0,
    neutral: 0,
  },
};

function toggleContent(content, button, classification) {
  statistics.interaction[classification] += 1;

  if (button.textContent === "Ver mais") {
    content.classList.remove("hideContent");
    content.classList.add("showContent");
    button.textContent = "Ver menos";
    return;
  }

  content.classList.remove("showContent");
  content.classList.add("hideContent");
  button.textContent = "Ver mais";
}

function toggleImage(image, container, classification, blur) {
  if (image.classList.contains("expandedImage")) {
    if (blur) {
      image.classList.add("heavyBlur");
    }
    image.classList.remove("expandedImage");
    container.classList.remove("expandedImage");
  } else {
    statistics.interaction[classification] += 1;
    console.log(statistics.interaction);
    if (image.classList.contains("heavyBlur")) {
      image.classList.remove("heavyBlur");
    }
    image.classList.add("expandedImage");
    container.classList.add("expandedImage");
  }
}

function toggleLikePost(likeElement, dislikeElement, post) {
  statistics.interaction[post.classification] += 1;

  if (dislikeElement.disliked) {
    dislikeElement.disliked = false;
    dislikeElement.textContent = parseInt(dislikeElement.textContent) - 1;
    statistics.reaction[post.classification] -= 1;
  }

  if (likeElement.liked) {
    likeElement.liked = false;
    likeElement.textContent = parseInt(likeElement.textContent) - 1;
    statistics.reaction[post.classification] -= 1;
    return;
  }

  likeElement.liked = true;
  likeElement.textContent = parseInt(likeElement.textContent) + 1;
  statistics.reaction[post.classification] += 1;
}

function toggleDislikePost(likeElement, dislikeElement, post) {
  statistics.interaction[post.classification] += 1;

  if (likeElement.liked) {
    likeElement.liked = false;
    likeElement.textContent = parseInt(likeElement.textContent) - 1;
    statistics.reaction[post.classification] -= 1;
  }

  if (dislikeElement.disliked) {
    dislikeElement.disliked = false;
    dislikeElement.textContent = parseInt(dislikeElement.textContent) - 1;
    statistics.reaction[post.classification] -= 1;
    return;
  }

  dislikeElement.disliked = true;
  dislikeElement.textContent = parseInt(dislikeElement.textContent) + 1;
  statistics.reaction[post.classification] += 1;
}

function createInteractions(post) {
  const container = document.createElement("div");
  container.className = "post_interactions";

  const likes = document.createElement("span");
  likes.className = "interaction likes";
  likes.textContent = post.likes;
  likes.onclick = () => toggleLikePost(likes, dislikes, post);

  const dislikes = document.createElement("span");
  dislikes.className = "interaction dislikes";
  dislikes.textContent = post.dislikes;
  dislikes.onclick = () => toggleDislikePost(likes, dislikes, post);

  const comments = document.createElement("span");
  comments.className = "interaction comments";
  comments.textContent = post.comments;
  comments.onclick = () => {
    statistics.interaction[post.classification] += 1;
  };

  container.appendChild(likes);
  container.appendChild(dislikes);
  container.appendChild(comments);
  return container;
}

function shortTextPost(postElement, post) {
  const author = document.createElement("h2");
  author.textContent = post.author;
  postElement.appendChild(author);

  const content = document.createElement("p");
  content.textContent = post.content;
  postElement.appendChild(content);

  postElement.appendChild(createInteractions(post));
}

function longTextPost(postElement, post) {
  const author = document.createElement("h2");
  author.textContent = post.author;
  postElement.appendChild(author);

  const content = document.createElement("div");
  content.classList.add("hideContent");
  content.textContent = post.content;
  postElement.appendChild(content);

  const expandButton = document.createElement("button");
  expandButton.textContent = "Ver mais";
  expandButton.onclick = () =>
    toggleContent(content, expandButton, post.classification);
  postElement.appendChild(expandButton);

  postElement.appendChild(createInteractions(post));
}

function imagePost(postElement, post) {
  const author = document.createElement("h2");
  author.textContent = post.author;
  postElement.appendChild(author);

  const content = document.createElement("p");
  content.textContent = post.content;
  postElement.appendChild(content);

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("imageContainer");
  const image = document.createElement("img");
  image.setAttribute("src", "files/" + post.image.src);
  image.setAttribute("alt", post.image.alt);
  image.onclick = () =>
    toggleImage(image, imageContainer, post.classification, post.image.blur);
  if (post.image.blur) {
    image.classList.add("heavyBlur");
  }
  imageContainer.appendChild(image);
  postElement.appendChild(imageContainer);

  postElement.appendChild(createInteractions(post));
}

function linkPost(postElement, post) {
  const author = document.createElement("h2");
  author.textContent = post.author;
  postElement.appendChild(author);

  const content = document.createElement("p");
  content.textContent = post.content;
  postElement.appendChild(content);

  const link = document.createElement("a");
  link.setAttribute("href", post.link.href);
  link.setAttribute("target", "_blank");
  link.textContent = post.link.text;
  postElement.appendChild(link);

  postElement.appendChild(createInteractions(post));
}

function videoPost(postElement, post) {
  const author = document.createElement("h2");
  author.textContent = post.author;
  postElement.appendChild(author);

  const content = document.createElement("p");
  content.textContent = post.content;
  postElement.appendChild(content);

  const video = document.createElement("video");
  video.setAttribute("controls", "controls");
  const source = document.createElement("source");
  source.setAttribute("src", "files/" + post.video.src);
  source.setAttribute("type", post.video.type);
  video.appendChild(source);
  postElement.appendChild(video);

  postElement.appendChild(createInteractions(post));
}

function buildPost(postElement, post) {
  postElement.setAttribute("id", "post_" + post.id);
  if (post.type === "short_text") {
    shortTextPost(postElement, post);
    return;
  }

  if (post.type === "long_text") {
    longTextPost(postElement, post);
    return;
  }

  if (post.type === "image") {
    imagePost(postElement, post);
    return;
  }

  if (post.type === "link") {
    linkPost(postElement, post);
    return;
  }

  if (post.type === "video") {
    videoPost(postElement, post);
    return;
  }

  console.error("Unknown post type:", post.type);
}

function populateFeed(posts) {
  const feedBody = document.getElementById("feed_body");

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    buildPost(postElement, post);
    postElement.classList.add("post");
    feedBody.appendChild(postElement);
  });
}

function goToResults() {
  // TODO: pass statistics to results page (localStorage?)
  // window.location.href = "../results/index.html";
  console.log(statistics);
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("files/content_posts.json")
    .then((response) => response.json())
    .then((data) => populateFeed(data.posts))
    .catch((error) => console.error("Error fetching JSON:", error));
});
