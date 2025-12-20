import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import * as React from "react";

/**
 * @intent Checkbox component for manage capacity and other toggles
 */
const Checkbox = React.forwardRef(({ className, checked, onCheckedChange, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState(checked || false);

    React.useEffect(() => {
        if (checked !== undefined) setIsChecked(checked);
    }, [checked]);

    const handleClick = () => {
        const newValue = !isChecked;
        setIsChecked(newValue);
        onCheckedChange?.(newValue);
    };

    return (
        <button
            ref={ref}
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            data-state={isChecked ? "checked" : "unchecked"}
            onClick={handleClick}
            className={cn(
                "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                isChecked && "bg-primary text-primary-foreground",
                className
            )}
            {...props}
        >
            {isChecked && (
                <span className="flex items-center justify-center text-current">
                    <Check className="h-3 w-3" />
                </span>
            )}
        </button>
    );
});
Checkbox.displayName = "Checkbox";

export { Checkbox };

