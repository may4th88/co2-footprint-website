// Hauptinitialisierungsfunktion für die Emissionen-Seite.
// Sie wird beim Aufruf durch das Navigationssystem geladen.
function initEmissionen() {
  // Lade die Emissionsdaten für Unternehmen und Länder aus einer JSON-Datei.
  // fetch() ruft die Datei asynchron ab.
  // response.json() konvertiert den HTTP-Response in ein JavaScript-Objekt.
  fetch('data/emissionen.json')
    .then(response => response.json())
    .then(data => {
      // Wandle die Daten in ein Array von Arrays um (für DataTables erforderlich).
      // Jeder Eintrag besteht aus: [Land, Unternehmen, Emissionen].
      const rows = data.map(item => [item.land, item.unternehmen, item.emissionen]);

      // Initialisiere DataTable mit jQuery und konfiguriere Bootstrap 5 + Responsive Layout.
      const table = $('#emissionenTabelle').DataTable({
        // Deaktiviere automatische Spaltenbreite
        autoWidth: false,

        // Setze die Datensätze aus JSON
        data: rows,

        // Aktiviere Responsive-Erweiterung (macht Tabelle u.a. auf kleinen Geräten einklappbar)
        responsive: true,

        // Definiere Spalteninformationen
        columns: [
          { title: "Land", width: "20%" },
          { title: "Unternehmen", width: "50%" },
          { title: "Emissionen (Mt CO₂)", width: "30%", className: "text-end" } // Rechtsbündig für Zahlen
        ],

        // Lokalisierung: Deutsch
        language: {
          url: "https://cdn.datatables.net/plug-ins/2.3.1/i18n/de-DE.json",
          paginate: {
            first: '«',
            previous: '‹',
            next: '›',
            last: '»'
          }
        },

        // Layoutstruktur für Integrierung des benutzerdefinierten Filters
        layout: {
          top: [
            'pageLength',
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
          bottomStart: 'info',
          bottomEnd: 'paging'
        },


        // Wird nach dem Aufbau der Tabelle aufgerufen (z.B. für benutzerdefinierte UI-Komponenten)
        initComplete: function () {
          const api = this.api();

          // Referenzen auf die beiden Dropdowns
          const filterField = document.getElementById('filterField');
          const filterValue = document.getElementById('filterValue');

          // Hilfsfunktion: Fülle das zweite Dropdown (Werte) je nach Spaltenauswahl
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

          // Ändere die zu filternde Spalte (Land/Unternehmen)
          filterField.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            api.column(0).search(''); // Reset Spalte 0
            api.column(1).search(''); // Reset Spalte 1
            updateFilterOptions(col); // Neue Werte setzen
            filterValue.value = '';
            api.draw();
          });

          // Filtere die gewählte Spalte nach dem ausgewählten Wert
          filterValue.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            const value = filterValue.value;
            api.column(col).search(value).draw();
          });

          // Initial: Lade Länder in Dropdown
          updateFilterOptions(0);
        }
      });

      // Mache den Bereich sichtbar (z.B. nach Fading einblenden)
      document.querySelector('#emissionen .fade-container')?.classList.add('visible');
    })
    .catch(error => console.error("Fehler beim Laden der Emissionsdaten:", error));

  // Lade zweite Tabelle: Länderranking
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

// Exportiere die Funktion global, sodass sie nach dem Laden der Partials aufgerufen werden kann
window.initEmissionen = initEmissionen;
