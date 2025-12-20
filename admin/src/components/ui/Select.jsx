import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import * as React from "react";

/**
 * @intent Select component for day selection in schedule
 */
const SelectContext = React.createContext({ value: "", onValueChange: () => { }, open: false, setOpen: () => { } });

const Select = ({ value, onValueChange, defaultValue, children }) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");
    const [open, setOpen] = React.useState(false);

    const handleChange = (newValue) => {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
        setOpen(false);
    };

    return (
        <SelectContext.Provider value={{ value: value ?? selectedValue, onValueChange: handleChange, open, setOpen }}>
            <div className="relative">{children}</div>
        </SelectContext.Provider>
    );
};

const SelectTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
    const { setOpen, open } = React.useContext(SelectContext);
    return (
        <button
            ref={ref}
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {children}
            <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
    );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => {
    const { value } = React.useContext(SelectContext);
    return <span>{value || placeholder}</span>;
};

const SelectContent = React.forwardRef(({ className, children, ...props }, ref) => {
    const { open } = React.useContext(SelectContext);
    if (!open) return null;
    return (
        <div
            ref={ref}
            className={cn(
                "absolute z-50 mt-1 max-h-60 min-w-[8rem] overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
SelectContent.displayName = "SelectContent";

const SelectItem = React.forwardRef(({ className, value, children, ...props }, ref) => {
    const context = React.useContext(SelectContext);
    return (
        <div
            ref={ref}
            onClick={() => context.onValueChange(value)}
            className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                context.value === value && "bg-accent",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});
SelectItem.displayName = "SelectItem";

export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue };

