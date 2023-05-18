import { useBuyCredits } from '~/hooks/useBuyCredits';
import { Button } from './Button';
import { PrimaryLink } from './PrimaryLink'
import { signIn, signOut, useSession } from 'next-auth/react'
import { api } from '~/utils/api';
import Image from 'next/image';

export const Header = () => {
    const {data} = useSession();
    const { buyCredits } = useBuyCredits();

    const { data: credits } = api.user.getCredits.useQuery();

    const isLoggedIn = !!data;

    return (
        <header className='bg-slate-900 border-b-2 border-b-slate-700 w-full'>
            <main className='flex justify-between items-center h-16 gap-6 container mx-auto px-4 sm:px-6'>
                <PrimaryLink className='flex items-center gap-3' href="/">
                    <Image 
                        src={'/logo.png'}
                        alt='logo'
                        width={60}
                        height={60}/>
                    <p className='invisible lg:visible'>AIcon Generator</p>
                </PrimaryLink>
                
                <ul className='flex gap-4 sm:gap-7'>
                    <PrimaryLink href="/generate">Generate</PrimaryLink>
                    {isLoggedIn && 
                        <PrimaryLink href="/collection">Collection</PrimaryLink>
                    }
                    <PrimaryLink href="/community">Community</PrimaryLink>
                    <PrimaryLink href="/about">About</PrimaryLink>
                </ul>
                
                { isLoggedIn ?
                    <div className='flex gap-4'>
                        {credits && <span className='flex items-center text-slate-400 cursor-default'>{`${credits} credits left`}</span>}
                        <Button className='px-0 py-0 sm:px-2 sm:py-2' onClick={() => buyCredits()}>Buy credits</Button>
                        <Button className='px-0 py-0 sm:px-2 sm:py-2' variant='secondary' onClick={() => signOut()} >Logout</Button>
                    </div>
                    : <Button onClick={() => signIn()} >Login</Button> 
                }
            </main>
        </header>
    )
}