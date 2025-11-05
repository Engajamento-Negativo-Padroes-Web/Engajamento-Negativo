const nossoFeedLink = document.getElementById("feed-link");
const modalOverlay = document.getElementById("modal-overlay");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");

function openModal() {
  if (modalOverlay) {
    modalOverlay.style.display = "flex";
  }
}

function closeModal() {
  if (modalOverlay) {
    modalOverlay.style.display = "none";
  }
}

if (nossoFeedLink) {
  nossoFeedLink.addEventListener("click", (event) => {
    event.preventDefault();
    openModal();
  });
}

if (cancelBtn) {
  cancelBtn.addEventListener("click", closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeModal();
    }
  });
}

if (confirmBtn) {
  confirmBtn.addEventListener("click", () => {
    closeModal();

    if (nossoFeedLink && nossoFeedLink.href) {
      window.location.href = nossoFeedLink.href;
    }
  });
}
