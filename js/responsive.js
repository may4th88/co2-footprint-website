function initResponsiveBehavior() {
  console.log("Init responsive behavior");

  // [1] Globale Navigation schließen nach Auswahl
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse?.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
    bsCollapse.hide();
  }

  // [2] Emissionen-Dropdown schließen
  const submenu = document.getElementById('emissionenSubmenu');
  if (submenu?.classList.contains('show')) {
    console.log("Submenu is open");
    submenu.classList.remove('show');
  } 

  // [3] Toggle hinzufügen – aber nur einmal
  const toggle = document.getElementById('emissionenToggle');
  if (toggle && !toggle.dataset.listenerAttached) {
    console.log("Attach toggle listener");
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const submenu = document.getElementById('emissionenSubmenu');
      if (submenu) submenu.classList.toggle('show');
    });
    toggle.dataset.listenerAttached = 'true';
  }

  if (window.matchMedia('(max-width: 767px)').matches) {
  const filter = document.getElementById('filterContainer');
  if (filter?.classList.contains('show')) {
    new bootstrap.Collapse(filter).hide();
  }
}


}
