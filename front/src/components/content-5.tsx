import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
export default function ContentSection() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-12">
                <Image
                    className="rounded-(--radius) grayscale"
                    src="/team.tiff"
                    alt="team image"
                    height={400}
                    width={800}
                    loading="lazy"
                />

                <div className="grid gap-6 md:grid-cols-2 md:gap-12">
                    <h2 className="text-4xl font-medium">Finally, a job application platform that manages the chaos for you.</h2>
                    <div className="space-y-6">
                        <p>
                            As three developers who faced the grind of job hunting, we built this platform to eliminate the soul-crushing administrative work. Our mission is to instantly tailor your professional experience into a perfect CV for every job and simplify your inbox so you can focus only on landing the interview.
                        </p>

                        <Button
                            asChild
                            variant="secondary"
                            size="sm"
                            className="gap-1 pr-1.5">
                            <Link href="#">
                                <span>Learn More</span>
                                <ChevronRight className="size-2" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
