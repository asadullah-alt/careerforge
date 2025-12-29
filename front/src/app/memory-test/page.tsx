'use client'
import { useEffect, useState } from 'react'

export default function MemoryTest() {
    const [count, setCount] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(c => c + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="p-8 space-y-4">
            <h1 className="text-2xl font-bold">Memory Leak Verification</h1>
            <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                <p className="text-lg">State Update Cycle: <span className="font-mono font-bold">{count}</span></p>
                <div className="mt-4 text-sm text-muted-foreground space-y-2">
                    <p><strong>Instructions:</strong></p>
                    <ol className="list-decimal list-inside space-y-1">
                        <li>Open Chrome DevTools (F12)</li>
                        <li>Go to the <strong>Memory</strong> tab</li>
                        <li>Select <strong>Heap snapshot</strong></li>
                        <li>Take a snapshot now (Snapshot 1)</li>
                        <li>Wait for the counter to increase by ~20-30</li>
                        <li>Take another snapshot (Snapshot 2)</li>
                        <li>Select "Comparison" view in Snapshot 2 and compare with Snapshot 1</li>
                    </ol>
                    <p className="mt-4 p-2 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900 rounded">
                        ⚠️ Look for increasing counts of <code>CSSStyleDeclaration</code> or detached DOM nodes.
                    </p>
                </div>
            </div>
        </div>
    )
}
