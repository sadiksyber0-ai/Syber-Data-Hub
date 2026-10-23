
const bundleContainer = document.getElementById("bundleContainer");
const selectedNetwork = document.getElementById("selectedNetwork");

const networkNames = {
  MTN: "MTN Ghana",
  Telecel: "Telecel Ghana",
  AirtelTigo: "AT Ghana"
};

function selectNetwork(network) {
  if (!bundleContainer || !selectedNetwork) {
    console.error("Required homepage elements were not found.");
    return;
  }

  const networkName = networkNames[network];

  if (!networkName) {
    console.error("Unknown network:", network);
    return;
  }

  selectedNetwork.textContent = networkName;

  bundleContainer.replaceChildren();

  const message = document.createElement("p");
  message.textContent =
    `Live ${networkName} bundle prices and availability will appear here after a verified data supplier is connected.`;

  bundleContainer.appendChild(message);
}

document.querySelectorAll("[data-network]").forEach((button) => {
  button.addEventListener("click", () => {
    selectNetwork(button.dataset.network);
  });
});

if (bundleContainer) {
  const message = document.createElement("p");
  message.textContent =
    "Choose a network above to check its setup status. Live orders are not enabled yet.";

  bundleContainer.appendChild(message);
}

console.log("SYBER DATA HUB app.js loaded successfully.");
