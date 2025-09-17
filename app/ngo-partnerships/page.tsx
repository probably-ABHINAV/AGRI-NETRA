import { HeartHandshake, Users2, MapPin, Award, CheckCircle, Globe, Handshake, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function NGOPartnershipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <HeartHandshake className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">NGO Partnership Program</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Building trust through community partnerships for sustainable agricultural transformation
          </p>
          <Badge variant="secondary" className="mt-4 px-4 py-2">
            <Users2 className="h-4 w-4 mr-2" />
            Community-Driven Adoption
          </Badge>
        </div>

        {/* Partnership Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-white shadow-lg">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-center">Local Trust Building</h3>
            <p className="text-gray-600 text-center">
              NGOs help build trust within farming communities through familiar faces and established relationships
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-center">Cultural Adaptation</h3>
            <p className="text-gray-600 text-center">
              Customize AgriNetra features to local farming practices, languages, and cultural preferences
            </p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <Award className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-center">Training & Support</h3>
            <p className="text-gray-600 text-center">
              Provide hands-on training and ongoing support through trusted community organizations
            </p>
          </Card>
        </div>

        {/* Current Partners */}
        <Card className="p-8 bg-white shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Handshake className="h-6 w-6" />
              Our NGO Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Rural Development Foundation</h4>
                <p className="text-sm text-gray-600 mb-2">Maharashtra, Karnataka</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Partner
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">Farmers Welfare Society</h4>
                <p className="text-sm text-gray-600 mb-2">Punjab, Haryana</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Partner
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Sustainable Agriculture Initiative</h4>
                <p className="text-sm text-gray-600 mb-2">Tamil Nadu, Kerala</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Partner
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
                <h4 className="font-semibold mb-2">Organic Farming Collective</h4>
                <p className="text-sm text-gray-600 mb-2">West Bengal, Odisha</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Partner
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <h4 className="font-semibold mb-2">Women Farmers Association</h4>
                <p className="text-sm text-gray-600 mb-2">Rajasthan, Gujarat</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Partner
                </Badge>
              </div>

              <div className="text-center p-4 border rounded-lg">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <MapPin className="h-6 w-6 text-teal-600" />
                </div>
                <h4 className="font-semibold mb-2">Youth Agriculture Network</h4>
                <p className="text-sm text-gray-600 mb-2">Uttar Pradesh, Bihar</p>
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Partner
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Partnership Program */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users2 className="h-6 w-6" />
                For NGOs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-3">Partnership Benefits:</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Revenue sharing from farmer subscriptions</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Training materials and certification programs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Technology infrastructure support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Community impact measurement tools</span>
                </li>
              </ul>
              <Button className="w-full">
                <HeartHandshake className="h-4 w-4 mr-2" />
                Become a Partner NGO
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6" />
                For Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold mb-3">Community Support:</h4>
              <ul className="space-y-2 text-sm mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Local language training and support</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Group learning sessions and workshops</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Peer-to-peer knowledge sharing</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Subsidized access through NGO programs</span>
                </li>
              </ul>
              <Button variant="outline" className="w-full bg-transparent">
                <MapPin className="h-4 w-4 mr-2" />
                Find Local NGO Partner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <Card className="p-8 bg-gradient-to-r from-green-50 to-blue-50 mb-12">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Award className="h-6 w-6" />
              Success Stories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">85%</div>
                <p className="text-gray-600 mb-2">Farmer Adoption Rate</p>
                <p className="text-sm text-gray-500">Through NGO partnerships vs 45% direct adoption</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">12,000+</div>
                <p className="text-gray-600 mb-2">Farmers Onboarded</p>
                <p className="text-sm text-gray-500">Via NGO community programs in 2024</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Partner with Us?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join our mission to transform agriculture through community-driven technology adoption
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <HeartHandshake className="h-5 w-5" />
                Partner with AgriNetra
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/auth/signup" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Join as Farmer
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
