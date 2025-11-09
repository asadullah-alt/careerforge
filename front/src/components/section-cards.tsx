import StatCard from "./ui/statCard"
import { Bookmark, PenLine, CheckCircle, CalendarCheck, ArrowRight } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface StageType {
  step: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: string;
  trending: "up" | "down" | "neutral";
  percentage: string;
  description: string;
  footerText: string;
  color: string;
  tooltip: string;
}

const stages: StageType[] = [
  {
    step: 1,
    title: "Bookmarked Jobs",
    icon: Bookmark,
    count: "24",
    trending: "down",
    percentage: "12.5",
    description: "Trending down this month",
    footerText: "Jobs for the past month",
    color: "text-blue-500",
    tooltip: "Jobs you've saved for later. These are positions you're interested in but haven't started applying to yet."
  },
  {
    step: 2,
    title: "Applying to Jobs",
    icon: PenLine,
    count: "2",
    trending: "up",
    percentage: "1.5",
    description: "Trending up this month",
    footerText: "Applications in progress",
    color: "text-yellow-500",
    tooltip: "Applications you're currently working on. These jobs need your attention to complete the application process."
  },
  {
    step: 3,
    title: "Applied to Jobs",
    icon: CheckCircle,
    count: "2",
    trending: "neutral",
    percentage: "1.5",
    description: "Trending up this month",
    footerText: "Completed applications",
    color: "text-green-500",
    tooltip: "Successfully submitted applications. These are jobs where you've completed the entire application process and are awaiting response."
  },
  {
    step: 4,
    title: "Interviews Scheduled",
    icon: CalendarCheck,
    count: "22",
    trending: "up",
    percentage: "55.5",
    description: "Trending up this month",
    footerText: "Upcoming interviews",
    color: "text-purple-500",
    tooltip: "Jobs where you've been invited for an interview. These represent opportunities moving forward in the hiring process."
  }
]

export function SectionCards() {
  return (
    <TooltipProvider>
      <div className="px-4 lg:px-6">
        <div className="relative flex flex-col @xl/main:flex-row gap-4 items-center">
          {stages.map((stage, index) => (
            <div key={stage.title} className="relative flex-1 w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`relative z-10 w-full ${index !== stages.length - 1 ? 'mb-8 @xl/main:mb-0' : ''}`}>
                    <div className="absolute -top-3 left-4 z-20 rounded-full bg-background border px-2 py-0.5 text-xs font-semibold">
                      Step {stage.step}
                    </div>
                    <StatCard
                      title={stage.title}
                      count={stage.count}
                      trending={stage.trending}
                      percentage={stage.percentage}
                      description={stage.description}
                      footerText={stage.footerText}
                      icon={<stage.icon className={`size-5 ${stage.color}`} />}
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs text-sm">
                  {stage.tooltip}
                </TooltipContent>
              </Tooltip>
              
              {index !== stages.length - 1 && (
                <div className="absolute left-1/2 top-full @xl/main:left-full @xl/main:top-1/2 z-0 -translate-x-1/2 @xl/main:-translate-y-1/2 transform">
                  <div className="h-8 @xl/main:h-0.5 w-0.5 @xl/main:w-8 bg-border overflow-hidden">
                    <div className="h-full w-full bg-foreground/50 animate-flow-line"></div>
                  </div>
                  <ArrowRight className="absolute left-1/2 @xl/main:top-1/2 text-muted-foreground transform -translate-x-1/2 rotate-90 @xl/main:rotate-0 @xl/main:-translate-y-1/2 animate-pulse" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  )
}
