import { Button } from './Button';
import { PrimaryLink } from './PrimaryLink'
import { signIn, signOut, useSession } from 'next-auth/react'

export const Header = () => {
    const {data} = useSession();

    const isLoggedIn = !!data;

    return (
        <header className='bg-slate-800 flex justify-between items-center h-16 container mx-auto px-4 sm:px-6'>
            <PrimaryLink href="/">AIcon Generator</PrimaryLink>
            
            <ul className='flex gap-4 sm:gap-7'>
                <PrimaryLink href="/generate">Generate</PrimaryLink>
                <PrimaryLink href="/about">About</PrimaryLink>
            </ul>
            
            { isLoggedIn ?
                <Button onClick={() => signOut()} >Logout</Button>
                : <Button onClick={() => signIn()} >Login</Button> 
            }
        </header>
    )
}