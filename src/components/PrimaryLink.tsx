import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

export const PrimaryLink = (props: LinkProps & { children: ReactNode, className?: string }) => {
    return (
        <Link 
            {...props}
            className={clsx(props.className, 'hover:text-slate-500' )}
            >
                { props.children }
        </Link>
    );
}