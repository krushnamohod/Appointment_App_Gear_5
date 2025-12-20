import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * @intent Tabs container component
 */
const Tabs = React.forwardRef(({ className, defaultValue, value, onValueChange, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

    const handleValueChange = (newValue) => {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <div
            ref={ref}
            className={cn("w-full", className)}
            data-value={selectedValue}
            {...props}
        >
            {React.Children.map(props.children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child, { selectedValue, onValueChange: handleValueChange });
                }
                return child;
            })}
        </div>
    );
});
Tabs.displayName = "Tabs";

const TabsList = React.forwardRef(({ className, selectedValue, onValueChange, children, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
            className
        )}
        role="tablist"
        {...props}
    >
        {React.Children.map(children, child => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { selectedValue, onValueChange });
            }
            return child;
        })}
    </div>
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, selectedValue, onValueChange, ...props }, ref) => (
    <button
        ref={ref}
        type="button"
        role="tab"
        aria-selected={selectedValue === value}
        data-state={selectedValue === value ? "active" : "inactive"}
        onClick={() => onValueChange?.(value)}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            selectedValue === value && "bg-background text-foreground shadow",
            className
        )}
        {...props}
    />
));
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, selectedValue, ...props }, ref) => {
    if (selectedValue !== value) return null;
    return (
        <div
            ref={ref}
            role="tabpanel"
            data-state={selectedValue === value ? "active" : "inactive"}
            className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
            {...props}
        />
    );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsContent, TabsList, TabsTrigger };

