import StatCard from "./ui/statCard"

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
     <StatCard
  title="Bookmarked Jobs"
  count="24"
  trending="down"
  percentage="12.5"
  description="Trending down this month"
  footerText="Jobs for the past month"
/>
    <StatCard
  title="Applying to Jobs"
  count="2"
  trending="up"
  percentage="1.5"
  description="Trending up this month"
  footerText="Applications for the past month"
/>
    <StatCard
  title="Applied to Jobs"
  count="2"
  trending="neutral"
  percentage="1.5"
  description="Trending up this month"
  footerText="Applications for the past month"
/>
 <StatCard
  title="Interviews Scheduled"
  count="22"
  trending="up"
  percentage="55.5"
  description="Trending up this month"
  footerText="Interviews for the past month"
/>
    
      
    
    </div>
  )
}
