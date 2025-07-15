function initResponsiveBehavior() {
  console.log("Init responsive behavior");

  // [1] Globale Navigation schließen nach Auswahl
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse?.classList.contains('show')) {
    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse);
    bsCollapse.hide();
  }

}
