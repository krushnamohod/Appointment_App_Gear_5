import { cn } from "@/lib/utils";

/**
 * @intent Pill-style label for assigned resources
 * @param {object} props - Component props
 * @param {string} props.label - Resource label (e.g., A1, R1)
 */
function ResourcePill({ label, className }) {
    return (
        <span
            className={cn(
                "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-2.5 py-0.5 text-xs font-medium text-white shadow-sm",
                className
            )}
            aria-label={`Resource ${label}`}
        >
            {label}
        </span>
    );
}

export { ResourcePill };

