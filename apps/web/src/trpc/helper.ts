export function getTrpcUrl() {
  const base = (() => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL)
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    return "http://localhost:4000";
  })();
  return `${base}/trpc`;
}
