import { useQuery } from "@tanstack/react-query";
import { Redirect } from "expo-router";
import { Loading } from "@/components/ui/Loading";
import { checkAppNeedUpdate } from "@/features/version";
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
  return <RedirectComponent latestVersion={latestVersion ?? "1.0.0"} />;
}

const RedirectComponent = ({ latestVersion }: { latestVersion: string }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["checkversion", latestVersion],
    queryFn: () => checkAppNeedUpdate(latestVersion),
  });

  if (isLoading) {
    return <Loading position="center" />;
  }
  if (data) {
    return <Redirect href="/(root)/(home)/home" />;
  }
  return <Redirect href="/(root)/(home)/home" />;
};
