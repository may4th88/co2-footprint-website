function initEmissionen() {
  // Lade die Emissionsdaten für Unternehmen und Länder.
  // fetch() ruft die JSON-Datei ab, response => response.json() konvertiert den Response-Body in ein JavaScript-Objekt (JSON), da fetch nur das rohe Response-Objekt liefert.
  fetch('data/emissionen.json')
    .then(response => response.json())
    .then(data => {
      const rows = [];

      // Sammle die Daten in ein Array von Arrays (für DataTables), jedes Element besteht aus Land, Unternehmen, Emissionen.
      data.forEach(item => {
        rows.push([item.land, item.unternehmen, item.emissionen]);
      });

      // Initialisiere die DataTable mit Bootstrap-Styling und deutscher Sprache.
      const table = $('#emissionenTabelle').DataTable({
        autoWidth: false,
        data: rows,
        responsive: true,
        columns: [
          { title: "Land", width: "20%" },
          { title: "Unternehmen", width: "50%" },
          { title: "Emissionen (Mt CO₂)", width: "30%", className: "text-end" }
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/2.3.1/i18n/de-DE.json",
          // Ersetze die Standard-Beschriftung der Pagination durch Symbole für ein kompakteres Layout.
          paginate: {
            first: '«',
            previous: '‹',
            next: '›',
            last: '»'
          }
        },
        // Definiere den DOM-Aufbau der Tabelle: oben Zeilenanzahl, eigener Filter und Suche; unten Info und Pagination.
        dom:
          '<"top d-flex flex-wrap gap-4 align-items-center justify-content-between mb-3"l<"land-filter">f>' +
          '<"datatable-scroll"rt>' +
          '<"bottom d-flex flex-wrap justify-content-between align-items-center mt-3"ip>',

        // Nach Initialisierung führe folgendes Setup aus:
        initComplete: function () {
          // Erzeuge ein benutzerdefiniertes Filter-Element mit zwei Dropdowns:
          // eins zur Auswahl des Filterfelds (Land oder Unternehmen), eins zur Auswahl des konkreten Werts.
          const filterWrapper = document.createElement('div');
          filterWrapper.className = 'd-flex align-items-center gap-2';
          filterWrapper.innerHTML = `
            <label for="filterField" class="mb-0">Filtern nach:</label>
            <select id="filterField" class="form-select form-select-sm w-auto">
              <option value="0">Land</option>
              <option value="1">Unternehmen</option>
            </select>
            <select id="filterValue" class="form-select form-select-sm w-auto">
              <option value="">Alle</option>
            </select>
          `;

          // Füge das Filter-Element an der vorgesehenen Stelle im DataTables-Wrapper ein.
          const target = document.querySelector('#emissionenTabelle_wrapper .land-filter');
          if (target) target.appendChild(filterWrapper);

          // Referenzen auf die beiden Dropdowns
          const filterField = document.getElementById('filterField');
          const filterValue = document.getElementById('filterValue');

          // Fülle das zweite Dropdown dynamisch basierend auf der gewählten Spalte (Land = 0, Unternehmen = 1).
          // Dies geschieht über die Erstellung eines Sets, das durch Mapping aller Werte in der Spalte erzeugt wird, um Duplikate zu entfernen.
          function updateFilterOptions(columnIndex) {
            const unique = new Set(rows.map(r => r[columnIndex]));
            filterValue.innerHTML = '<option value="">Alle</option>';
            Array.from(unique).sort().forEach(val => {
              const option = document.createElement('option');
              option.value = val;
              option.textContent = val;
              filterValue.appendChild(option);
            });
          }

          // Wenn der Benutzer das Feld ändert, lösche alle Filter und befülle das neue Dropdown entsprechend.
          filterField.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            table.column(0).search('');
            table.column(1).search('');
            updateFilterOptions(col);
          });

          // Wenn der Benutzer einen Filterwert auswählt, filtere die entsprechende Spalte.
          filterValue.addEventListener('change', () => {
            const col = parseInt(filterField.value);
            table.column(col).search(filterValue.value).draw();
          });

          // Initial befüllen des Dropdowns mit Ländern
          updateFilterOptions(0);
        }
      });

      // Zeige die Sektion mit Fade-In Effekt an, sobald alles geladen ist.
      document.querySelector('#emissionen .fade-container')?.classList.add('visible');
    })
    .catch(error => console.error("Fehler beim Laden der Emissionsdaten:", error));

  // Lade das Länderranking aus einer separaten JSON-Datei und fülle die zweite Tabelle.
  fetch('data/laender_ranking_2023.json')
    .then(response => response.json())
    .then(rankingData => {
      const daten = rankingData.daten;
      const tableBody = document.querySelector('#laenderRanking tbody');

      // Iteriere durch alle Länder und erstelle je eine Tabellenzeile
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

// Exportiere die Funktion global, damit sie durch Navigation bei SPA-Seitenaufruf aufgerufen werden kann.
window.initEmissionen = initEmissionen;
