export function getTrpcUrl() {
  const base = (() => {
    if (process.env.URL) return `https://${process.env.URL}`;
    return "http://192.168.1.44:4000";
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
