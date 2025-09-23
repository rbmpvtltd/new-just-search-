import { log } from "util";
import { trpcServer } from "@/trpc/trpc-server";
import { asyncHandler } from "@/utils/error/asyncHandler";

export default async function UserPage() {
	console.log("user page");

	const result = await asyncHandler(trpcServer.auth.logout.query());
	console.log("result", result);

	if (result.error) {
		return <div style={{ color: "red" }}>{result.error}</div>;
	}

	if (result.data) {
		return <div>user id {result.data}</div>;
	}

	return <div>not login</div>;
}
