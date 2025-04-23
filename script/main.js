// Globale Navigation: Umschalten der Hauptbereiche
document.querySelectorAll('nav .nav-link[data-target]').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('data-target');
    if (!targetId) return;

    // Alle view-Sektionen ausblenden
    document.querySelectorAll('.view').forEach(section => {
      section.classList.add('hidden');
    });

    // Ziel anzeigen
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      targetSection.classList.remove('hidden');
      window.scrollTo({ top: targetSection.offsetTop - 80, behavior: 'smooth' });
    }
  });
});


// Lokale Navigation: Scroll innerhalb von #emissionen
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
      rows.push([
        item.land,
        item.unternehmen,
        item.emissionen
      ]);
      laenderSet.add(item.land);
    });

    // Tabelle initialisieren
    dataTableInstance = $('#emissionenTabelle').DataTable({
      data: rows,
      columns: [
        { title: "Land" },
        { title: "Unternehmen" },
        { title: "Emissionen (Mt CO₂)", type: "num" }
      ],
      language: {
        url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/de-DE.json"
      },
      initComplete: function () {
        // DataTable-Elemente verschieben
        $('#emissionenTabelle_length').appendTo('#customLengthFilter');
        $('#emissionenTabelle_filter').appendTo('#customSearchFilter');

        // Paginierung unten korrekt anhängen
        $('#emissionenTabelle_paginate').appendTo('#tablePaginationBottom');

        const topPaginate = $('<div id="emissionenTabelle_paginate_top" class="dataTables_paginate"></div>');
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

    // Filter-Dropdown befüllen
    const landFilter = document.getElementById('landFilter');
    Array.from(laenderSet).sort().forEach(land => {
      const option = document.createElement('option');
      option.value = land;
      option.textContent = land;
      landFilter.appendChild(option);
    });

    // Filter-Event
    landFilter.addEventListener('change', () => {
      const value = landFilter.value;
      dataTableInstance.column(0).search(value).draw(); // 0 = erste Spalte (Land)
    });
  })
  .catch(error => {
    console.error("Fehler beim Laden der Emissionsdaten:", error);
  });
