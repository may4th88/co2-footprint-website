function initNavigation() {
  console.log("initNavigation gestartet");

  const toggle = document.getElementById('emissionenToggle');
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = document.getElementById('emissionenSubmenu');
      submenu.classList.toggle('show');
    });
  }

  document.querySelectorAll('.nav-link[data-target], .dropdown-item[data-target]').forEach(link => {
    console.log("Eventlistener gesetzt für", link);
    link.addEventListener('click', async (event) => {
      console.log("Klick erkannt auf", link);
      event.preventDefault();
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      const targetSection = document.getElementById(targetId);
      const currentSection = document.querySelector('.view.active');

      if (currentSection && currentSection !== targetSection) {
        const currentFade = currentSection.querySelector('.fade-container');
        if (currentFade) currentFade.classList.remove('visible');
        currentSection.classList.remove('active');
        currentSection.classList.add('hidden');
      }

      targetSection.classList.remove('hidden');
      setTimeout(() => {
        targetSection.classList.add('active');
        const targetFade = targetSection.querySelector('.fade-container');
        if (targetFade) {
          setTimeout(() => targetFade.classList.add('visible'), 100);
        }
      }, 20);

      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }

      const submenu = document.getElementById('emissionenSubmenu');
      if (submenu && submenu.classList.contains('show')) {
        submenu.classList.remove('show');
      }

      const offset = 80;
      const targetY = targetSection.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    });
  });

  document.querySelectorAll('.nav-link[data-scroll]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('data-target');
      const scrollId = link.getAttribute('data-scroll');
      document.querySelector(`a[data-target='${targetId}']`).click();

      setTimeout(() => {
        const scrollTarget = document.querySelector(scrollId);
        if (scrollTarget) {
          const offset = 100;
          const targetY = scrollTarget.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }, 500);
    });
  });

  document.querySelectorAll('#lokaleNavigation a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        const offset = 100; // Header + optischer Abstand
        const targetY = targetElement.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  });

}

// Export in globalen Scope
window.initNavigation = initNavigation;
