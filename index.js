const express = require("express");
const fetch = require("node-fetch");
const { SocksProxyAgent } = require("socks-proxy-agent");

const app = express();
const PORT = process.env.PORT || 3000;

const proxyUrl = 'socks5://test:test@103.159.218.218:1920';
const agent = new SocksProxyAgent(proxyUrl);

app.get("/*", async (req, res) => {
  const path = req.params[0];
  const targetUrl = `https://live.dinesh29.com.np/stream/jiotvplus/${path}`;
  console.log(`[Proxying]: ${targetUrl}`);

  try {
    const response = await fetch(targetUrl, {
      agent,
      headers: {
        "User-Agent": "RANAPK"
      }
    });

    const contentType = response.headers.get("content-type") || "application/octet-stream";
    res.setHeader("Content-Type", contentType);
    res.status(response.status);
    response.body.pipe(res);
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).send("Proxy failed.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});