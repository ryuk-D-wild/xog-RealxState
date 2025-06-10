import { MapPin, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

interface PropertyCardProps {
  property: {
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
  }
}

export function PropertyCard({ property }: PropertyCardProps) {
  // Format price based on transaction type
  const formattedPrice = property.transaction === "rent" 
    ? `$${property.price.toLocaleString()}/month` 
    : `$${property.price.toLocaleString()}`
    
  // Format area with commas and sq ft
  const formattedArea = `${property.area.toLocaleString()} sq ft`

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
      <div className="relative">
        <img
          src={property.images && property.images.length > 0 ? property.images[0] : "/placeholder.svg"}
          alt={property.title}
          className="w-full h-48 object-cover"
        />
        <Badge className="absolute top-4 left-4 bg-primary hover:bg-primary">
          {property.transaction === "buy" ? "For Sale" : "For Rent"}
        </Badge>
        <div className="absolute top-4 right-4 bg-background rounded-full p-1 shadow-sm">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-medium">{property.views}</span>
          </div>
        </div>
      </div>

      <CardHeader>
        <CardTitle className="text-xl">{property.title}</CardTitle>
        <CardDescription className="flex items-center">
          <MapPin className="h-4 w-4 mr-1" />
          {property.location}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col">
        {property.description && (
          <p className="text-muted-foreground text-sm mb-4">{property.description}</p>
        )}

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary">{formattedPrice}</span>
          <Badge variant="outline">{property.type === "house" ? "House" : "Store"}</Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground mb-4">
          {property.type === "house" && (
            <>
              <div>{property.bedrooms} Beds</div>
              <div>{property.bathrooms} Baths</div>
            </>
          )}
          <div>{formattedArea}</div>
        </div>

        <div className="mt-auto">
          <Link href={`/properties/${property._id}`}>
            <Button className="w-full">View Details</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}