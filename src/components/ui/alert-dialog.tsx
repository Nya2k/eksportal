"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import * as React from "react"

interface AlertDialogProps {
    children: React.ReactNode
}

interface AlertDialogContextType {
    open: boolean
    setOpen: (open: boolean) => void
}

const AlertDialogContext = React.createContext<AlertDialogContextType | undefined>(undefined)

const AlertDialog = ({ children }: AlertDialogProps) => {
    const [open, setOpen] = React.useState(false)

    return (
        <AlertDialogContext.Provider value={{ open, setOpen }}>
            {children}
        </AlertDialogContext.Provider>
    )
}

const AlertDialogTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, asChild, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext)
    if (!context) throw new Error("AlertDialogTrigger must be used within AlertDialog")

    const handleClick = () => {
        context.setOpen(true)
    }

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            ...(children.props as any),
            onClick: handleClick,
            ref
        })
    }

    return (
        <Button
            ref={ref}
            className={className}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Button>
    )
})
AlertDialogTrigger.displayName = "AlertDialogTrigger"

const AlertDialogContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext)
    if (!context) throw new Error("AlertDialogContent must be used within AlertDialog")

    if (!context.open) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div
                ref={ref}
                className={cn(
                    "bg-background border rounded-lg shadow-lg p-6 w-full max-w-md",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        </div>
    )
})
AlertDialogContent.displayName = "AlertDialogContent"

const AlertDialogHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col space-y-2 text-center sm:text-left mb-4", className)}
        {...props}
    />
)
AlertDialogHeader.displayName = "AlertDialogHeader"

const AlertDialogFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)}
        {...props}
    />
)
AlertDialogFooter.displayName = "AlertDialogFooter"

const AlertDialogTitle = React.forwardRef<
    HTMLHeadingElement,
    React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
    <h2
        ref={ref}
        className={cn("text-lg font-semibold", className)}
        {...props}
    />
))
AlertDialogTitle.displayName = "AlertDialogTitle"

const AlertDialogDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
AlertDialogDescription.displayName = "AlertDialogDescription"

const AlertDialogAction = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, onClick, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext)
    if (!context) throw new Error("AlertDialogAction must be used within AlertDialog")

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e)
        context.setOpen(false)
    }

    return (
        <Button
            ref={ref}
            className={cn("", className)}
            onClick={handleClick}
            {...props}
        />
    )
})
AlertDialogAction.displayName = "AlertDialogAction"

const AlertDialogCancel = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
    const context = React.useContext(AlertDialogContext)
    if (!context) throw new Error("AlertDialogCancel must be used within AlertDialog")

    const handleClick = () => {
        context.setOpen(false)
    }

    return (
        <Button
            ref={ref}
            variant="outline"
            className={cn("mt-2 sm:mt-0", className)}
            onClick={handleClick}
            {...props}
        />
    )
})
AlertDialogCancel.displayName = "AlertDialogCancel"

export {
    AlertDialog, AlertDialogAction,
    AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger
}

