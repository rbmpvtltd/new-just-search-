import { db, schemas } from "@repo/db";
import { eq } from "drizzle-orm";


const category = schemas.not_related.categories;

async function getPopularCategories(){
    const data = await db.select({photo : category.photo,title : category.title,id:category.id}).from(category).where(eq(category.isPopular,true))
    return data;
}

async function getAllCategories(){
    const data = await db.select({photo : category.photo,title : category.title,id:category.id}).from(category)
    return data
}

export {getPopularCategories,getAllCategories}