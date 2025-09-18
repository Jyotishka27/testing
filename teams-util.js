
// /assets/js/teams-util.js
export async function loadTeams(url = "teams.json") {
  const res = await fetch(url, { cache: "no-cache" });
  if (!res.ok) throw new Error(`Failed to load teams: ${res.status}`);
  const teams = await res.json();
  const byId = new Map(teams.map((t) => [t.id, t]));
  const byName = new Map(teams.map((t) => [t.name.toLowerCase().trim(), t]));

  const aliases = {
    "amingos fc": "amigos fc",
  };
  Object.entries(aliases).forEach(([alias, canonical]) => {
    const t = byName.get(canonical);
    if (t) byName.set(alias, t);
  });

  return { list: teams, byId, byName };
}

export function findTeamByName(name, maps) {
  if (!name || !maps) return null;
  return maps.byName.get(String(name).toLowerCase().trim()) || null;
}

/**
 * Hydrate logos in multiple patterns:
 * 1) Containers with [data-team] and an inner <img class="team-logo">
 * 2) Fixture rows with [data-home][data-away] and <img data-role="home-logo|away-logo">
 * 3) Generic <img class="team-logo" alt="Team Name"> OR next to a sibling <span>Team Name</span>
 */
export function hydrateTeamLogos(root, maps) {
  const scope = root || document;

  // 1) Generic team cards with data-team
  scope.querySelectorAll("[data-team]").forEach((el) => {
    const t = findTeamByName(el.getAttribute("data-team"), maps);
    const img = el.querySelector("img.team-logo");
    const nameEl = el.querySelector("[data-team-name]");
    if (t && img) {
      img.src = t.logo;
      img.alt = `${t.name} logo`;
      img.loading = "lazy";
      img.decoding = "async";
    }
    if (t && nameEl) nameEl.textContent = t.name;
  });

  // 2) Fixtures (home/away)
  scope.querySelectorAll("[data-home][data-away]").forEach((row) => {
    const home = findTeamByName(row.getAttribute("data-home"), maps);
    const away = findTeamByName(row.getAttribute("data-away"), maps);
    const hImg = row.querySelector('img[data-role="home-logo"]');
    const aImg = row.querySelector('img[data-role="away-logo"]');
    if (home && hImg) {
      hImg.src = home.logo;
      hImg.alt = `${home.name} logo`;
      hImg.loading = "lazy";
      hImg.decoding = "async";
    }
    if (away && aImg) {
      aImg.src = away.logo;
      aImg.alt = `${away.name} logo`;
      aImg.loading = "lazy";
      aImg.decoding = "async";
    }
  });

  // 3) Fallback: plain <img class="team-logo"> next to text OR with alt text
  scope.querySelectorAll("img.team-logo").forEach((img) => {
    const nameFromAlt = (img.getAttribute("alt") || "").trim();
    let guessName = nameFromAlt;
    if (!guessName) {
      // look for sibling span text
      const parent = img.parentElement;
      if (parent) {
        const span = parent.querySelector("span, .team-name, [data-team-name]");
        if (span) guessName = (span.textContent || "").trim();
      }
    }
    const t = findTeamByName(guessName, maps);
    if (t) {
      img.src = t.logo;
      img.alt = `${t.name} logo`;
      if (img.nextElementSibling && img.nextElementSibling.textContent) {
        img.nextElementSibling.textContent = t.name; // normalize text label
      }
      img.loading = "lazy";
      img.decoding = "async";
    }
  });
}
