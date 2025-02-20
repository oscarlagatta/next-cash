'use client';

import { z } from 'zod';
import {addDays, format} from "date-fns";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Button} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {CalendarIcon} from "lucide-react";
import {Calendar} from "@/components/ui/calendar";
import {Input} from "@/components/ui/input";
import { type Category} from "@/types/category";

export const transactionFormSchema = z.object({
    transactionType: z.enum(['income', 'expense']),
    categoryId: z.coerce.number().positive({
        message: 'Please select a category'
    }),
    transactionDate: z.coerce.date().max(addDays(new Date(), 1), "Transaction date cannot be in the future"),
    amount: z.coerce.number().positive({
        message: 'Amount must be greater than zero'
    }),
    description: z.string().min(3, {
        message: 'Description must be at least 3 characters'
    }).max(300, {
        message: 'Description must contain no more than 300 characters'
    })
});

type Props = {
    categories: Category[];
    onSubmit: (data: z.infer<typeof transactionFormSchema>) => Promise<void>;
    defaultValues?: {
        transactionType: 'income' | 'expense';
        amount: number;
        categoryId: number;
        description: string;
        transactionDate: Date;
    };
}

export default function TransactionForm({
                                            categories,
                                            onSubmit,
                                            defaultValues,
                                        }: Props) {
    const form = useForm<z.infer<typeof transactionFormSchema>>({
        resolver: zodResolver(transactionFormSchema),
        defaultValues: {
            transactionType: 'income',
            categoryId: 0,
            transactionDate: new Date(),
            amount: 0,
            description: '',
            ...defaultValues
        }
    });


    const filteredCategories = categories.filter(category => category.type === form.getValues("transactionType"));

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <fieldset disabled={form.formState.isSubmitting} className='grid grid-cols-2 gap-y-5 gap-x-2'>
                    <FormField
                        control={form.control}
                        name='transactionType'
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Transaction Type
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={(newValue) => {
                                            field.onChange(newValue);
                                            form.setValue("categoryId", 0);
                                        }} value={field.value}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value='income'>
                                                    Income
                                                </SelectItem>
                                                <SelectItem value='expense'>
                                                    Expense
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}/>
                    <FormField
                        control={form.control}
                        name='categoryId'
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Category
                                    </FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} value={field.value.toString()}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filteredCategories.map(category => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}/>
                    <FormField
                        control={form.control}
                        name='transactionDate'
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Transaction Date
                                    </FormLabel>
                                    <FormControl>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value}
                                                    onSelect={field.onChange}
                                                    initialFocus
                                                    disabled={{
                                                        after: new Date(),
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}/>
                    <FormField
                        control={form.control}
                        name='amount'
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Amount
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} type='number'/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                </fieldset>
                <fieldset disabled={form.formState.isSubmitting}  className='mt-5 flex flex-col gap-5'>
                    <FormField
                        control={form.control}
                        name='description'
                        render={({field}) => {
                            return (
                                <FormItem>
                                    <FormLabel>
                                        Description
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <Button type='submit'>Submit</Button>
                </fieldset>
            </form>
        </Form>
    )
}