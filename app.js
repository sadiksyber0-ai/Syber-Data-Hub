
import { supabase } from "./supabase.js";

/* =========================================
   SYBER MART - APP.JS
   Bundles, demo purchases, login and signup
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

const $ = id => document.getElementById(id);

const bundleContainer = $("bundleContainer");
const selectedNetwork = $("selectedNetwork");
const loginBtn = $("loginBtn");
const loginModal = $("loginModal");
const signupBtn = $("createAccountBtn");
const signupModal = $("createaccountmodal");

console.log("SYBER MART app.js loaded");

/* =========================================
   MESSAGE HELPER
========================================= */

function showMessage(elementId, message, isError = false) {
    const element = $(elementId);
    if (!element) return;

    element.textContent = message;
    element.style.color = isError ? "#c62828" : "#237a3b";
}

/* =========================================
   NETWORKS AND BUNDLES
========================================= */

function selectNetwork(network) {
    if (!bundles[network] || !bundleContainer || !selectedNetwork) {
        console.error("Network or bundle container not found:", network);
        return;
    }

    selectedNetwork.textContent = `${network} Data Bundles`;
    bundleContainer.replaceChildren();

    bundles[network].forEach(bundle => {
        const card = document.createElement("div");
        card.className = "bundle-card";

        const networkName = document.createElement("div");
        networkName.className = "bundle-network";
        networkName.textContent = network;

        const size = document.createElement("div");
        size.className = "bundle-size";
        size.textContent = bundle.size;

        const price = document.createElement("div");
        price.className = "bundle-price";
        price.textContent = `GH₵ ${bundle.price.toFixed(2)}`;

        const button = document.createElement("button");
        button.className = "buy-btn";
        button.type = "button";
        button.textContent = "Buy Now";
        button.addEventListener("click", () => {
            buyBundle(network, bundle.size, bundle.price);
        });

        card.append(networkName, size, price, button);
        bundleContainer.appendChild(card);
    });
}

/* =========================================
   PURCHASE FORM - DEMO ONLY
========================================= */

let currentOrder = null;

function buyBundle(network, size, price) {
    currentOrder = { network, size, price };

    const modal = $("purchaseModal");
    if (!modal) return;

    $("orderNetwork").textContent = network;
    $("orderSize").textContent = size;
    $("orderPrice").textContent = `GH₵ ${price.toFixed(2)}`;
    $("recipientPhone").value = "";
    $("purchaseMessage").textContent = "";

    modal.style.display = "flex";
}

function closePurchase() {
    const modal = $("purchaseModal");
    if (modal) modal.style.display = "none";
}

$("purchaseForm")?.addEventListener("submit", event => {
    event.preventDefault();

    if (!currentOrder) {
        showMessage("purchaseMessage", "Please select a bundle first.", true);
        return;
    }

    const phone = $("recipientPhone").value.trim().replace(/[\s-]/g, "");
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

/* =========================================
   SCROLL
========================================= */

function scrollToBundles() {
    $("bundles")?.scrollIntoView({ behavior: "smooth" });
}

/* =========================================
   MODALS
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

$("showSignupLink")?.addEventListener("click", event => {
    event.preventDefault();
    openSignup();
});

$("showLoginLink")?.addEventListener("click", event => {
    event.preventDefault();
    openLogin();
});

window.addEventListener("click", event => {
    if (event.target === loginModal) closeLogin();
    if (event.target === signupModal) closesignup();
    if (event.target === $("purchaseModal")) closePurchase();
});

/* =========================================
   SUPABASE CONNECTION CHECK
========================================= */

function getSupabase() {
    if (!supabase || !supabase.auth) {
        throw new Error(
            "Supabase did not initialize. Check the export in supabase.js and your project settings."
        );
    }
    return supabase;
}

/* =========================================
   CREATE ACCOUNT
========================================= */

const signupForm = $("signupForm");

signupForm?.addEventListener("submit", async event => {
    event.preventDefault();

    const email = $("signupEmail").value.trim();
    const password = $("signupPassword").value;
    const button = signupForm.querySelector('button[type="submit"]');

    if (password.length < 6) {
        showMessage(
            "signupMessage",
            "Your password must contain at least 6 characters.",
            true
        );
        return;
    }

    if (!email) {
        showMessage("signupMessage", "Please enter your email address.", true);
        return;
    }

    button.disabled = true;
    button.textContent = "Creating account...";
    showMessage("signupMessage", "Connecting to Supabase. Please wait...");

    try {
        const client = getSupabase();

        const { data, error } = await client.auth.signUp({
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
        } else if (data.user) {
            showMessage(
                "signupMessage",
                "Registration received. Check your email for a confirmation link before logging in."
            );
        } else {
            showMessage(
                "signupMessage",
                "Supabase did not confirm registration. Please try again.",
                true
            );
        }
    } catch (error) {
        console.error("SYBER MART registration error:", error);

        let message = error?.message || "Account creation failed. Please try again.";

        if (/already registered|already exists|already been registered/i.test(message)) {
            message = "An account may already exist with this email. Try logging in instead.";
        } else if (/invalid.*email/i.test(message)) {
            message = "Please enter a valid email address.";
        } else if (/password/i.test(message)) {
            message = "Please check your password and try again.";
        } else if (/failed to fetch|networkerror/i.test(message)) {
            message = "Could not reach Supabase. Check your internet connection and supabase.js settings.";
        }

        showMessage("signupMessage", message, true);
    } finally {
        button.disabled = false;
        button.textContent = "Create Account";
    }
});

/* =========================================
   LOGIN
========================================= */

const loginForm = $("loginForm");

loginForm?.addEventListener("submit", async event => {
    event.preventDefault();

    const email = $("loginEmail").value.trim();
    const password = $("loginPassword").value;
    const button = loginForm.querySelector('button[type="submit"]');

    button.disabled = true;
    button.textContent = "Logging in...";
    showMessage("loginMessage", "Checking your login details...");

    try {
        const client = getSupabase();

        const { data, error } = await client.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        if (data.user) {
            showMessage("loginMessage", "Login successful!");
            if (loginBtn) loginBtn.textContent = "Account";
            loginForm.reset();

            setTimeout(closeLogin, 1200);
        } else {
            showMessage("loginMessage", "Login could not be completed. Please try again.", true);
        }
    } catch (error) {
        console.error("SYBER MART login error:", error);

        let message = error?.message || "Login failed. Please try again.";

        if (/invalid login credentials/i.test(message)) {
            message = "Incorrect email or password. Please check and try again.";
        } else if (/email not confirmed/i.test(message)) {
            message = "Please confirm your email using the link sent to your inbox.";
        } else if (/failed to fetch|networkerror/i.test(message)) {
            message = "Could not reach Supabase. Check your internet connection and supabase.js settings.";
        }

        showMessage("loginMessage", message, true);
    } finally {
        button.disabled = false;
        button.textContent = "Login";
    }
});

/* =========================================
   EXPOSE FUNCTIONS USED BY HTML
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
   INITIAL BUNDLES
========================================= */

selectNetwork("MTN");
