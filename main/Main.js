let currentSlide = 0;
let promotions = [];

const testPromotions = [
  {
    id: 1,
    type: "PERCENT",
    value: 50,
    description: "Скидка 50% на все курсы! Только до конца месяца",
    image: "/pictures/promo1.svg"
  },
  {
    id: 2,
    type: "BONUS",
    value: 1000,
    description: "Бонус 1000₽ при регистрации",
    image: "/pictures/promo2.svg"
  },
  {
    id: 3,
    type: "GIFT",
    value: 0,
    description: "Бесплатный час игры при бронировании от 3 часов",
    image: "/pictures/promo3.svg"
  },
  {
    id: 4,
    type: "PERCENT",
    value: 50,
    description: "Скидка 50% на все курсы! Только до конца месяца",
    image: "/pictures/promo1.svg"
  }
];

function initSlider() {
  /*
  // Реальная функция загрузки акций с сервера
  fetch('http://localhost:8080/api/promotions')
    .then(response => response.json())
    .then(data => {
      promotions = data;
      renderSlides();
      updateSlider();
    })
    .catch(error => {
      console.error('Ошибка загрузки акций:', error);
      promotions = testPromotions;
      renderSlides();
      updateSlider();
    });
  */

  promotions = testPromotions;
  renderSlides();
  updateSlider();
}

function renderSlides() {
  const slideContainer = document.querySelector('.slide-container');
  const dotsContainer = document.querySelector('.dots');
  
  slideContainer.innerHTML = '';
  dotsContainer.innerHTML = '';

  promotions.forEach((promo, index) => {
    const slide = document.createElement('div');
    slide.className = 'slide';
    slide.innerHTML = `
      <div class="slide-text">
        <h2>${getPromoTitle(promo)}</h2>
        <p>${promo.description}</p>
      </div>
      <img src="${promo.image}" alt="Promo ${promo.id}">
    `;
    slideContainer.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot';
    dot.addEventListener('click', () => {
      currentSlide = index;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
  });
}

function getPromoTitle(promo) {
  switch(promo.type) {
    case 'PERCENT':
      return `Скидка ${promo.value}%`;
    case 'BONUS':
      return `Бонус ${promo.value}₽`;
    case 'GIFT':
      return 'Специальное предложение';
    default:
      return 'Акция';
  }
}

function updateSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
  
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

document.querySelector('.arrow.left').addEventListener('click', () => {
  currentSlide = (currentSlide - 1 + promotions.length) % promotions.length;
  updateSlider();
});

document.querySelector('.arrow.right').addEventListener('click', () => {
  currentSlide = (currentSlide + 1) % promotions.length;
  updateSlider();
});

let slideInterval = setInterval(() => {
  currentSlide = (currentSlide + 1) % promotions.length;
  updateSlider();
}, 5000);

document.querySelector('.slider').addEventListener('mouseenter', () => {
  clearInterval(slideInterval);
});

document.querySelector('.slider').addEventListener('mouseleave', () => {
  slideInterval = setInterval(() => {
    currentSlide = (currentSlide + 1) % promotions.length;
    updateSlider();
  }, 5000);
});

document.addEventListener('DOMContentLoaded', initSlider);