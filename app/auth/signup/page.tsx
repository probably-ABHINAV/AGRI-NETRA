import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sprout, AlertCircle } from "lucide-react"
import Link from "next/link"
import { registerAction } from "@/app/actions/auth"

interface SignupPageProps {
  searchParams: { error?: string; message?: string }
}

export default function SignupPage({ searchParams }: SignupPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sprout className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold text-gray-900">AgriNetra</span>
          </div>
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join thousands of farmers using smart technology to optimize their crops</CardDescription>
        </CardHeader>
        <CardContent>
          {searchParams.error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {searchParams.error}
              </AlertDescription>
            </Alert>
          )}
          
          {searchParams.message && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <AlertCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {searchParams.message}
              </AlertDescription>
            </Alert>
          )}

          <form action="/api/auth/signup" method="POST" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="farmer@example.com" required />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" placeholder="Create a strong password" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" name="phoneNumber" type="tel" placeholder="+91 9876543210" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select name="role" defaultValue="farmer">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farmer">Farmer</SelectItem>
                    <SelectItem value="expert">Agricultural Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select name="state">
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                    <SelectItem value="karnataka">Karnataka</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="gujarat">Gujarat</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                    <SelectItem value="odisha">Odisha</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Account
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            <div className="text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
            
            <div className="text-center pt-4 border-t">
              <Link 
                href="/test-database" 
                className="text-xs text-blue-600 hover:text-blue-700 underline"
              >
                Test Database Connection
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
