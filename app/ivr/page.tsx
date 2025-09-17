import { Phone, Radio, Volume2, Mic, CheckCircle, Globe, Headphones } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function IVRPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
              <Phone className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">IVR Support System</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Access all AgriNetra features through voice calls - no smartphone required!
          </p>
          <Badge variant="secondary" className="mt-4 px-4 py-2">
            <Radio className="h-4 w-4 mr-2" />
            Available 24/7 in Local Languages
          </Badge>
        </div>

        {/* Phone Numbers */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center p-6 bg-white shadow-lg">
            <Phone className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Hindi Support</h3>
            <p className="text-2xl font-bold text-green-600 mb-2">1800-AGRI-HIN</p>
            <p className="text-sm text-gray-600">हिंदी में सहायता</p>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg">
            <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">English Support</h3>
            <p className="text-2xl font-bold text-blue-600 mb-2">1800-AGRI-ENG</p>
            <p className="text-sm text-gray-600">English assistance</p>
          </Card>

          <Card className="text-center p-6 bg-white shadow-lg">
            <Phone className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Regional Languages</h3>
            <p className="text-2xl font-bold text-purple-600 mb-2">1800-AGRI-REG</p>
            <p className="text-sm text-gray-600">Tamil, Telugu, Bengali & more</p>
          </Card>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white shadow-lg">
            <Volume2 className="h-8 w-8 text-green-600 mb-4" />
            <h3 className="font-semibold mb-2">Voice Crop Recommendations</h3>
            <p className="text-sm text-gray-600">Get AI-powered crop suggestions through voice interaction</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <Mic className="h-8 w-8 text-blue-600 mb-4" />
            <h3 className="font-semibold mb-2">Pest Detection Reporting</h3>
            <p className="text-sm text-gray-600">Describe pest symptoms and get treatment advice</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <Radio className="h-8 w-8 text-purple-600 mb-4" />
            <h3 className="font-semibold mb-2">Weather Updates</h3>
            <p className="text-sm text-gray-600">Daily weather forecasts and farming alerts</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <Headphones className="h-8 w-8 text-orange-600 mb-4" />
            <h3 className="font-semibold mb-2">Expert Consultation</h3>
            <p className="text-sm text-gray-600">Connect with agricultural experts via phone</p>
          </Card>
        </div>

        {/* How to Use */}
        <Card className="p-8 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-6 w-6" />
              How to Use IVR System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Step-by-Step Process
                </h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      1
                    </span>
                    <span>Call the appropriate number for your language</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      2
                    </span>
                    <span>Follow voice prompts to select your service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      3
                    </span>
                    <span>Provide your farm details or registration number</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      4
                    </span>
                    <span>Receive personalized recommendations and advice</span>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-green-600" />
                  Available Services
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Crop recommendation requests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Pest and disease reporting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Weather forecast updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Expert consultation booking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Farm registration and updates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Emergency agricultural support</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <Link href="/auth/signup" className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Register for IVR Access
            </Link>
          </Button>
          <p className="text-sm text-gray-600 mt-4">Registration required for personalized recommendations</p>
        </div>
      </div>
    </div>
  )
}
