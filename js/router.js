window.addEventListener("DOMContentLoaded", (event) => {
  event.preventDefault();

  const params = new URL(window.location.href).searchParams;
  const language = params.get("language");

  if (language) {
    localStorage.setItem("lang_", language);
  } else {
    localStorage.setItem("lang_", navigator.language.substring(0, 2));
  }

  const defaultLanguage = localStorage.getItem("lang_");

  localStorage.setItem("cd_", window.location.protocol + "//" + window.location.hostname);
  localStorage.setItem("cid_", params.get("cid"));
  localStorage.setItem("eid_", params.get("eid"));
  localStorage.setItem("pdid_", params.get("pdid"));
  localStorage.setItem("params_", params);

  window.location.href = "langs/" + defaultLanguage + "/index.html";
});
