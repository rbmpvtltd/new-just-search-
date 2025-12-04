import HelpAndSupportChat from "@/features/help-and-support/chat/HelpAndSupportPrivateChat";
export default async function Page({
  params,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;

  return <HelpAndSupportChat chatTokenSessionId={Number(id)} />;
}
