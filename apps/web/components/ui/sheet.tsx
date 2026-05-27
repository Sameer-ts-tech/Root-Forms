"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "~/lib/utils"

const SheetContext = React.createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

function Sheet({ children, open: controlledOpen, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) {
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

  return <SheetContext.Provider value={{ open, setOpen }}>{children}</SheetContext.Provider>;
}

function SheetTrigger({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  const { setOpen } = React.useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        setOpen(true);
        if ((children as React.ReactElement<any>).props.onClick) {
          (children as React.ReactElement<any>).props.onClick(e);
        }
      }
    });
  }
  return <button onClick={() => setOpen(true)}>{children}</button>;
}

function SheetPortal({ children }: { children: React.ReactNode }) {
  const { open } = React.useContext(SheetContext);
  if (!open) return null;
  return <>{children}</>;
}

function SheetClose({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) {
  const { setOpen } = React.useContext(SheetContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (e: any) => {
        setOpen(false);
        if ((children as React.ReactElement<any>).props.onClick) {
          (children as React.ReactElement<any>).props.onClick(e);
        }
      }
    });
  }
  return <button onClick={() => setOpen(false)}>{children}</button>;
}

function SheetOverlay({ className, ...props }: React.ComponentProps<"div">) {
  const { setOpen } = React.useContext(SheetContext);
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

function SheetContent({
  className,
  children,
  side = "right",
  ...props
}: React.ComponentProps<"div"> & {
  side?: "top" | "right" | "bottom" | "left"
}) {
  const { setOpen } = React.useContext(SheetContext);
  return (
    <SheetPortal>
      <SheetOverlay />
      <div
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out animate-in",
          side === "right" && "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm slide-in-from-right",
          side === "left" && "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm slide-in-from-left",
          side === "top" && "inset-x-0 top-0 h-auto border-b slide-in-from-top",
          side === "bottom" && "inset-x-0 bottom-0 h-auto border-t slide-in-from-bottom",
          className
        )}
        {...props}
      >
        {children}
        <button
          onClick={() => setOpen(false)}
          className="ring-offset-background focus:ring-ring absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none"
        >
          <XIcon className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1.5 p-4", className)} {...props} />
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto flex flex-col gap-2 p-4", className)} {...props} />
}

function SheetTitle({ className, ...props }: React.ComponentProps<"h2">) {
  return <h2 className={cn("text-foreground font-semibold", className)} {...props} />
}

function SheetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-muted-foreground text-sm", className)} {...props} />
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
