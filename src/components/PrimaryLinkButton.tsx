import clsx from 'clsx'
import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

export const PrimaryLinkButton = (props: LinkProps & { children: ReactNode, className?: string }) => {
    return <Link 
        {...props}
        className={clsx('bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg', props.className ?? '')} 
    >
        { props.children }
    </Link>
}