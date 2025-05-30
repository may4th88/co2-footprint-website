// Initialisiert die Navigation der Webanwendung
function initNavigation() {
  console.log("initNavigation gestartet");

  // === [1] Dropdown-Menü für "Emissionen" ===
  const toggle = document.getElementById('emissionenToggle');
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = document.getElementById('emissionenSubmenu');
      submenu.classList.toggle('show');
    });
  }

  // === [2] Hauptnavigation: Alle Links mit data-target-Attribut ===
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
        currentSection.classList.remove('active');
        currentSection.classList.add('hidden');
      }

      // Schritt 1: .hidden entfernen, sichtbar aber noch nicht .active
      targetSection.classList.remove('hidden');

      // === [3] Spezialfall: Emissionen-Initialisierung
      const main = document.getElementById('main-container');
      const isEmissionen = targetId === 'emissionen';

      if (isEmissionen) {
        main.classList.add('emissionen-mode');
        if (!window._emissionenInitialized) {
          window.initEmissionen();
          window._emissionenInitialized = true;
        }
      } else {
        main.classList.remove('emissionen-mode');
      }

      // Schritt 2: .active setzen & ScrollSpy starten
      requestAnimationFrame(() => {
        targetSection.classList.add('active');

        if (isEmissionen) {
          const spyTarget = document.getElementById('emissionen');
          requestAnimationFrame(() => {
            const oldSpy = bootstrap.ScrollSpy.getInstance(spyTarget);
            if (oldSpy) oldSpy.dispose();

            new bootstrap.ScrollSpy(spyTarget, {
              target: '#scrollspyNav',
              offset: 10
            });

            // triggert sofortige Prüfung:
            spyTarget.dispatchEvent(new Event('scroll'));
          });
        }
      });

      // === [6] Menü schließen (mobil)
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide();
      }

      // === [7] Emissionen-Submenü schließen
      const submenu = document.getElementById('emissionenSubmenu');
      if (submenu && submenu.classList.contains('show')) {
        submenu.classList.remove('show');
      }
    });
  });

  // === [8] Lokale Navigation innerhalb der Emissionen-Sektion ===
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

// === [10] Globale Registrierung ===
window.initNavigation = initNavigation;
