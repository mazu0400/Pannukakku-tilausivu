function renderOrders() {
  const ordersContainer = document.getElementById("ordersContainer");
  if (!ordersContainer) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];

  ordersContainer.innerHTML = "";

  if (orders.length === 0) {
    ordersContainer.innerHTML = "<p>Ei tilauksia.</p>";
    return;
  }
  orders.forEach((order) => {
    const orderDiv = document.createElement("div");
    orderDiv.classList.add("order");
    const fillings =
      order.fillings.length > 0 ? order.fillings.join(", ") : "ei valintoja";
    const extras =
      order.extras.length > 0 ? order.extras.join(", ") : "ei valintoja";
    const jams = order.jams.length > 0 ? order.jams.join(", ") : "ei valintoja";

    const statusClass = `status-${order.status
      .replace(/\s+/g, "")
      .toLowerCase()}`;
    const statusSelect = document.createElement("select");
    ["vastaanotettu", "Työn alla", "Matkalla", "Toimitettu"].forEach(
      (statusOption) => {
        const option = document.createElement("option");
        option.value = statusOption;
        option.textContent = statusOption;
        if (order.status === statusOption) option.selected = true;
        statusSelect.appendChild(option);
      }
    );

    statusSelect.addEventListener("change", (e) => {
      order.status = e.target.value;
      localStorage.setItem("orders", JSON.stringify(orders));
      renderOrders();
    });
    orderDiv.innerHTML = `
        <p><strong>Tilausnumero:</strong> ${order.id}</p>
        <p><strong>Asiakkaan nimi:</strong> ${order.firstName} ${order.lastName}</p>
        <p><strong>Pannukakun tyyppi:</strong>${order.pancake}</p>
        <p><strong>Täytteet:</strong> ${fillings}</p>
        <p><strong>Lisätäytteet:</strong>${extras}</p>
        <p><strong>Hillo:</strong>${jams}</p>
        <p><strong>Toimitustapa:</strong>${order.deliveryMethod}</p>
        <p><strong>Kokonaishinta:</strong>${order.price}</p>
        <p><strong>Tila:</strong>
        <span class="status-indicator ${statusClass}"></span>
        <span>${order.status}</span>
        </p>
      `;
    orderDiv.appendChild(statusSelect);
    ordersContainer.appendChild(orderDiv);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderOrders();

  document.getElementById("openOldOrdersBtn").addEventListener("click", () => {
    document.getElementById("oldOrdersPopup").classList.remove("hidden");
    showOldOrders();
  });

  document
    .getElementById("closeOldOrdersPopup")
    .addEventListener("click", () => {
      document.getElementById("oldOrdersPopup").classList.add("hidden");
    });
  document
    .getElementById("searchOldOrders")
    .addEventListener("input", showOldOrders);

  document.getElementById("clearOrdersBtn").addEventListener("click", () => {
    const currentOrders = JSON.parse(localStorage.getItem("orders")) || [];
    const archivedOrders =
      JSON.parse(localStorage.getItem("archivedOrders")) || [];

    const deliveryOrders = currentOrders.filter(
      (order) => order.status.toLowerCase() === "toimitettu"
    );
    const otherOrders = currentOrders.filter(
      (order) => order.status.toLowerCase() !== "toimitettu"
    );

    const updateArchive = archivedOrders.concat(deliveryOrders);
    localStorage.setItem("archivedOrders", JSON.stringify(updateArchive));
    localStorage.setItem("orders", JSON.stringify(otherOrders));
    renderOrders();
  });
  document.getElementById("clearArchiveBtn").addEventListener("click", () => {
    localStorage.removeItem("archivedOrders");
    alert("Arkisto tyhjennetty!");
    showOldOrders();
  });
});
function showOldOrders() {
  const allOrders = JSON.parse(localStorage.getItem("archivedOrders")) || [];
  const searchQuery = document
    .getElementById("searchOldOrders")
    .value.toLowerCase();
  const listContainer = document.getElementById("oldOrdersList");
  const filtered = allOrders.filter(
    (order) =>
      String(order.id).toLowerCase().includes(searchQuery) ||
      order.firstName.toLowerCase().includes(searchQuery) ||
      order.lastName.toLowerCase().includes(searchQuery)
  );
  if (filtered.length === 0) {
    listContainer.innerHTML = "<p>Ei löytynyt tilauksia.</p>";
    return;
  }
  listContainer.innerHTML = "";
  filtered.forEach((order) => {
    const div = document.createElement("div");
    div.classList.add("order");
    div.innerHTML = `
            <p><strong>ID:</strong> ${order.id}</p>
        <p><strong>Asiakas:</strong> ${order.firstName} ${order.lastName}</p>
        <p><strong>Tila:</strong> ${order.status}</p>
        <hr/>
        `;
    listContainer.appendChild(div);
  });
}
