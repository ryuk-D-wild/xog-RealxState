'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Home, Bath, Bed, Square, Star, Phone, Mail, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useParams } from 'next/navigation'
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

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

export default function PropertyDetailPage() {
  const params = useParams()
  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  })

  // Fetch property data from the API
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!params.id) {
          throw new Error('Property ID is missing')
        }
        
        const response = await fetch(`/api/properties/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch property')
        }
        
        const data = await response.json()
        setProperty(data)
      } catch (error: any) {
        console.error('Error fetching property:', error)
        setError(error.message || 'Failed to load property')
      } finally {
        setLoading(false)
      }
    }

    fetchProperty()
  }, [params.id])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real application, you would send this data to your backend
    console.log('Form submitted:', {
      propertyId: params.id,
      ...formData
    })
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      message: ''
    })
    
    // Show success message (in a real app, you'd use a toast notification)
    alert('Viewing request submitted successfully!')
  }

  // Format price based on transaction type
  const formatPrice = (price: number, transaction: string) => {
    return transaction === "rent" 
      ? `$${price.toLocaleString()}/month` 
      : `$${price.toLocaleString()}`
  }

  // Format area with commas and sq ft
  const formatArea = (area: number) => {
    return `${area.toLocaleString()} sq ft`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'Property not found'}</p>
          <Link href="/properties">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/properties" className="inline-flex items-center text-primary hover:text-primary/90 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="grid grid-cols-2 gap-4">
                {property.images && property.images.length > 0 ? (
                  <>
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-64 object-cover rounded-lg col-span-2"
                    />
                    {property.images.slice(1, 4).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${property.title} ${index + 2}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </>
                ) : (
                  <img
                    src="/placeholder.svg"
                    alt={property.title}
                    className="w-full h-64 object-cover rounded-lg col-span-2"
                  />
                )}
              </div>
            </div>

            {/* Property Info */}
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{property.title}</CardTitle>
                    <CardDescription className="flex items-center text-lg">
                      <MapPin className="h-5 w-5 mr-2" />
                      {property.location}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary mb-2">
                      {formatPrice(property.price, property.transaction)}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{property.views} views</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <Badge className="bg-primary">{property.transaction === "buy" ? "For Sale" : "For Rent"}</Badge>
                  <Badge variant="outline">{property.type}</Badge>
                  <Badge variant="outline" className={property.status === 'active' ? 'bg-green-100' : property.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent>
                {/* Property Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.bedrooms > 0 && (
                    <div className="flex items-center space-x-2">
                      <Bed className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{property.bedrooms} Bedrooms</span>
                    </div>
                  )}
                  {property.bathrooms > 0 && (
                    <div className="flex items-center space-x-2">
                      <Bath className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{property.bathrooms} Bathrooms</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Square className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium">{formatArea(property.area)}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Description</h3>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Features & Amenities</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Info */}
            {property.agent && (
              <Card>
                <CardHeader>
                  <CardTitle>Contact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src="/placeholder-user.jpg"
                      alt={property.agent.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium">{property.agent.name}</div>
                      <div className="text-sm text-muted-foreground">Licensed</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.agent.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{property.agent.email}</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <Button className="w-full">
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle>Schedule a Viewing</CardTitle>
                <CardDescription>Book a tour of this property</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Your full name" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="your@email.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="(555) 123-4567" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input 
                      id="date" 
                      type="date" 
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Any specific questions or requirements..." 
                      value={formData.message}
                      onChange={handleInputChange}
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Viewing
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}
