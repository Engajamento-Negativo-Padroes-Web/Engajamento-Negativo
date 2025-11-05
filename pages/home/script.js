const nossoFeedLink = document.getElementById("feed-link");
const modalOverlay = document.getElementById("modal-overlay");
const confirmBtn = document.getElementById("confirm-btn");
const cancelBtn = document.getElementById("cancel-btn");

let previouslyFocusedElement = null;

function handleModalKeydown(event) {
  if (event.key === "Escape") {
    closeModal();
  }
}

function openModal() {
  if (!modalOverlay) {
    return;
  }

  previouslyFocusedElement = document.activeElement;
  modalOverlay.style.display = "flex";

  if (confirmBtn) {
    confirmBtn.focus();
  }

  document.addEventListener("keydown", handleModalKeydown);
}

function closeModal() {
  if (!modalOverlay) {
    return;
  }

  modalOverlay.style.display = "none";
  document.removeEventListener("keydown", handleModalKeydown);

  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
    previouslyFocusedElement = null;
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
