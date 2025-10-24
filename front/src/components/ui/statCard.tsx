import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badgeTable";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/cardInteractive";

interface StatCardProps {
  title: string;
  count: string | number;
  trending?: "up" | "down" | "neutral";
  percentage?: string | number;
  description?: string;
  footerText: string;
}

export default function StatCard({ 
  title, 
  count, 
  trending = "neutral", 
  percentage, 
  description, 
  footerText 
}: StatCardProps) {
  const isUp = trending === "up";
  const isDown = trending === "down";
  const isNeutral = trending === "neutral";
  
  const TrendIcon = isUp ? IconTrendingUp : isDown ? IconTrendingDown : null;
  
  const getDefaultDescription = () => {
    if (isUp) return "Trending up this period";
    if (isDown) return "Trending down this period";
    return "Stable performance";
  };
  
  const displayDescription = description || getDefaultDescription();
  
  return (
    <Card className="@container/card cursor-pointer transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.6),0_0_40px_rgba(34,197,94,0.4),inset_0_0_20px_rgba(34,197,94,0.2)] hover:border-green-500/50 hover:animate-pulse">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {count}
        </CardTitle>
        <CardAction>
          {!isNeutral && percentage !== undefined && (
            <Badge variant="outline">
              {TrendIcon && <TrendIcon />}
              {isUp ? '+' : '-'}{percentage}%
            </Badge>
          )}
          {isNeutral && (
            <Badge variant="outline">
              No change
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {displayDescription} {TrendIcon && <TrendIcon className="size-4" />}
        </div>
        <div className="text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}