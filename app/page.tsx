'use client'

import {
  Sprout,
  Users,
  BarChart3,
  Shield,
  Zap,
  Phone,
  CheckCircle,
  Brain,
  Leaf,
  Cloud,
  ArrowRight,
  Star,
  TrendingUp,
  Award,
  Globe,
  Sparkles,
  Play,
  ChevronRight,
  MousePointer,
  Lightbulb,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"
import LanguageSelector from "@/components/language-selector"

export default function HomePage() {
  const { t, userState } = useLanguage()

  return (
    <div className="min-h-screen bg-background">
      <header className="glass-effect border-b border-border/50 sticky top-0 z-50 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in">
            <div className="relative">
              <Sprout className="h-10 w-10 text-primary animate-float" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-pulse" />
            </div>
            <span className="text-3xl font-black gradient-text">AgriNetra</span>
            <Badge variant="outline" className="ml-2 bg-primary/10 text-primary border-primary/20">
              Premium
            </Badge>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:scale-105"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:scale-105"
            >
              How it Works
            </Link>
            <Link
              href="#testimonials"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:scale-105"
            >
              Success Stories
            </Link>
            <Link
              href="#contact"
              className="text-muted-foreground hover:text-primary transition-all duration-300 font-medium hover:scale-105"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
              asChild
            >
              <Link href="/auth/login">Login</Link>
            </Button>
            <Button
              className="premium-shadow hover-lift bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              asChild
            >
              <Link href="/auth/signup" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-transparent to-accent" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        />

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <Badge
            variant="outline"
            className="mb-8 px-6 py-3 bg-card/80 border-primary/30 text-primary font-semibold animate-slide-up"
          >
            <Award className="h-5 w-5 mr-2" />
            World's Most Advanced Agricultural AI Platform
          </Badge>

          <h1 className="text-6xl md:text-8xl font-black text-foreground mb-8 text-balance animate-slide-up leading-tight">
            The Future of
            <span className="gradient-text block mt-2">Smart Farming</span>
          </h1>

          <p className="text-2xl text-muted-foreground mb-12 text-pretty max-w-3xl mx-auto leading-relaxed animate-slide-up font-medium">
            Revolutionize your agricultural operations with cutting-edge AI technology, real-time monitoring, and expert
            insights that maximize yields while minimizing environmental impact.
          </p>

          {/* Language Selection Banner */}
          {!userState && (
            <section className="bg-green-600 text-white py-3">
              <div className="container mx-auto px-4 text-center">
                <p className="text-sm">
                  {t('common.selectYourState') || 'Select your state for localized farming advice in your language'}
                </p>
              </div>
            </section>
          )}

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16 animate-slide-up">
            <Button
              size="lg"
              className="text-xl px-10 py-6 premium-shadow hover-lift bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
              asChild
            >
              <Link href="/auth/signup" className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6" />
                Start Free Trial
                <ChevronRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-10 py-6 glass-effect hover-lift border-2 border-primary/20 hover:border-primary/40 font-bold bg-transparent"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <Play className="h-6 w-6" />
                Watch Demo
                <MousePointer className="h-5 w-5" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto animate-scale-in">
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">98%</div>
              <div className="text-muted-foreground font-medium">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">50K+</div>
              <div className="text-muted-foreground font-medium">Active Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">35%</div>
              <div className="text-muted-foreground font-medium">Yield Increase</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-black text-primary mb-2">24/7</div>
              <div className="text-muted-foreground font-medium">AI Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <Badge variant="outline" className="mb-6 px-4 py-2 bg-primary/10 text-primary border-primary/20">
              <Lightbulb className="h-4 w-4 mr-2" />
              Premium Features
            </Badge>
            <h2 className="text-5xl font-black text-foreground mb-6 gradient-text">
              Everything You Need for Excellence
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge AI technology with agricultural expertise to deliver unparalleled
              farming intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 premium-shadow hover-lift bg-card/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-all duration-300">
                  <Brain className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">AI Crop Intelligence</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Advanced machine learning algorithms analyze soil conditions, weather patterns, and market trends to
                  provide personalized crop recommendations with 98% accuracy.
                </p>
                <div className="flex items-center gap-3 text-sm text-primary font-semibold">
                  <Star className="h-4 w-4 fill-current" />
                  <span>Industry Leading Accuracy</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 premium-shadow hover-lift bg-card/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-all duration-300">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Smart Pest Detection</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Upload crop images for instant AI-powered pest and disease identification with comprehensive treatment
                  recommendations and prevention strategies.
                </p>
                <div className="flex items-center gap-3 text-sm text-blue-600 font-semibold">
                  <Zap className="h-4 w-4" />
                  <span>Real-time Analysis</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 premium-shadow hover-lift bg-card/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all duration-300">
                  <Globe className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">IoT Ecosystem</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Comprehensive sensor network monitoring soil moisture, temperature, nutrients, and environmental
                  conditions with automated alerts and recommendations.
                </p>
                <div className="flex items-center gap-3 text-sm text-purple-600 font-semibold">
                  <Cloud className="h-4 w-4" />
                  <span>24/7 Monitoring</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 premium-shadow hover-lift bg-card/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-all duration-300">
                  <Cloud className="h-8 w-8 text-orange-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Weather Intelligence</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Hyperlocal weather forecasts, climate insights, and predictive analytics to optimize planting,
                  irrigation, and harvesting schedules.
                </p>
                <div className="flex items-center gap-3 text-sm text-orange-600 font-semibold">
                  <TrendingUp className="h-4 w-4" />
                  <span>Predictive Analytics</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 premium-shadow hover-lift bg-card/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-red-500/20 transition-all duration-300">
                  <Users className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Expert Network</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Connect with certified agricultural experts and AI assistants for personalized advice,
                  troubleshooting, and strategic planning support.
                </p>
                <div className="flex items-center gap-3 text-sm text-red-600 font-semibold">
                  <Phone className="h-4 w-4" />
                  <span>24/7 Expert Support</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 premium-shadow hover-lift bg-card/80 backdrop-blur-sm group">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-500/20 transition-all duration-300">
                  <BarChart3 className="h-8 w-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Advanced Analytics</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Comprehensive performance tracking with detailed analytics, yield predictions, ROI calculations, and
                  actionable business insights.
                </p>
                <div className="flex items-center gap-3 text-sm text-teal-600 font-semibold">
                  <BarChart3 className="h-4 w-4" />
                  <span>Real-time Insights</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works section */}
      <section id="how-it-works" className="py-20 px-4 bg-card/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">How AgriNetra Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to transform your farming with smart technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Setup Your Farm</h3>
              <p className="text-muted-foreground">
                Register your farm details, location, and current crops. Connect IoT sensors for monitoring.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Get AI Insights</h3>
              <p className="text-muted-foreground">
                Receive personalized recommendations, pest alerts, and weather-based farming advice.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Optimize & Grow</h3>
              <p className="text-muted-foreground">
                Implement recommendations, track progress, and continuously improve your yields.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-accent" />
        <div className="absolute inset-0 bg-[url('/agricultural-field-pattern.jpg')] opacity-10" />

        <div className="container mx-auto text-center relative z-10">
          <h2 className="text-5xl font-black mb-6 text-primary-foreground">Ready to Transform Your Farm?</h2>
          <p className="text-xl mb-12 text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            Join thousands of progressive farmers using AgriNetra to increase yields, reduce costs, and build
            sustainable agricultural operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-xl px-10 py-6 premium-shadow hover-lift font-bold"
              asChild
            >
              <Link href="/auth/signup" className="flex items-center gap-3">
                <Leaf className="h-6 w-6" />
                Start Free Trial
                <Sparkles className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-xl px-10 py-6 border-2 border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground/40 font-bold bg-transparent"
              asChild
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <ArrowRight className="h-6 w-6" />
                Explore Platform
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-foreground/95 text-primary-foreground py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Sprout className="h-8 w-8 text-accent" />
                <span className="text-2xl font-black">AgriNetra</span>
                <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                  Premium
                </Badge>
              </div>
              <p className="text-primary-foreground/70 leading-relaxed mb-6">
                Empowering farmers worldwide with cutting-edge AI technology for sustainable, profitable agriculture.
              </p>
              <div className="flex items-center gap-2 text-accent">
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <Star className="h-4 w-4 fill-current" />
                <span className="ml-2 text-sm font-semibold">Rated #1 AgTech Platform</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li>
                  <Link href="#features" className="hover:text-accent transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-accent transition-colors">
                    Demo
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-accent transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/api-docs" className="hover:text-accent transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li>
                  <Link href="#help" className="hover:text-accent transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-accent transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/chat" className="hover:text-accent transition-colors">
                    Expert Chat
                  </Link>
                </li>
                <li>
                  <Link href="/training" className="hover:text-accent transition-colors">
                    Training
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-primary-foreground/70">
                <li>
                  <Link href="#about" className="hover:text-accent transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#careers" className="hover:text-accent transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#privacy" className="hover:text-accent transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-accent transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-primary-foreground/60">
              © 2025 AgriNetra. All rights reserved. Built with ❤️ for farmers worldwide.
            </p>
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                <Award className="h-3 w-3 mr-1" />
                ISO Certified
              </Badge>
              <Badge variant="outline" className="bg-primary/20 text-primary border-primary/30">
                <Shield className="h-3 w-3 mr-1" />
                SOC 2 Compliant
              </Badge>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}