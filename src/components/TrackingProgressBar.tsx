
'use client';

import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

interface TrackingProgressBarProps {
    currentStatus: OrderStatus;
    statuses: readonly OrderStatus[];
}

const statusLabelMap: Record<OrderStatus, string[]> = {
    'Placed': ['Shipping', 'soon'],
    'Shipped': ['Shipped'],
    'On the way': ['On', 'the', 'way'],
    'Out for delivery': ['Out', 'for', 'delivery'],
    'Delivered': ['Delivered'],
    'Cancelled': ['Cancelled']
};

export default function TrackingProgressBar({ currentStatus, statuses }: TrackingProgressBarProps) {
    const currentIndex = statuses.indexOf(currentStatus);
    
    if (currentStatus === 'Cancelled') {
        return (
            <div className="flex items-center justify-center p-4 my-8 bg-destructive/10 rounded-lg">
                <p className="text-destructive font-semibold">This order has been cancelled.</p>
            </div>
        )
    }

    return (
        <div className="mt-12">
            <div className="relative w-full h-1.5 bg-muted-foreground/30 rounded-full">
                <div 
                    className="absolute top-0 left-0 h-1.5 bg-primary rounded-full transition-all duration-500 ease-out"
                    style={{ width: `calc(${Math.max(0, (currentIndex) / (statuses.length - 2)) * 100}% - 1rem)`}}
                />
                
                <div className="absolute -top-3 w-full flex justify-between">
                    {statuses.map((status, index) => {
                         if (status === 'Cancelled') return null;
                        const isActive = index <= currentIndex;
                        const isCurrent = index === currentIndex;

                        return (
                            <div key={status} className="flex flex-col items-center relative">
                               <div 
                                    className={cn(
                                        "w-6 h-6 rounded-full border-4 transition-colors duration-300",
                                        isActive ? "bg-card border-primary" : "bg-muted-foreground/50 border-muted-foreground/30"
                                    )}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 flex justify-between text-xs text-muted-foreground text-center">
                 {statuses.map((status, index) => {
                     if (status === 'Cancelled') return null;
                     const isCurrent = index === currentIndex;

                     const labels = statusLabelMap[status];

                     return (
                         <div key={status} className={cn("w-[15%]", isCurrent && "font-bold text-primary")}>
                            {labels.map(label => <div key={label}>{label}</div>)}
                         </div>
                     )
                 })}
            </div>
        </div>
    );
}
