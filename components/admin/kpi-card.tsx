import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function KpiCard({
  label,
  value,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "primary" | "success" | "muted";
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-lg",
            accent === "success" && "bg-success/15 text-success",
            accent === "muted" && "bg-muted text-muted-foreground",
            (!accent || accent === "primary") && "bg-primary/15 text-primary"
          )}
        >
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-heading text-2xl font-extrabold leading-none">
            {value}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
