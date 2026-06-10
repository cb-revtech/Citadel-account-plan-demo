const playTabs = document.querySelectorAll(".play-tab");
const playPanels = document.querySelectorAll(".play-panel");
const audienceTabs = document.querySelectorAll(".audience-tab");
const audienceCards = document.querySelectorAll(".audience-card");
const navLinks = document.querySelectorAll(".top-nav a");
const modalOpeners = document.querySelectorAll("[data-modal-open]");
const modalClosers = document.querySelectorAll("[data-modal-close]");

document.body.classList.add("page-is-entering");

window.setTimeout(() => {
  document.body.classList.remove("page-is-entering");
}, 700);

const transitionOverlay = document.createElement("div");
transitionOverlay.className = "page-transition-overlay";
transitionOverlay.setAttribute("aria-hidden", "true");
transitionOverlay.innerHTML = `
  <div class="page-transition-card" role="status" aria-live="polite">
    <img src="assets/ddn-logo-small.svg" alt="DDN" />
    <span>DDN account experience</span>
    <strong data-transition-message>Opening next view</strong>
    <div class="page-transition-track" aria-hidden="true"></div>
  </div>
`;
document.body.appendChild(transitionOverlay);

const transitionMessage = transitionOverlay.querySelector("[data-transition-message]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function shouldTransitionLink(link) {
  if (!link || link.target || link.hasAttribute("download")) return false;
  if (link.dataset.modalOpen) return false;
  if (link.getAttribute("href").startsWith("#")) return false;

  const url = new URL(link.href, window.location.href);
  if (url.origin !== window.location.origin) return false;

  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const nextPath = url.pathname.split("/").pop() || "index.html";

  return currentPath !== nextPath;
}

document.addEventListener("click", (event) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

  const link = event.target.closest("a[href]");
  if (!shouldTransitionLink(link)) return;

  event.preventDefault();
  if (transitionMessage) {
    transitionMessage.textContent = link.dataset.transitionLabel || "Opening next view";
  }
  transitionOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("is-transitioning");

  window.setTimeout(() => {
    window.location.href = link.href;
  }, reduceMotion ? 0 : 360);
});

window.addEventListener("pageshow", () => {
  document.body.classList.remove("is-transitioning");
  transitionOverlay.setAttribute("aria-hidden", "true");
});

function setActiveTab(tabs, panels, activeId, prefix) {
  tabs.forEach((tab) => {
    const isActive = tab.dataset[prefix] === activeId;
    tab.classList.toggle("is-active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  panels.forEach((panel) => {
    const isActive = panel.id === `${prefix === "play" ? "" : "audience-"}${activeId}`;
    panel.classList.toggle("is-active", isActive);
    panel.hidden = !isActive;
  });
}

playTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(playTabs, playPanels, tab.dataset.play, "play");
  });
});

audienceTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setActiveTab(audienceTabs, audienceCards, tab.dataset.audience, "audience");
  });
});

const observedSections = [...navLinks]
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => document.querySelector(href))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-36% 0px -52% 0px", threshold: 0.01 }
);

observedSections.forEach((section) => navObserver.observe(section));

function scrollToHashTarget() {
  if (!window.location.hash) return;
  const targetId = decodeURIComponent(window.location.hash.slice(1));
  const target = document.getElementById(targetId);
  if (!target) return;

  window.requestAnimationFrame(() => {
    target.scrollIntoView({ block: "start" });
  });
}

window.addEventListener("load", scrollToHashTarget);
window.addEventListener("hashchange", scrollToHashTarget);

modalOpeners.forEach((opener) => {
  opener.addEventListener("click", () => {
    const modal = document.getElementById(opener.dataset.modalOpen);
    if (!modal) return;

    if (typeof modal.showModal === "function") {
      modal.showModal();
    } else {
      modal.setAttribute("open", "");
    }
  });
});

modalClosers.forEach((closer) => {
  closer.addEventListener("click", () => {
    const modal = closer.closest("dialog");
    if (!modal) return;
    modal.close();
  });
});

document.querySelectorAll("dialog.asset-modal").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.close();
    }
  });
});
