import clsx from 'clsx'
import { Spinner } from './Spinner';


export const Button = (props: React.ComponentPropsWithoutRef<'button'> & {
    variant?: 'primary' | 'secondary',
    isLoading?: boolean
}) => {
    const { variant, children, isLoading, ...otherProps } = props;
    const colors = (variant ?? 'primary') === 'primary' ? 
        'bg-blue-600 hover:bg-blue-500' : 'bg-slate-600 hover:bg-slate-500';

    return (
        <button 
            className={clsx('px-4 py-2 rounded-lg flex items-center justify-center disabled:bg-slate-500', colors)}
            disabled={isLoading}
            {...otherProps}
            >
                {isLoading ? <Spinner /> : children}
        </button>
    )
}