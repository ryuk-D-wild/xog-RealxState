'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PropertyCard } from "@/components/property-card"

// Define the property type based on our MongoDB schema
interface Property {
  _id: string
  title: string
  type: string
  transaction: string
  price: number
  location: string
  bedrooms: number
  bathrooms: number
  area: number
  images: string[]
  views: number
  description?: string
  features?: string[]
  status: string
  agent?: {
    name: string
    phone: string
    email: string
  }
  inquiries?: number
  createdAt?: string
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    type: 'all',
    transaction: 'all',
    priceRange: 'all',
    location: ''
  })

  // Fetch properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data = await response.json()
        setProperties(data)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Handle filter changes
  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Apply filters to properties
  const filteredProperties = properties.filter(property => {
    // Filter by type
    if (filters.type !== 'all' && property.type !== filters.type) {
      return false
    }
    
    // Filter by transaction
    if (filters.transaction !== 'all' && property.transaction !== filters.transaction) {
      return false
    }
    
    // Filter by price range
    if (filters.priceRange !== 'all') {
      const price = property.price
      if (filters.priceRange === '0-500000' && (price < 0 || price > 500000)) {
        return false
      } else if (filters.priceRange === '500000-1000000' && (price < 500000 || price > 1000000)) {
        return false
      } else if (filters.priceRange === '1000000+' && price < 1000000) {
        return false
      }
    }
    
    // Filter by location
    if (filters.location && !property.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false
    }
    
    return true
  })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">All Properties</h1>
          <p className="text-muted-foreground">Discover your perfect property from our extensive collection</p>
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="house">House</SelectItem>
                <SelectItem value="apartment">Apartment</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="studio">Studio</SelectItem>
                <SelectItem value="penthouse">Penthouse</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('transaction', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Transaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="rent">Rent</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(value) => handleFilterChange('priceRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="0-500000">$0 - $500K</SelectItem>
                <SelectItem value="500000-1000000">$500K - $1M</SelectItem>
                <SelectItem value="1000000+">$1M+</SelectItem>
              </SelectContent>
            </Select>

            <Input 
              placeholder="Location" 
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />

            <Button className="bg-primary hover:bg-primary/90">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        ) : filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl font-semibold mb-2">No properties found</p>
            <p className="text-muted-foreground">Try adjusting your filters to find more properties</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
