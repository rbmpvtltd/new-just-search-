Bun.serve({
  port: 4001,
  fetch() {
    return new Response("Hello from Bun!");
  },
});

console.log("Server running on http://localhost:4001");
