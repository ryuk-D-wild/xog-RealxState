import Link from 'next/link'
import { Home, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Home className="h-8 w-8" />
              <span className="text-2xl font-bold">RealEstate Pro</span>
            </div>
            <p className="text-primary-foreground/80">Your trusted partner in finding the perfect property for your needs.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>
                <Link href="/properties" className="hover:text-primary-foreground transition-colors">
                  Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary-foreground transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-primary-foreground/80">
              <li>Property Sales</li>
              <li>Rental Services</li>
              <li>Commercial Spaces</li>
              <li>Property Management</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <div className="space-y-2 text-primary-foreground/80">
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@realestatepro.com</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>123 Main St, City, State</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/80">
          <p>&copy; 2025. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}