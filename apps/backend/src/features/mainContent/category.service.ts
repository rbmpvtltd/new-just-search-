import { db, schemas } from "@repo/db";
import { eq } from "drizzle-orm";


const category = schemas.not_related.categories;

async function getPopularCategories(){
    const data = await db.select({photo : category.photo,title : category.title,id:category.id}).from(category).where(eq(category.isPopular,true))
    return data;
}

async function getAllCategories(){
    const data = await db.select({photo : category.photo,title : category.title,id:category.id,type : category.type}).from(category)
    return data
}

async function getPopularBannerCategory(){
    const hireCategories = await db.select({photo : category.photo,title : category.title,id:category.id,type:category.type}).from(category).where(eq(category.type,2)).limit(4);
    const businessCategory = await db.select({photo : category.photo,title : category.title,id:category.id,type:category.type}).from(category).where(eq(category.type,1)).limit(4);
    const data = [...hireCategories,...businessCategory]
    return data;
}

export {getPopularCategories,getAllCategories,getPopularBannerCategory}