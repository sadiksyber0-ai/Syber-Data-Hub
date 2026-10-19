
const bundles = {
    MTN: [
        { size: "1GB", price: 5 },
        { size: "2GB", price: 10 },
        { size: "5GB", price: 20 },
        { size: "10GB", price: 35 }
    ],
    Telecel: [
        { size: "1GB", price: 5 },
        { size: "2GB", price: 10 },
        { size: "5GB", price: 20 },
        { size: "10GB", price: 35 }
    ],
    AirtelTigo: [
        { size: "1GB", price: 5 },
        { size: "2GB", price: 10 },
        { size: "5GB", price: 20 },
        { size: "10GB", price: 35 }
    ]
};

const bundleContainer = document.getElementById("bundleContainer");
const selectedNetwork = document.getElementById("selectedNetwork");
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const createAccountBtn = document.getElementById("createAccountBtn");
const createaccountModal = document.getElementById("createaccountmodal");

/* =========================
   SELECT NETWORK
========================= */

function selectNetwork(network) {
    if (!bundles[network] || !bundleContainer || !selectedNetwork) {
        console.error("Network or bundle elements not found:", network);
        return;
    }

    selectedNetwork.textContent = network + " Data Bundles";
    bundleContainer.innerHTML = "";

    bundles[network].forEach(bundle => {
        const card = document.createElement("div");
        card.className = "bundle-card";

        card.innerHTML = `
            <div class="bundle-network">${network}</div>
            <div class="bundle-size">${bundle.size}</div>
            <div class="bundle-price">
                GH₵ ${bundle.price.toFixed(2)}
            </div>
            <button class="buy-btn" type="button">Buy Now</button>
        `;

        card.querySelector(".buy-btn").addEventListener("click", () => {
            buyBundle(network, bundle.size, bundle.price);
        });

        bundleContainer.appendChild(card);
    });

    document.getElementById("bundles")?.scrollIntoView({
        behavior: "smooth"
    });
}

/* =========================
   BUY BUNDLE
========================= */

let currentOrder = null;

function buyBundle(network, size, price) {
    currentOrder = { network, size, price };

    const orderNetwork = document.getElementById("orderNetwork");
    const orderSize = document.getElementById("orderSize");
    const orderPrice = document.getElementById("orderPrice");
    const recipientPhone = document.getElementById("recipientPhone");
    const purchaseMessage = document.getElementById("purchaseMessage");
    const purchaseModal = document.getElementById("purchaseModal");

    if (!purchaseModal) {
        console.error("Purchase modal not found.");
        return;
    }

    if (orderNetwork) orderNetwork.textContent = network;
    if (orderSize) orderSize.textContent = size;
    if (orderPrice) orderPrice.textContent = `GH₵ ${price.toFixed(2)}`;
    if (recipientPhone) recipientPhone.value = "";
    if (purchaseMessage) purchaseMessage.textContent = "";

    purchaseModal.style.display = "flex";
}

function closePurchase() {
    const modal = document.getElementById("purchaseModal");
    if (modal) modal.style.display = "none";
}

const purchaseForm = document.getElementById("purchaseForm");

if (purchaseForm) {
    purchaseForm.addEventListener("submit", function(event) {
        event.preventDefault();

        if (!currentOrder) return;

        const phoneInput = document.getElementById("recipientPhone");
        const message = document.getElementById("purchaseMessage");

        if (!phoneInput || !message) return;

        const phone = phoneInput.value.trim();
        const normalizedPhone = phone.replace(/[\s-]/g, "");
        const validPhone = /^(0\d{9}|\+233\d{9}|233\d{9})$/.test(normalizedPhone);

        if (!validPhone) {
            message.textContent =
                "Enter a valid Ghanaian phone number, e.g. 0241234567.";
            message.style.color = "#c62828";
            return;
        }

        message.style.color = "#237a3b";
        message.textContent =
            `Details checked: ${currentOrder.network} ${currentOrder.size} ` +
            `for ${normalizedPhone}. Total: GH₵ ${currentOrder.price.toFixed(2)}. ` +
            "Demo only: no payment or data delivery has occurred.";

        console.log("SYBER MART demo order:", {
            ...currentOrder,
            phone: normalizedPhone,
            status: "Demo — not submitted"
        });
    });
}

/* =========================
   SCROLL TO BUNDLES
========================= */

function scrollToBundles() {
    document.getElementById("bundles")?.scrollIntoView({
        behavior: "smooth"
    });
}

/* =========================
   LOGIN
========================= */

function openLogin() {
    if (loginModal) loginModal.style.display = "flex";
}

function closeLogin() {
    if (loginModal) loginModal.style.display = "none";
}

if (loginBtn) {
    loginBtn.addEventListener("click", openLogin);
}

/* =========================
   CREATE ACCOUNT
========================= */

function openSignup() {
    if (createaccountModal) {
        createaccountModal.style.display = "flex";
    }
}

function closesignup() {
    if (createaccountModal) {
        createaccountModal.style.display = "none";
    }
}

if (createAccountBtn) {
    createAccountBtn.addEventListener("click", openSignup);
}

/* =========================
   CLOSE MODALS WHEN BACKDROP IS CLICKED
========================= */

window.addEventListener("click", function(event) {
    if (event.target === loginModal) closeLogin();
    if (event.target === createaccountModal) closesignup();

    const purchaseModal = document.getElementById("purchaseModal");
    if (event.target === purchaseModal) closePurchase();
});

/* =========================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================= */

window.selectNetwork = selectNetwork;
window.buyBundle = buyBundle;
window.closePurchase = closePurchase;
window.scrollToBundles = scrollToBundles;
window.openLogin = openLogin;
window.closeLogin = closeLogin;
window.openSignup = openSignup;
window.closesignup = closesignup;

/* =========================
   DEFAULT BUNDLES
========================= */

selectNetwork("MTN");
