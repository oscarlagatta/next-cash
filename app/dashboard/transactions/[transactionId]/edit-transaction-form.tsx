"use client";

import type {Category} from "@/types/category";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {z} from "zod";
import TransactionForm, {transactionFormSchema} from "@/components/transaction-form";
import {updateTransaction} from "@/app/dashboard/transactions/[transactionId]/actions";
import {format} from "date-fns";


export default function EditTransactionForm({ categories, transaction}: { categories: Category[], transaction: {
    id: number;
    categoryId: number;
    amount: string;
    description: string;
    transactionDate: string;
    }}) {
    const router = useRouter();

    const {toast} = useToast();

    const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {

        const result = await updateTransaction({
            id: transaction.id,
            amount: data.amount,
            description: data.description,
            categoryId: data.categoryId,
            transactionDate: format(data.transactionDate, "yyyy-MM-dd")
        });

        if (result?.error) {
            toast({
                title: "Error",
                description: result.message,
                variant: 'destructive'
            });
            return;
        }

        toast({
            title: "Success",
            description: "Transaction updated.",
            variant: 'success'
        });

        router.push(`/dashboard/transactions?${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`);
    }
    return (
        <TransactionForm defaultValues={{
            amount: Number(transaction.amount),
            categoryId: transaction.categoryId,
            description: transaction.description,
            transactionDate: new Date(transaction.transactionDate),
            transactionType: categories.find( category => category.id === transaction.categoryId)?.type ?? "income"
        }}  categories={categories} onSubmit={handleSubmit}/>
    );
}