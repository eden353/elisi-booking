import { ShaderMount } from '../vendor/paper-shaders/shader-mount.js';
import { ShaderFitOptions, defaultObjectSizing } from '../vendor/paper-shaders/shader-sizing.js';
import { getShaderColorFromString } from '../vendor/paper-shaders/get-shader-color-from-string.js';
import { meshGradientFragmentShader } from '../vendor/paper-shaders/shaders/mesh-gradient.js';

function getDesktopStageHeight() {
  if (window.visualViewport && window.visualViewport.height) {
    return window.visualViewport.height;
  }

  return window.innerHeight;
}

function setupHeroShader() {
  var shell = document.querySelector('.hero-fluid-shell');
  var shaderHost = document.getElementById('hero-fluid-shader');

  if (!shell || !shaderHost || !window.WebGL2RenderingContext) {
    return;
  }

  var didMount = false;
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mountShader() {
    if (didMount) {
      return;
    }

    didMount = true;

    var uniforms = {
      u_colors: [
        getShaderColorFromString('#e5e2ee'),
        getShaderColorFromString('#ffcdb3'),
        getShaderColorFromString('#ffa19e'),
        getShaderColorFromString('#ffa880')
      ],
      u_colorsCount: 4,
      u_distortion: 0.43,
      u_swirl: 0.41,
      u_grainMixer: 0,
      u_grainOverlay: 0.03,
      u_fit: ShaderFitOptions[defaultObjectSizing.fit],
      u_rotation: 80,
      u_scale: 0.68,
      u_offsetX: defaultObjectSizing.offsetX,
      u_offsetY: defaultObjectSizing.offsetY,
      u_originX: defaultObjectSizing.originX,
      u_originY: defaultObjectSizing.originY,
      u_worldWidth: defaultObjectSizing.worldWidth,
      u_worldHeight: defaultObjectSizing.worldHeight
    };

    try {
      new ShaderMount(
        shaderHost,
        meshGradientFragmentShader,
        uniforms,
        { alpha: true, antialias: true, premultipliedAlpha: true },
        prefersReducedMotion ? 0 : 0.88,
        0,
        1.25,
        1600 * 1600
      );

      shell.classList.add('is-shader-mounted');
    } catch (error) {
      console.warn('Hero shader mount failed:', error);
    }
  }

  mountShader();
}

function setupHeroProductJourney() {
  var journey = document.getElementById('hero-product-journey');

  if (!journey) {
    return;
  }

  var desktopQuery = window.matchMedia('(min-width: 721px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function easeOutQuad(value) {
    return 1 - (1 - value) * (1 - value);
  }

  function updateStageScale() {
    if (!desktopQuery.matches) {
      journey.style.removeProperty('--hero-stage-scale');
      journey.style.removeProperty('--product-stage-scale');
      return;
    }

    var viewportWidth = window.innerWidth;
    var viewportHeight = getDesktopStageHeight();
    var horizontalPadding = 48;
    var verticalPadding = 56;

    var heroScale = Math.min(
      (viewportWidth - horizontalPadding) / 1440,
      (viewportHeight - verticalPadding) / 944,
      1
    );

    var productScale = Math.min(
      (viewportWidth - horizontalPadding) / 1440,
      (viewportHeight - verticalPadding) / 896,
      1
    );

    journey.style.setProperty('--hero-stage-scale', Math.max(heroScale, 0.32).toFixed(4));
    journey.style.setProperty('--product-stage-scale', Math.max(productScale, 0.32).toFixed(4));
  }

  function applyProgress(rawProgress) {
    var progress = easeOutQuad(rawProgress);
    var contentProgress = easeOutQuad(clamp((rawProgress - 0.18) / 0.28, 0, 1));
    var copyProgress = easeOutQuad(clamp((rawProgress - 0.04) / 0.22, 0, 1));
    var titleProgress = easeOutQuad(clamp((rawProgress - 0.02) / 0.2, 0, 1));
    var backdropProgress = easeOutQuad(clamp((rawProgress - 0.12) / 0.32, 0, 1));

    journey.style.setProperty('--journey-progress', progress.toFixed(4));
    journey.style.setProperty('--journey-content-progress', contentProgress.toFixed(4));
    journey.style.setProperty('--journey-copy-progress', copyProgress.toFixed(4));
    journey.style.setProperty('--journey-title-progress', titleProgress.toFixed(4));
    journey.style.setProperty('--journey-backdrop-progress', backdropProgress.toFixed(4));
    journey.classList.toggle('is-journey-active', rawProgress > 0.01 && rawProgress < 0.995);
  }

  function resetProgress() {
    applyProgress(0);
    journey.classList.remove('is-journey-active');
  }

  function updateJourney() {
    ticking = false;

    updateStageScale();

    if (!desktopQuery.matches || reducedMotionQuery.matches) {
      journey.style.setProperty('--journey-progress', '1');
      journey.style.setProperty('--journey-content-progress', '1');
      journey.style.setProperty('--journey-copy-progress', '1');
      journey.style.setProperty('--journey-title-progress', '1');
      journey.style.setProperty('--journey-backdrop-progress', '1');
      journey.classList.remove('is-journey-active');
      return;
    }

    var rect = journey.getBoundingClientRect();
    var scrollRange = Math.max(1, rect.height - getDesktopStageHeight());
    var rawProgress = clamp(-rect.top / scrollRange, 0, 1);
    applyProgress(rawProgress);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateJourney);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', requestUpdate);
    reducedMotionQuery.addEventListener('change', requestUpdate);
  }

  requestUpdate();
}

function setupPinnedHeroNav() {
  var heroNav = document.querySelector('.hero-nav');

  if (!heroNav) {
    return;
  }

  var ticking = false;

  function updateNav() {
    ticking = false;
    heroNav.classList.toggle('is-pinned', window.scrollY > 0);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateNav);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  requestUpdate();
}

function setupFeatureParallaxScenes() {
  var scenes = Array.prototype.slice.call(document.querySelectorAll('[data-feature-scene]'));

  if (!scenes.length) {
    return;
  }

  var desktopQuery = window.matchMedia('(min-width: 721px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function setSceneValues(scene, rawProgress) {
    var progress = easeOutCubic(rawProgress);
    var copyProgress = easeOutCubic(clamp((rawProgress - 0.02) / 0.24, 0, 1));
    var leafProgress = easeOutCubic(clamp((rawProgress - 0.16) / 0.28, 0, 1));
    var cardProgress = easeOutCubic(clamp((rawProgress - 0.24) / 0.34, 0, 1));
    var detailProgress = easeOutCubic(clamp((rawProgress - 0.12) / 0.5, 0, 1));

    scene.style.setProperty('--feature-scene-progress', progress.toFixed(4));
    scene.style.setProperty('--feature-copy-progress', copyProgress.toFixed(4));
    scene.style.setProperty('--feature-leaf-progress', leafProgress.toFixed(4));
    scene.style.setProperty('--feature-card-progress', cardProgress.toFixed(4));
    scene.style.setProperty('--feature-detail-progress', detailProgress.toFixed(4));
    scene.classList.toggle('is-feature-scene-active', rawProgress > 0.01 && rawProgress < 0.995);
  }

  function showScene(scene) {
    scene.style.setProperty('--feature-scene-progress', '1');
    scene.style.setProperty('--feature-copy-progress', '1');
    scene.style.setProperty('--feature-leaf-progress', '1');
    scene.style.setProperty('--feature-card-progress', '1');
    scene.style.setProperty('--feature-detail-progress', '1');
    scene.classList.remove('is-feature-scene-active');
  }

  function updateScenes() {
    ticking = false;

    if (!desktopQuery.matches || reducedMotionQuery.matches) {
      scenes.forEach(showScene);
      return;
    }

    scenes.forEach(function (scene) {
      var rect = scene.getBoundingClientRect();
      var scrollRange = Math.max(1, rect.height - getDesktopStageHeight());
      var rawProgress = clamp(-rect.top / scrollRange, 0, 1);
      setSceneValues(scene, rawProgress);
    });
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScenes);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', requestUpdate);
    reducedMotionQuery.addEventListener('change', requestUpdate);
  }

  requestUpdate();
}

function setupPlatformParallaxScene() {
  var scene = document.querySelector('[data-platform-scene]');

  if (!scene) {
    return;
  }

  var desktopQuery = window.matchMedia('(min-width: 721px)');
  var reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function setSceneValues(rawProgress) {
    var progress = easeOutCubic(rawProgress);
    var bgProgress = easeOutCubic(clamp((rawProgress - 0.02) / 0.58, 0, 1));
    var copyProgress = easeOutCubic(clamp((rawProgress - 0.08) / 0.3, 0, 1));
    var dashboardProgress = easeOutCubic(clamp((rawProgress - 0.18) / 0.38, 0, 1));
    var phoneProgress = easeOutCubic(clamp((rawProgress - 0.28) / 0.42, 0, 1));

    scene.style.setProperty('--platform-progress', progress.toFixed(4));
    scene.style.setProperty('--platform-bg-progress', bgProgress.toFixed(4));
    scene.style.setProperty('--platform-copy-progress', copyProgress.toFixed(4));
    scene.style.setProperty('--platform-dashboard-progress', dashboardProgress.toFixed(4));
    scene.style.setProperty('--platform-phone-progress', phoneProgress.toFixed(4));
    scene.classList.toggle('is-platform-scene-active', rawProgress > 0.01 && rawProgress < 0.995);
  }

  function showScene() {
    scene.style.setProperty('--platform-progress', '1');
    scene.style.setProperty('--platform-bg-progress', '1');
    scene.style.setProperty('--platform-copy-progress', '1');
    scene.style.setProperty('--platform-dashboard-progress', '1');
    scene.style.setProperty('--platform-phone-progress', '1');
    scene.classList.remove('is-platform-scene-active');
  }

  function updateScene() {
    ticking = false;

    if (!desktopQuery.matches || reducedMotionQuery.matches) {
      showScene();
      return;
    }

    var rect = scene.getBoundingClientRect();
    var viewportHeight = getDesktopStageHeight();
    var travel = rect.height + viewportHeight * 0.45;
    var rawProgress = clamp((viewportHeight * 0.82 - rect.top) / travel, 0, 1);
    setSceneValues(rawProgress);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScene);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', requestUpdate);
    reducedMotionQuery.addEventListener('change', requestUpdate);
  }

  requestUpdate();
}

document.addEventListener('DOMContentLoaded', function () {
  if (window.lucide) {
    window.lucide.createIcons();
  }

  var heroSection = document.querySelector('.hero-section');
  var heroEmail = document.getElementById('hero-email');
  var tryBtn = document.getElementById('hero-try-btn');
  var contactName = document.getElementById('glass-name');
  var contactEmail = document.getElementById('glass-email');
  var contactTrialBtn = document.getElementById('contact-trial-btn');
  var modal = document.getElementById('success-modal');
  var confirmBtn = document.getElementById('modal-confirm-btn');

  setupHeroShader();
  setupHeroProductJourney();
  setupPinnedHeroNav();
  setupFeatureParallaxScenes();
  setupPlatformParallaxScene();

  if (heroSection) {
    var revealHero = function () {
      window.requestAnimationFrame(function () {
        heroSection.classList.add('is-loaded');
      });
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealHero();
    } else if (document.fonts && document.fonts.ready) {
      Promise.race([
        document.fonts.ready,
        new Promise(function (resolve) {
          window.setTimeout(resolve, 220);
        })
      ]).then(revealHero);
    } else {
      window.setTimeout(revealHero, 120);
    }
  }

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
    contactName.value = '';
    contactName.setAttribute('placeholder', 'Enter your name');
    contactEmail.value = '';
    contactEmail.setAttribute('placeholder', 'Enter your email');
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('.absolute.inset-0.bg-black\\/60')) {
      modal.classList.remove('active');
    }
  });
});
