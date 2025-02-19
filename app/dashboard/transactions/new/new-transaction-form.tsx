'use client';
import { z } from 'zod';

import TransactionForm, {transactionFormSchema} from "@/components/transaction-form";
import {type Category} from "@/types/category";
import {createTransaction} from "@/app/dashboard/transactions/new/actions";
import {format} from "date-fns";
import {useToast} from "@/hooks/use-toast";
import {useRouter} from "next/navigation";

export default function NewTransactionForm({ categories}: { categories: Category[]}) {
    const router = useRouter();
    const { toast} = useToast();
    const handleSubmit =  async (data: z.infer<typeof transactionFormSchema>) => {
        // nextjs server action
        const result = await createTransaction({
            amount: data.amount,
            transactionDate: format(data.transactionDate.toString(), "yyyy-MM-dd"),
            categoryId: data.categoryId,
            description: data.description,
        });

        if(result.error) {
            toast({
                title: "Error",
                description: result.message,
                variant: 'destructive'
            });
            return;
        }

        toast({
            title: "Success",
            description: "Transaction created successfully.",
            variant: 'success'
        });

        router.push(`/dashboard/transactions?${data.transactionDate.getMonth()+1}&year=${data.transactionDate.getFullYear()}`);

        console.log(result.id);

    }
    return (
        <TransactionForm categories={categories} onSubmit={handleSubmit} />
    )
}