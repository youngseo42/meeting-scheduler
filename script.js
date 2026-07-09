const screens = document.querySelectorAll(".screen");
const stepItems = document.querySelectorAll(".step-item");
const progressBar = document.querySelector(".progress div");
const nextBtn = document.querySelector("#nextBtn");
const prevBtn = document.querySelector("#prevBtn");
const modeBtns = document.querySelectorAll(".mode-btn");
const priorityBox = document.querySelector(".priority-box");

let currentStep = 0;
let mode = "organizer";

const organizerSteps = [
  "meeting-info",
  "participants",
  "essential",
  "priority",
  "share",
  "waiting",
  "analysis",
  "result",
];

const participantSteps = [
  "participant-info",
  "input-method",
  "conditions",
  "participant-done",
];

function getSteps() {
  return mode === "organizer" ? organizerSteps : participantSteps;
}

function showStep(index) {
  const steps = getSteps();

  if (index < 0) index = 0;
  if (index >= steps.length) index = steps.length - 1;

  currentStep = index;

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  const activeScreen = document.querySelector(`#${steps[currentStep]}`);
  if (activeScreen) activeScreen.classList.add("active");

  stepItems.forEach((item, idx) => {
    item.classList.toggle("active", idx === currentStep);
  });

  if (progressBar) {
    progressBar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  }

  prevBtn.style.display = currentStep === 0 ? "none" : "inline-flex";

  if (currentStep === steps.length - 1) {
    nextBtn.textContent = mode === "organizer" ? "다시 확인하기" : "제출 완료";
  } else if (steps[currentStep] === "analysis") {
    nextBtn.textContent = "추천 결과 보기";
  } else if (steps[currentStep] === "share") {
    nextBtn.textContent = "응답 현황 보기";
  } else {
    nextBtn.textContent = "다음";
  }
}

nextBtn.addEventListener("click", () => {
  const steps = getSteps();

  if (currentStep === steps.length - 1) {
    showStep(0);
    return;
  }

  showStep(currentStep + 1);
});

prevBtn.addEventListener("click", () => {
  showStep(currentStep - 1);
});

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    modeBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    mode = btn.dataset.mode;
    currentStep = 0;

    showStep(0);
  });
});

document.querySelectorAll(".person").forEach((person) => {
  person.addEventListener("click", () => {
    person.classList.toggle("selected");
  });
});

document.querySelectorAll(".essential").forEach((item) => {
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  });
});

document.querySelectorAll(".chips button").forEach((chip) => {
  chip.addEventListener("click", () => {
    chip.classList.toggle("on");
  });
});

let draggedItem = null;

document.querySelectorAll(".priority-card").forEach((card) => {
  card.setAttribute("draggable", "true");

  card.addEventListener("dragstart", () => {
    draggedItem = card;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    draggedItem = null;
    card.classList.remove("dragging");

    document.querySelectorAll(".priority-card").forEach((item) => {
      item.classList.remove("over");
    });

    updatePriorityNumbers();
  });

  card.addEventListener("dragover", (e) => {
    e.preventDefault();

    if (card !== draggedItem) {
      card.classList.add("over");
    }
  });

  card.addEventListener("dragleave", () => {
    card.classList.remove("over");
  });

  card.addEventListener("drop", (e) => {
    e.preventDefault();

    card.classList.remove("over");

    if (!draggedItem || draggedItem === card) return;

    const cards = [...priorityBox.querySelectorAll(".priority-card")];
    const draggedIndex = cards.indexOf(draggedItem);
    const targetIndex = cards.indexOf(card);

    if (draggedIndex < targetIndex) {
      priorityBox.insertBefore(draggedItem, card.nextSibling);
    } else {
      priorityBox.insertBefore(draggedItem, card);
    }

    updatePriorityNumbers();
  });
});

function updatePriorityNumbers() {
  const cards = document.querySelectorAll(".priority-card");

  cards.forEach((card, index) => {
    const number = card.querySelector(".priority-number");

    if (number) {
      number.textContent = `${index + 1}`;
    }
  });
}

document.querySelectorAll(".method").forEach((method) => {
  method.addEventListener("click", () => {
    document.querySelectorAll(".method").forEach((item) => {
      item.classList.remove("recommended");
    });

    method.classList.add("recommended");
  });
});

showStep(0);
