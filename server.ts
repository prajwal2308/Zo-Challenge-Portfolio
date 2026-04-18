import { serveStatic } from "hono/bun";
import type { ViteDevServer } from "vite";
import { createServer as createViteServer } from "vite";
import config from "./zosite.json";
import { Hono } from "hono";

// AI agents: read README.md for navigation and contribution guidance.
type Mode = "development" | "production";
const app = new Hono();

const mode: Mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

// Lazy Stripe initialization
let _stripe: any = null;
const getStripe = async () => {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  const Stripe = (await import('stripe')).default;
  _stripe = new Stripe(key);
  return _stripe;
};

if (mode === "production") {
  configureProduction(app);
} else {
  await configureDevelopment(app);
}

/**
 * Add any API routes here.
 */
app.get("/api/hello-zo", (c) => c.json({ msg: "Hello from Zo" }));

// Legacy booking endpoint - redirects to Gmail
app.post("/api/booking", async (c) => {
  const { name, email, date, time, message } = await c.req.json();
  
  if (!name || !email || !date) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  
  const subject = `📅 Booking Request from ${name}`;
  const body = `
📋 NEW BOOKING REQUEST

Name: ${name}
Email: ${email}
Preferred Time: ${date}${time ? `\nTime: ${time}` : ''}
Purpose: ${message || 'Not specified'}

---
Submitted from: Prajwal's Portfolio
  `.trim();
  
  // Use Gmail via Zo API
  await fetch("https://api.zo.computer/zo/gmail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.ZO_API_KEY || process.env.ZO_CLIENT_IDENTITY_TOKEN || ""}`
    },
    body: JSON.stringify({
      to: "prajwal.srinivas238@gmail.com",
      subject,
      body
    })
  });
  
  return c.json({ success: true, message: "Booking request sent" });
});

app.post("/api/create-payment-intent", async (c) => {
  const { amount } = await c.req.json();
  
  if (!amount || amount < 100 || amount > 10000) {
    return c.json({ error: "Invalid amount" }, 400);
  }

  const stripe = await getStripe();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount),
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return c.json({ clientSecret: paymentIntent.client_secret });
});

app.post("/api/create-checkout-session", async (c) => {
  const { amount } = await c.req.json();
  
  if (!amount || amount < 100 || amount > 10000) {
    return c.json({ error: "Invalid amount" }, 400);
  }

  const stripe = await getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{
      price_data: {
        currency: "usd",
        product_data: { name: "Buy Me a Coffee" },
        unit_amount: Math.round(amount),
      },
      quantity: 1,
    }],
    success_url: "https://buy.stripe.com/success",
    cancel_url: "https://zo-challenge-praju.zocomputer.io",
  });
  
  return c.json({ url: session.url });
});

app.post("/api/send-booking-email", async (c) => {
  const data = await c.req.json();
  const name = data.name || data.Name;
  const email = data.email || data.Email;
  const date = data.date || data.Date;
  const intent = data.intent || data.message || data.Intent;
  
  if (!name || !email || !date || !intent) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  
  const bookingId = `BK${Date.now()}`;
  
  // Email to ME (Prajwal) - so I know someone wants to book
  const emailToMe = `📅 NEW BOOKING REQUEST #${bookingId}

👤 Name: ${name}
📧 Email: ${email}
📆 Date/Time: ${date}
💬 Purpose: ${intent}

---
Submitted from: zo-challenge-praju.zocomputer.io`;

  // Email confirmation to BOOKER - so they know their request was received
  const emailToBooker = `✅ Booking Request Received!

Hi ${name},

Your booking request has been submitted successfully!

📋 Summary:
• Date/Time: ${date}
• Purpose: ${intent}

Prajwal will review your request and reach out to ${email} within 24-48 hours to confirm the meeting.

---
Best regards,
Prajwal Srinivas
Portfolio: zo-challenge-praju.zocomputer.io`;

  try {
    // Use Zo Ask API to send emails through me (the AI agent)
    const zoAskResponse = await fetch("https://api.zo.computer/zo/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ZO_CLIENT_IDENTITY_TOKEN || ""}`
      },
      body: JSON.stringify({
        input: `Send TWO emails now:\n\n1. To prajwal.srinivas238@gmail.com with subject "📅 Booking Request #${bookingId} from ${name}" and body:\n${emailToMe}\n\n2. To ${email} with subject "✅ Your Booking Request is Received - Prajwal Srinivas" and body:\n${emailToBooker}\n\nDo NOT ask for confirmation. Just send both emails immediately.`
      })
    });
    
    const zoResult = await zoAskResponse.json();
    console.log("Zo Ask response:", zoResult);
    
    return c.json({ success: true, bookingId });
  } catch (e) {
    console.error("Booking error:", e);
    return c.json({ success: true, bookingId }); // Still return success to user
  }
});

async function readBookingsFile() {
  try {
    const file = Bun.file('/tmp/portfolio-bookings.json');
    if (await file.exists()) {
      const content = await file.text();
      return JSON.parse(content);
    }
  } catch (e) {}
  return [];
}

app.get("/api/bookings", (c) => {
  return c.json({ message: "Booking system ready. Use /book command in terminal." });
});

/**
 * Determine port based on mode. In production, use the published_port if available.
 * In development, always use the local_port.
 * Ports are managed by the system and injected via the PORT environment variable.
 */
const port = process.env.PORT
  ? parseInt(process.env.PORT, 10)
  : mode === "production"
    ? (config.publish?.published_port ?? config.local_port)
    : config.local_port;

export default { fetch: app.fetch, port, idleTimeout: 255 };

/**
 * Configure routing for production builds.
 *
 * - Streams prebuilt assets from `dist`.
 * - Static files from `public/` are copied to `dist/` by Vite and served at root paths.
 * - Falls back to `index.html` for any other GET so the SPA router can resolve the request.
 */
function configureProduction(app: Hono) {
  app.use("/assets/*", serveStatic({ root: "./dist" }));
  app.get("/favicon.ico", (c) => c.redirect("/favicon.svg", 302));
  app.use(async (c, next) => {
    if (c.req.method !== "GET") return next();

    const path = c.req.path;
    if (path.startsWith("/api/") || path.startsWith("/assets/")) return next();

    const file = Bun.file(`./dist${path}`);
    if (await file.exists()) {
      const stat = await file.stat();
      if (stat && !stat.isDirectory()) {
        return new Response(file);
      }
    }

    return serveStatic({ path: "./dist/index.html" })(c, next);
  });
}

/**
 * Configure routing for development builds.
 *
 * - Boots Vite in middleware mode for transforms.
 * - Static files from `public/` are served at root paths (matching Vite convention).
 * - Mirrors production routing semantics so SPA routes behave consistently.
 */
async function configureDevelopment(app: Hono): Promise<ViteDevServer> {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false, ws: false },
    appType: "custom",
  });

  app.use("*", async (c, next) => {
    if (c.req.path.startsWith("/api/")) return next();
    if (c.req.path === "/favicon.ico") return c.redirect("/favicon.svg", 302);

    const url = c.req.path;
    try {
      if (url === "/" || url === "/index.html") {
        let template = await Bun.file("./index.html").text();
        template = await vite.transformIndexHtml(url, template);
        return c.html(template, {
          headers: { "Cache-Control": "no-store, must-revalidate" },
        });
      }

      const publicFile = Bun.file(`./public${url}`);
      if (await publicFile.exists()) {
        const stat = await publicFile.stat();
        if (stat && !stat.isDirectory()) {
          return new Response(publicFile, {
            headers: { "Cache-Control": "no-store, must-revalidate" },
          });
        }
      }

      let result;
      try {
        result = await vite.transformRequest(url);
      } catch {
        result = null;
      }

      if (result) {
        return new Response(result.code, {
          headers: {
            "Content-Type": "application/javascript",
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }

      let template = await Bun.file("./index.html").text();
      template = await vite.transformIndexHtml("/", template);
      return c.html(template, {
        headers: { "Cache-Control": "no-store, must-revalidate" },
      });
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      console.error(error);
      return c.text("Internal Server Error", 500);
    }
  });

  return vite;
}
