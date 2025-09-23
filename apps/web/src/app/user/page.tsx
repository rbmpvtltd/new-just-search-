import { Toaster } from "@/components/ui/sonner";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import ClientComponent from "./clinet";

export default async function UserPage() {
	console.log("user page");

	const result = await asyncHandler(trpcServer.test.test.query());
	console.log("result", result);

	if (result.error) {
		return <ClientComponent error={result.error} />;
	}

	if (result.data) {
		return <div>user id {result.data}</div>;
	}

	return <div>not login</div>;
}
