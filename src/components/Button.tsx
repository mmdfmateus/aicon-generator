

export const Button = (props: React.ComponentPropsWithoutRef<'button'>) => {
    return (
        <button 
            className='bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg'
            {...props}
            >
                {props.children}
        </button>
    )
}