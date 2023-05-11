import { useBuyCredits } from '~/hooks/useBuyCredits';
import { Button } from './Button';
import { PrimaryLink } from './PrimaryLink'
import { signIn, signOut, useSession } from 'next-auth/react'

export const Header = () => {
    const {data} = useSession();
    const { buyCredits } = useBuyCredits();

    const isLoggedIn = !!data;

    return (
        <header className='bg-slate-800 flex justify-between items-center h-16 container mx-auto px-4 sm:px-6'>
            <PrimaryLink href="/">AIcon Generator</PrimaryLink>
            
            <ul className='flex gap-4 sm:gap-7'>
                <PrimaryLink href="/generate">Generate</PrimaryLink>
                <PrimaryLink href="/about">About</PrimaryLink>
            </ul>
            
            { isLoggedIn ?
                <div className='flex gap-4'>
                    <Button onClick={() => buyCredits()}>Buy credits</Button>
                    <Button onClick={() => signOut()} >Logout</Button>
                </div>
                : <Button onClick={() => signIn()} >Login</Button> 
            }
        </header>
    )
}