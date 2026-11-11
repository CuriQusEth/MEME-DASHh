import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API - MCP Route
  app.get("/api/mcp", (req, res) => {
    res.json({
      protocol: "MCP",
      version: "1.0.0",
      name: "Meme Das MCP Endpoint",
      status: "active",
      description: "Active MCP server for Meme Das Orchestrator Agent on Base Mainnet (Denim)",
      network: {
        chain: "Base Mainnet",
        chainId: 8453,
        caip2: "eip155:8453",
        upgrade: "Denim",
        blockTimeMs: 200,
        flashblocksRetired: true,
        rpcUrl: "https://mainnet.base.org",
        wsRpcUrl: "wss://mainnet.base.org",
      },
      capabilities: [
        "meme-culture-management",
        "viral-content-automation",
        "dash-mechanics",
        "denim-fast-execution",
      ],
      timestamp: new Date().toISOString(),
    });
  });

  app.post("/api/mcp", (req, res) => {
    const body = req.body || {};
    
    // Support JSON-RPC tools list
    if (body.method === 'tools/list' || body.type === 'tools/list') {
      const response = {
        tools: [
          { name: "get_race_status", description: "Get current race status [Denim 200ms fast block track]" },
          { name: "start_race", description: "Start a new race on Base Mainnet" },
          { name: "get_leaderboard", description: "Get the dashboard leaderboard" },
          { name: "optimize_speed", description: "Optimize speed behavior" },
          { name: "get_track_info", description: "Get track properties and Denim block timing" }
        ]
      };
      if (body.jsonrpc) {
        return res.json({ jsonrpc: "2.0", id: body.id, result: response });
      }
      return res.json(response);
    }

    if (body.method === 'tools/call' || body.type === 'tools/call') {
      const response = {
        content: [
          {
            type: "text",
            text: "Tool executed successfully on Base Mainnet (Denim 200ms blocks)"
          }
        ],
        isError: false
      };
      if (body.jsonrpc) {
        return res.json({ jsonrpc: "2.0", id: body.id, result: response });
      }
      return res.json(response);
    }

    res.json({
      status: "success",
      message: "MCP command received on Base Mainnet (Denim)",
      agent: "Meme Das Orchestrator",
      network: "Base Mainnet (8453)",
      upgrade: "Denim 200ms",
      receivedAt: new Date().toISOString(),
      payload: body,
    });
  });

  // API - Agent Route
  app.get("/api/agent", (req, res) => {
    res.json({
      name: "Meme Das Orchestrator",
      status: "active",
      wallet: "0x29536D0bc1004ab274c4F0F59734Ad74D4559b7B",
      platform: "Meme Das",
      version: "1.0.0",
      network: {
        chain: "Base Mainnet",
        chainId: 8453,
        upgrade: "Denim",
        blockTime: "200ms",
        canonicalBlocks: true,
      },
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
    // Fallback for all other routes to index.html
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
