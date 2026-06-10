const playTabs = document.querySelectorAll(".play-tab");
const playPanels = document.querySelectorAll(".play-panel");
const audienceTabs = document.querySelectorAll(".audience-tab");
const audienceCards = document.querySelectorAll(".audience-card");
const navLinks = document.querySelectorAll(".top-nav a");

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
  .map((link) => document.querySelector(link.getAttribute("href")))
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
