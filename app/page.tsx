import Image from "next/image";
import {ChartColumnBigIcon} from "lucide-react";
import {SignedIn, SignedOut, SignInButton, SignUpButton} from "@clerk/nextjs";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
   <main className='min-h-[400px] h-[calc(100vh-80px)] flex items-center justify-center bg-white relative'>
     <Image src='/cover.webp' fill className='object-cover opacity-50' alt='cover' />
     <div className='relative z-10 text-center flex flex-col gap-4'>
       <h1 className='text-5xl font-bold flex gap-1 items-center justify-center'>
         <ChartColumnBigIcon className='text-lime-500' size={60} /> NextCash
       </h1>
       <p className='text-2xl'>
         Track your finances with ease
       </p>
       <SignedIn>
         <Button asChild size='lg'>
           <Link href='/dashboard'>
             Got to your dashboard
           </Link>
         </Button>
       </SignedIn>
       <SignedOut>
         <div className='flex gap-2 items-center justify-center'>
           <Button asChild size='lg' className='bg-lime-600 hover:bg-lime-700'>
            <SignInButton />
           </Button>
           <Button asChild size='lg'>
             <SignUpButton />
           </Button>
         </div>

       </SignedOut>
     </div>
   </main>
  );
}
