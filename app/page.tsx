'use client'

import { useState, useEffect } from 'react'
import { Search, MapPin, Home, Building2, Star, Clock } from "lucide-react"
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

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useState({
    type: '',
    transaction: '',
    location: ''
  })

  // Fetch featured properties from the API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('/api/properties')
        if (!response.ok) {
          throw new Error('Failed to fetch properties')
        }
        const data = await response.json()
        
        // Get the 3 properties with the most views
        const featured = [...data]
          .sort((a, b) => b.views - a.views)
          .slice(0, 3)
        
        setFeaturedProperties(featured)
      } catch (error) {
        console.error('Error fetching properties:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Construct the query string
    const queryParams = new URLSearchParams()
    
    if (searchParams.type) {
      queryParams.append('type', searchParams.type)
    }
    
    if (searchParams.transaction) {
      queryParams.append('transaction', searchParams.transaction)
    }
    
    if (searchParams.location) {
      queryParams.append('location', searchParams.location)
    }
    
    // Redirect to the properties page with the search parameters
    window.location.href = `/properties?${queryParams.toString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-20"> {/* Changed from blue-600/800 */}
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Find Your Perfect Property</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing houses and commercial spaces for rent or purchase. Your dream property is just a click
            away.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="bg-card rounded-lg p-6 max-w-4xl mx-auto shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select onValueChange={(value) => setSearchParams(prev => ({ ...prev, type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Property Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="studio">Studio</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>

              <Select onValueChange={(value) => setSearchParams(prev => ({ ...prev, transaction: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                </SelectContent>
              </Select>

              <Input 
                placeholder="Location" 
                onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
              />

              <Button type="submit" className="bg-primary hover:bg-primary/90">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our handpicked selection of premium properties that stand out for their exceptional features and value.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading featured properties...</p>
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-semibold mb-2">No featured properties available</p>
              <p className="text-muted-foreground">Check back soon for new listings</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/properties">
              <Button size="lg" variant="outline">
                View All Properties
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  )
}
