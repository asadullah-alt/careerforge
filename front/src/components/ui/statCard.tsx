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
  icon?: React.ReactNode;
}

export default function StatCard({ 
  title, 
  count, 
  trending = "neutral", 
  percentage, 
  description, 
  footerText,
  icon
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
    <Card className="@container/card cursor-pointer group transform-gpu transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/20 hover:border-primary/50">
      <CardHeader className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 group-hover:translate-x-full duration-1000 transition-transform ease-in-out"></div>
        <div className="flex items-center gap-2">
          {icon}
          <CardDescription>{title}</CardDescription>
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl transition-all duration-300 group-hover:scale-105 transform-gpu">
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
        <div className="line-clamp-1 flex gap-2 font-medium group-hover:text-primary transition-colors duration-300">
          {displayDescription} {TrendIcon && <TrendIcon className="size-4 transition-transform duration-300 group-hover:scale-110" />}
        </div>
        <div className="text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}