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

function buyBundle(network, size, price) {

    alert(
        `${network} ${size} bundle selected.\n\nPrice: GH₵ ${price.toFixed(2)}\n\nCheckout will be connected later.`
    );

}


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