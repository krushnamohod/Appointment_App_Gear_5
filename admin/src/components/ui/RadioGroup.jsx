import { cn } from "@/lib/utils";
import * as React from "react";

/**
 * @intent RadioGroup component for selecting between options
 */
const RadioGroupContext = React.createContext({ value: "", onValueChange: () => { } });

const RadioGroup = React.forwardRef(({ className, value, onValueChange, defaultValue, ...props }, ref) => {
    const [selectedValue, setSelectedValue] = React.useState(value || defaultValue || "");

    const handleChange = (newValue) => {
        setSelectedValue(newValue);
        onValueChange?.(newValue);
    };

    return (
        <RadioGroupContext.Provider value={{ value: value ?? selectedValue, onValueChange: handleChange }}>
            <div ref={ref} className={cn("grid gap-2", className)} role="radiogroup" {...props} />
        </RadioGroupContext.Provider>
    );
});
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(({ className, value, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const isChecked = context.value === value;

    return (
        <button
            ref={ref}
            type="button"
            role="radio"
            aria-checked={isChecked}
            data-state={isChecked ? "checked" : "unchecked"}
            onClick={() => context.onValueChange(value)}
            className={cn(
                "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            {...props}
        >
            {isChecked && (
                <span className="flex items-center justify-center">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                </span>
            )}
        </button>
    );
});
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };

