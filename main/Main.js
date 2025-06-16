const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prev = document.querySelector('.arrow.left');
  const next = document.querySelector('.arrow.right');

  let current = 0;

  function updateSlider(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
  }

  prev.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlider(current);
  });

  next.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    updateSlider(current);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      current = index;
      updateSlider(current);
    });
  });

  updateSlider(current);