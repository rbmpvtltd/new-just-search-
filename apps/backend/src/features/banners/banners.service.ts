import {banners, db} from "@repo/db"
import {eq} from 'drizzle-orm'

async function getFirstBannerData (){
    const banner1 = await db.select().from(banners).where(eq(banners.type, 1))
    return banner1
} 

export {getFirstBannerData}