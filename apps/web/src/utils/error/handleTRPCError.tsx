import type { AppRouter } from "@repo/types";
import type { TRPCClientError } from "@trpc/client";
import type { redirect } from "next/navigation";
import type { NextRouter } from "next/router";
import { toast } from "sonner";
import { errorCodeMap } from "./errorCode";
import { log } from "@repo/helper";
import { ErrorComponent } from "./errorComponent";
export function handleTRPCError(
	error: TRPCClientError<AppRouter>,
	navigator: NextRouter | typeof redirect,
) {
	const code = error.data?.code;
	const config = errorCodeMap[code ?? "undefined"];

	if (!config) return log.error(error);

	if (config.action === "redirect" && config.path) {
		if (typeof navigator === "function") {
			return navigator(config.path);
		}
	} else if (config.action === "toast" && config.message) {
		toast(config.message);
		<ErrorComponent error="lasdkjfaldksj" />;
	}
}
