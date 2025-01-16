import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function CollapsibleSection({ title, icon, children, className }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className={className}>
      <CardHeader className="p-0">
        <Button
          variant="ghost"
          className="w-full flex justify-between p-4 h-auto hover:bg-accent"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {icon}
            <CardTitle>{title}</CardTitle>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className={cn(
        "overflow-hidden transition-all duration-200",
        isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 p-0"
      )}>
        {children}
      </CardContent>
    </Card>
  );
}