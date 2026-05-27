"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "~/lib/utils"

const DialogContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

function Dialog({ children, open: controlledOpen, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = React.useCallback((newOpen: boolean) => {
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  }, [controlledOpen, onOpenChange]);

  return <DialogContext.Provider value={{ open, setOpen }}>{children}</DialogContext.Provider>;
}

function DialogTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  const { setOpen } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        setOpen(true);
        if ((children as any).props.onClick) (children as any).props.onClick(e);
      }
    });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
}

function DialogPortal({ children }: { children: React.ReactNode }) {
  const { open } = React.useContext(DialogContext);
  if (!open) return null;
  return <>{children}</>;
}

function DialogClose({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  const { setOpen } = React.useContext(DialogContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        setOpen(false);
        if ((children as any).props.onClick) (children as any).props.onClick(e);
      }
    });
  }
  return <button onClick={() => setOpen(false)}>{children}</button>;
}

function DialogOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { setOpen } = React.useContext(DialogContext);
  return (
    <div
      onClick={() => setOpen(false)}
      className={cn(
        "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<"div"> & {
  showCloseButton?: boolean
}) {
  const { setOpen } = React.useContext(DialogContext);
  return (
    <DialogPortal>
      <DialogOverlay />
      <div
        className={cn(
          "bg-background fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 outline-none sm:max-w-lg animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<"h2">) {
  return (
    <h2
      className={cn("text-lg leading-none font-semibold", className)}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
