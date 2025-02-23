import {z} from "zod";
import {addDays, subYears} from "date-fns";

export const transactionSchema = z.object({
    amount: z.number().positive("Amount must be greater than 0"),
    description: z.string().min(3, {
        message: 'Description must be at least 3 characters'
    }).max(300, {
        message: 'Description must contain no more than 300 characters'
    }),
    categoryId: z.number().positive("Category ID is invalid"),
    transactionDate: z.coerce.date().min(subYears(new Date(), 100)).max(addDays(new Date(), 1)),
});