const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const publicationList = document.querySelector('.publication-list');
const showMore = document.querySelector('[data-show-more]');
const views = [...document.querySelectorAll('[data-view]')];
const viewNames = new Set(views.map(view => view.dataset.view));

const setHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
setHeader();
window.addEventListener('scroll', setHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  navigation.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
};

const showView = (name, updateHash = true) => {
  const nextView = viewNames.has(name) ? name : 'home';

  views.forEach(view => {
    const isActive = view.dataset.view === nextView;
    view.hidden = !isActive;
    view.setAttribute('aria-hidden', String(!isActive));
    if (isActive) {
      view.querySelectorAll('.reveal').forEach(element => element.classList.add('in-view'));
    }
  });

  navigation.querySelectorAll('[data-view-link]').forEach(link => {
    const isCurrent = link.getAttribute('href') === `#${nextView}`;
    if (isCurrent) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  closeMenu();
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (updateHash) history.pushState(null, '', nextView === 'home' ? '#home' : `#${nextView}`);
};

document.querySelectorAll('[data-view-link]').forEach(link => link.addEventListener('click', event => {
  const name = link.getAttribute('href').slice(1);
  if (!viewNames.has(name)) return;
  event.preventDefault();
  showView(name);
}));

window.addEventListener('popstate', () => showView(location.hash.slice(1), false));

showMore?.addEventListener('click', () => {
  const expanded = publicationList.classList.toggle('expanded');
  showMore.setAttribute('aria-expanded', String(expanded));
  showMore.innerHTML = expanded
    ? 'Show fewer publications <span aria-hidden="true">↑</span>'
    : 'Show all publications <span aria-hidden="true">↓</span>';
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
document.querySelector('[data-year]').textContent = new Date().getFullYear();
showView(location.hash.slice(1), false);
