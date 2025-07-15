window.initContactForm = function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", function (e) {
    const inputs = this.querySelectorAll("input, textarea");
    for (const input of inputs) {
      if (/[<>{}[\]()'"`]/.test(input.value)) {
        alert("Ungültige Zeichen in Eingabe erkannt.");
        e.preventDefault();
        return;
      }
    }
  });
};
