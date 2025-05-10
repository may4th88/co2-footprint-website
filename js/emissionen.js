function initEmissionen() {
  fetch('data/emissionen.json')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#emissionenTabelle tbody');
      const rows = [];
      const laenderSet = new Set();

      data.forEach(item => {
        rows.push([item.land, item.unternehmen, item.emissionen]);
        laenderSet.add(item.land);
      });

      const dataTableInstance = $('#emissionenTabelle').DataTable({
        autoWidth: false,
        data: rows,
        columns: [
          { title: "Land", width: "20%" },
          { title: "Unternehmen", width: "50%" },
          { title: "Emissionen (Mt CO₂)", type: "num", width: "30%" }
        ],
        language: { url: "//cdn.datatables.net/plug-ins/1.13.6/i18n/de-DE.json" },
        initComplete: function () {
          $('#emissionenTabelle_length').appendTo('#customLengthFilter');
          $('#emissionenTabelle_filter').appendTo('#customSearchFilter');
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
    .catch(error => console.error("Fehler beim Laden der Emissionsdaten:", error));

  // Länder-Ranking laden und Tabelle befüllen
  fetch('data/laender_ranking_2023.json')
    .then(response => response.json())
    .then(rankingData => {
      const daten = rankingData.daten;
      const tableBody = document.querySelector('#laenderRanking tbody');

      daten.forEach(item => {
        const row = document.createElement('tr');

        const zellePlatz = document.createElement('td');
        zellePlatz.textContent = item.platz;
        row.appendChild(zellePlatz);

        const zelleLand = document.createElement('td');
        zelleLand.textContent = item.land;
        row.appendChild(zelleLand);

        const zelleEmissionen = document.createElement('td');
        zelleEmissionen.textContent = item.emissionen.toFixed(2);
        row.appendChild(zelleEmissionen);

        const zelleProzent = document.createElement('td');
        zelleProzent.textContent = item.prozent.toFixed(2) + " %";
        row.appendChild(zelleProzent);

        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Fehler beim Laden des Länder-Rankings:", error));
}

// Export in globalen Scope
window.initEmissionen = initEmissionen;
