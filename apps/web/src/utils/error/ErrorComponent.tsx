"use client";
import { toast } from "sonner";
export default function ErrorComponent({ error }: { error: string }) {
	toast.error(error, {
		style: {
			background: "red",
			color: "white",
		},
	});

	return <div></div>;
}
