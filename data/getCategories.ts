import 'server-only';
import {db} from "@/db";
import {categoriesTable} from "@/db/schema";

export async function getCategories() {
    return db.select().from(categoriesTable);
}
