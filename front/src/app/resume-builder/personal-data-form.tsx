'use client'

import React from 'react'
import { PersonalData, Location } from './types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/cardInteractive'
import { Input } from '@/components/ui/inputInteractive'
import { Label } from '@/components/ui/labelInteractive'

interface PersonalDataFormProps {
  data: PersonalData
  onChange: (data: PersonalData) => void
}

export function PersonalDataForm({ data, onChange }: PersonalDataFormProps) {
  const handleLocationChange = (field: keyof Location, value: string) => {
    onChange({
      ...data,
      location: {
        ...data.location,
        [field]: value,
      } as Location,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>Your basic contact and personal details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={data.firstName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, firstName: e.target.value })}
              placeholder="John"
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={data.lastName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, lastName: e.target.value })}
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={data.email || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, email: e.target.value })}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={data.phone || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, phone: e.target.value })}
              placeholder="+1 (555) 123-4567"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={data.linkedin || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, linkedin: e.target.value })}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
          <div>
            <Label htmlFor="portfolio">Portfolio</Label>
            <Input
              id="portfolio"
              value={data.portfolio || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...data, portfolio: e.target.value })}
              placeholder="https://johndoe.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={data.location?.city || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('city', e.target.value)}
              placeholder="San Francisco"
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={data.location?.country || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleLocationChange('country', e.target.value)}
              placeholder="United States"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
