import { useQuery } from "@tanstack/react-query";
import { Loading } from "@/components/ui/Loading";
import { UpdateModel } from "@/features/version/Component/UpdateModel";
import { useLoadToken } from "@/hooks/useLoadToken";
import { trpc } from "@/lib/trpc";

export default function Index() {
  const data = useLoadToken();
  const { data: latestVersion, isLoading } = useQuery(
    trpc.versionRouter.checkLatestVesion.queryOptions(),
  );
  if (data?.isLoading || isLoading) {
    return <Loading position="center" />;
  }
  return <UpdateModel latestVersion={latestVersion ?? "1.0.0"} />;
}
