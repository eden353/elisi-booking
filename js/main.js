document.addEventListener('DOMContentLoaded', function () {
  lucide.createIcons();

  var heroEmail = document.getElementById('hero-email');
  var tryBtn = document.getElementById('hero-try-btn');
  var contactEmail = document.getElementById('glass-email');
  var contactTrialBtn = document.getElementById('contact-trial-btn');
  var modal = document.getElementById('success-modal');
  var confirmBtn = document.getElementById('modal-confirm-btn');

  tryBtn.addEventListener('click', function () {
    var email = heroEmail.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      heroEmail.focus();
      heroEmail.setAttribute('placeholder', 'Please enter a valid email');
      return;
    }
    modal.classList.add('active');
  });

  contactTrialBtn.addEventListener('click', function () {
    var email = contactEmail.value.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      contactEmail.focus();
      contactEmail.setAttribute('placeholder', 'Please enter a valid email');
      return;
    }
    modal.classList.add('active');
  });

  confirmBtn.addEventListener('click', function () {
    modal.classList.remove('active');
    heroEmail.value = '';
    heroEmail.setAttribute('placeholder', 'Enter your email to book demo');
    contactEmail.value = '';
    contactEmail.setAttribute('placeholder', 'name@company.com');
  });

  // Carousel scroll
  var track = document.getElementById('carousel-track');
  var prevBtn = document.getElementById('carousel-prev');
  var nextBtn = document.getElementById('carousel-next');
  var cardWidth = function () {
    return track.querySelector('.snap-center').offsetWidth + 32; // card + gap
  };

  nextBtn.addEventListener('click', function () {
    track.scrollBy({ left: cardWidth(), behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', function () {
    track.scrollBy({ left: -cardWidth(), behavior: 'smooth' });
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('.absolute.inset-0.bg-black\\/60')) {
      modal.classList.remove('active');
    }
  });
});
