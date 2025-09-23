import { redirect } from "next/navigation";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";
import ErrorComponent from "@/utils/error/ErrorComponent";

export default async function UserPage() {
	const result = await asyncHandler(trpcServer.test.test.query());

	if (result.redirect) {
		redirect(result.redirect);
	}
	if (result.error) {
		console.log("error", result.error);
		
		return <ErrorComponent error={result.error} />;
	}

	if (result.data) {
		return <div>user id {result.data}</div>;
	}

	return <div>not login</div>;
}
