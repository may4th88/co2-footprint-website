function initNavigation() {
  console.log("initNavigation gestartet");

  // === [1] Dropdown-Menü für "Emissionen" (mobil)
  const toggle = document.getElementById('emissionenToggle');
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = document.getElementById('emissionenSubmenu');
      submenu.classList.toggle('show');
    });
  }

  // === [2] Navigation
  document.querySelectorAll('.nav-link[data-target], .dropdown-item[data-target]').forEach(link => {
    link.addEventListener('click', (event) => {
      event.preventDefault();

      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      const targetSection = document.getElementById(targetId);
      const currentSection = document.querySelector('.view:not(.hidden)');

      if (currentSection && currentSection !== targetSection) {
      currentSection.classList.add('hidden');
      currentSection.classList.remove('view');

      // 👇 Untersections von Emissionen ebenfalls verstecken
      if (currentSection.id === 'emissionen') {
        ['emissionen-uebersicht', 'emissionen-ranking'].forEach(id => {
          const sub = document.getElementById(id);
          if (sub) {
            sub.classList.add('hidden');
            sub.classList.remove('view');
          }
        });
      }
    }

      targetSection.classList.add('view'); 
      targetSection.classList.remove('hidden');

      // === Emissionen init (NACH Anzeige)
      if (targetId === 'emissionen') {
        // Zeige Untersektionen explizit
        ['emissionen-uebersicht', 'emissionen-ranking'].forEach(id => {
          const sub = document.getElementById(id);
          if (sub) {
            sub.classList.remove('hidden');
            sub.classList.add('view');
          }
        });

        if (!window._emissionenInitialized) {
          window.initEmissionen();
          window._emissionenInitialized = true;
        }
      }
  

      // === Menü schließen nach Auswahl Ziel (mobil)
     const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse?.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }

    });
  });

  // === [3] Lokale Navigation in Emissionen
  document.querySelectorAll('#lokaleNavigation a').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

window.initNavigation = initNavigation;
