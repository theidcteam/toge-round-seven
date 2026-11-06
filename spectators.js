'use strict';
const navLinks = [...document.querySelectorAll('.bottom-nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
function updateNavigation() {
  let active = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= window.innerHeight * 0.35) active = section;
  }
  for (const link of navLinks) {
    const selected = link.hash === '#' + active.id;
    link.classList.toggle('active', selected);
    if (selected) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  }
}
window.addEventListener('scroll', updateNavigation, { passive: true });
window.addEventListener('resize', updateNavigation);
updateNavigation();

document.querySelector('#share').addEventListener('click', async () => {
  const status = document.querySelector('#share-status');
  const fallback = document.querySelector('#share-copy');
  const text = 'Tōge Round Seven • November 20–22, 2026 • Eureka Springs, Arkansas. Friday: cruise leaves Great Passion Play at 6 PM for Gaskin Switch, 2039 E Van Buren Ste A. FREE car show with DJ & food trucks, expected arrival 6:10 PM until 8:30 PM, then cruise back. Saturday & Sunday: mountain drifting, 9 AM–5 PM, at Great Passion Play. Saturday church: 6 PM under the Christ of the Ozarks statue. $10/person/day for Saturday & Sunday drifting at the gate; kids 12 & under FREE. Cash & cards accepted. 935 Passion Play Road, Eureka Springs, AR 72632.';
  const isPreview = ['localhost', '127.0.0.1', ''].includes(location.hostname) || location.protocol === 'file:';
  const url = isPreview ? '' : location.origin + location.pathname;
  const data = { title: 'Tōge Round Seven', text, ...(url ? { url } : {}) };
  fallback.hidden = true;
  status.textContent = '';
  if (navigator.share) {
    try { await navigator.share(data); status.textContent = 'Thanks for sharing the weekend!'; return; }
    catch (error) { if (error.name === 'AbortError') return; }
  }
  const copy = text + (url ? '\n' + url : '');
  try {
    await navigator.clipboard.writeText(copy);
    status.textContent = url ? 'Event details and link copied. Send them to your crew!' : 'Event details copied. Send them to your crew!';
  } catch {
    fallback.value = copy;
    fallback.hidden = false;
    fallback.focus();
    fallback.select();
    status.textContent = 'Copy these event details and send them to your crew.';
  }
});
