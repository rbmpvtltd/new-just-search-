export function getTrpcUrl() {
  const base = (() => {
    if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
    return "http://localhost:4000";
  })();
  return `${base}/trpc`;
}

export function getWsUrl() {
  const wsUrl = (() => {
    if (process.env.WSURL) return process.env.WSURL;
    return "ws://localhost:5500";
  })();
  return wsUrl;
}
