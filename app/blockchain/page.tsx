import { Database, Lock, Shield, CheckCircle, Key, Network, Globe, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function BlockchainPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <Database className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blockchain Data Security</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your farm data is secured with cutting-edge blockchain technology, ensuring complete ownership and privacy
          </p>
          <Badge variant="secondary" className="mt-4 px-4 py-2">
            <Shield className="h-4 w-4 mr-2" />
            Stage 3 Implementation Ready
          </Badge>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white shadow-lg text-center">
            <Lock className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Data Ownership</h3>
            <p className="text-sm text-gray-600">You own and control your agricultural data completely</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg text-center">
            <Key className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Private Keys</h3>
            <p className="text-sm text-gray-600">Cryptographic keys ensure only you can access your data</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg text-center">
            <Network className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Decentralized</h3>
            <p className="text-sm text-gray-600">No single point of failure or control</p>
          </Card>

          <Card className="p-6 bg-white shadow-lg text-center">
            <CheckCircle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Immutable</h3>
            <p className="text-sm text-gray-600">Data cannot be altered or deleted without your permission</p>
          </Card>
        </div>

        {/* Implementation Roadmap */}
        <Card className="p-8 bg-white shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              Blockchain Implementation Roadmap
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold text-green-600">Stage 1: Current (Centralized Security)</h4>
                  <p className="text-gray-600 text-sm">Enterprise-grade encryption and secure cloud storage</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-blue-600">Stage 2: Hybrid Model (Q2 2025)</h4>
                  <p className="text-gray-600 text-sm">Critical data hashed on blockchain, full data in secure cloud</p>
                  <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                    <li>Data integrity verification</li>
                    <li>Audit trail on blockchain</li>
                    <li>Smart contracts for data sharing</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-purple-600">Stage 3: Full Decentralization (Q4 2025)</h4>
                  <p className="text-gray-600 text-sm">Complete blockchain-based data storage and ownership</p>
                  <ul className="text-xs text-gray-500 mt-1 ml-4 list-disc">
                    <li>IPFS distributed storage</li>
                    <li>NFT-based data ownership certificates</li>
                    <li>Decentralized identity management</li>
                    <li>Farmer-controlled data monetization</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card className="p-6 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Privacy Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Complete Data Control:</strong> You decide who can access your farm data
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Selective Sharing:</strong> Share specific data points without revealing everything
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Revocable Access:</strong> Withdraw data access permissions anytime
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Anonymous Analytics:</strong> Contribute to research without revealing identity
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="p-6 bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-6 w-6" />
                Economic Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Data Monetization:</strong> Earn from sharing your agricultural insights
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Research Participation:</strong> Get paid for contributing to agricultural studies
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Premium Services:</strong> Access advanced features through token rewards
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>
                    <strong>Community Governance:</strong> Vote on platform features and policies
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Technical Details */}
        <Card className="p-8 bg-gradient-to-r from-purple-50 to-blue-50 mb-12">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Network className="h-6 w-6" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Database className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-semibold mb-2">Polygon Network</h4>
                <p className="text-sm text-gray-600">Low-cost, fast transactions for agricultural data</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Key className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-semibold mb-2">IPFS Storage</h4>
                <p className="text-sm text-gray-600">Distributed file system for large agricultural datasets</p>
              </div>
              <div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold mb-2">Smart Contracts</h4>
                <p className="text-sm text-gray-600">Automated data sharing agreements and payments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="p-6 bg-white shadow-lg mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6" />
              Current Security Measures
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              While we prepare for full blockchain implementation, your data is currently protected by:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>AES-256 encryption at rest and in transit</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>Multi-factor authentication</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-green-600" />
                  <span>Regular security audits</span>
                </li>
              </ul>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>GDPR and data protection compliance</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Granular access controls</span>
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>Data anonymization options</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready for Secure, Decentralized Agriculture?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join AgriNetra today and be ready for the future of farmer-owned agricultural data
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup" className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Start Secure Farming
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact" className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
