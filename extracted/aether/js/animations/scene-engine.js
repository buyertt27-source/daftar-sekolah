// Scene Engine — drives the "3D swipe" navigation between full-viewport
// scenes using wheel, touch, drag and keyboard. Each .scene can itself hold
// more content than one viewport (overflow-y: auto); the engine only
// advances to the next/previous scene once the user is already at the
// edge of the current scene's internal content, so long sections (Portfolio,
// Products, Contact) stay fully readable via natural scrolling first.

const EDGE_EPS = 2;
const WHEEL_THRESHOLD = 70;
const TOUCH_THRESHOLD = 64;
const DRAG_THRESHOLD = 90;

function atTop(el) { return el.scrollTop <= EDGE_EPS; }
function atBottom(el) { return el.scrollTop + el.clientHeight >= el.scrollHeight - EDGE_EPS; }

export function createSceneEngine({ onHeroProgress, isOverlayOpen } = {}) {
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const dotsWrap = document.querySelector('.scene-dots');
  let currentIndex = 0;
  let isAnimating = false;
  let wheelAccum = 0;
  const perfLow = () => document.documentElement.dataset.perf === 'low';

  if (dotsWrap) {
    dotsWrap.innerHTML = scenes.map((_, i) => `<button class="scene-dot" data-i="${i}" aria-label="Go to section ${i + 1}"></button>`).join('');
    dotsWrap.querySelectorAll('.scene-dot').forEach((dot) => {
      dot.addEventListener('click', () => goTo(Number(dot.dataset.i)));
    });
  }

  function updateDots() {
    dotsWrap?.querySelectorAll('.scene-dot').forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
  }

  function render(prevIndex) {
    scenes.forEach((el, i) => {
      el.dataset.state = i === currentIndex ? 'active' : i === currentIndex - 1 ? 'prev' : i === currentIndex + 1 ? 'next' : 'idle';
    });
    if (prevIndex !== currentIndex) scenes[currentIndex].scrollTop = 0;
    updateDots();
    wheelAccum = 0;
    if (currentIndex !== 0) onHeroProgress?.(0);
    window.dispatchEvent(new CustomEvent('aether:scene-change', {
      detail: { index: currentIndex, id: scenes[currentIndex].dataset.sceneId }
    }));
    const dur = perfLow() ? 560 : 960;
    isAnimating = true;
    setTimeout(() => { isAnimating = false; }, dur);
  }

  function goTo(index) {
    const clamped = Math.max(0, Math.min(scenes.length - 1, index));
    if (clamped === currentIndex || isAnimating) return;
    const prev = currentIndex;
    currentIndex = clamped;
    render(prev);
  }

  function goToId(id) {
    const idx = scenes.findIndex((s) => s.dataset.sceneId === id);
    if (idx >= 0) goTo(idx);
  }

  const next = () => goTo(currentIndex + 1);
  const prev = () => goTo(currentIndex - 1);
  const activeEl = () => scenes[currentIndex];

  // ---------- Wheel ----------
  function onWheel(e) {
    if (isOverlayOpen?.()) return;
    const el = activeEl();
    const goingDown = e.deltaY > 0;
    const canScrollMore = goingDown ? !atBottom(el) : !atTop(el);
    if (canScrollMore) { wheelAccum = 0; return; }

    e.preventDefault();
    if (isAnimating) return;
    wheelAccum += e.deltaY;

    if (currentIndex === 0 && goingDown) {
      onHeroProgress?.(Math.max(0, Math.min(1, wheelAccum / WHEEL_THRESHOLD)));
    }

    if (Math.abs(wheelAccum) > WHEEL_THRESHOLD) {
      goingDown ? next() : prev();
    }
  }

  // ---------- Touch ----------
  let touchStartY = 0, touchStartScrollTop = 0;
  function onTouchStart(e) {
    if (isOverlayOpen?.()) return;
    touchStartY = e.touches[0].clientY;
    touchStartScrollTop = activeEl().scrollTop;
  }
  function onTouchMove(e) {
    if (isOverlayOpen?.() || currentIndex !== 0) return;
    const deltaY = touchStartY - e.touches[0].clientY;
    if (deltaY > 0) onHeroProgress?.(Math.max(0, Math.min(1, deltaY / (TOUCH_THRESHOLD * 1.6))));
  }
  function onTouchEnd(e) {
    if (isOverlayOpen?.()) return;
    const el = activeEl();
    const deltaY = touchStartY - e.changedTouches[0].clientY;
    const goingDown = deltaY > 0;
    if (Math.abs(deltaY) < TOUCH_THRESHOLD) { if (currentIndex === 0) onHeroProgress?.(0); return; }
    const startAtBottom = touchStartScrollTop + el.clientHeight >= el.scrollHeight - EDGE_EPS;
    const startAtTop = touchStartScrollTop <= EDGE_EPS;
    const wasAtEdge = goingDown ? startAtBottom : startAtTop;
    if (!wasAtEdge || isAnimating) { if (currentIndex === 0) onHeroProgress?.(0); return; }
    goingDown ? next() : prev();
  }

  // ---------- Mouse drag ----------
  let dragStartY = null;
  function onMouseDown(e) {
    if (isOverlayOpen?.() || e.button !== 0) return;
    if (e.target.closest('button, a, input, textarea, select, .work-card, .product-card')) return;
    dragStartY = e.clientY;
    activeEl().style.cursor = 'grabbing';
  }
  function onMouseUp(e) {
    if (dragStartY === null) return;
    const el = activeEl();
    el.style.cursor = '';
    const deltaY = dragStartY - e.clientY;
    dragStartY = null;
    if (Math.abs(deltaY) < DRAG_THRESHOLD || isAnimating) return;
    const goingDown = deltaY > 0;
    const canScrollMore = goingDown ? !atBottom(el) : !atTop(el);
    if (canScrollMore) return;
    goingDown ? next() : prev();
  }

  // ---------- Keyboard ----------
  function onKeydown(e) {
    const tag = document.activeElement?.tagName;
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
    if (isOverlayOpen?.()) return;
    const el = activeEl();
    if (e.key === 'ArrowDown' || e.key === 'PageDown') {
      if (!atBottom(el)) { el.scrollBy({ top: 240, behavior: 'smooth' }); return; }
      e.preventDefault(); next();
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      if (!atTop(el)) { el.scrollBy({ top: -240, behavior: 'smooth' }); return; }
      e.preventDefault(); prev();
    } else if (e.key === 'Home') { e.preventDefault(); goTo(0); }
    else if (e.key === 'End') { e.preventDefault(); goTo(scenes.length - 1); }
  }

  const viewport = document.getElementById('scene-viewport');
  viewport.addEventListener('wheel', onWheel, { passive: false });
  viewport.addEventListener('touchstart', onTouchStart, { passive: true });
  viewport.addEventListener('touchmove', onTouchMove, { passive: true });
  viewport.addEventListener('touchend', onTouchEnd, { passive: true });
  viewport.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mouseup', onMouseUp);
  window.addEventListener('keydown', onKeydown);
  window.addEventListener('aether:go-scene', (e) => goToId(e.detail.id));

  render(0);

  return { goTo, goToId, next, prev, current: () => currentIndex, total: () => scenes.length };
}
