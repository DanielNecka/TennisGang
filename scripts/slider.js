'use strict';

const sliderContainer = document.querySelector('.sliderContainer');

if (sliderContainer) {
  const SLIDE_DURATION = 480;
  let isAnimating = false;

  const rotate = (direction) => {
    if (isAnimating) {
      return;
    }

    const [prev, current, next] = ['prevCard', 'currentCard', 'nextCard'].map((cls) =>
      sliderContainer.querySelector(`.${cls}`)
    );

    if (!prev || !current || !next) {
      return;
    }

    isAnimating = true;
    sliderContainer.classList.add('is-animating');
    sliderContainer.dataset.direction = direction;

    const cards = [prev, current, next];
    let pending = cards.length;
    let safetyTimer = 0;

    const done = () => {
      if (!isAnimating) {
        return;
      }

      isAnimating = false;
      sliderContainer.classList.remove('is-animating');
      delete sliderContainer.dataset.direction;
      if (safetyTimer) {
        clearTimeout(safetyTimer);
        safetyTimer = 0;
      }
    };

    cards.forEach((card) => {
      card.addEventListener(
        'transitionend',
        ({ propertyName }) => {
          if (propertyName === 'transform' && --pending === 0) {
            done();
          }
        },
        { once: true }
      );
    });

    safetyTimer = setTimeout(done, SLIDE_DURATION + 80);

    (direction === 'next'
      ? [
          [prev, 'prevCard', 'nextCard'],
          [current, 'currentCard', 'prevCard'],
          [next, 'nextCard', 'currentCard'],
        ]
      : [
          [next, 'nextCard', 'prevCard'],
          [current, 'currentCard', 'nextCard'],
          [prev, 'prevCard', 'currentCard'],
        ]
    ).forEach(([card, from, to]) => card.classList.replace(from, to));
  };

  sliderContainer.addEventListener('click', (event) => {
    const target = event.target.closest('.sliderBtn');

    if (!target || !sliderContainer.contains(target)) {
      return;
    }

    if (target.classList.contains('nextBtn')) {
      rotate('next');
    } else if (target.classList.contains('prevBtn')) {
      rotate('prev');
    }
  });
}
