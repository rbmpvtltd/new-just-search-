export function getTrpcUrl() {
  const base = () => {
    if (process.env.NEXT_PUBLIC_BACKEND_URL)
      return process.env.NEXT_PUBLIC_BACKEND_URL;
    return "http://192.168.1.51:4000";
  };

  return `${base()}/trpc`;
}
