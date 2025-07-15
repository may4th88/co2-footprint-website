function initNavigation() {

  // === [1] Navigation zwischen Hauptseiten
  document.querySelectorAll('.nav-link[data-target]').forEach(link => {
    link.addEventListener('click', (event) => {

      const targetId = link.getAttribute('data-target'); // Zielbereich auslesen
      if (!targetId) return;

      const targetSection = document.getElementById(targetId); // Ziel-Element
      /* const currentSection = document.querySelector('.view:not(.hidden)'); */ // Aktuell sichtbarer Bereich
      const currentSection = document.querySelector('.view:not(.hidden)');
      // Aktuellen Bereich ausblenden
      if (currentSection && currentSection !== targetSection) {
        currentSection.classList.add('hidden');
        currentSection.classList.remove('view');

        // Falls "Emissionen", auch Unterabschnitte ausblenden
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

      // Zielbereich einblenden
      targetSection.classList.add('view');
      targetSection.classList.remove('hidden');

      // Nach jeder Navigation: Responsives Verhalten prüfen/auslösen (z. B. Menü zuklappen auf Mobilgeräten)
      // Auch andere Views (nicht nur Emissionen) benötigen z. B. das Einklappen des Menüs
      if (window.initResponsiveBehavior) window.initResponsiveBehavior();

      
      // === Spezialfall: Über-uns → Animationen neu starten
      if (targetId === 'ueber-uns' && currentSection.id !== 'ueber-uns') {
        const contentBlocks = document.querySelectorAll('#ueber-uns .animate__animated');
        contentBlocks.forEach(block => {
          block.classList.remove('animate__fadeInLeft', 'animate__fadeInRight');
          void block.offsetWidth; // Reflow erzwingen, um Animation erneut zu starten

          if (block.classList.contains('text-center')) {
            block.classList.add('animate__fadeInRight');
          } else {
            block.classList.add('animate__fadeInLeft');
          }
        });
      }

      // === Spezialfall: Emissionen → Initialisierung + Unterbereiche einblenden
      if (targetId === 'emissionen') {
        ['emissionen-uebersicht', 'emissionen-ranking'].forEach(id => {
          const sub = document.getElementById(id);
          if (sub) {
            sub.classList.remove('hidden');
            sub.classList.add('view');
          }
        });

        // Einmalige Initialisierung der Emissionen-Logik
        if (!window._emissionenInitialized) {
          // Init verzögert ausführen
          setTimeout(() => {
            window.initEmissionen();
            window._emissionenInitialized = true;
          }, 0);
        }

      }
    });
  });

  // === [3] Lokale Navigation innerhalb der Emissionen-Sektion
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

// Funktion global verfügbar machen
window.initNavigation = initNavigation;