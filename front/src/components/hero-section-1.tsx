'use client'
import React,{useState,useEffect} from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X, Target, FileText, Sparkles, TrendingUp, BarChart3, CheckCircle2, Clock, Zap,Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/buttonHome'
import { AnimatedGroup } from '@/components/ui/animated-group'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import type { Variants } from 'framer-motion'
import { useTheme } from '@/context/theme-context'

const transitionVariants: {
    container?: Variants;
    item: Variants;
} = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden">
                <div
                    aria-hidden
                    className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                       
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Introducing AI-Powered Career Tools</span>
                                        <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700"></span>

                                        <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                        
                                   
                                 
                                </AnimatedGroup>

                              

                                {/* Trust badges */}
                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.1,
                                                    delayChildren: 1,
                                                },
                                            },
                                        },
                                        item: transitionVariants.item,
                                    }}
                                    className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="size-4 text-green-500" />
                                        <span>Free to start</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4 text-blue-500" />
                                        <span>Save 10+ hours per week</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Zap className="size-4 text-yellow-500" />
                                        <span>Land jobs 3x faster</span>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Key Features Section */}
                <section className="bg-background pb-16 pt-24 md:pb-32 md:pt-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                                Everything you need to land your dream job
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                Powerful AI-driven tools that work together to streamline your entire job search journey
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className="bg-muted/50 rounded-2xl border p-6 hover:border-foreground/20 transition-all duration-300 hover:shadow-lg">
                                    <div className="bg-background rounded-xl size-12 flex items-center justify-center mb-4">
                                        <feature.icon className="size-6 text-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                    <p className="text-muted-foreground">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section className="bg-muted/30 py-16 md:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                                How CareerForge Works
                            </h2>
                            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                                A simple three-step process to transform your job search
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
                            {steps.map((step, index) => (
                                <div key={index} className="relative text-center">
                                    <div className="bg-foreground text-background rounded-full size-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                                        {index + 1}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Social Proof / Stats Section */}
                <section className="bg-background py-16 md:py-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-4">
                                Join thousands of successful job seekers
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <p className="text-muted-foreground">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Testimonials */}
                        <div className="mt-20 grid md:grid-cols-3 gap-6">
                            {testimonials.map((testimonial, index) => (
                                <div
                                    key={index}
                                    className="bg-muted/50 rounded-2xl border p-6 hover:border-foreground/20 transition-all duration-300">
                                    <p className="text-muted-foreground mb-4 italic">&ldquo;{testimonial.quote}&rdquo;</p>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-foreground/10 rounded-full size-10 flex items-center justify-center font-semibold">
                                            {testimonial.initials}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{testimonial.name}</p>
                                            <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="bg-muted/30 py-16 md:py-32">
                    <div className="mx-auto max-w-4xl px-6 text-center">
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-6">
                            Ready to transform your job search?
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
                            Start building tailored resumes, tracking applications, and landing interviews faster—all for free.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button
                                asChild
                                size="lg"
                                className="rounded-xl px-8 text-base">
                                <Link href="/dashboard">
                                    <span>Get Started Free</span>
                                </Link>
                            </Button>
                            <Button
                                asChild
                                size="lg"
                                variant="outline"
                                className="rounded-xl px-8 text-base">
                                <Link href="/pricing">
                                    <span>View Pricing</span>
                                </Link>
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground mt-6">
                            No credit card required • Unlimited job tracking • Cancel anytime
                        </p>
                    </div>
                </section>
            </main>
        </>
    )
}

const features = [
    {
        icon: Target,
        title: 'AI Resume Builder',
        description: 'Create tailored resumes that match job descriptions perfectly. Our AI analyzes keywords and optimizes your content for ATS systems.'
    },
    {
        icon: FileText,
        title: 'Job Application Tracker',
        description: 'Track every application in one place. Save jobs from 40+ job boards, monitor status, and never lose track of opportunities.'
    },
    {
        icon: Sparkles,
        title: 'AI Cover Letter Generator',
        description: 'Generate compelling, personalized cover letters in seconds. AI-powered content that highlights your unique value.'
    },
    {
        icon: TrendingUp,
        title: 'Resume Match Score',
        description: 'Get instant match scores comparing your resume to job descriptions with personalized recommendations.'
    },
    {
        icon: BarChart3,
        title: 'Keyword Analyzer',
        description: 'Extract essential keywords from job descriptions and optimize your resume to get noticed by recruiters.'
    },
    {
        icon: Zap,
        title: 'Autofill Applications',
        description: 'Automate your application process with AI-powered autofill for job application questions and forms.'
    }
]

const steps = [
    {
        title: 'Upload Your Profile',
        description: 'Add your resume, LinkedIn profile, and work history. Our AI learns about your experience and skills.'
    },
    {
        title: 'Find & Save Jobs',
        description: 'Paste job URLs or use our extension to save opportunities from any job board. Track everything in one place.'
    },
    {
        title: 'Apply with AI',
        description: 'Generate tailored resumes and cover letters for each role. Track applications and follow up automatically.'
    }
]

const stats = [
    { value: '50K+', label: 'Active Users' },
    { value: '3x', label: 'Faster Job Search' },
    { value: '10+', label: 'Hours Saved/Week' },
    { value: '95%', label: 'Success Rate' }
]

const testimonials = [
    {
        quote: 'I would not have been able to handle the sheer amount of applications without CareerForge. It&apos;s been a game-changer.',
        name: 'Sarah Johnson',
        role: 'Software Engineer',
        initials: 'SJ'
    },
    {
        quote: 'The AI resume builder helped me land 3x more interviews. The keyword matching is incredibly accurate.',
        name: 'Michael Chen',
        role: 'Product Manager',
        initials: 'MC'
    },
    {
        quote: 'Finally, a tool that keeps everything organized. The job tracker alone is worth it—no more lost applications.',
        name: 'Emily Rodriguez',
        role: 'Marketing Specialist',
        initials: 'ER'
    }
]

const menuItems = [
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
]

export const HeroHeader = () => {
    const { theme, toggle } = useTheme()
    const [menuState, setMenuState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={toggle} 
                                className={cn("border border-gray-200 dark:border-gray-700 rounded-md px-2 flex items-center", isScrolled && 'lg:hidden')}>
                                    {theme === 'dark' ? <Sun className="size-4" /> : <Moon className="size-4" />}
                                    <span className="ml-2">Theme</span>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="/signup">
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled && 'lg:hidden')}>
                                    <Link href="/signup">
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="sm"
                                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <Link href="/signup">
                                        <span>Get Started</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

const Logo = ({ className }: { className?: string }) => {
    return (
        <Image 
          src="/output-image.png" 
          alt="CareerForge Logo"
          width={50} 
          height={50} 
          className={className} 
        />
    )

}