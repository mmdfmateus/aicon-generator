import clsx from 'clsx'


export const Button = (props: React.ComponentPropsWithoutRef<'button'> & {
    variant?: 'primary' | 'secondary'
}) => {
    const { variant, children, ...otherProps } = props;
    const colors = (variant ?? 'primary') === 'primary' ? 
        'bg-blue-600 hover:bg-blue-500' : 'bg-slate-600 hover:bg-slate-500';

    return (
        <button 
            className={clsx('px-4 py-2 rounded-lg disabled:bg-slate-500', colors)}
            {...otherProps}
            >
                {children}
        </button>
    )
}