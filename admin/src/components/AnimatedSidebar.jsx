import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * @intent Animated sidebar component with nested items and custom styling
 * @param {object} props - Component props
 * @param {boolean} props.isOpen - Initial open state
 * @param {array} props.items - Navigation items array
 */
function AnimatedSidebar({ isOpen: propIsOpen = true, items }) {
    // Select the first item that has content as default
    const [activeContent, setActiveContent] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [isOpen, setIsOpen] = useState(propIsOpen);
    const [contentKey, setContentKey] = useState(0);
    const [expandedItems, setExpandedItems] = useState({});

    // Initialize active content
    useEffect(() => {
        if (!activeContent && items?.length > 0) {
            setActiveContent(items[0].title);
        }
    }, [items]);

    // Check for mobile viewport
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) setIsOpen(false);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Sync with prop changes on desktop
    useEffect(() => {
        if (!isMobile) setIsOpen(propIsOpen);
    }, [propIsOpen, isMobile]);

    // Trigger animation on content change
    useEffect(() => {
        setContentKey((prev) => prev + 1);
    }, [activeContent]);

    const toggleExpand = (title) => {
        setExpandedItems((prev) => ({ ...prev, [title]: !prev[title] }));
    };

    const handleItemClick = (item) => {
        if (item.onClick) {
            item.onClick();
        }

        if (item.subItems) {
            toggleExpand(item.title);
        } else {
            setActiveContent(item.title);
            if (isMobile) setIsOpen(false);
        }
    };

    const renderContent = () => {
        // Flatten items to find the active one
        const findItem = (items) => {
            for (const item of items) {
                if (item.title === activeContent) return item;
                if (item.subItems) {
                    const found = findItem(item.subItems);
                    if (found) return found;
                }
            }
            return null;
        };

        const activeItem = findItem(items);
        return activeItem && activeItem.Content ? <activeItem.Content /> : null;
    };

    const renderSidebarButton = (item, depth = 0) => {
        const isActive = activeContent === item.title;
        const hasSubItems = item.subItems && item.subItems.length > 0;
        const isExpanded = expandedItems[item.title];

        return (
            <div key={item.title} className="w-full">
                <button
                    onClick={() => handleItemClick(item)}
                    className={cn(
                        "group flex items-center w-full py-2.5 px-4 text-sm font-medium transition-all duration-200 border-l-4",
                        isOpen ? "justify-start" : "justify-center",
                        isActive
                            ? "border-blue-600 bg-blue-50/50 text-blue-700"
                            : "border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                        item.className,
                        depth > 0 && isOpen && "pl-8 border-l-0" // Indent sub-items, no border
                    )}
                >
                    {item.Icon && (
                        <item.Icon
                            className={cn(
                                "w-5 h-5 flex-shrink-0 transition-colors",
                                isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600",
                                item.iconClassName
                            )}
                        />
                    )}

                    {isOpen && (
                        <div className="ml-3 flex flex-1 items-center justify-between whitespace-nowrap">
                            <span className="font-medium">{item.title}</span>
                            {hasSubItems && (
                                isExpanded ? <ChevronDown className="h-4 w-4 opacity-50" /> : <ChevronRight className="h-4 w-4 opacity-50" />
                            )}
                        </div>
                    )}
                </button>

                {/* Sub-items */}
                {hasSubItems && isExpanded && isOpen && (
                    <div className="w-full bg-gray-50/50">
                        {item.subItems.map((subItem) => renderSidebarButton(subItem, depth + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="relative h-full flex overflow-hidden">
            {/* Mobile menu button */}
            {isMobile && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed top-20 left-4 z-50 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "flex flex-col border-r bg-white shadow-sm transition-all duration-300 ease-out z-20",
                    isMobile ? "fixed inset-y-0 left-0" : "relative",
                    isOpen ? "w-64" : "w-20",
                    isMobile && !isOpen && "-translate-x-full"
                )}
            >
                <div className="pt-4 pb-2 flex justify-end px-4">
                    {isMobile && (
                        <button onClick={() => setIsOpen(false)}><X className="h-5 w-5 opacity-50" /></button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    {items.map((item) => renderSidebarButton(item))}
                </div>
            </div>

            {/* Backdrop for mobile */}
            {isMobile && isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/20 z-10"
                />
            )}

            {/* Content Area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50">
                <div
                    key={contentKey}
                    className="flex-1 overflow-auto animate-in fade-in slide-in-from-bottom-4 duration-300"
                >
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

export { AnimatedSidebar };

