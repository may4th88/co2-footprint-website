document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;
  const browserLang = (navigator.language || navigator.userLanguage || "de").split('-')[0].toLowerCase();
  const rtlLanguages = ["ar", "he", "fa", "ur", "ps", "dv", "syr", "ug", "yi"];
  if (rtlLanguages.includes(browserLang)) {
    html.setAttribute("dir", "rtl");
  } else {
    html.setAttribute("dir", "ltr");
  }
});
