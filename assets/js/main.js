/* ============================================================
   YENVANAIL'S BELLEZA & ESTILO — shared behaviour
   Business name as ONE swappable constant.
   ============================================================ */
"use strict";

const BUSINESS_NAME = "Yenvanail's Belleza & Estilo";
const WA_NUMBER = "573132366526";
const waLink = (msg) => "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);

/* --- Mobile nav --- */
(function () {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", (e) => {
    if (e.target.closest("a")) links.classList.remove("open");
  });
})();

/* --- Hero rotating word: PELO -> UÑAS -> ESTILO only (no FLOW) --- */
(function () {
  const rot = document.getElementById("hero-rot");
  if (!rot) return;
  const words = ["PELO", "UÑAS", "ESTILO"];
  let i = 0;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return; // stays on PELO, all content visible
  setInterval(() => {
    i = (i + 1) % words.length;
    rot.classList.remove("swap");
    void rot.offsetWidth; // restart animation
    rot.textContent = words[i] + ".";
    rot.classList.add("swap");
  }, 2400);
})();

/* --- Gallery filter --- */
(function () {
  const buttons = document.querySelectorAll("[data-filter]");
  const items = document.querySelectorAll(".g-item");
  if (!buttons.length || !items.length) return;
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const f = btn.getAttribute("data-filter");
      buttons.forEach((b) => b.setAttribute("aria-pressed", b === btn ? "true" : "false"));
      items.forEach((item) => {
        const cat = item.getAttribute("data-cat");
        item.hidden = f !== "all" && cat !== f;
      });
    });
  });
})();

/* --- Booking widget (Reserva) --- */
(function () {
  const widget = document.getElementById("booking-widget");
  if (!widget) return;

  const state = { servicio: null, dia: null, hora: null };
  const summaryServicio = document.getElementById("sum-servicio");
  const summaryDia = document.getElementById("sum-dia");
  const summaryHora = document.getElementById("sum-hora");
  const statusServicio = document.getElementById("status-servicio");
  const statusDia = document.getElementById("status-dia");
  const statusHora = document.getElementById("status-hora");
  const confirmBtn = document.getElementById("confirm-btn");
  const hint = document.getElementById("confirm-hint");

  function pick(group, value, label) {
    state[group] = { value, label };
    widget.querySelectorAll('[data-group="' + group + '"]').forEach((b) => {
      b.setAttribute("aria-pressed", b.getAttribute("data-value") === value ? "true" : "false");
    });
    update();
  }

  function update() {
    summaryServicio.textContent = state.servicio ? state.servicio.label : "Por seleccionar";
    summaryDia.textContent = state.dia ? state.dia.label : "Por seleccionar";
    summaryHora.textContent = state.hora ? state.hora.label : "Por seleccionar";
    statusServicio.textContent = state.servicio ? state.servicio.label : "Ninguno seleccionado";
    statusDia.textContent = state.dia ? state.dia.label : "Sin fecha";
    statusHora.textContent = state.hora ? state.hora.label : "Sin hora";
    [statusServicio, statusDia, statusHora].forEach((el, idx) => {
      const done = [state.servicio, state.dia, state.hora][idx];
      el.classList.toggle("done", !!done);
    });
    const ready = state.servicio && state.dia && state.hora;
    confirmBtn.classList.toggle("is-disabled", !ready);
    confirmBtn.setAttribute("aria-disabled", ready ? "false" : "true");
    hint.hidden = !!ready;
    if (ready) {
      const msg = "Hola " + BUSINESS_NAME + ", quiero reservar " + state.servicio.label +
        " el " + state.dia.label + " a las " + state.hora.label + ".";
      confirmBtn.setAttribute("href", waLink(msg));
    } else {
      confirmBtn.removeAttribute("href");
    }
  }

  widget.querySelectorAll("[data-group]").forEach((btn) => {
    btn.addEventListener("click", () => {
      pick(btn.getAttribute("data-group"), btn.getAttribute("data-value"), btn.getAttribute("data-label"));
    });
  });

  /* Anchor buttons don't honour `disabled`: block the click until complete */
  confirmBtn.addEventListener("click", (e) => {
    if (!(state.servicio && state.dia && state.hora)) e.preventDefault();
  });

  /* Pre-select a service from ?servicio= (links from Servicios page) */
  const params = new URLSearchParams(window.location.search);
  const pre = params.get("servicio");
  if (pre) {
    const target = widget.querySelector('[data-group="servicio"][data-value="' + pre + '"]');
    if (target) pick("servicio", pre, target.getAttribute("data-label"));
  }
  update();
})();
