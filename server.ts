import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "Nexus System Online", timestamp: new Date().toISOString() });
  });

  app.post("/api/action/initialize", (req, res) => {
    // Simulate system initialization
    res.json({ 
      success: true, 
      message: "Neural Nexus Initialized", 
      data: {
        nodes: 124,
        latency: "0.42ms",
        security: "Grade A-Prime"
      } 
    });
  });

  app.post("/api/action/join", (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email required" });
    }
    res.json({ 
      success: true, 
      message: `Enrolled: ${email} in Nexus Grid`,
      accessKey: "NX-" + Math.random().toString(36).substring(2, 10).toUpperCase()
    });
  });

  app.post("/api/action/launch-vr", (req, res) => {
    res.json({ 
      success: true, 
      message: "VR Stream Synchronized",
      streamUrl: "ws://nexus.local/vr-stream/live"
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexus Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Critical System Failure:", err);
  process.exit(1);
});
