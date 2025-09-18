// /assets/js/tournament_header.js
// Reusable site header with mobile toggle + active link
export function injectHeader(targetSelector, { active = "" } = {}) {
  const el = document.querySelector(targetSelector);
  if (!el) return;

  const nav = [
    { key: "home", label: "Home", href: "index.html" },
    { key: "teams", label: "Teams", href: "team_list.html" },
    { key: "results", label: "Results", href: "team_results.html" },
    { key: "tournaments", label: "Independence Cup", href: "independence_cup_2025.html" },
    { key: "tournament_photos", label: "Tournament Photos", href: "tournament_gallery.html" } // ← NEW
  ];

  const link = (item, mobile = false) => {
    const isActive = item.key === active;
    const base =
      "block px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring focus:ring-offset-2";
    const desktopCls = isActive
      ? "bg-gray-900 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";
    const mobileCls = isActive
      ? "bg-gray-900 text-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white";
    const cls = mobile ? `${base} ${mobileCls}` : `${base} ${desktopCls}`;
    const aria = isActive ? 'aria-current="page"' : "";
    return `<a href="${item.href}" class="${cls}" ${aria}>${item.label}</a>`;
  };

  el.innerHTML = `
  <header class="bg-gray-800">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
      <div class="flex h-16 items-center justify-between">
        <!-- Left: Brand -->
        <div class="flex items-center gap-3">
          <a href="index.html" class="flex items-center gap-2">
            <img src="independence_cup_logo.jpg" alt="tournaments" class="h-8 w-8 rounded-full object-cover" />
            <span class="text-white font-semibold tracking-wide">Independence Cup 2025</span>
          </a>
        </div>

        <!-- Desktop nav -->
        <div class="hidden md:flex items-center gap-2">
          ${nav.map((n) => link(n)).join("")}
        </div>

        <!-- Mobile button -->
        <div class="md:hidden">
          <button id="mobile-menu-button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring"
            aria-controls="mobile-menu" aria-expanded="false" aria-label="Open main menu">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile nav -->
    <div class="md:hidden hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pb-3 pt-2">
        ${nav.map((n) => link(n, true)).join("")}
      </div>
    </div>
  </header>
  `;

  // Mobile toggle + outside click close
  const btn = el.querySelector("#mobile-menu-button");
  const menu = el.querySelector("#mobile-menu");
  if (btn && menu) {
    const close = () => {
      menu.classList.add("hidden");
      btn.setAttribute("aria-expanded", "false");
    };
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("hidden");
    });
    document.addEventListener("click", (e) => {
      if (!el.contains(e.target)) close();
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) close();
    });
  }
}
