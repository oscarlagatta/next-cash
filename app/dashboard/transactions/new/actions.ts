'use server';

import {auth} from "@clerk/nextjs/server";
import {z} from "zod";
import {addDays, subYears} from "date-fns";
import {transactionsTable} from "@/db/schema";
import {db} from "@/db";

const transactionSchema = z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    description: z.string().min(3, {
        message: 'Description must be at least 3 characters'
    }).max(300, {
        message: 'Description must contain no more than 300 characters'
    }),
    categoryId: z.number().positive("Category ID is invalid"),
    transactionDate: z.coerce.date().min(subYears(new Date(), 100)).max(addDays(new Date(), 1)),
});

export const createTransaction = async (data: {
    amount: number;
    transactionDate: string;
    description: string;
    categoryId: number;
}) => {
    // check if there's a currently logged user
    const {userId} = await auth();

    if (!userId) {
        return {
            error: true,
            message: "Unauthorized"
        };
    }

    const validation = transactionSchema.safeParse(data);

    if (!validation.success) {
        return {
            error: true,
            message: validation.error.issues[0].message,
        }
    }

    const [transaction] = await db.insert(transactionsTable).values({
        userId,
        amount: data.amount.toString(),
        description: data.description,
        categoryId: data.categoryId.toString(),
        transactionDate: data.transactionDate,
    }).returning();

    return {
        id: transaction.id,
    }
}