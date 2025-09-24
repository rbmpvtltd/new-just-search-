import { trpcServer } from "@/trpc/trpc-server";
import { getToken } from "@/utils/session";
import { bannersFourt, bannersSecond, bannersThird } from "../action";
import FirstCaraousel from "@/components/banners/BannerFistCaraousel";

// const BannerFirstCaraousel = async () => {
//   console.log(bannerFirst)
// 	return (
//     <>
// 			<div> token {token?.value}</div>
// 		</>
// 	);
// };

export default async function Page() {
	const token = await getToken();
	const bannerFirst = await trpcServer.banners.firstBanner.query();
	const bannerSecond = await bannersSecond();
	const bannerThird = await bannersThird();
	const bannerFourth = await bannersFourt();
	return (
		<div className="mx-auto">
			<FirstCaraousel bannerFirst={bannerFirst} />
			{/* <BannerFirstCaraousel /> */}
		</div>
	);
}
