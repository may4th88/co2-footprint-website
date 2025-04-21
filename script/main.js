// Navigation umschalten
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();
    const targetId = link.getAttribute('data-target');
    document.querySelectorAll('.view').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(targetId).classList.remove('hidden');
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



