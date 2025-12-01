import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Types
interface CustomerData {
  id: string;
  name: string;
  mobile: string;
  purchases: string[];
  purchaseHistory: PurchaseRecord[]; // New: detailed purchase history
  completedRoadmaps: string[];
  badges: string[];
  createdAt: string;
  lastPurchaseAt?: string;
}

interface PurchaseRecord {
  id: string;
  items: string[];
  timestamp: string;
  source: 'scanner' | 'barista' | 'manual';
  billId?: string;
}

interface OTPData {
  mobile: string;
  otp: string;
  expiresAt: number;
}

// Utility Functions
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateCustomerId(): string {
  return `customer_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function generatePurchaseId(): string {
  return `purchase_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// OTP Routes
app.post("/make-server-6a458d4b/send-otp", async (c) => {
  try {
    const { mobile } = await c.req.json();
    
    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number. Must be 10 digits." }, 400);
    }

    const otp = generateOTP();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes (extended from 5)

    const otpData: OTPData = {
      mobile,
      otp,
      expiresAt
    };

    await kv.set(`otp:${mobile}`, otpData);

    // In production, you would send SMS here
    console.log(`OTP for ${mobile}: ${otp}`);

    return c.json({ 
      success: true, 
      message: "OTP sent successfully",
      // For demo purposes, return OTP. Remove in production!
      otp: otp 
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return c.json({ error: "Failed to send OTP" }, 500);
  }
});

app.post("/make-server-6a458d4b/verify-otp", async (c) => {
  try {
    const { mobile, otp, name } = await c.req.json();

    if (!mobile || !otp) {
      return c.json({ error: "Mobile and OTP are required" }, 400);
    }

    const storedOTPData = await kv.get<OTPData>(`otp:${mobile}`);

    if (!storedOTPData) {
      return c.json({ error: "OTP not found or expired. Please request a new OTP." }, 400);
    }

    if (Date.now() > storedOTPData.expiresAt) {
      await kv.del(`otp:${mobile}`);
      return c.json({ error: "OTP expired. Please request a new OTP." }, 400);
    }

    if (storedOTPData.otp !== otp) {
      // Don't delete OTP on wrong attempt, allow retry
      return c.json({ error: "Invalid OTP. Please check and try again." }, 400);
    }

    // Check if customer exists
    let customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    if (!customer) {
      // New customer - name is required
      if (!name || !name.trim()) {
        // Don't delete OTP yet - user needs to provide name
        return c.json({ 
          error: "Name is required for new customers",
          isNewUser: true 
        }, 400);
      }

      // Create new customer
      const customerId = generateCustomerId();
      customer = {
        id: customerId,
        name: name.trim(),
        mobile,
        purchases: [],
        purchaseHistory: [], // Initialize purchase history
        completedRoadmaps: [],
        badges: [],
        createdAt: new Date().toISOString()
      };

      await kv.set(`customer:${customerId}`, customer);
      await kv.set(`customer:mobile:${mobile}`, customer);
    }

    // OTP verified successfully - now delete it
    await kv.del(`otp:${mobile}`);

    return c.json({ 
      success: true, 
      customer: {
        id: customer.id,
        name: customer.name,
        mobile: customer.mobile
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return c.json({ error: "Failed to verify OTP" }, 500);
  }
});

// Customer Routes
app.get("/make-server-6a458d4b/customer/:id", async (c) => {
  try {
    const customerId = c.req.param("id");
    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Ensure purchaseHistory exists (for backward compatibility)
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    return c.json({ customer });
  } catch (error) {
    console.error("Error fetching customer:", error);
    return c.json({ error: "Failed to fetch customer data" }, 500);
  }
});

app.post("/make-server-6a458d4b/customer/:id/purchase", async (c) => {
  try {
    const customerId = c.req.param("id");
    const { items } = await c.req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Items array is required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Add purchases
    customer.purchases.push(...items);
    customer.lastPurchaseAt = new Date().toISOString();

    // Add purchase record
    const purchaseId = generatePurchaseId();
    const purchaseRecord: PurchaseRecord = {
      id: purchaseId,
      items: items,
      timestamp: new Date().toISOString(),
      source: 'scanner'
    };
    customer.purchaseHistory.push(purchaseRecord);

    // Save updated customer
    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:mobile:${customer.mobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error adding purchase:", error);
    return c.json({ error: "Failed to add purchase" }, 500);
  }
});

app.post("/make-server-6a458d4b/customer/:id/complete-roadmap", async (c) => {
  try {
    const customerId = c.req.param("id");
    const { roadmapId, badge } = await c.req.json();

    if (!roadmapId || !badge) {
      return c.json({ error: "Roadmap ID and badge are required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Add completed roadmap and badge
    if (!customer.completedRoadmaps.includes(roadmapId)) {
      customer.completedRoadmaps.push(roadmapId);
    }
    
    if (!customer.badges.includes(badge)) {
      customer.badges.push(badge);
    }

    // Save updated customer
    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:mobile:${customer.mobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error completing roadmap:", error);
    return c.json({ error: "Failed to complete roadmap" }, 500);
  }
});

// Barista Routes
app.get("/make-server-6a458d4b/barista/search/:mobile", async (c) => {
  try {
    const mobile = c.req.param("mobile");

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    return c.json({ customer });
  } catch (error) {
    console.error("Error searching customer:", error);
    return c.json({ error: "Failed to search customer" }, 500);
  }
});

app.post("/make-server-6a458d4b/barista/add-purchase", async (c) => {
  try {
    const { mobile, items } = await c.req.json();

    if (!mobile || !Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Mobile and items are required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Ensure purchaseHistory exists (for backward compatibility)
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    // Add purchases
    customer.purchases.push(...items);
    customer.lastPurchaseAt = new Date().toISOString();

    // Add purchase record
    const purchaseId = generatePurchaseId();
    const purchaseRecord: PurchaseRecord = {
      id: purchaseId,
      items: items,
      timestamp: new Date().toISOString(),
      source: 'barista'
    };
    customer.purchaseHistory.push(purchaseRecord);

    // Save updated customer
    await kv.set(`customer:${customer.id}`, customer);
    await kv.set(`customer:mobile:${mobile}`, customer);

    return c.json({ success: true, customer });
  } catch (error) {
    console.error("Error adding purchase via barista:", error);
    return c.json({ error: "Failed to add purchase" }, 500);
  }
});

// Health check endpoint
app.get("/make-server-6a458d4b/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Check if customer exists (for OTP flow)
app.get("/make-server-6a458d4b/check-customer/:mobile", async (c) => {
  try {
    const mobile = c.req.param("mobile");

    if (!mobile || !/^\d{10}$/.test(mobile)) {
      return c.json({ error: "Invalid mobile number" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:mobile:${mobile}`);

    return c.json({ 
      exists: !!customer,
      isNewUser: !customer
    });
  } catch (error) {
    console.error("Error checking customer:", error);
    return c.json({ error: "Failed to check customer" }, 500);
  }
});

// Process scanned bill
app.post("/make-server-6a458d4b/customer/:id/scan-bill", async (c) => {
  try {
    const customerId = c.req.param("id");
    const { scannedText, items } = await c.req.json();

    if (!Array.isArray(items) || items.length === 0) {
      return c.json({ error: "Items array is required" }, 400);
    }

    const customer = await kv.get<CustomerData>(`customer:${customerId}`);

    if (!customer) {
      return c.json({ error: "Customer not found" }, 404);
    }

    // Ensure purchaseHistory exists (for backward compatibility)
    if (!customer.purchaseHistory) {
      customer.purchaseHistory = [];
    }

    // Add purchases to main list
    customer.purchases.push(...items);
    customer.lastPurchaseAt = new Date().toISOString();

    // Add detailed purchase record
    const purchaseId = generatePurchaseId();
    const purchaseRecord: PurchaseRecord = {
      id: purchaseId,
      items: items,
      timestamp: new Date().toISOString(),
      source: 'scanner',
      billId: `bill_${Date.now()}`
    };
    customer.purchaseHistory.push(purchaseRecord);

    // Save updated customer
    await kv.set(`customer:${customerId}`, customer);
    await kv.set(`customer:mobile:${customer.mobile}`, customer);

    return c.json({ success: true, customer, purchaseId });
  } catch (error) {
    console.error("Error processing scanned bill:", error);
    return c.json({ error: "Failed to process scanned bill" }, 500);
  }
});

Deno.serve(app.fetch);