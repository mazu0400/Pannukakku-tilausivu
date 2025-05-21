//tässä valitaan elementit
const pancakeType = document.getElementById("pancakeType");
const totalPriceDisplay = document.getElementById("totalPrice");
const totalPriceDisplays = document.querySelectorAll(".kokonaishinta");
const quantityDisplay = document.getElementById("quantity");
const plusButton = document.getElementById("plusBtn");
const minusButton = document.getElementById("minusBtn");

const fillingsCheckboxes = document.querySelectorAll('input[name="täytteet"]');
const extraCheckboxes = document.querySelectorAll('input[name="lisukkeet"]');
const jamCheckboxes = document.querySelectorAll('input[name="hillo"]');

// muuttujat

let selectedPancakePrice = 4;
let selectedPancakeName = "Perinteinen 4€";
let quantity = 1;
quantityDisplay.textContent = quantity;

// tapahtumakuuntelijat täytteille lisukkeille ja hilloille

fillingsCheckboxes.forEach((cb) => cb.addEventListener("change", updatePrice));
extraCheckboxes.forEach((cb) => cb.addEventListener("change", updatePrice));
jamCheckboxes.forEach((cb) => cb.addEventListener("change", updatePrice));

//tässä osiossa on määrän lisäys ja vähennys kohta

plusButton.addEventListener("click", () => {
  quantity++;
  quantityDisplay.textContent = quantity;
  updatePrice();
});

minusButton.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityDisplay.textContent = quantity;
    updatePrice();
  }
});

// tämä kohta korostaa valitun pannukakku tyypin ja asettaa hinnan ja nimen sen mukaan

function setActiveCard(card, type) {
  document
    .querySelectorAll(".option-card")
    .forEach((c) => c.classList.remove("active"));
  card.classList.add("active");

  selectedPancakePrice = parseFloat(card.dataset.price);
  selectedPancakeName = card.querySelector("h2").textContent;

  updatePrice();
  vaihdaTausta(type);
}

//tämä osio vaihtaa vasemman puolen taustakuvan valitun pannukakku tyypin mukaan

function vaihdaTausta(kuva) {
  let tausta = "";
  switch (kuva) {
    case "perinteinen":
      tausta = 'url("images/768359-pannukakut.jpg")';
      break;
    case "suklaa":
      tausta =
        'url("images/depositphotos_118391856-stock-photo-ombre-chocolate-pancakes.jpg")';
      break;
    case "siirappi":
      tausta =
        'url("images/stack-pancakes-with-maple-syrup-being-poured-it_875133-5.jpg.avif")';
      break;
  }
  document.querySelector(".vasen").style.backgroundImage = tausta;
}

//tämä osio laskee hinnan valituille täytteille lisukkeille ja hilloille ja päivittää hinnan

function updatePrice() {
  let total = selectedPancakePrice;

  fillingsCheckboxes.forEach((cb) => {
    if (cb.checked) total += 1;
  });

  extraCheckboxes.forEach((cb) => {
    if (cb.checked) total += 0.5;
  });

  jamCheckboxes.forEach((cb) => {
    if (cb.checked) total += 0.75;
  });

  let finalPrice = total * quantity;
  totalPriceDisplays[0].textContent = finalPrice.toFixed(0) + "€";
  totalPriceDisplays[1].textContent = finalPrice.toFixed(2) + "€";

  totalPriceDisplays.forEach((el) => {
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
  });
}
updatePrice();

// valitaan elementit

const orderBtn = document.getElementById("orderBtn");
const orderPopup = document.getElementById("orderPopup");
const closePopup = document.getElementById("closePopup");
const orderSummary = document.getElementById("orderSummary");

// tässä on tilaus ja popup
// kun käyttäjä painaa tilaa nappia koodi kerää valinnat ja näyttää ne popup näkymässä yhteen veto kohdassa

orderBtn.addEventListener("click", () => {
  let selectedPancake = selectedPancakeName;
  let selectedFillings = [...fillingsCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.nextElementSibling.textContent);
  let selectedExtras = [...extraCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.nextElementSibling.textContent);
  let selectedjams = [...jamCheckboxes]
    .filter((cb) => cb.checked)
    .map((cb) => cb.nextElementSibling.textContent);

  let summaryhtml = `
  <p><strong>pannukakku:</strong> ${selectedPancake}</p>
  <p><strong>täytteet:</strong> ${
    selectedFillings.join(",") || "ei valintoja"
  }</p>
  <p><strong>lisukkeet:</strong> ${
    selectedExtras.join(",") || "ei valintoja"
  }</p>
  <p><strong>hillo:</strong> ${selectedjams.join(",") || "ei valintoja"}</p>
  <p><strong>kpl:</strong> ${quantity}</p>
  <p><strong>hinta:</strong> ${totalPriceDisplay.textContent} </p>
  `;
  orderSummary.innerHTML = summaryhtml;
  orderPopup.classList.add("show");
});

// tässä suljetaan popup näkymä

closePopup.addEventListener("click", () => {
  orderPopup.classList.remove("show");
});

// valitaan elementit

const finalizeOrderBtn = document.getElementById("finalizeOrderBtn");
const clearSelectionsBtn = document.getElementById("clearSelectionsBtn");

function clearForm() {
  document
    .querySelectorAll(".option-card")
    .forEach((card) => card.classList.remove("active"));
  //valitaan oletus kortti ja päivitetään hinta tiedot
  const defaultCard = document.querySelector('.option-card[data-price="4"]');
  if (defaultCard) {
    defaultCard.classList.add("active");
    selectedPancakePrice = 4;
    selectedPancakeName = defaultCard.querySelector("h2").textContent;
  }
  //tyhjennetään kaikki täytteet lisukkeet ja hillo valinnat
  fillingsCheckboxes.forEach((cb) => (cb.checked = false));
  extraCheckboxes.forEach((cb) => (cb.checked = false));
  jamCheckboxes.forEach((cb) => (cb.checked = false));
  //tyhjentää kaikki lomakekentät esim teksti kenttä ja valintaruudut
  document
    .querySelectorAll(
      "#orderPopup input, #orderPopup textarea, #orderPopup select"
    )
    .forEach((el) => {
      if (el.type === "checkbox" || el.type === "radio") {
        el.checked = false;
      } else {
        el.value = "";
      }
    });
  //palauttaa toimitus tavan oletukseen
  document.getElementById("deliveryMethod").selectedIndex = 0;
  document.getElementById("paymentMethod").selectedIndex = 0;
  //palauttaa määrän oletukseen ja päivittää hinnan
  quantity = 1;
  quantityDisplay.textContent = quantity;
  updatePrice();
  //tyhjentää tilauksen yhteen vedon ja sulkee popupin
  orderSummary.innerHTML = "";
  orderPopup.classList.remove("show");
}
//lomakkeen validiointi eli määritetään kaikki tarkistettavat kohdat
//näytetään käyttäjälle error viesti jos jotain on väärin ja tarkistaa erityisesti sähköpostin

function validateForm() {
  let isValid = true;
  const requiredFields = [
    "#firstName",
    "#lastName",
    "#email",
    "#phone",
    "#address",
    "#postalCode",
    "#city",
    "#deliveryMethod",
    "#paymentMethod",
    "#deliveryTime",
    "#deliveryAddress",
    "#deliveryPostalCode",
    "#deliveryCity",
  ];
  requiredFields.forEach((selector) => {
    const field = document.querySelector(selector);
    const errorSpan = field.parentElement.querySelector(".error-message");
    if (field && errorSpan) {
      if (!field.value.trim()) {
        field.style.border = "2px solid red";
        errorSpan.textContent = "";
        isValid = false;
      } else {
        field.style.border = "";
        errorSpan.textContent = "";
      }
    }
  });

  const emailField = document.querySelector("#email");
  const emailError = emailField.parentElement.querySelector(".error-message");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailField.value.trim() && !emailRegex.test(emailField.value.trim())) {
    emailField.style.border = "2px solid red";
    emailError.textContent = "Virhe.";
    isValid = false;
  }
  return isValid;
}

//saatetaan tilaus loppuun ja näytetään viestit näytölle ja tyhjennetään valinnat lähetyksen jälkeen

finalizeOrderBtn.addEventListener("click", () => {
  if (!validateForm()) {
    alert("Täytä kaikki pakolliset kentät.");
    return;
  }
  alert("Kiitos tilauksestasi! Tilaus vahvistus on lähetetty sähköpostiisi.");
  clearForm();
});

//tämä tyhjentää kaikki valinnat ja palauttaa lomakkeen oletusasetuksiin

clearSelectionsBtn.addEventListener("click", clearForm);
