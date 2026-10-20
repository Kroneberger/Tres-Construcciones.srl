const modelNames = {
  casa1: "Vivienda esencial",
  casa2: "Vivienda flexible",
  casa3: "Vivienda familiar"
};

const modelCards = document.querySelectorAll(".model-card");
const roomTabs = document.querySelectorAll(".room-tab");
const floorSelect = document.querySelector("#floorMaterial");
const wallSelect = document.querySelector("#wallMaterial");
const counterSelect = document.querySelector("#counterMaterial");
const vanitySelect = document.querySelector("#vanityMaterial");
const kitchenExtra = document.querySelector("#kitchenExtra");
const bathExtra = document.querySelector("#bathExtra");
const roomPreview = document.querySelector("#roomPreview");
const renderPreviewImage = document.querySelector("#renderPreviewImage");
const materialTint = document.querySelector("#materialTint");
const previewTitle = document.querySelector("#previewTitle");
const materialSummary = document.querySelector("#materialSummary");
const swatches = document.querySelectorAll(".swatch");

let selectedModel = "casa1";
let selectedRoom = "cocina";

const wallColors = {
  blanco: "#f3f0e8",
  verde: "#b5c2ad",
  arena: "#d4c4a9",
  azul: "#b6c5c9"
};
const floorColors = {
  cemento: "#b9b7ae",
  madera: "#a98059",
  arena: "#d2c4ac",
  damero: "#bcb9b0"
};
const counterColors = {
  clara: "#f6f5ef",
  negra: "#424642",
  madera: "#a67d52"
};
const vanityColors = {
  madera: "#a67d52",
  blanco: "#e6e5df",
  negro: "#444743"
};
const floorNames = {
  cemento: "Porcelanato gris",
  madera: "Símil madera",
  arena: "Porcelanato arena",
  damero: "Cerámica damero"
};
const wallNames = {
  blanco: "Blanco cálido",
  verde: "Verde salvia",
  arena: "Arena",
  azul: "Azul grisáceo"
};
const counterNames = { clara: "Cuarzo blanco", negra: "Granito negro", madera: "Madera natural" };
const vanityNames = { madera: "Madera natural", blanco: "Blanco mate", negro: "Negro" };

function updatePreview() {
  const wall = wallSelect.value;
  const floor = floorSelect.value;

  // Usamos renders reales como referencia visual; la selección cambia una tonalidad general
  // y el resumen. Para un cambio físicamente exacto por superficie hacen falta máscaras.
  if (renderPreviewImage) {
    renderPreviewImage.src = selectedRoom === "cocina" ? "imagenes/cocina-profesional.png" : "imagenes/interior-estar-cocina.png";
    renderPreviewImage.alt = selectedRoom === "cocina" ? "Render de cocina profesional" : "Render interior de referencia para la propuesta de baño";
  }
  if (materialTint) {
    const tint = selectedRoom === "cocina" ? (counterSelect.value === "negra" ? "rgba(26,31,29,.18)" : counterSelect.value === "madera" ? "rgba(164,116,69,.12)" : "rgba(245,241,229,.08)") : (vanitySelect.value === "negro" ? "rgba(25,29,28,.2)" : vanitySelect.value === "madera" ? "rgba(160,112,66,.13)" : "rgba(245,245,239,.12)");
    materialTint.style.backgroundColor = tint;
    materialTint.style.setProperty("--material-tint", tint);
  }

  roomPreview.querySelector(".back-wall").style.backgroundColor = wallColors[wall];
  roomPreview.querySelector(".floor").style.backgroundColor = floorColors[floor];

  if (selectedRoom === "cocina") {
    roomPreview.querySelector(".counter").style.backgroundColor = counterColors[counterSelect.value];
    roomPreview.querySelector(".lower-cabinets").style.backgroundColor = counterColors[counterSelect.value];
    roomPreview.querySelector(".lower-cabinets").style.filter = "brightness(.92)";
    materialSummary.textContent = `${floorNames[floor]} · ${wallNames[wall]} · ${counterNames[counterSelect.value]}`;
  } else {
    roomPreview.querySelector(".lower-cabinets").style.backgroundColor = vanityColors[vanitySelect.value];
    roomPreview.querySelector(".counter").style.backgroundColor = vanityColors[vanitySelect.value];
    materialSummary.textContent = `${floorNames[floor]} · ${wallNames[wall]} · ${vanityNames[vanitySelect.value]}`;
  }

  previewTitle.textContent = `${selectedRoom === "cocina" ? "Cocina" : "Baño"} · ${modelNames[selectedModel]}`;
}

function chooseRoom(room) {
  selectedRoom = room;
  roomTabs.forEach(tab => {
    const active = tab.dataset.room === room;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });

  const isKitchen = room === "cocina";
  kitchenExtra.hidden = !isKitchen;
  bathExtra.hidden = isKitchen;
  roomPreview.classList.toggle("kitchen", isKitchen);
  roomPreview.classList.toggle("bathroom", !isKitchen);
  updatePreview();
}

modelCards.forEach(card => {
  card.addEventListener("click", () => {
    selectedModel = card.dataset.model;
    modelCards.forEach(item => {
      const active = item === card;
      item.classList.toggle("selected", active);
      item.setAttribute("aria-pressed", String(active));
      item.querySelector(".choose-label").textContent = active ? "Seleccionada ✓" : "Elegir vivienda ↗";
    });
    updatePreview();
  });
});

roomTabs.forEach(tab => tab.addEventListener("click", () => chooseRoom(tab.dataset.room)));
[floorSelect, wallSelect, counterSelect, vanitySelect].forEach(select => {
  select.addEventListener("change", updatePreview);
});

swatches.forEach(swatch => {
  swatch.addEventListener("click", () => {
    wallSelect.value = swatch.dataset.wall;
    swatches.forEach(item => item.classList.toggle("active", item === swatch));
    updatePreview();
  });
});

document.querySelector("#resetButton").addEventListener("click", () => {
  floorSelect.value = "cemento";
  wallSelect.value = "blanco";
  counterSelect.value = "clara";
  vanitySelect.value = "madera";
  swatches.forEach(swatch => swatch.classList.toggle("active", swatch.dataset.wall === "blanco"));
  updatePreview();
});

updatePreview();


// Carrusel de Inicio: rota cada 7 segundos y permite navegación manual.
const slides = [...document.querySelectorAll('.slide')];
const slideDots = [...document.querySelectorAll('.slider-dot')];
const slideTitle = document.querySelector('#slideTitle');
const slideDescription = document.querySelector('#slideDescription');
const slideCounter = document.querySelector('#slideCounter');
const slider = document.querySelector('.home-slider');
let currentSlide = 0;
let slideTimer;
function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  const track = document.querySelector('.slides');
  if (track) track.style.transform = `translateX(-${currentSlide * 100}%)`;
  slides.forEach((slide, i) => {
    const active = i === currentSlide;
    slide.classList.toggle('active', active);
    slide.setAttribute('aria-hidden', String(!active));
    slideDots[i].classList.toggle('active', active);
    slideDots[i].setAttribute('aria-pressed', String(active));
  });
  slideTitle.innerHTML = slides[currentSlide].dataset.title.replace(/ (\S+)$/, ' <em>$1</em>');
  slideDescription.textContent = slides[currentSlide].dataset.description;
  slideCounter.textContent = `${String(currentSlide + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
}
function startSlideTimer() {
  clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000);
}
document.querySelector('#prevSlide').addEventListener('click', () => { showSlide(currentSlide - 1); startSlideTimer(); });
document.querySelector('#nextSlide').addEventListener('click', () => { showSlide(currentSlide + 1); startSlideTimer(); });
slideDots.forEach(dot => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); startSlideTimer(); }));
slider.addEventListener('mouseenter', () => clearInterval(slideTimer));
slider.addEventListener('mouseleave', startSlideTimer);
slider.addEventListener('focusin', () => clearInterval(slideTimer));
slider.addEventListener('focusout', startSlideTimer);
showSlide(0);
startSlideTimer();
