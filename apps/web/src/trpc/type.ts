import type { AppRouter } from "@repo/types";
import type { inferRouterOutputs , inferRouterInputs } from "@trpc/server";

export type OutputTrpcType = inferRouterOutputs<AppRouter>
export type InputTrpcType = inferRouterInputs<AppRouter>
