import http from "node:http";
import handler from "./chat.js";
const PORT = Number(process.env.CHAT_API_PORT || 3002);

const server = http.createServer(async (req, res) => {
  // Parse body for POST
  if (req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        req.body = JSON.parse(body);
      } catch {
        req.body = {};
      }
      handler(req, {
        setHeader: (k, v) => res.setHeader(k, v),
        status: (code) => ({
          end: () => res.writeHead(code).end(),
          json: (data) => {
            res.writeHead(code, { "Content-Type": "application/json" });
            res.end(JSON.stringify(data));
          },
        }),
      });
    });
  } else {
    handler(req, {
      setHeader: (k, v) => res.setHeader(k, v),
      status: (code) => ({
        end: () => res.writeHead(code).end(),
        json: (data) => {
          res.writeHead(code, { "Content-Type": "application/json" });
          res.end(JSON.stringify(data));
        },
      }),
    });
  }
});

server.listen(PORT, () => {
  console.log(`Chat API dev server running on http://localhost:${PORT}`);
});
