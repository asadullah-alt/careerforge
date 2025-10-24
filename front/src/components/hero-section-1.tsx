'use client'
import React,{useState,useEffect} from 'react'
import Link from 'next/link'
import { ArrowRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/buttonHome'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'
import type { Variants } from 'framer-motion'

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
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            delayChildren: 1,
                                        },
                                    },
                                },
                                item: {
                                    hidden: {
                                        opacity: 0,
                                        y: 20,
                                    },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: {
                                            type: 'spring' as const,
                                            bounce: 0.3,
                                            duration: 2,
                                        },
                                    },
                                },
                            }}
                            className="absolute inset-0 -z-20">
                            {/* background image optimized via next/image */}
                            <img
                                src="https://ik.imagekit.io/lrigu76hy/tailark/night-background.jpg?updatedAt=1745733451120"
                                alt="background"
                                className="absolute inset-x-0 top-56 -z-20 hidden lg:top-32 dark:block"
                                width={3276}
                                height={4095}
                            />
                        </AnimatedGroup>
                        <div aria-hidden className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_100%,transparent_0%,var(--background)_75%)]" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>
                                    <Link
                                        href="#link"
                                        className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950">
                                        <span className="text-foreground text-sm">Introducing Support for AI Models</span>
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
                        
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-balance text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                       Take the pain out of job applications.
                                    </h1>
                                    <p
                                        className="mx-auto mt-8 max-w-2xl text-balance text-lg">
                                        Take control. Paste job URLs to track everything instantly. Our AI reads your CV and profiles to forge a winning, tailored CV for every role. Email sync handles follow-up; AI flags the responses you need to act on.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        item: transitionVariants.item,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
                                    <div
                                        key={1}
                                        className="bg-foreground/10 rounded-[14px] border p-0.5">
                                        <Button
                                            asChild
                                            size="lg"
                                            className="rounded-xl px-5 text-base">
                                            <Link href="/dashboard">
                                                <span className="text-nowrap">Start Building</span>
                                            </Link>
                                        </Button>
                                    </div>
                                    <Button
                                        key={2}
                                        asChild
                                        size="lg"
                                        variant="ghost"
                                        className="h-10.5 rounded-xl px-5">
                                        <Link href="#link">
                                            <span className="text-nowrap">Request a demo</span>
                                        </Link>
                                    </Button>
                                </AnimatedGroup>
                            </div>
                        </div>

                        {/* <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                item: transitionVariants.item,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-background absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
                                    <img
                                        className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="https://tailark.com//_next/image?url=%2Fmail2.png&w=3840&q=75"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <img
                                        className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup> */}
                    </div>
                </section>
                {/* <section className="bg-background pb-16 pt-16 md:pb-32">
                    <div className="group relative m-auto max-w-5xl px-6">
                        <div className="absolute inset-0 z-10 flex scale-95 items-center justify-center opacity-0 duration-500 group-hover:scale-100 group-hover:opacity-100">
                            <Link
                                href="/"
                                className="block text-sm duration-150 hover:opacity-75">
                                <span> Meet Our Customers</span>

                                <ChevronRight className="ml-1 inline-block size-3" />
                            </Link>
                        </div>
                        <div className="group-hover:blur-xs mx-auto mt-12 grid max-w-2xl grid-cols-4 gap-x-12 gap-y-8 transition-all duration-500 group-hover:opacity-50 sm:gap-x-16 sm:gap-y-14">
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nike.svg"
                                    alt="Nike Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </div>
                    </div>
                </section> */}
            </main>
        </>
    )
}

const menuItems = [
    { name: 'Features', href: '/features' },
   
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/about' },
]

export const HeroHeader = () => {
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
        <svg 
      viewBox="0 0 800 120" 
      xmlns="http://www.w3.org/2000/svg"
     
      className={cn('h-5 w-auto', className)}
    >
    <defs>
        {/* Outer flame gradient */}
        <radialGradient id="outerFlame" cx="50%" cy="70%">
          <stop offset="0%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="30%" style={{ stopColor: '#FF8C00', stopOpacity: 1 }} />
          <stop offset="70%" style={{ stopColor: '#FF4500', stopOpacity: 0.9 }} />
          <stop offset="100%" style={{ stopColor: '#8B0000', stopOpacity: 0.7 }} />
        </radialGradient>
        
        {/* Inner flame gradient */}
        <radialGradient id="innerFlame" cx="50%" cy="60%">
          <stop offset="0%" style={{ stopColor: '#FFFACD', stopOpacity: 1 }} />
          <stop offset="40%" style={{ stopColor: '#FFD700', stopOpacity: 1 }} />
          <stop offset="80%" style={{ stopColor: '#FFA500', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#FF6347', stopOpacity: 0.6 }} />
        </radialGradient>
        
        {/* Core flame gradient */}
        <radialGradient id="coreFlame" cx="50%" cy="50%">
          <stop offset="0%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#FFFFE0', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#FFD700', stopOpacity: 0.9 }} />
        </radialGradient>
      </defs>
      
      {/* Base/outer flame */}
      <path 
        d="M 50 105 Q 25 85 22 60 Q 20 40 30 25 Q 37 13 43 5 Q 46 2 50 0 Q 54 2 57 5 Q 63 13 70 25 Q 80 40 78 60 Q 75 85 50 105 Z" 
        fill="url(#outerFlame)" 
        opacity="0.85"
      >
        <animate 
          attributeName="d" 
          dur="2s" 
          repeatCount="indefinite"
          values="M 50 105 Q 25 85 22 60 Q 20 40 30 25 Q 37 13 43 5 Q 46 2 50 0 Q 54 2 57 5 Q 63 13 70 25 Q 80 40 78 60 Q 75 85 50 105 Z;
                  M 50 105 Q 23 83 20 58 Q 18 38 28 23 Q 35 11 41 3 Q 44 0 50 -2 Q 56 0 59 3 Q 65 11 72 23 Q 82 38 80 58 Q 77 83 50 105 Z;
                  M 50 105 Q 27 87 24 62 Q 22 42 32 27 Q 39 15 45 7 Q 48 3 50 1 Q 52 3 55 7 Q 61 15 68 27 Q 78 42 76 62 Q 73 87 50 105 Z;
                  M 50 105 Q 25 85 22 60 Q 20 40 30 25 Q 37 13 43 5 Q 46 2 50 0 Q 54 2 57 5 Q 63 13 70 25 Q 80 40 78 60 Q 75 85 50 105 Z"
        />
      </path>
      
      {/* Middle flame layer */}
      <path 
        d="M 50 100 Q 30 80 28 58 Q 27 43 35 28 Q 40 16 46 8 Q 48 5 50 3 Q 52 5 54 8 Q 60 16 65 28 Q 73 43 72 58 Q 70 80 50 100 Z" 
        fill="url(#innerFlame)" 
        opacity="0.9"
      >
        <animate 
          attributeName="d" 
          dur="1.5s" 
          repeatCount="indefinite"
          values="M 50 100 Q 30 80 28 58 Q 27 43 35 28 Q 40 16 46 8 Q 48 5 50 3 Q 52 5 54 8 Q 60 16 65 28 Q 73 43 72 58 Q 70 80 50 100 Z;
                  M 50 100 Q 32 78 30 56 Q 29 41 37 26 Q 42 14 47 6 Q 49 3 50 1 Q 51 3 53 6 Q 58 14 63 26 Q 71 41 70 56 Q 68 78 50 100 Z;
                  M 50 100 Q 31 82 29 60 Q 28 45 36 30 Q 41 18 47 10 Q 49 6 50 4 Q 51 6 53 10 Q 59 18 64 30 Q 72 45 71 60 Q 69 82 50 100 Z;
                  M 50 100 Q 30 80 28 58 Q 27 43 35 28 Q 40 16 46 8 Q 48 5 50 3 Q 52 5 54 8 Q 60 16 65 28 Q 73 43 72 58 Q 70 80 50 100 Z"
        />
      </path>
      
      {/* Inner bright core */}
      <path 
        d="M 50 95 Q 37 77 36 58 Q 35 45 40 33 Q 44 23 48 16 Q 49 12 50 10 Q 51 12 52 16 Q 56 23 60 33 Q 65 45 64 58 Q 63 77 50 95 Z" 
        fill="url(#coreFlame)"
      >
        <animate 
          attributeName="d" 
          dur="1.2s" 
          repeatCount="indefinite"
          values="M 50 95 Q 37 77 36 58 Q 35 45 40 33 Q 44 23 48 16 Q 49 12 50 10 Q 51 12 52 16 Q 56 23 60 33 Q 65 45 64 58 Q 63 77 50 95 Z;
                  M 50 95 Q 38 75 37 56 Q 36 43 41 31 Q 45 21 48 14 Q 49 10 50 8 Q 51 10 52 14 Q 55 21 59 31 Q 64 43 63 56 Q 62 75 50 95 Z;
                  M 50 95 Q 36 78 35 59 Q 34 46 39 34 Q 43 24 47 17 Q 49 13 50 11 Q 51 13 53 17 Q 57 24 61 34 Q 66 46 65 59 Q 64 78 50 95 Z;
                  M 50 95 Q 37 77 36 58 Q 35 45 40 33 Q 44 23 48 16 Q 49 12 50 10 Q 51 12 52 16 Q 56 23 60 33 Q 65 45 64 58 Q 63 77 50 95 Z"
        />
      </path>
      
      {/* Bright white center */}
      <ellipse cx="50" cy="55" rx="5" ry="10" fill="#FFFFFF" opacity="0.9">
        <animate 
          attributeName="ry" 
          dur="1s" 
          repeatCount="indefinite"
          values="10;12;9;11;10"
        />
        <animate 
          attributeName="opacity" 
          dur="1s" 
          repeatCount="indefinite"
          values="0.9;1;0.8;0.95;0.9"
        />
      </ellipse>
      
      {/* CareerForge Text with modern font */}
      <text 
        x="100" 
        y="75" 
        fontFamily="'Segoe UI', 'Helvetica Neue', Arial, sans-serif" 
        fontSize="82" 
        fontWeight="600" 
        fill="#1a1a1a" 
        letterSpacing="-1"
      >
        CareerForge
      </text>
    </svg>
    )
}