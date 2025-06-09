function initEmissionen() {
  fetch('data/emissionen.json')
    .then(response => response.json())
    .then(data => {
      const rows = data.map(item => [item.land, item.unternehmen, item.emissionen]);

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

layout: {
  framework: 'bootstrap5',
  top: [
    function () {
      const wrapper = document.createElement('div');

      const button = document.createElement('button');
      button.className = 'btn btn-outline-secondary btn-sm mb-2 d-md-none';
      button.type = 'button';
      button.setAttribute('data-bs-toggle', 'collapse');
      button.setAttribute('data-bs-target', '#filterCollapse');
      button.textContent = '🔍 Filter & Suche anzeigen';

      const collapse = document.createElement('div');
      collapse.className = 'collapse d-md-block'; // Mobil: zugeklappt
      collapse.id = 'filterCollapse';

      const filterRow = document.createElement('div');
      filterRow.className = 'd-flex align-items-center gap-2 flex-wrap mb-2';
      filterRow.innerHTML = `
        <label for="filterField" class="mb-0">Filtern nach:</label>
        <select id="filterField" class="form-select form-select-sm w-auto">
          <option value="0">Land</option>
          <option value="1">Unternehmen</option>
        </select>
        <select id="filterValue" class="form-select form-select-sm w-auto">
          <option value="">Alle</option>
        </select>
        <div id="searchContainer" class="flex-grow-1"></div> <!-- Zielcontainer -->
      `;

      collapse.appendChild(filterRow);
      wrapper.appendChild(button);
      wrapper.appendChild(collapse);
      return wrapper;
    }
  ],
  topStart: null,
  topEnd: null,
  bottomStart: null,
  bottomEnd: null
}


,

initComplete: function () {
  const api = this.api();

  const filterField = document.getElementById('filterField');
  const filterValue = document.getElementById('filterValue');
  const searchEl = document.querySelector('.dataTables_filter');
  const target = document.getElementById('searchContainer');

  if (searchEl && target) {
    target.appendChild(searchEl);
    console.log('✅ DataTables native Suche verschoben');
  }

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
    // Repariert ScrollSpy, falls Bootstrap es nicht automatisch aktiviert hat      const spyTarget = document.getElementById('emissionen');
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
