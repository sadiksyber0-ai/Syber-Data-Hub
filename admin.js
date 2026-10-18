
import { supabase } from "./supabase.js";

const $ = id => document.getElementById(id);

function message(id, text, error = false) {
  $(id).textContent = text;
  $(id).style.color = error ? "#b42318" : "#237a3b";
}

let adminReady = false;

async function checkAdmin() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    location.replace("./index.html");
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "admin") {
    alert("Access denied. Administrators only.");
    location.replace("./index.html");
    return;
  }

  adminReady = true;
  await Promise.all([loadPrices(), loadOrders()]);
}

function safeCell(value) {
  const td = document.createElement("td");
  td.textContent = value ?? "";
  return td;
}

async function loadPrices() {
  message("pricesMessage", "Loading prices…");

  const { data, error } = await supabase
    .from("bundle_prices")
    .select("*")
    .order("network")
    .order("price");

  if (error) {
    message("pricesMessage", error.message, true);
    return;
  }

  const table = document.createElement("table");
  const head = document.createElement("tr");

  ["Network", "Bundle", "Price", "Status", "Actions"].forEach(label => {
    const th = document.createElement("th");
    th.textContent = label;
    head.appendChild(th);
  });

  const thead = document.createElement("thead");
  thead.appendChild(head);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach(item => {
    const tr = document.createElement("tr");
    tr.append(
      safeCell(item.network),
      safeCell(item.size),
      safeCell(`GH₵ ${Number(item.price).toFixed(2)}`),
      safeCell(item.is_active ? "Active" : "Hidden")
    );

    const actions = document.createElement("td");

    const edit = document.createElement("button");
    edit.textContent = "Edit";
    edit.onclick = () => {
      $("priceId").value = item.id;
      $("network").value = item.network;
      $("size").value = item.size;
      $("price").value = item.price;
      $("priceForm").scrollIntoView({ behavior: "smooth" });
    };

    const toggle = document.createElement("button");
    toggle.textContent = item.is_active ? "Hide" : "Activate";
    toggle.className = "secondary";
    toggle.onclick = async () => {
      const { error } = await supabase
        .from("bundle_prices")
        .update({
          is_active: !item.is_active,
          updated_at: new Date().toISOString()
        })
        .eq("id", item.id);

      if (error) {
        message("pricesMessage", error.message, true);
      } else {
        message("pricesMessage", "Bundle status updated.");
        await loadPrices();
      }
    };

    actions.append(edit, toggle);
    tr.appendChild(actions);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  $("pricesTable").replaceChildren(table);
  message("pricesMessage", `${data.length} bundle prices loaded.`);
}

$("priceForm").addEventListener("submit", async event => {
  event.preventDefault();
  if (!adminReady) return;

  const id = $("priceId").value;
  const network = $("network").value;
  const size = $("size").value.trim().toUpperCase();
  const price = Number($("price").value);

  if (!size || !Number.isFinite(price) || price < 0) {
    message("pricesMessage", "Enter a valid bundle and price.", true);
    return;
  }

  message("pricesMessage", "Saving price…");

  let result;

  if (id) {
    result = await supabase
      .from("bundle_prices")
      .update({
        network, size, price,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);
  } else {
    result = await supabase
      .from("bundle_prices")
      .upsert(
        { network, size, price, is_active: true },
        { onConflict: "network,size" }
      );
  }

  if (result.error) {
    message("pricesMessage", result.error.message, true);
    return;
  }

  $("priceForm").reset();
  $("priceId").value = "";
  message("pricesMessage", "Bundle price saved successfully.");
  await loadPrices();
});

$("clearPrice").addEventListener("click", () => {
  $("priceForm").reset();
  $("priceId").value = "";
});

async function loadOrders() {
  message("ordersMessage", "Loading orders…");

  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    message("ordersMessage", error.message, true);
    return;
  }

  $("totalOrders").textContent = data.length;
  $("pendingOrders").textContent =
    data.filter(o => o.status === "pending").length;
  $("deliveredOrders").textContent =
    data.filter(o => o.status === "delivered").length;

  const table = document.createElement("table");
  const header = document.createElement("tr");

  ["Order", "Date", "Phone", "Network", "Bundle", "Price", "Status", "Action"]
    .forEach(label => {
      const th = document.createElement("th");
      th.textContent = label;
      header.appendChild(th);
    });

  const thead = document.createElement("thead");
  thead.appendChild(header);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  data.forEach(order => {
    const tr = document.createElement("tr");
    const date = new Date(order.created_at).toLocaleString();

    tr.append(
      safeCell(`#${order.id}`),
      safeCell(date),
      safeCell(order.customer_phone),
      safeCell(order.network),
      safeCell(order.bundle_size),
      safeCell(`GH₵ ${Number(order.price).toFixed(2)}`),
      safeCell(order.status)
    );

    const actions = document.createElement("td");

    if (order.status !== "delivered" && order.status !== "cancelled") {
      const delivered = document.createElement("button");
      delivered.textContent = "Mark delivered";
      delivered.onclick = async () => {
        if (!confirm(
          `Confirm order #${order.id} has actually been delivered?`
        )) return;

        delivered.disabled = true;

        const { error } = await supabase
          .from("orders")
          .update({
            status: "delivered",
            delivered_at: new Date().toISOString()
          })
          .eq("id", order.id);

        if (error) {
          message("ordersMessage", error.message, true);
        } else {
          message("ordersMessage", `Order #${order.id} marked delivered.`);
          await loadOrders();
        }
      };
      actions.appendChild(delivered);

      if (order.status === "pending") {
        const processing = document.createElement("button");
        processing.textContent = "Processing";
        processing.className = "secondary";
        processing.onclick = async () => {
          const { error } = await supabase
            .from("orders")
            .update({ status: "processing" })
            .eq("id", order.id);

          if (error) {
            message("ordersMessage", error.message, true);
          } else {
            await loadOrders();
          }
        };
        actions.appendChild(processing);
      }
    }

    tr.appendChild(actions);
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  $("ordersTable").replaceChildren(table);
  message("ordersMessage", `${data.length} recent orders loaded.`);
}

$("refreshOrders").addEventListener("click", loadOrders);

$("logoutBtn").addEventListener("click", async () => {
  await supabase.auth.signOut();
  location.replace("./index.html");
});

checkAdmin().catch(error => {
  message("message", error.message || "Could not load admin dashboard.", true);
});
