export default function Card({
    children,
    hover = false,
    className = '',
    ...props
}) {
    const classes = `card ${hover ? 'card-hover' : ''} ${className}`;

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
}
