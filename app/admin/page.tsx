"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, Edit, Trash2, Home, Building2, Eye, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import Link from "next/link"
import Cookies from 'js-cookie'

// Define the Property type
interface Property {
  _id: string;
  title: string;
  type: string;
  transaction: string;
  price: string;
  location: string;
  status: string;
  views: number;
  inquiries: number;
}

// Define the Stats type
interface Stat {
  title: string;
  value: string;
  icon: any;
  color: string;
}

export default function AdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminUser, setAdminUser] = useState("")
  const [properties, setProperties] = useState<Property[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Total Properties",
      value: "0",
      icon: Home,
      color: "text-gray-600",
    },
    {
      title: "Active Listings",
      value: "0",
      icon: Building2,
      color: "text-green-600",
    },
    {
      title: "Total Views",
      value: "0",
      icon: Eye,
      color: "text-purple-600",
    },
    {
      title: "Inquiries",
      value: "0",
      icon: Plus,
      color: "text-orange-600",
    },
  ])
  
  // Check authentication using localStorage
  useEffect(() => {
    // Check if user is authenticated using localStorage
    const auth = localStorage.getItem("adminAuth")
    const user = localStorage.getItem("adminUser")
    
    if (auth !== "true") {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
      setAdminUser(user || "")
      fetchProperties()
    }
  }, [])

  // Fetch properties from the API
  const fetchProperties = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/properties')
      
      if (!response.ok) {
        throw new Error('Failed to fetch properties')
      }
      
      const data = await response.json()
      setProperties(data)
      
      // Update stats based on fetched properties
      updateStats(data)
    } catch (error) {
      console.error('Error fetching properties:', error)
      toast.error('Failed to load properties')
    } finally {
      setIsLoading(false)
    }
  }
  
  // Update stats based on properties data
  const updateStats = (properties: Property[]) => {
    const totalProperties = properties.length
    const activeListings = properties.filter(p => p.status === 'active').length
    const totalViews = properties.reduce((sum, p) => sum + p.views, 0)
    const totalInquiries = properties.reduce((sum, p) => sum + p.inquiries, 0)
    
    setStats([
      {
        title: "Total Properties",
        value: totalProperties.toString(),
        icon: Home,
        color: "text-gray-600",
      },
      {
        title: "Active Listings",
        value: activeListings.toString(),
        icon: Building2,
        color: "text-green-600",
      },
      {
        title: "Total Views",
        value: totalViews.toString(),
        icon: Eye,
        color: "text-purple-600",
      },
      {
        title: "Inquiries",
        value: totalInquiries.toString(),
        icon: Plus,
        color: "text-orange-600",
      },
    ])
  }

  // Delete a property
  const deleteProperty = async (id: string) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete property')
      }
      
      // Remove the property from the state
      setProperties(properties.filter(p => p._id !== id))
      toast.success('Property deleted successfully')
      
      // Refresh properties to update stats
      fetchProperties()
    } catch (error) {
      console.error('Error deleting property:', error)
      toast.error('Failed to delete property')
    }
  }

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("adminUser")
    // Clear the cookie for middleware
    Cookies.remove('adminAuth')
    router.push("/admin/login")
  }

  // If not authenticated, don't render the admin page
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Home className="h-8 w-8 text-gray-700" />
            <span className="text-2xl font-bold text-gray-900">RealEstate Pro</span>
          </Link>
          <nav className="flex items-center space-x-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              View Site
            </Link>
            <Badge variant="outline">Admin Panel</Badge>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* User ID display */}
        <div className="mb-4 text-right">
          <span className="text-sm text-gray-600">Logged in as: <strong>{adminUser}</strong></span>
        </div>
        
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your property listings and view analytics</p>
          </div>
          <Link href="/admin/properties/new">
            <Button className="bg-gray-800 hover:bg-gray-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Properties Table */}
        <Card>
          <CardHeader>
            <CardTitle>Property Listings</CardTitle>
            <CardDescription>Manage all your property listings</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <p>Loading properties...</p>
              </div>
            ) : properties.length === 0 ? (
              <div className="text-center py-8">
                <p>No properties found. Add your first property!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead>Inquiries</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{property.title}</div>
                          <div className="text-sm text-gray-500">{property.location}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{property.type === "house" ? "House" : "Store"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={property.transaction === "buy" ? "default" : "secondary"}>
                          {property.transaction === "buy" ? "Sale" : "Rent"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">{property.price}</TableCell>
                      <TableCell>
                        <Badge
                          variant={property.status === "active" ? "default" : "secondary"}
                          className={property.status === "active" ? "bg-green-600" : "bg-yellow-600"}
                        >
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{property.views}</TableCell>
                      <TableCell>{property.inquiries}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Link href={`/properties/${property._id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/admin/properties/edit/${property._id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the property
                                  and remove the data from the server.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => deleteProperty(property._id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
