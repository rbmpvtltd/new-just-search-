export function getTrpcUrl() {
  const base = (() => {
    if (process.env.URL) return `https://${process.env.URL}`;
    return "http://localhost:4000";
  })();
  return `${base}/trpc`;
}
