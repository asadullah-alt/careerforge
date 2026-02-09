'use client'

import React, { use } from 'react'
import { BackgroundReset } from '@/components/ui/background-reset'

export default function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
    const resolvedParams = use(params)
    return (
        <BackgroundReset token={resolvedParams.token} />
    )
}
