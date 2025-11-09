// language codes: hu / en / rs || sr / de / sk / ro

const currentUrl = window.location.href;
const currentEventDate = "2025-06-14 15:00:00";

const getRegistApiUrl = "https://www.nics.hu/function/registration-data.aspx";
const createRegistApiUrl = "https://www.nics.hu/function/registration-create-and-modify.aspx";
const updateRegistApiUrl = "https://www.nics.hu/function/registration-create-and-modify.aspx";
const deleteRegistAPiUrl = "https://www.nics.hu/function/registration-delete.aspx";

const requestRegist = {
  customer_id: localStorage.getItem("cid_"),
  event_id: localStorage.getItem("eid_"),
  guest_name: "",
};
let dataRegist = [];

const getCreditApiUrl = "https://www.nics.hu/function/prize-draw-data-eu.aspx";

const requestCredit = {
  customer_id: localStorage.getItem("cid_"),
  prize_draw_id: localStorage.getItem("pdid_"),
};
let dataCredit = [];

const form = document.getElementById("regForm");
let regActions = document.getElementById("regActions");
let customerName = document.getElementById("customerName");
let guestName = document.getElementById("guestName");
let createRegBtn = document.getElementById("createRegbtn");
let updateRegBtn = document.getElementById("updateRegBtn");
let deleteRegBtn = document.getElementById("deleteRegBtn");
let customerErrorMessage = document.getElementById("customerErrorMessage");
let guestErrorMessage = document.getElementById("guestErrorMessage");
let messageOnSubmit = document.getElementById("messageOnSubmit");
let regStatusInfo = document.getElementById("regStatusInfo");
let regStatus = document.getElementById("regStatus");
let guestBoxInfo = document.getElementById("guestBoxInfo");
let guestBox = document.getElementById("guestBox");
let guestNameLabel = document.getElementById("guestNameLabel");
let regIcon = document.getElementById("regIcon");
let statusBox = document.getElementById("statusBox");
let counterBox = document.getElementById("counterBox");
let gdpr = document.getElementById("gdpr");
let closedRegBox = document.getElementById("closedRegBox");
let infoSection = document.getElementById("infoSection");
let countdownTimer = document.getElementById("countdownTimer");
let countdownTimerPrize = document.getElementById("countdownTimerPrize");
let creditBalance = document.getElementById("creditBalance");
let qualifiedMessage = document.getElementById("qualifiedMessage");
let goalCredit = document.getElementById("goalCredit");
let currentCredit = document.getElementById("currentCredit");
let creditInfo = document.getElementById("creditInfo");

let actionName = "";
const defaultRegHour = "08:00:00";
const prizeDrawEndHour = "23:59:59";
const prizeDrawEndDate = "2025-06-12";

countdownTimerPrize.setAttribute("data-time", prizeDrawEndHour);
countdownTimerPrize.setAttribute("data-date", prizeDrawEndDate);

function getActionName(id) {
  actionName = id;
}

function selectElement() {
  let element = document.getElementById("languages");
  if (element.value != "none") {
    localStorage.setItem("lang_", element.value);
    let selectedLanguage = localStorage.getItem("lang_");
    window.location.href = currentUrl.slice(0, -20) + "/langs/" + selectedLanguage + "/index.html";
  }
}

function isValidText(text) {
  const textPattern = /[a-zA-Z,.-]+/g;
  return textPattern.test(text);
}

function refreshPage() {
  setTimeout(() => {
    loading();
  }, 9000);
}

function loading() {
  document.getElementById("bx").style.display = "none";
  messageOnSubmit.innerHTML = ``;
  window.open(currentUrl, "_self");
}

function startCounter() {
  $(".credit-counter").each(function (index) {
    var size = $(this).text().split(".")[1] ? $(this).text().split(".")[1].length : 0;
    $(this)
      .prop("Counter", 0)
      .animate(
        {
          Counter: $(this).text(),
        },
        {
          duration: 2000,
          easing: "swing",
          step: function (now) {
            $(this).text(parseFloat(now).toFixed(size));
          },
        }
      );
  });
}

// startCounter();

const counters = document.querySelectorAll(".value"),
  speed = 400,
  observer = new IntersectionObserver(
    (entries) => entries.forEach((entry) => entry.isIntersecting && animate(entry.target)),
    {
      threshold: 1, // tells the browser that we only need to execute the callback only when an element (counter) is fully visible in the viewport
    }
  ),
  // the animate function now accepts a counter (HTML element)
  animate = (counter) => {
    const value = +counter.dataset.akhi,
      data = +counter.innerText,
      time = value / speed;
    if (data < value) {
      counter.innerText = Math.ceil(data + time);
      setTimeout(() => animate(counter), 1);
    } else {
      counter.innerText = value;
    }
  };

// attach the counters to the observer
counters.forEach((c) => observer.observe(c));

// Countdown Timer
function initializeCountdownTimers() {
  const timers = document.querySelectorAll(".countdown-timer");

  timers.forEach((timer) => {
    const dateAttr = timer.getAttribute("data-date");
    const timeAttr = timer.getAttribute("data-time") || "00:00:00";
    const targetDate = new Date(`${dateAttr}T${timeAttr}`).getTime();

    if (isNaN(targetDate)) {
      console.error("Invalid date or time in data attributes:", dateAttr, timeAttr);
      return;
    }

    function swapNumbers(element, value, type) {
      const current = element.querySelector(`.current.${type}`);
      const next = element.querySelector(`.next.${type}`);

      if (current.textContent === value) return;

      next.textContent = value;
      current.classList.add("animate-out");
      next.classList.add("animate-in");

      setTimeout(() => {
        current.textContent = value;
        current.classList.remove("animate-out");
        next.classList.remove("animate-in");

        current.classList.remove("current");
        current.classList.add("next");
        next.classList.remove("next");
        next.classList.add("current");
      }, 500);
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        timer.querySelectorAll(".number-wrapper .current").forEach((span) => (span.textContent = "00"));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, "0");
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      swapNumbers(timer.querySelector(".days").parentElement, days, "days");
      swapNumbers(timer.querySelector(".hours").parentElement, hours, "hours");
      swapNumbers(timer.querySelector(".minutes").parentElement, minutes, "minutes");
      swapNumbers(timer.querySelector(".seconds").parentElement, seconds, "seconds");
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
  });
}

// Countdown Timer Prize
function initializeCountdownTimersPrize() {
  const timersPrz = document.querySelectorAll(".countdown-timer-prize");

  timersPrz.forEach((timer) => {
    const dateAttr = timer.getAttribute("data-date");
    const timeAttr = timer.getAttribute("data-time") || "00:00:00";
    const targetDate = new Date(`${dateAttr}T${timeAttr}`).getTime();

    if (isNaN(targetDate)) {
      console.error("Invalid date or time in data attributes:", dateAttr, timeAttr);
      return;
    }

    function swapNumbers(element, value, type) {
      const current = element.querySelector(`.current.${type}`);
      const next = element.querySelector(`.next.${type}`);

      if (current.textContent === value) return;

      next.textContent = value;
      current.classList.add("animate-out");
      next.classList.add("animate-in");

      setTimeout(() => {
        current.textContent = value;
        current.classList.remove("animate-out");
        next.classList.remove("animate-in");

        current.classList.remove("current");
        current.classList.add("next");
        next.classList.remove("next");
        next.classList.add("current");
      }, 500);
    }

    function updateCountdown() {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        timer.querySelectorAll(".number-wrapper-prz .current").forEach((span) => (span.textContent = "00"));
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        .toString()
        .padStart(2, "0");
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)
        .toString()
        .padStart(2, "0");

      swapNumbers(timer.querySelector(".days").parentElement, days, "days");
      swapNumbers(timer.querySelector(".hours").parentElement, hours, "hours");
      swapNumbers(timer.querySelector(".minutes").parentElement, minutes, "minutes");
      swapNumbers(timer.querySelector(".seconds").parentElement, seconds, "seconds");
    }

    const interval = setInterval(updateCountdown, 1000);
    updateCountdown();
  });
}

initializeCountdownTimersPrize();

function startLoader() {
  myVar = setTimeout(showPage, 1500);
}

function showPage() {
  document.getElementById("loader").style.display = "none";
  document.getElementById("myDiv").style.display = "block";
}

String.prototype.replaceAt = function (index, replacement) {
  return this.substring(0, index) + replacement + this.substring(index + replacement.length);
};

if (localStorage.getItem("pdid_") != "") {
  // *** Get credit object *** //

  async function postData(url, data) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }
  postData(getCreditApiUrl, requestCredit)
    .then((data) => {
      dataCredit = data;

      // countdownTimerPrize.setAttribute("data-date", dataCredit.prize_draw_end_date.slice(0, 10));
      // countdownTimerPrize.setAttribute("data-time", dataCredit.prize_draw_end_date.slice(-8, 19));

      // console.log(requestCredit);
      // console.log(dataCredit.prize_draw_end_date.slice(0, 10));
      // console.log(dataCredit.prize_draw_end_date.slice(-8, 19));

      if (dataCredit.credit_points != "") {
        creditBalance.setAttribute("data-akhi", dataCredit.credit_points);
      } else {
        creditBalance.innerText = `"NaN"`;
      }
      if (dataCredit.credit_points >= 3500) {
        qualifiedMessage.innerHTML = `<span class="text-primary-color text-center mt-6 mb-6 lh-25"><strong>Gratulálunk, bekerültél a sorsológömbbe!</strong></span>`;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      creditBalance.innerText = `"NaN"`;
    });
}

if (localStorage.getItem("params_") != "") {
  // *** Get registration object *** //

  async function postData(url, data) {
    const response = await fetch(url, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  delete requestRegist.guest_name;

  postData(getRegistApiUrl, requestRegist)
    .then((data) => {
      dataRegist = data;

      // console.log(requestRegist);
      // console.log(dataRegist);

      const currentTime = new Date().getTime();
      const closingTime = new Date(dataRegist.event_date.slice(0, 10) + " " + defaultRegHour).getTime();

      if (currentTime > closingTime) {
        dataRegist.status_id = 5;
      }

      if (currentEventDate != dataRegist.event_date) {
        dataRegist.status_id = 0;
      }

      countdownTimer.setAttribute("data-date", dataRegist.event_date.slice(0, 10));
      countdownTimer.setAttribute("data-time", defaultRegHour);

      customerName.innerText = dataRegist.customer_name;
      guestName.value = dataRegist.guest_name;

      initializeCountdownTimers();

      switch (dataRegist.status_id) {
        case 2:
          regActions.innerHTML = `

        <div class="col-lg-4">
          <button type="submit" onclick="getActionName(this.id)" id="createRegBtn" class="btn btn-create">Regisztráció elküldése</button>
        </div>

        `;
          regStatus.innerText = "Még nem jelentkeztél";
          guestName.classList.remove("form-control-second");
          guestName.classList.add("form-control-first");
          guestBoxInfo.innerHTML = `<span class="fs-16 lh-22"><sup>*</sup>Csak egy név adható meg</span>`;
          gdpr.innerHTML = `
        
        <p class="small-font">Az előadás helyszínén, az <strong>Adatkezelési tájékoztatónk</strong> elfogadása szükséges, a rendezvényen készült kép-, hang- és videófelvétel felhasználásához kapcsolódóan,
        melyet előzetesen <a href="docs/nics-adatkezelesi-tajekoztato.pdf" target="_blank">ide kattintva</a> tudsz elolvasni.</p>
        `;
          break;
        case 1:
          regActions.innerHTML = `

          <div class="">
            <button type="submit" onclick="getActionName(this.id)" id="updateRegBtn" class="btn btn-update">Regisztráció frissítése</button>
          </div>
          <br>
          <hr>
          <span>Ha valamilyen oknál fogva mégsem tudsz eljönni a partyra, kérlek, töröld a regisztrációdat, segítve ezzel az előkészületeinket!</span>
          <div class="pt-20">
            <button type="submit" onclick="getActionName(this.id)" id="deleteRegBtn" class="btn btn-delete">Regisztráció törlése</button>
          </div>

        `;
          customerName.classList.remove("nonreg-customer-name");
          customerName.classList.add("reg-customer-name");
          guestBox.classList.remove("guest-box-first");
          guestBox.classList.add("guest-box-second");
          guestName.classList.remove("form-control-first");
          guestName.classList.add("form-control-second");
          regIcon.classList.remove("text-orange");
          regIcon.classList.add("text-green");
          statusBox.classList.remove("nonreg-status-box");
          statusBox.classList.add("reg-status-box");
          regStatus.innerText = "Már elküldted a jelentkezésedet";
          guestBoxInfo.innerHTML = `<span class="fs-16"><sup>*</sup>A név utólag is megadható, törölhető</span>`;
          guestNameLabel.innerText = "Vendéged neve:";
          regIcon.innerText = "check_circle";
          gdpr.innerHTML = `
    
        <p class="small-font">Az előadás helyszínén, az <strong>Adatkezelési tájékoztatónk</strong> elfogadása szükséges, a rendezvényen készült kép-, hang- és videófelvétel felhasználásához kapcsolódóan,
        melyet előzetesen <a href="docs/nics-adatkezelesi-tajekoztato.pdf" target="_blank">ide kattintva</a> tudsz elolvasni.</p>
  
        `;
          break;
        case 0:
          customerName.classList.remove("nonreg-customer-name");
          customerName.classList.add("error-message");
          customerName.innerText = "Nem sikerült az azonosítás!";
          regForm.innerHTML = ``;
          regStatusInfo.innerHTML = ``;
          countdownTimer.innerHTML = ``;
          creditInfo.innerHTML = ``;
          break;
        case 5:
          infoSection.innerHTML = ``;
          regForm.innerHTML = ``;
          creditInfo.innerHTML = ``;
          closedRegBox.innerHTML = `
          
          <p class="closed-reg-box text-center">
          <span class="material-icons text-primary-color" id="regIcon">lock</span>
            <span><strong>A születésnapi rendezvényhez tartozó jelentkezési felületet már lezártuk!</strong><br>
            <span class="d-block pt-10">Ha regisztráltál, a partyn találkozunk! Ha most nem tudsz eljönni, ne csüggedj, 2026. júniusában szintén lesz lehetőség együtt ünnepelni!
              <span class="material-symbols-outlined">mood</span>
              <span class="material-icons">celebration</span>
            </span>
          </p>
          
          `;
          break;

        default:
          break;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      customerName.classList.remove("nonreg-customer-name");
      customerName.classList.add("error-message");
      customerName.innerText = "Nem sikerült az azonosítás!";
      regForm.innerHTML = ``;
      regStatusInfo.innerHTML = ``;
      countdownTimer.innerHTML = ``;
      creditInfo.innerHTML = ``;
    });
} else {
  console.log("no params in url");
  customerName.classList.remove("nonreg-customer-name");
  customerName.classList.add("error-message");
  customerName.innerText = "Nem sikerült az azonosítás!";
  regForm.innerHTML = ``;
  regStatusInfo.innerHTML = ``;
  countdownTimer.innerHTML = ``;
  creditInfo.innerHTML = ``;
}

function clearStorage() {
  if (!localStorage.getItem("storageCreatedAt")) {
    localStorage.setItem("storageCreatedAt", Date.now());
  } else {
    const storageCreatedAt = localStorage.getItem("storageCreatedAt");
    const timePassed = Date.now() - Number(storageCreatedAt);

    if (timePassed > 24 * 60 * 60 * 1000) {
      localStorage.clear();
    }

    return localStorage.getItem("storageCreatedAt");
  }
}
clearStorage();

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (guestName.value.trim() !== "" && !isValidText(guestName.value)) {
    guestName.classList.add("input-error");
    guestErrorMessage.innerHTML = `<label class"d-block pt-10 fs-16">Kérlek, csak betűt adj meg!</label>`;
  } else {
    guestName.classList.remove("input-error");
    guestErrorMessage.textContent = "";
    requestRegist.guest_name = guestName.value;

    // *** Create registration *** //
    if (actionName === "createRegBtn") {
      async function postData(url, data) {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return response.json();
      }

      postData(createRegistApiUrl, requestRegist)
        .then((data) => {
          dataRegist = data;
          if (dataRegist.status_id === 1) {
            refreshPage();
            messageOnSubmit.innerHTML = `
        
            <div class="alert alert-success" role="alert" id="bx">Köszönjük, sikeresen regisztráltál!
              <br>
              <br>
              <div class="loader">
                <div class="bar"></div>
              </div>
              <br>
              <i>Néhány másodperc múlva frissítjük a regisztrációdat, melyet ugyanezen az oldalon <strong>ellenőrizhetsz, módosíthatsz vagy törölhetsz.</strong></i>
            </div>
            
              `;
            document.getElementById("createRegBtn").disabled = true;
          } else {
            messageOnSubmit.innerHTML = `<span class="alert alert-danger" role="alert">Hiba történt a regisztráció során!</span>`;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    // *** Update registration *** //
    if (actionName === "updateRegBtn") {
      async function postData(url, data) {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return response.json();
      }

      postData(updateRegistApiUrl, requestRegist)
        .then((data) => {
          dataRegist = data;
          if (dataRegist.status_id === 1) {
            messageOnSubmit.innerHTML = `
            
            <div class="alert alert-success" role="alert" id="bx">Sikeresen módosítottad a regisztrációdat!
              <br>
              <br>
              <div class="loader">
                <div class="bar"></div>
              </div>
              <br>
              <i>Néhány másodperc múlva frissítjük a regisztrációdat, melyet ugyanezen az oldalon <strong>ellenőrizhetsz, módosíthatsz vagy törölhetsz.</strong></i>
            </div>
            
            `;
            document.getElementById("updateRegBtn").disabled = true;
            document.getElementById("deleteRegBtn").disabled = true;
            refreshPage();
          } else {
            messageOnSubmit.innerHTML = `<span class="alert alert-danger" role="alert">Hiba történt a regisztráció módosítása során!</span>`;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    // *** Delete registration *** //
    if (actionName === "deleteRegBtn") {
      async function postData(url, data) {
        const response = await fetch(url, {
          method: "POST",
          mode: "cors",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        return response.json();
      }

      postData(deleteRegistAPiUrl, requestRegist)
        .then((data) => {
          dataRegist = data;
          if (dataRegist.status_id === 1) {
            messageOnSubmit.innerHTML = `
            
            <div class="alert alert-success" role="alert" id="bx">Sikeresen törölted a regisztrációdat!
              <br>
              <br>
              <div class="loader">
                <div class="bar"></div>
              </div>
              <br>
              <i>Néhány másodperc múlva frissítjük a regisztrációd állapotát, melyet ugyanezen az oldalon <strong>ellenőrizhetsz, illetve igény esetén újra regisztrálhatsz.</strong></i>
            </div>
            
            `;
            document.getElementById("updateRegBtn").disabled = true;
            document.getElementById("deleteRegBtn").disabled = true;
            refreshPage();
          } else {
            messageOnSubmit.innerHTML = `<span class="alert alert-danger" role="alert">Hiba történt a regisztráció törlése során!</span>`;
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }
});
