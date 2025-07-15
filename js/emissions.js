function initEmissionen() {
  // Lade Unternehmensdaten
  fetch('data/emissions.json')
    .then(response => response.json())
    .then(data => {
      // Daten in Tabellenstruktur konvertieren
      const rows = data.map(item => [item.land, item.unternehmen, item.emissionen]);

      // Initialisiere DataTable
      new DataTable('#emissionenTabelle', {
        paging: false,
        scrollCollapse: true,
        scrollY: '50vh',
        data: rows,
        columns: [
          { title: "Land" },
          { title: "Unternehmen" },
          { title: "Emissionen (Mt CO₂)", className: "text-end" }
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/2.3.1/i18n/de-DE.json",
        },

        // Benutzerdefiniertes Layout (ohne native DataTable-Komponenten)
        layout: {
          topStart: null,
          topEnd: null,
          bottomStart: null,
          bottomEnd: null,
          top: [
            function () {
              const wrapper = document.createElement('div');

              // Collapse-Container für Filter & Suche (mobil einklappbar, Desktop immer sichtbar)
              const collapse = document.createElement('div');
              collapse.className = 'collapse d-md-block';
              collapse.id = 'filterCollapse';

              // Wrapper für Filter + Suche (gemeinsam linksbündig)
              const filterRow = document.createElement('div');
              filterRow.className = 'd-flex flex-column flex-md-row flex-wrap align-items-start gap-2 mb-2';

              // Inhalt: Label + Dropdowns + Sucheingabe
              filterRow.innerHTML = `
                <div class="d-flex align-items-center gap-2 flex-wrap">
                  <label for="filterField" class="mb-0">Filtern nach:</label>
                  <select id="filterField" class="form-select form-select-sm w-auto">
                    <option value="0">Land</option>
                    <option value="1">Unternehmen</option>
                  </select>
                  <select id="filterValue" class="form-select form-select-sm w-auto">
                    <option value="">Alle</option>
                  </select>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <label for="customSearch" class="mb-0">Suche:</label>
                  <input type="search" id="customSearch" class="form-control form-control-sm w-auto" placeholder="Suchen..." />
                </div>
              `;


              // Aufbau
              collapse.appendChild(filterRow);
              wrapper.appendChild(collapse);
              return wrapper;
            }
          ]
        },

        // Event-Listener und Initialfilter nach dem Rendern
        initComplete: function () {
          const api = this.api();
          const filterField = document.getElementById('filterField');
          const filterValue = document.getElementById('filterValue');
          const searchInput = document.getElementById('customSearch');

          // Filter-Dropdown aktualisieren je nach Spalte
          function updateFilterOptions(columnIndex) {
            const unique = new Set(api.column(columnIndex).data().toArray());
            filterValue.innerHTML = '<option value="">Alle</option>';
            Array.from(unique).sort().forEach(val => {
              const option = document.createElement('option');
              option.value = val;
              option.textContent = val;
              filterValue.appendChild(option);
            });
          }

          // Spaltenwechsel im "Filtern nach"-Dropdown
          filterField.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            api.column(0).search('');
            api.column(1).search('');
            updateFilterOptions(col);
            filterValue.value = '';
            api.draw();
          });

          // Filterwert auswählen
          filterValue.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            api.column(col).search(filterValue.value).draw();
          });

          // Suchfeld synchronisieren
          if (searchInput) {
            searchInput.addEventListener('input', () => {
              let value = searchInput.value;
              value = value.replace(/[<>{}[\]()'"`]/g, ''); // riskante Zeichen entfernen
              api.search(value).draw();
            });
          }

          // Standardmäßig Filteroptionen für Spalte 0 ("Land") laden
          updateFilterOptions(0);
        }
      });

      // Bootstrap ScrollSpy aktivieren
      const spyTarget = document.getElementById('emissionen');
      if (!bootstrap.ScrollSpy.getInstance(spyTarget)) {
        new bootstrap.ScrollSpy(spyTarget, {
          target: '#scrollspyNav',
          offset: 10
        });
      }
    })
    .catch(error => console.error("Fehler beim Laden der Emissionsdaten:", error));

  // Ranking-Tabelle separat laden
  fetch('data/country_ranking_2023.json')
    .then(response => response.json())
    .then(rankingData => {
      const daten = rankingData.data;
      const tableBody = document.querySelector('#laenderRanking tbody');

      daten.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.rank}</td>
          <td>${item.country}</td>
          <td>${item.emissions.toFixed(2)}</td>
          <td>${item.percentage.toFixed(2)} %</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Fehler beim Laden des Länder-Rankings:", error));
}

window.initEmissionen = initEmissionen;
