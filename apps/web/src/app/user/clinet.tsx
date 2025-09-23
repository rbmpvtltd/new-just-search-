"use client";
import { toast } from "sonner";

export default function ErrorComponent({ error }: { error: string }) {
	toast(error);

	return <div></div>;
}
