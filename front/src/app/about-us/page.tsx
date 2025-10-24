import { redirect } from 'next/navigation'

export default function AboutUsRedirect() {
    // Permanent redirect to canonical /about
    redirect('/about')
}
