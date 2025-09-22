import type { TRPCClientError } from "@trpc/client";
import type { AxiosError } from "axios";

export type AppError = TRPCClientError<any> | AxiosError | Error
