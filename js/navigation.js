// Initialisiert die Navigation der Webanwendung
function initNavigation() {
  console.log("initNavigation gestartet"); // Debug-Ausgabe zum Nachverfolgen, wann die Initialisierung erfolgt

  // === [1] Dropdown-Menü für "Emissionen" ===
  // Wird nur auf kleinen Bildschirmen (responsive) verwendet
  const toggle = document.getElementById('emissionenToggle');
  if (toggle) {
    toggle.addEventListener('click', function (e) {
      e.preventDefault(); // Verhindert Standard-Linkverhalten
      const submenu = document.getElementById('emissionenSubmenu');
      submenu.classList.toggle('show'); // Zeigt oder versteckt das Submenü (CSS-gesteuert)
    });
  }

  // === [2] Hauptnavigation: Alle Links mit data-target-Attribut ===
  document.querySelectorAll('.nav-link[data-target], .dropdown-item[data-target]').forEach(link => {
    console.log("Eventlistener gesetzt für", link);

    link.addEventListener('click', async (event) => {
      console.log("Klick erkannt auf", link);
      event.preventDefault();

      // Ziel-ID aus data-target lesen
      const targetId = link.getAttribute('data-target');
      if (!targetId) return;

      // Referenz zur Zielsektion
      const targetSection = document.getElementById(targetId);
      const currentSection = document.querySelector('.view.active'); // Aktuell aktive Ansicht

      // Wenn eine andere Section aktiv ist, diese verstecken
      if (currentSection && currentSection !== targetSection) {
        const currentFade = currentSection.querySelector('.fade-container');
        if (currentFade) currentFade.classList.remove('visible'); // Für Fade-Out-Effekt
        currentSection.classList.remove('active');
        currentSection.classList.add('hidden');
      }

      // Zielsektion sichtbar machen
      targetSection.classList.remove('hidden');

      // === [3] Spezialfall: Emissionen-Sektion ===
      const main = document.getElementById('main-container');

      if (targetId === 'emissionen') {
        main.classList.add('emissionen-mode'); // Optionales Styling über CSS
        // Initialisiere Emissionen nur beim ersten Aufruf
        if (!window._emissionenInitialized) {
          window.initEmissionen();
          window._emissionenInitialized = true;
        }
      } else {
        main.classList.remove('emissionen-mode');
      }

      // === [4] Sichtbarmachung mit kleinem Delay für weichen Übergang ===
      setTimeout(() => {
        targetSection.classList.add('active');
        const targetFade = targetSection.querySelector('.fade-container');
        if (targetFade) {
          // Zweite Verzögerung: Sichtbarkeitsklasse für Fade-Effekt
          setTimeout(() => targetFade.classList.add('visible'), 100);
        }

        // === [5] ScrollSpy aktivieren, wenn Emissionen aktiv ===
        if (targetId === 'emissionen') {
          const scrollContainer = targetSection.querySelector('.fade-container');
          if (scrollContainer) {
            // ScrollSpy von Bootstrap synchronisiert Scrollposition mit Navigation
            bootstrap.ScrollSpy.getOrCreateInstance(scrollContainer, {
              target: '#lokaleNavigation'
            });
          }
        }
      }, 20);

      // === [6] Responsive: Menü nach Navigation automatisch schließen ===
      // Nur relevant auf kleinen Bildschirmen (z. B. mobiles Menü)
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
        bsCollapse.hide(); // Menü wird eingeklappt
      }

      // === [7] Responsive: Emissionen-Submenü schließen ===
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

      // Ziel ermitteln (z. B. href="#emissionen-ranking" → ID = "emissionen-ranking")
      const targetId = link.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// === [10] Globale Registrierung ===
// Die Funktion steht im globalen Scope zur Verfügung und kann nach dynamischem HTML-Laden ausgeführt werden.
window.initNavigation = initNavigation;
