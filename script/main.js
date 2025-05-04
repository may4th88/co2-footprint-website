// Toggle für Emissionen-Submenu (mobil)
document.getElementById('emissionenToggle').addEventListener('click', function (e) {
  e.preventDefault();
  const submenu = document.getElementById('emissionenSubmenu');
  submenu.classList.toggle('show');
});

// Globale Navigation: Umschalten der Hauptbereiche
document.querySelectorAll('.nav-link[data-target], .dropdown-item[data-target]').forEach(link => {
  link.addEventListener('click', async (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('data-target');
    if (!targetId) return;

    const targetSection = document.getElementById(targetId);
    const currentSection = document.querySelector('.view.active');

    // Umschalten der Sektionen
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

    // Hamburger-Menü schließen, falls offen
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }

    // Untermenü schließen
    const submenu = document.getElementById('emissionenSubmenu');
    if (submenu.classList.contains('show')) {
      submenu.classList.remove('show');
    }

    // Immer nach oben scrollen, wenn schon in derselben Section
    window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
  });
});

// Mobile Unterpunkte mit Scroll-Ziel
document.querySelectorAll('.nav-link[data-scroll]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('data-target');
    const scrollId = link.getAttribute('data-scroll');
    document.querySelector(`a[data-target='${targetId}']`).click();

    setTimeout(() => {
      const scrollTarget = document.querySelector(scrollId);
      if (scrollTarget) {
        window.scrollTo({ top: scrollTarget.offsetTop - 80, behavior: 'smooth' });
      }
    }, 500);
  });
});

// Lokale Navigation (nur Desktop): Scroll innerhalb von #emissionen
document.querySelectorAll('#lokaleNavigation a').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

// Emissionsdaten laden
let dataTableInstance = null;

fetch('emissionen.json')
  .then(response => response.json())
  .then(data => {
    const tableBody = document.querySelector('#emissionenTabelle tbody');
    const rows = [];
    const laenderSet = new Set();

    data.forEach(item => {
      rows.push([item.land, item.unternehmen, item.emissionen]);
      laenderSet.add(item.land);
    });

    dataTableInstance = $('#emissionenTabelle').DataTable({
      autoWidth: false,
      data: rows,
      columns: [
        { title: "Land", width: "20%" },
        { title: "Unternehmen", width: "50%" },
        { title: "Emissionen (Mt CO₂)", type: "num", width: "30%" }
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/de-DE.json"
      },
      initComplete: function () {
        $('#emissionenTabelle_length').appendTo('#customLengthFilter');
        $('#emissionenTabelle_filter').appendTo('#customSearchFilter');
        $('#emissionenTabelle_paginate').appendTo('#tablePaginationBottom');

        const topPaginate = $('<div id=\"emissionenTabelle_paginate_top\" class=\"dataTables_paginate\"></div>');
        $('#tablePaginationTop').append(topPaginate);

        function updateTopPagination() {
          const bottom = $('#emissionenTabelle_paginate').html();
          $('#emissionenTabelle_paginate_top').html(bottom);
          $('#emissionenTabelle_paginate_top a').each(function (i, el) {
            $(el).on('click', function (e) {
              e.preventDefault();
              $('#emissionenTabelle_paginate a').eq(i).trigger('click');
            });
          });
        }

        updateTopPagination();
        $('#emissionenTabelle').on('draw.dt', function () {
          updateTopPagination();
        });
      }
    });

    const landFilter = document.getElementById('landFilter');
    Array.from(laenderSet).sort().forEach(land => {
      const option = document.createElement('option');
      option.value = land;
      option.textContent = land;
      landFilter.appendChild(option);
    });

    landFilter.addEventListener('change', () => {
      const value = landFilter.value;
      dataTableInstance.column(0).search(value).draw();
    });

    document.querySelector('#emissionen .fade-container')?.classList.add('visible');
  })
  .catch(error => {
    console.error("Fehler beim Laden der Emissionsdaten:", error);
  });

// RTL oder LTR gemäß Browsersprache
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const browserLang = (navigator.language || navigator.userLanguage || "de").split('-')[0].toLowerCase();
  const rtlLanguages = ["ar", "he", "fa", "ur", "ps", "dv", "syr", "ug", "yi"];
  if (rtlLanguages.includes(browserLang)) {
    html.setAttribute("dir", "rtl");
  } else {
    html.setAttribute("dir", "ltr");
  }
});
