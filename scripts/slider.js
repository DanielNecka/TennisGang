'use strict';

const sliderContainer = document.querySelector('.sliderContainer');
const nextBtn = document.querySelector('.nextBtn');
const prevBtn = document.querySelector('.prevBtn');

if (sliderContainer && nextBtn && prevBtn) {
  const SLIDE_DURATION = 480;
  let isAnimating = false;

  const rotate = (direction) => {
    if (isAnimating) {
      return;
    }

    const prev = sliderContainer.querySelector('.prevCard');
    const current = sliderContainer.querySelector('.currentCard');
    const next = sliderContainer.querySelector('.nextCard');

    if (!prev || !current || !next) {
      return;
    }

    isAnimating = true;
    sliderContainer.classList.add('is-animating');
    sliderContainer.dataset.direction = direction;

    const cards = [prev, current, next];
    let finished = 0;
    let safetyTimer;

    const cleanup = () => {
      if (!isAnimating) {
        return;
      }

      isAnimating = false;
      sliderContainer.classList.remove('is-animating');
      delete sliderContainer.dataset.direction;

      if (safetyTimer) {
        clearTimeout(safetyTimer);
        safetyTimer = undefined;
      }
    };

    const handleTransitionEnd = (event) => {
      if (event.propertyName !== 'transform') {
        return;
      }

      finished += 1;

      if (finished === cards.length) {
        cleanup();
      }
    };

    cards.forEach((card) => {
      card.addEventListener('transitionend', handleTransitionEnd, { once: true });
    });

    safetyTimer = setTimeout(cleanup, SLIDE_DURATION + 80);

    if (direction === 'next') {
      prev.classList.replace('prevCard', 'nextCard');
      current.classList.replace('currentCard', 'prevCard');
      next.classList.replace('nextCard', 'currentCard');
    } else {
      next.classList.replace('nextCard', 'prevCard');
      current.classList.replace('currentCard', 'nextCard');
      prev.classList.replace('prevCard', 'currentCard');
    }
  };

  nextBtn.addEventListener('click', () => rotate('next'));
  prevBtn.addEventListener('click', () => rotate('prev'));
}
