import { supabase } from './supabase.js';

/* =========================================
   SYBER MART - APP.JS
   Bundles, purchases, login and registration
========================================= */

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
const signupBtn = document.getElementById("createAccountBtn");
const signupModal = document.getElementById("createaccountmodal");

/* =========================================
   SUPABASE CONNECTION
   Uses your existing supabase.js file.
========================================= */

let supabaseClient = null;

async function getSupabase() {
    if (supabaseClient) return supabaseClient;

    try {
        const module = await import("./supabase.js");
        supabaseClient = module.supabase;

        if (!supabaseClient) {
            throw new Error("The Supabase client was not exported.");
        }

        return supabaseClient;
    } catch (error) {
        console.error("Supabase connection error:", error);
        throw new Error(
            "Cannot connect to Supabase. Please check supabase.js and try again."
        );
    }
}

function showMessage(elementId, message, isError = false) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#c62828" : "#237a3b";
}

/* =========================================
   SELECT NETWORK
========================================= */

function selectNetwork(network) {
    if (!bundles[network] || !bundleContainer || !selectedNetwork) {
        console.error("Network or bundle container not found:", network);
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

/* =========================================
   PURCHASE FORM - DEMO ONLY
========================================= */

let currentOrder = null;

function buyBundle(network, size, price) {
    currentOrder = { network, size, price };

    const modal = document.getElementById("purchaseModal");
    if (!modal) return;

    document.getElementById("orderNetwork").textContent = network;
    document.getElementById("orderSize").textContent = size;
    document.getElementById("orderPrice").textContent =
        `GH₵ ${price.toFixed(2)}`;

    document.getElementById("recipientPhone").value = "";
    document.getElementById("purchaseMessage").textContent = "";

    modal.style.display = "flex";
}

function closePurchase() {
    const modal = document.getElementById("purchaseModal");
    if (modal) modal.style.display = "none";
}

const purchaseForm = document.getElementById("purchaseForm");

if (purchaseForm) {
    purchaseForm.addEventListener("submit", event => {
        event.preventDefault();

        if (!currentOrder) return;

        const phoneInput = document.getElementById("recipientPhone");
        const phone = phoneInput.value.trim().replace(/[\s-]/g, "");
        const validPhone = /^(0\d{9}|\+233\d{9}|233\d{9})$/.test(phone);

        if (!validPhone) {
            showMessage(
                "purchaseMessage",
                "Enter a valid Ghanaian phone number, e.g. 0241234567.",
                true
            );
            return;
        }

        showMessage(
            "purchaseMessage",
            `Details checked: ${currentOrder.network} ${currentOrder.size} for ${phone}. Total: GH₵ ${currentOrder.price.toFixed(2)}. Demo only: no payment or data delivery has occurred.`
        );

        console.log("SYBER MART demo order:", {
            ...currentOrder,
            phone,
            status: "Demo — not submitted"
        });
    });
}

/* =========================================
   SCROLL TO BUNDLES
========================================= */

function scrollToBundles() {
    document.getElementById("bundles")?.scrollIntoView({
        behavior: "smooth"
    });
}

/* =========================================
   OPEN AND CLOSE MODALS
========================================= */

function openLogin() {
    if (signupModal) signupModal.style.display = "none";
    if (loginModal) loginModal.style.display = "flex";
}

function closeLogin() {
    if (loginModal) loginModal.style.display = "none";
}

function openSignup() {
    if (loginModal) loginModal.style.display = "none";
    if (signupModal) signupModal.style.display = "flex";
}

function closesignup() {
    if (signupModal) signupModal.style.display = "none";
}

loginBtn?.addEventListener("click", openLogin);
signupBtn?.addEventListener("click", openSignup);

document.getElementById("showSignupLink")?.addEventListener("click", event => {
    event.preventDefault();
    openSignup();
});

document.getElementById("showLoginLink")?.addEventListener("click", event => {
    event.preventDefault();
    openLogin();
});

window.addEventListener("click", event => {
    if (event.target === loginModal) closeLogin();
    if (event.target === signupModal) closesignup();

    const purchaseModal = document.getElementById("purchaseModal");
    if (event.target === purchaseModal) closePurchase();
});

/* =========================================
   CREATE ACCOUNT - SUPABASE AUTH
========================================= */

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const submitButton = signupForm.querySelector('button[type="submit"]');

        if (password.length < 6) {
            showMessage(
                "signupMessage",
                "Your password must contain at least 6 characters.",
                true
            );
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = "Creating account...";
        showMessage("signupMessage", "Please wait while we create your account...");

        try {
            const supabase = await getSupabase();

            const { data, error } = await supabase.auth.signUp({
                email,
                password
            });

            if (error) throw error;

            if (data.session) {
                showMessage(
                    "signupMessage",
                    "Account created successfully! You are now signed in."
                );

                signupForm.reset();

                setTimeout(() => {
                    closesignup();
                }, 1500);
            } else if (data.user) {
                showMessage(
                    "signupMessage",
                    "Registration received! Check your email for a confirmation link before logging in."
                );
            } else {
                showMessage(
                    "signupMessage",
                    "Registration could not be confirmed. Please try again.",
                    true
                );
            }
        } catch (error) {
            console.error("SYBER MART registration error:", error);

            let message = error.message || "Account creation failed. Please try again.";

            if (/already registered|already exists|already been registered/i.test(message)) {
                message = "An account may already exist with this email. Try logging in instead.";
            } else if (/invalid.*email/i.test(message)) {
                message = "Please enter a valid email address.";
            } else if (/password/i.test(message)) {
                message = "Please check your password and try again.";
            }

            showMessage("signupMessage", message, true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Create Account";
        }
    });
}

/* =========================================
   LOGIN - SUPABASE AUTH
========================================= */

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async event => {
        event.preventDefault();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const submitButton = loginForm.querySelector('button[type="submit"]');

        submitButton.disabled = true;
        submitButton.textContent = "Logging in...";
        showMessage("loginMessage", "Checking your login details...");

        try {
            const supabase = await getSupabase();

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            if (data.user) {
                showMessage("loginMessage", "Login successful!");

                if (loginBtn) {
                    loginBtn.textContent = "Account";
                }

                loginForm.reset();

                setTimeout(() => {
                    closeLogin();
                }, 1200);
            } else {
                showMessage(
                    "loginMessage",
                    "Login could not be completed. Please try again.",
                    true
                );
            }
        } catch (error) {
            console.error("SYBER MART login error:", error);

            let message = error.message || "Login failed. Please try again.";

            if (/invalid login credentials/i.test(message)) {
                message = "Incorrect email or password. Please check and try again.";
            } else if (/email not confirmed/i.test(message)) {
                message = "Please confirm your email using the link sent to your inbox.";
            }

            showMessage("loginMessage", message, true);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = "Login";
        }
    });
}

/* =========================================
   MAKE FUNCTIONS AVAILABLE TO HTML
========================================= */

window.selectNetwork = selectNetwork;
window.buyBundle = buyBundle;
window.closePurchase = closePurchase;
window.scrollToBundles = scrollToBundles;
window.openLogin = openLogin;
window.closeLogin = closeLogin;
window.openSignup = openSignup;
window.closesignup = closesignup;

/* =========================================
   DEFAULT BUNDLES
========================================= */

selectNetwork("MTN");
