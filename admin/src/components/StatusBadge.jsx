import { Badge } from "@/components/ui/Badge";

/**
 * @intent Status badge showing Published/Unpublished state
 * @param {object} props - Component props
 * @param {boolean} props.isPublished - Whether appointment is published
 */
function StatusBadge({ isPublished }) {
    return (
        <Badge
            variant={isPublished ? "success" : "secondary"}
            aria-label={isPublished ? "Published" : "Unpublished"}
        >
            {isPublished ? "Published" : "Unpublished"}
        </Badge>
    );
}

export { StatusBadge };

