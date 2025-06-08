function initEmissionen() {
  fetch('data/emissionen.json')
    .then(response => response.json())
    .then(data => {
      const rows = data.map(item => [item.land, item.unternehmen, item.emissionen]);

      const table = new DataTable('#emissionenTabelle', {
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

        // Layoutstruktur für Integrierung des benutzerdefinierten Filters
        layout: {
          top: [       
            function () {
              const wrapper = document.createElement('div');
              wrapper.className = 'd-flex align-items-center gap-2';
              wrapper.innerHTML = `
            <label for="filterField" class="mb-0">Filtern nach:</label>
            <select id="filterField" class="form-select form-select-sm w-auto">
              <option value="0">Land</option>
              <option value="1">Unternehmen</option>
            </select>
            <select id="filterValue" class="form-select form-select-sm w-auto">
              <option value="">Alle</option>
            </select>
          `;
              return wrapper;
            },
            'search'
          ],
          topStart: null,
          topEnd: null,
        },


        // Wird nach dem Aufbau der Tabelle aufgerufen (z.B. für benutzerdefinierte UI-Komponenten)
        initComplete: function () {
          const api = this.api();

          // Referenzen auf die beiden Dropdowns
          const filterField = document.getElementById('filterField');
          const filterValue = document.getElementById('filterValue');

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

          filterField.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            api.column(0).search('');
            api.column(1).search('');
            updateFilterOptions(col);
            filterValue.value = '';
            api.draw();
          });

          filterValue.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            const value = filterValue.value;
            api.column(col).search(value).draw();
          });

          updateFilterOptions(0);
        }
      });

    // ScrollSpy sauber einmalig setzen
    // Repariert ScrollSpy, falls Bootstrap es nicht automatisch aktiviert hat
    const spyTarget = document.getElementById('emissionen');
    const existing = bootstrap.ScrollSpy.getInstance(spyTarget);

    if (!existing) {
      new bootstrap.ScrollSpy(spyTarget, {
        target: '#scrollspyNav',
        offset: 10
      });
    }


    })
    .catch(error => console.error("Fehler beim Laden der Emissionsdaten:", error));

  // Länderranking laden (nur statisch)
  fetch('data/laender_ranking_2023.json')
    .then(response => response.json())
    .then(rankingData => {
      const daten = rankingData.daten;
      const tableBody = document.querySelector('#laenderRanking tbody');

      daten.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.platz}</td>
          <td>${item.land}</td>
          <td>${item.emissionen.toFixed(2)}</td>
          <td>${item.prozent.toFixed(2)} %</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(error => console.error("Fehler beim Laden des Länder-Rankings:", error));
}

window.initEmissionen = initEmissionen;
