"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import Link from "next/link"

const features = [
  "Floor-to-ceiling windows",
  "Hardwood floors",
  "Modern kitchen",
  "Stainless steel appliances",
  "24/7 concierge",
  "Fitness center",
  "Rooftop terrace",
  "In-unit laundry",
  "Central air conditioning",
  "Pet-friendly",
  "Parking included",
  "Balcony/Patio",
  "Swimming pool",
  "Security system",
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [images, setImages] = useState<File[]>([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    transaction: "",
    price: "",
    area: "",
    bedrooms: "0",
    bathrooms: "0",
    description: "",
    "agent-name": "",
    "agent-phone": "",
    "agent-email": "",
  })

  const handleFeatureChange = (feature: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, feature])
    } else {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files)
      setImages([...images, ...newFiles])
      
      // Create preview URLs for the images
      const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file))
      setImagePreviewUrls([...imagePreviewUrls, ...newPreviewUrls])
    }
  }

  const removeImage = (index: number) => {
    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(imagePreviewUrls[index])
    
    setImages(images.filter((_, i) => i !== index))
    setImagePreviewUrls(imagePreviewUrls.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({
      ...formData,
      [id]: value
    })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({
      ...formData,
      [id]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (images.length === 0) {
      toast.error("Please upload at least one image")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create FormData object for the API request
      const apiFormData = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        apiFormData.append(key, value)
      })
      
      // Add features
      selectedFeatures.forEach(feature => {
        apiFormData.append('features', feature)
      })
      
      // Add images
      images.forEach(image => {
        apiFormData.append('images', image)
      })
      
      // Submit to API
      const response = await fetch('/api/properties', {
        method: 'POST',
        body: apiFormData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add property')
      }
      
      toast.success("Property added successfully!")
      router.push('/admin')
    } catch (error) {
      console.error('Error adding property:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to add property')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">RealEstate Pro</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">
              Admin Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link href="/admin" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add New Property</CardTitle>
              <CardDescription>Fill in the details to add a new property listing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">Property Title</Label>
                    <Input 
                      id="title" 
                      placeholder="e.g., Modern Downtown Apartment" 
                      required 
                      value={formData.title}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      placeholder="e.g., Downtown, NY" 
                      required 
                      value={formData.location}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="type">Property Type</Label>
                    <Select 
                      required
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="store">Store</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="transaction">Transaction Type</Label>
                    <Select 
                      required
                      value={formData.transaction}
                      onValueChange={(value) => handleSelectChange("transaction", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select transaction type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="buy">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input 
                      id="price" 
                      placeholder="e.g., $2,500/month or $850,000" 
                      required 
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input 
                      id="area" 
                      placeholder="e.g., 1,200" 
                      required 
                      value={formData.area}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input 
                      id="bedrooms" 
                      type="number" 
                      placeholder="0" 
                      value={formData.bedrooms}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input 
                      id="bathrooms" 
                      type="number" 
                      placeholder="0" 
                      value={formData.bathrooms}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the property in detail..."
                    className="min-h-[120px]"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </div>

                {/* Images */}
                <div>
                  <Label>Property Images</Label>
                  <div className="mt-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      {imagePreviewUrls.map((imageUrl, index) => (
                        <div key={index} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Property ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 h-6 w-6 p-0"
                            onClick={() => removeImage(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center w-full">
                      <label htmlFor="image-upload" className="w-full cursor-pointer">
                        <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors">
                          <Upload className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="mt-2 text-sm text-gray-600">Click to upload images</p>
                          <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          multiple
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <Label>Features & Amenities</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center space-x-2">
                        <Checkbox
                          id={feature}
                          checked={selectedFeatures.includes(feature)}
                          onCheckedChange={(checked) => handleFeatureChange(feature, checked as boolean)}
                        />
                        <Label htmlFor={feature} className="text-sm">
                          {feature}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Agent Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="agent-name">Agent Name</Label>
                      <Input 
                        id="agent-name" 
                        placeholder="e.g., Sarah Johnson" 
                        required 
                        value={formData["agent-name"]}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="agent-phone">Agent Phone</Label>
                      <Input 
                        id="agent-phone" 
                        placeholder="(555) 123-4567" 
                        required 
                        value={formData["agent-phone"]}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <Label htmlFor="agent-email">Agent Email</Label>
                      <Input 
                        id="agent-email" 
                        type="email" 
                        placeholder="agent@realestatepro.com" 
                        required 
                        value={formData["agent-email"]}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex items-center space-x-4 pt-6">
                  <Button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Adding Property..." : "Add Property"}
                  </Button>
                  <Link href="/admin">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
