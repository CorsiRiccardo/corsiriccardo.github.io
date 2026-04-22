// js/projects.js
// ES module — fetch data/projects.json, build .project-card elements, inject into .projects__grid
// No import/export — self-contained module (same convention as js/nav.js)
// NOTE: fetch() requires an HTTP server. Opening index.html via file:// will fail.
// Local dev: python3 -m http.server 8000  or  npx serve .

function buildPill(label) {
  const span = document.createElement('span');
  span.className = 'pill';
  span.textContent = label;
  return span;
}

const SAFE_URL_PREFIXES = ['https://', 'http://', 'mailto:'];

function buildActions(links) {
  const actions = document.createElement('div');
  actions.className = 'project-card__actions';
  links.forEach((link) => {
    if (!SAFE_URL_PREFIXES.some((prefix) => link.url.startsWith(prefix))) return;
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.label;
    a.className = 'btn btn--outline';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    actions.appendChild(a);
  });
  return actions;
}

function buildCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card';

  const h3 = document.createElement('h3');
  h3.textContent = project.title;
  card.appendChild(h3);

  const desc = document.createElement('p');
  desc.className = 'project-card__copy';
  desc.textContent = project.description;
  card.appendChild(desc);

  if (Array.isArray(project.tech) && project.tech.length > 0) {
    const pillsRow = document.createElement('div');
    pillsRow.className = 'project-card__pills';
    project.tech.forEach((tag) => pillsRow.appendChild(buildPill(tag)));
    card.appendChild(pillsRow);
  }

  if (Array.isArray(project.links) && project.links.length > 0) {
    card.appendChild(buildActions(project.links));
  }

  return card;
}

async function loadProjects() {
  const grid = document.querySelector('.projects__grid');
  if (!grid) {
    console.warn('projects.js: .projects__grid not found in DOM');
    return;
  }

  try {
    const res = await fetch('data/projects.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const projects = await res.json();

    const fragment = document.createDocumentFragment();
    projects.forEach((project) => fragment.appendChild(buildCard(project)));
    grid.appendChild(fragment);
  } catch {
    grid.innerHTML =
      '<p class="projects__error">Projects currently unavailable. ' +
      '<a href="https://github.com/corsiriccardo" target="_blank" rel="noopener noreferrer">' +
      'View my work on GitHub</a>.</p>';
  }
}

loadProjects();
