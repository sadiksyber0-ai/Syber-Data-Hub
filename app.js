const bundles = {

    MTN: [
        {
            size: "1GB",
            price: 5
        },
        {
            size: "2GB",
            price: 10
        },
        {
            size: "5GB",
            price: 20
        },
        {
            size: "10GB",
            price: 35
        }
    ],

    Telecel: [
        {
            size: "1GB",
            price: 5
        },
        {
            size: "2GB",
            price: 10
        },
        {
            size: "5GB",
            price: 20
        },
        {
            size: "10GB",
            price: 35
        }
    ],

    AirtelTigo: [
        {
            size: "1GB",
            price: 5
        },
        {
            size: "2GB",
            price: 10
        },
        {
            size: "5GB",
            price: 20
        },
        {
            size: "10GB",
            price: 35
        }
    ]

};


const bundleContainer =
    document.getElementById("bundleContainer");

const selectedNetwork =
    document.getElementById("selectedNetwork");

const loginBtn =
    document.getElementById("loginBtn");

const loginModal =
    document.getElementById("loginModal");


/* =========================
   SELECT NETWORK
========================= */

function selectNetwork(network) {

    selectedNetwork.textContent =
        network + " Data Bundles";

    bundleContainer.innerHTML = "";

    bundles[network].forEach(bundle => {

        const card =
            document.createElement("div");

        card.className = "bundle-card";

        card.innerHTML = `

            <div class="bundle-network">
                ${network}
            </div>

            <div class="bundle-size">
                ${bundle.size}
            </div>

            <div class="bundle-price">
                GH₵ ${bundle.price.toFixed(2)}
            </div>

            <button
                class="buy-btn"
                onclick="buyBundle('${network}', '${bundle.size}', ${bundle.price})"
            >
                Buy Now
            </button>

        `;

        bundleContainer.appendChild(card);

    });

    document.getElementById("bundles")
        .scrollIntoView({
            behavior: "smooth"
        });
}


/* =========================
   BUY BUNDLE
========================= */


let currentOrder = null;

function buyBundle(network, size, price) {
    currentOrder = { network, size, price };

    document.getElementById("orderNetwork").textContent = network;
    document.getElementById("orderSize").textContent = size;
    document.getElementById("orderPrice").textContent =
        `GH₵ ${price.toFixed(2)}`;

    document.getElementById("recipientPhone").value = "";
    document.getElementById("purchaseMessage").textContent = "";

    document.getElementById("purchaseModal").style.display = "flex";
}

function closePurchase() {
    document.getElementById("purchaseModal").style.display = "none";
}

document.getElementById("purchaseForm").addEventListener("submit", function(event) {
    event.preventDefault();

    if (!currentOrder) return;

    const phone = document.getElementById("recipientPhone")
        .value.trim();

    const normalizedPhone = phone.replace(/[\s-]/g, "");
    const validPhone =
        /^(0\d{9}|\+233\d{9}|233\d{9})$/.test(normalizedPhone);

    const message = document.getElementById("purchaseMessage");

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



/* =========================
   SCROLL TO BUNDLES
========================= */

function scrollToBundles() {

    document.getElementById("bundles")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================
   LOGIN
========================= */

loginBtn.addEventListener("click", () => {

    loginModal.style.display = "flex";

});


function closeLogin() {

    loginModal.style.display = "none";

}


window.addEventListener("click", (event) => {

    if (event.target === loginModal) {

        closeLogin();

    }

});


/* =========================
   DEFAULT BUNDLES
========================= */

selectNetwork("MTN");