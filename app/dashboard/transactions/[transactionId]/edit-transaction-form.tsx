"use client";

import type {Category} from "@/types/category";
import {useRouter} from "next/navigation";
import {useToast} from "@/hooks/use-toast";
import {z} from "zod";
import TransactionForm, {transactionFormSchema} from "@/components/transaction-form";


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
        // nextjs server action
        const result:any = {}

        if (result.error) {
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

        console.log(result.id);

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