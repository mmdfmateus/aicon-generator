import Link, { LinkProps } from 'next/link'
import { ReactNode } from 'react'

export const PrimaryLink = (props: LinkProps & { children: ReactNode }) => {
    return <Link className='hover:text-slate-500' {...props}>{ props.children }</Link>
}