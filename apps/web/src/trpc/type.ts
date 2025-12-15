import type { AppRouter } from "@repo/types";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

export type OutputTrpcType = inferRouterOutputs<AppRouter>;
export type InputTrpcType = inferRouterInputs<AppRouter>;

export type UnwrapArray<T> = T extends (infer U)[] ? U : never;
