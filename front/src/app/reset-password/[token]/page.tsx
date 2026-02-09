'use client'

import React from 'react'
import { BackgroundReset } from '@/components/ui/background-reset'

export default function ResetPasswordPage({ params }: { params: { token: string } }) {
    return (
        <BackgroundReset token={params.token} />
    )
}
