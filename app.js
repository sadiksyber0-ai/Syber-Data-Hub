
import { supabase } from "./Supabase.js";

const loginBtn = document.getElementById("loginBtn");
const authModal = document.getElementById("authModal");
const closeAuthBtn = document.getElementById("closeAuthBtn");
const authForm = document.getElementById("authForm");
const authTitle = document.getElementById("authTitle");
const authName = document.getElementById("authName");
const authPhone = document.getElementById("authPhone");
const nameField = document.getElementById("nameField");
const phoneField = document.getElementById("phoneField");
const authEmail = document.getElementById("authEmail");
const authPassword = document.getElementById("authPassword");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const authMessage = document.getElementById("authMessage");
const toggleAuthBtn = document.getElementById("toggleAuthBtn");

let isSignup = false;

function showMessage(message, isError = false) {
  authMessage.textContent = message;
  authMessage.style.color = isError ? "#c62828" : "#16803c";
}

function openAuthModal() {
  authModal.hidden = false;
  showMessage("");
}

function closeAuthModal() {
  authModal.hidden = true;
  showMessage("");
}

function updateAuthMode() {
  authTitle.textContent = isSignup ? "Create Your Account" : "Customer Login";
  authSubmitBtn.textContent = isSignup ? "Create Account" : "Sign In";
  nameField.hidden = !isSignup;
  phoneField.hidden = !isSignup;
  authName.required = isSignup;
  authPhone.required = isSignup;
  authPassword.autocomplete = isSignup
    ? "new-password"
    : "current-password";
  toggleAuthBtn.textContent = isSignup
    ? "Already registered? Sign in"
    : "New customer? Create an account";
  showMessage("");
}
console.log("Login button:", loginBtn);
console.log("Login modal:", authModal);
console.log("Open modal function:", typeof openAuthModal);
if (loginBtn) {
  loginBtn.onclick = function (event) {
    event.preventDefault();
    authModal.hidden = false;
    authModal.style.display = "flex";
    showMessage("");
  };
}

if (closeAuthBtn) {
  closeAuthBtn.onclick = function () {
    authModal.hidden = true;
    authModal.style.display = "none";
  };
}

authModal?.addEventListener("click", (event) => {
  if (event.target === authModal) closeAuthModal();
});

toggleAuthBtn?.addEventListener("click", () => {
  isSignup = !isSignup;
  updateAuthMode();
});

authForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = authEmail.value.trim();
  const password = authPassword.value;
  const fullName = authName.value.trim();
  const phone = authPhone.value.trim();

  authSubmitBtn.disabled = true;
  showMessage(isSignup ? "Creating your account..." : "Signing you in...");

  try {
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });

      if (error) throw error;

      if (data.user && data.session) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: data.user.id,
            full_name: fullName,
            phone
          });

        if (profileError) throw profileError;
        showMessage("Account created successfully!");
      } else {
        showMessage(
          "Registration received. Check your email to confirm your account."
        );
      }

      authForm.reset();
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      showMessage("Login successful!");
      loginBtn.textContent = "Account";
      setTimeout(() => window.location.reload(), 800);
    }
  } catch (error) {
    showMessage(error.message || "Something went wrong.", true);
  } finally {
    authSubmitBtn.disabled = false;
  }
});

async function restoreSession() {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Could not restore session:", error.message);
    return;
  }

  if (data.session && loginBtn) {
    loginBtn.textContent = "Account";
  }
}

updateAuthMode();
restoreSession();
console.log("LOGIN DEBUG: app.js reached the end");
console.log("LOGIN DEBUG: button found =", !!loginBtn);
console.log("LOGIN DEBUG: modal found =", !!authModal);
console.log("SYBER DATA HUB authentication loaded.");
