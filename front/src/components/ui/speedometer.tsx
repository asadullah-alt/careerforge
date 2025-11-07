"use client"

import React from 'react'

interface SpeedometerProps {
  value: number // 0 - 100
  size?: number
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0)
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  }
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, radius, endAngle)
  const end = polarToCartesian(cx, cy, radius, startAngle)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`
}

const Speedometer = ({ value, size = 180 }: SpeedometerProps) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)))
  const cx = size / 2
  const cy = size / 2
  const radius = Math.floor(size * 0.38)
  const startAngle = -135
  const endAngle = 135
  const angle = startAngle + (clamped / 100) * (endAngle - startAngle)

  const arcBackground = describeArc(cx, cy, radius, startAngle, endAngle)
  const arcValue = describeArc(cx, cy, radius, startAngle, angle)

  const needle = polarToCartesian(cx, cy, radius * 0.9, angle)

  return (
    <svg width={size} height={size / 1.1} viewBox={`0 0 ${size} ${size / 1.1}`}>
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" x2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>

      {/* background arc */}
      <path d={arcBackground} fill="none" stroke="#e6e7eb" strokeWidth={size * 0.06} strokeLinecap="round" />

      {/* value arc */}
      <path d={arcValue} fill="none" stroke="url(#gaugeGrad)" strokeWidth={size * 0.06} strokeLinecap="round" />

      {/* ticks */}
      {[0, 25, 50, 75, 100].map((t) => {
        const ta = startAngle + (t / 100) * (endAngle - startAngle)
        const p1 = polarToCartesian(cx, cy, radius + size * 0.03, ta)
        const p2 = polarToCartesian(cx, cy, radius - size * 0.03, ta)
        return <line key={t} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#94a3b8" strokeWidth={2} />
      })}

      {/* needle */}
      <line x1={cx} y1={cy} x2={needle.x} y2={needle.y} stroke="#111827" strokeWidth={2.5} />

      {/* center cap */}
      <circle cx={cx} cy={cy} r={size * 0.03} fill="#111827" />

      {/* value text */}
      <text x={cx} y={cy + size * 0.22} textAnchor="middle" fontSize={size * 0.14} fontWeight={700} fill="#0f172a">
        {clamped}%
      </text>
    </svg>
  )
}

export default Speedometer