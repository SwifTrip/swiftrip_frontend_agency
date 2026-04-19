import { motion } from "framer-motion";
import {
  Brain,
  Sparkles,
  DollarSign,
  MapPinned,
  Award,
  MessageCircle,
  CreditCard,
  Bell,
  Star,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  ArrowRight,
  Menu,
  Play,
  Download,
  CircleDot,
  Compass,
  Route,
  Send,
  ExternalLink,
  Building2,
  FileText,
  BarChart3,
  Megaphone,
  Bot,
  Users,
  Target,
  UserCircle,
  Zap,
  Calendar,
  Wallet,
  Shield,
  ChevronRight,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "./ImageWithFallback";
import logoImage from "../../assets/logo.png";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Simplified animations for better performance
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced from 0.15 for faster appearance
      },
    },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.95 }, // Less dramatic scale
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    },
  };

  // Tourist Features
  const touristFeatures = [
    {
      icon: Brain,
      title: "AI-Assisted Itinerary Creation",
      description:
        "Smart AI creates personalized travel plans based on your preferences, budget, and interests",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: Sparkles,
      title: "Custom Tour Builder",
      description:
        "Design your perfect trip with full transparency on pricing and itinerary",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: DollarSign,
      title: "Agency Bidding System",
      description:
        "Post your requirements and let verified agencies compete with their best offers",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: MapPinned,
      title: "Event-Focused Maps",
      description:
        "Discover festivals, activities, and attractions all in one interactive map",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: Award,
      title: "Book Verified Guides",
      description: "Connect with certified local guides who know the area best",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: MessageCircle,
      title: "In-App Communication",
      description:
        "Chat directly with agencies and guides without sharing personal contact info",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: CreditCard,
      title: "Secure Payments & Refunds",
      description:
        "Safe online transactions with refund protection and payment guarantees",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description:
        "Get real-time alerts about bookings, offers, and travel updates",
      gradient: "from-orange-600 to-orange-800",
    },
    {
      icon: Star,
      title: "Reviews & Ratings",
      description:
        "Share your experience and help fellow travelers make informed decisions",
      gradient: "from-orange-600 to-orange-800",
    },
  ];

  // Agency Features
  const agencyFeatures = [
    {
      icon: Building2,
      title: "Package Showcase",
      description:
        "Display your tour packages, special deals, and custom tour capabilities",
    },
    {
      icon: FileText,
      title: "Brochure Management",
      description:
        "Upload, update, and manage PDF brochures with full CRUD functionality",
    },
    {
      icon: BarChart3,
      title: "Sales Analytics Dashboard",
      description:
        "Track bookings, revenue, customer trends, and performance metrics",
    },
    {
      icon: Megaphone,
      title: "Marketing & Ads",
      description:
        "Run targeted ads and boost your packages to reach more customers",
    },
    {
      icon: Bot,
      title: "AI-Powered FAQ Support",
      description:
        "Automated responses to common customer queries save time and improve service",
    },
    {
      icon: CreditCard,
      title: "Subscription Plans",
      description:
        "Flexible pricing tiers with advanced features for growing businesses",
    },
    {
      icon: Users,
      title: "User & Role Management",
      description:
        "Manage team members with customizable permissions and access controls",
    },
    {
      icon: Target,
      title: "Bid on Custom Tours",
      description:
        "Receive custom tour requests and submit competitive proposals",
    },
  ];

  // Guide Features
  const guideFeatures = [
    {
      icon: UserCircle,
      title: "Professional Profile",
      description:
        "Showcase your expertise, languages, specialties, and service areas",
    },
    {
      icon: Zap,
      title: "Direct Tourist Access",
      description:
        "Get discovered by tourists looking for local guides in your area",
    },
    {
      icon: Calendar,
      title: "Booking Management",
      description:
        "Manage your availability, accept bookings, and organize your schedule",
    },
    {
      icon: Wallet,
      title: "Secure Payments",
      description:
        "Receive payments directly through the platform with transparent pricing",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description:
        "Track your bookings, earnings, ratings, and customer feedback",
    },
    {
      icon: Shield,
      title: "Verified Badge",
      description:
        "Build trust with identity verification and customer reviews",
    },
  ];

  // Use Cases
  const useCases = [
    {
      name: "Ayesha Rahman",
      role: "Family Traveler from Karachi",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      story:
        "I used SwifTrip's AI to plan a 7-day trip to Northern Pakistan. The custom tour builder let me specify our budget and preferences. Three agencies bid on our request, and we got an amazing deal! The event map helped us discover a local festival we wouldn't have known about.",
      result: "Saved 30% on costs, discovered hidden gems",
    },
    {
      name: "Atlas Tours & Travels",
      role: "Travel Agency in Islamabad",
      image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400",
      story:
        "SwifTrip transformed our business. The analytics dashboard shows us exactly what customers want. We boosted our Hunza Valley package and saw a 200% increase in bookings. The AI FAQ handles basic queries, freeing our team to focus on custom tours.",
      result: "200% booking increase, 40% time saved",
    },
    {
      name: "Hassan Malik",
      role: "Local Guide in Skardu",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      story:
        "Before SwifTrip, I relied on word-of-mouth and tourist hotels. Now, I have a professional profile with my verified badge. Tourists book me directly through the app, and I receive payments securely. My bookings tripled in just 3 months!",
      result: "3x more bookings, verified professional status",
    },
  ];

  // Market Stats
  const marketStats = [
    {
      value: "50M+",
      label: "Annual Tourists",
      description: "Growing tourism market in Pakistan",
    },
    {
      value: "$16B",
      label: "Tourism Revenue",
      description: "≈5.9% of Pakistan's GDP",
    },
    {
      value: "0",
      label: "All-in-One Platforms",
      description: "No comprehensive solution exists yet",
    },
    {
      value: "100K+",
      label: "Potential Users",
      description: "Untapped market opportunity",
    },
  ];

  // Core Values
  const coreValues = [
    {
      icon: Brain,
      title: "AI-Powered Intelligence",
      description:
        "Smart algorithms that understand your preferences and create perfect itineraries",
    },
    {
      icon: Shield,
      title: "Trust & Security",
      description:
        "Verified agencies, certified guides, and secure payment protection",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Real-time updates, instant bookings, and immediate communication",
    },
    {
      icon: Globe,
      title: "Complete Ecosystem",
      description:
        "Everything you need in one place - no more switching between apps",
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-100 shadow-sm w-full"
      >
        <div className="w-full px-3 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={logoImage}
                alt="SwifTrip Logo"
                className="w-10 h-10 object-contain"
              />
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                  SwifTrip
                </span>
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-gray-500">
                    AI-Powered Travel
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center gap-6">
              <a
                href="#features"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Features
              </a>
              <a
                href="#for-agencies"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                For Agencies
              </a>
              <a
                href="#for-guides"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                For Guides
              </a>
              <a
                href="#use-cases"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Success Stories
              </a>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/auth/login")}
                  className="px-5 py-2 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/auth/register")}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#f97316] text-white rounded-full ring-1 ring-orange-200/50 shadow-[0_10px_24px_rgba(234,88,12,0.34)] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(234,88,12,0.44)] transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <ArrowRight className="rotate-90" /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden border-t border-gray-100 bg-white w-full"
          >
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto py-4 space-y-3">
                <a
                  href="#features"
                  className="block text-gray-600 hover:text-orange-600 py-2"
                >
                  Features
                </a>
                <a
                  href="#for-agencies"
                  className="block text-gray-600 hover:text-orange-600 py-2"
                >
                  For Agencies
                </a>
                <a
                  href="#for-guides"
                  className="block text-gray-600 hover:text-orange-600 py-2"
                >
                  For Guides
                </a>
                <a
                  href="#use-cases"
                  className="block text-gray-600 hover:text-orange-600 py-2"
                >
                  Success Stories
                </a>
                <button
                  onClick={() => {
                    navigate("/login");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full px-5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-left"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    navigate("/register");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#f97316] text-white rounded-full ring-1 ring-orange-200/50 shadow-[0_10px_24px_rgba(234,88,12,0.34)]"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-white to-orange-50 -z-10" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(234,88,12,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(234,88,12,0.08)_1px,transparent_1px)] bg-[size:48px_48px] -z-10" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-orange-500/30 to-orange-700/30 rounded-full blur-3xl -z-10"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-orange-600/20 to-orange-500/20 rounded-full blur-3xl -z-10"
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="text-center lg:text-left"
            >
              <motion.div
                variants={fadeInUp}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/85 backdrop-blur-sm rounded-full mb-8 border border-orange-200 shadow-sm"
              >
                <img
                  src={logoImage}
                  alt="SwifTrip"
                  className="w-4 h-4 object-contain"
                />
                <span className="text-sm text-orange-700">
                  Pakistan's First AI-Powered Travel Platform
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight"
              >
                Plan, Explore &
                <span className="block bg-gradient-to-r from-orange-700 via-orange-600 to-orange-700 bg-clip-text text-transparent mt-2">
                  Travel Pakistan
                </span>
                <span className="block text-3xl sm:text-4xl lg:text-5xl mt-3 text-gray-700">
                  Like Never Before
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-lg sm:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                One intelligent platform connecting tourists, travel agencies,
                and local guides. Create custom tours, discover hidden gems, and
                explore with confidence.
              </motion.p>

              {/* Primary CTAs */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
              >
                <button
                  onClick={() => navigate("/auth/register")}
                  className="group relative px-8 py-4 bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#f97316] text-white rounded-full overflow-hidden ring-1 ring-orange-200/50 shadow-[0_14px_30px_rgba(234,88,12,0.36)] hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(234,88,12,0.5)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#7c2d12] via-[#c2410c] to-[#ea580c] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-orange-200/90 animate-pulse" />
                  <div className="relative flex items-center justify-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    <span className="font-semibold">Get Started Free</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
                <button
                  onClick={() => navigate("/auth/login")}
                  className="group px-8 py-4 bg-white text-gray-700 rounded-2xl border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50/70 transition-all duration-300 shadow-sm hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Users className="w-5 h-5 text-orange-600" />
                  <span className="font-semibold">Login to Dashboard</span>
                </button>
              </motion.div>

              {/* Secondary CTAs */}
              {/* <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-3 justify-center lg:justify-start"
              >
                <button className="group px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-xl hover:shadow-lg hover:shadow-orange-600/50 transition-all flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Join as Agency</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group px-5 py-2.5 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-xl hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span className="text-sm font-medium">Become a Guide</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div> */}
            </motion.div>

            {/* Right Content - Hero Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative">
                {/* Floating Feature Cards */}
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute -top-6 -left-6 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-orange-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        AI-Powered
                      </div>
                      <div className="font-semibold text-gray-900">
                        Smart Planning
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                  }}
                  className="absolute top-1/2 -right-6 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-orange-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-orange-800 bg-clip-text text-transparent">
                        Customize
                      </div>
                      <div className="text-xs text-gray-600">Tour</div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                  }}
                  className="absolute -bottom-6 left-1/4 bg-white p-5 rounded-2xl shadow-2xl z-20 border border-orange-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-600 to-orange-800 rounded-xl flex items-center justify-center">
                      <MapPinned className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">
                        Live
                      </div>
                      <div className="font-semibold text-gray-900">
                        Event Maps
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Main Hero Image */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&q=80"
                    alt="Pakistan Mountains Tourism"
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 bg-white/92 backdrop-blur-sm rounded-xl border border-orange-100 shadow-lg px-4 py-3">
                    <p className="text-sm font-semibold text-gray-800">
                      Trusted by tourists, agencies and local guides
                    </p>
                    <p className="text-xs text-gray-600">
                      End-to-end travel planning on one platform
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Opportunity Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50/70 via-white to-orange-50/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(234,88,12,0.12),transparent_45%)]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl mb-4 tracking-tight"
            >
              Pakistan's Tourism is
              <span className="block bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                Ready to Boom
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              A massive market waiting for the right digital platform
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {marketStats.map((stat, index) => (
              <motion.div
                key={index}
                variants={scaleIn}
                whileHover={{ scale: 1.05 }}
                className="relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-xl transition-all border border-gray-100 hover:border-orange-200 group overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:blur-3xl transition-all" />
                <div className="relative">
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(136,19,55,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(136,19,55,0.06)_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -6 }}
                className="text-center bg-white/95 backdrop-blur-sm rounded-3xl p-6 border border-orange-100 shadow-md hover:shadow-xl hover:border-orange-200 transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-200 rounded-2xl flex items-center justify-center mb-4 mx-auto shadow-sm ring-1 ring-orange-200/70">
                  <value.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  {value.title}
                </h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-orange-50 to-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4"
            >
              <Target className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600">
                Complete Ecosystem
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl mb-6"
            >
              One Platform,
              <span className="block bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                Three Communities
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-3xl mx-auto"
            >
              SwifTrip brings together tourists, travel agencies, and local
              guides in a seamless ecosystem powered by AI and built for growth
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 mb-16"
          >
            {/* Tourists */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-orange-100 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-700 to-orange-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-4">For Tourists</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>AI-powered personalized itineraries</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Custom tour builder with bidding</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Event-focused interactive maps</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Book verified local guides</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Secure payments & refunds</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Agencies */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-orange-100 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-800 to-orange-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-4">For Agencies</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Showcase packages & deals</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Sales analytics dashboard</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Run ads & boost visibility</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>AI-powered FAQ support</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <span>Team & role management</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Guides */}
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="relative p-8 bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all border border-orange-100 group overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-700 to-orange-800 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl mb-4">For Guides</h3>
                <div className="space-y-3 text-gray-600">
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Professional public profile</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Direct access to tourists</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Booking & payment management</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Performance analytics</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CircleDot className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>Verified identity badge</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Integration Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative p-12 bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50/50 to-orange-50/50" />
            <div className="relative text-center mb-10">
              <h3 className="text-2xl sm:text-3xl mb-2">
                Seamless Integration
              </h3>
              <p className="text-gray-600">
                All stakeholders connected in real-time
              </p>
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-700 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <div>
                  <div className="font-semibold text-lg">Tourists</div>
                  <div className="text-sm text-gray-600">Plan & Book</div>
                </div>
              </div>

              <ChevronRight className="w-8 h-8 text-gray-400 hidden md:block" />
              <Route className="w-8 h-8 text-gray-400 md:hidden rotate-90" />

              <div className="relative px-10 py-6 bg-gradient-to-r from-orange-700 to-orange-800 rounded-2xl text-white text-center shadow-xl">
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 rounded-full animate-pulse" />
                <Brain className="w-10 h-10 mx-auto mb-2" />
                <div className="font-bold text-lg">SwifTrip</div>
                <div className="text-sm opacity-90">AI Hub</div>
              </div>

              <ChevronRight className="w-8 h-8 text-gray-400 hidden md:block" />
              <Route className="w-8 h-8 text-gray-400 md:hidden rotate-90" />

              <div className="flex items-center gap-4">
                <div>
                  <div className="font-semibold text-lg text-right">
                    Providers
                  </div>
                  <div className="text-sm text-gray-600">Deliver</div>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-800 to-orange-800 rounded-2xl flex items-center justify-center shadow-lg">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-orange-700 to-orange-800 rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features for Tourists */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4"
            >
              <Users className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600">For Tourists</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl mb-6"
            >
              Your Perfect Journey
              <span className="block bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                Starts Here
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Powerful features designed to make every trip unforgettable
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {touristFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-orange-200"
              >
                <div className="absolute -top-10 -right-10 w-28 h-28 bg-orange-300/10 rounded-full blur-2xl group-hover:bg-orange-300/20 transition-colors" />
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Visual Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 rounded-3xl overflow-hidden shadow-2xl"
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1632178151697-fd971baa906f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0b3VyaXN0JTIwZGVzdGluYXRpb24lMjBtYXB8ZW58MXx8fHwxNzY0Njk2MTEwfDA&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Tourist Features"
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      </section>

      {/* Features for Agencies */}
      <section
        id="for-agencies"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4"
            >
              <Building2 className="w-4 h-4 text-orange-700" />
              <span className="text-sm text-orange-700">
                For Travel Agencies
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl mb-6"
            >
              Scale Your Business
              <span className="block bg-gradient-to-r from-orange-800 to-orange-800 bg-clip-text text-transparent">
                With Smart Tools
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Complete management suite with analytics, marketing, and
              automation
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {agencyFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="p-6 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-orange-800 to-orange-800 rounded-xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Agency Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1608222351212-18fe0ec7b13b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMGFuYWx5dGljcyUyMGRhc2hib2FyZHxlbnwxfHx8fDE3NjQ2MTQ5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Agency Dashboard"
                className="w-full h-auto"
              />
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl sm:text-3xl">Real-Time Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your performance with comprehensive analytics. Monitor
                bookings, revenue, customer demographics, and package
                performance in real-time.
              </p>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <BarChart3 className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Revenue tracking and forecasting
                  </span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <Users className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Customer behavior insights
                  </span>
                </div>
                <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-xl">
                  <Target className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">
                    Package performance metrics
                  </span>
                </div>
              </div>
              <button className="group px-8 py-4 bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#f97316] text-white rounded-full ring-1 ring-orange-200/50 shadow-[0_10px_24px_rgba(234,88,12,0.34)] hover:shadow-[0_14px_30px_rgba(234,88,12,0.44)] transition-all flex items-center gap-2">
                Join as Agency
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features for Guides */}
      <section
        id="for-guides"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-100"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4"
            >
              <Award className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600">For Local Guides</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl mb-6"
            >
              Build Your Reputation
              <span className="block bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                Grow Your Income
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              Professional platform for local experts to connect with tourists
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {guideFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-orange-700 to-orange-800 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Guide Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div className="space-y-6 order-2 md:order-1">
              <h3 className="text-2xl sm:text-3xl">
                Stand Out as a Professional
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create a compelling profile that showcases your expertise,
                languages, and local knowledge. Verified badges help tourists
                trust and book you with confidence.
              </p>
              <div className="p-6 bg-gradient-to-br from-orange-200 to-orange-200 rounded-2xl border border-orange-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-700 to-orange-800 rounded-full" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center border-2 border-white">
                      <Shield className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="font-semibold text-lg">Verified Guide</div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                      <span className="text-sm text-gray-600 ml-1">
                        (127 reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-700">
                  Stand out with verified credentials, professional photos, and
                  authentic reviews
                </p>
              </div>
              <button className="group px-8 py-4 bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#f97316] text-white rounded-full ring-1 ring-orange-200/50 shadow-[0_10px_24px_rgba(234,88,12,0.34)] hover:shadow-[0_14px_30px_rgba(234,88,12,0.44)] transition-all flex items-center gap-2">
                Become a Guide
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl order-1 md:order-2">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1762174947626-96f76955cd74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBndWlkZSUyMGxvY2FsfGVufDF8fHx8MTc2NDY5NjEwOHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Local Guide"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases / Success Stories */}
      <section
        id="use-cases"
        className="py-20 px-4 sm:px-6 lg:px-8 bg-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(234,88,12,0.1),transparent_38%)]" />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="relative text-center mb-16"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-full mb-4"
            >
              <Star className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-600">Success Stories</span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-5xl mb-6"
            >
              Real Results from
              <span className="block bg-gradient-to-r from-orange-700 to-orange-800 bg-clip-text text-transparent">
                Real Users
              </span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-lg text-gray-600 max-w-2xl mx-auto"
            >
              See how SwifTrip is transforming travel experiences across
              Pakistan
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid lg:grid-cols-3 gap-8"
          >
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -10, rotate: -0.4 }}
                className="relative bg-gradient-to-br from-gray-50 to-orange-50 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all border border-gray-100 hover:border-orange-300 overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/10 to-orange-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                <div className="absolute top-3 right-5 text-6xl leading-none text-orange-200/60 font-serif">
                  "
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <ImageWithFallback
                      src={useCase.image}
                      alt={useCase.name}
                      className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                    />
                    <div>
                      <div className="font-semibold text-lg">
                        {useCase.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {useCase.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed italic pr-6">
                    "{useCase.story}"
                  </p>
                  <div className="p-4 bg-white rounded-xl border border-orange-200 shadow-sm">
                    <div className="flex items-center gap-2 text-orange-700">
                      <TrendingUp className="w-5 h-5" />
                      <span className="font-semibold text-sm">
                        {useCase.result}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#9a3412] via-[#ea580c] to-[#fb923c] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-orange-100/25 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(254,215,170,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(254,215,170,0.12)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-10 right-10 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl"
        />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6 border border-white/30"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm text-white">Join the Revolution</span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="text-3xl sm:text-4xl lg:text-6xl text-white mb-6 leading-tight"
            >
              Ready to Transform
              <span className="block">Your Travel Experience?</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-orange-100 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Whether you're a traveler seeking adventure, an agency looking to
              grow, or a guide building your reputation - SwifTrip is your
              platform
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-10"
            >
              <button className="group relative px-10 py-5 bg-white/95 text-orange-700 rounded-2xl overflow-hidden shadow-2xl hover:shadow-orange-200/50 transition-all border border-orange-100">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-50 to-amber-100 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative flex items-center justify-center gap-2 text-lg font-semibold">
                  <Download className="w-6 h-6" />
                  Download App
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
              <button className="px-10 py-5 bg-gradient-to-r from-[#9a3412] via-[#ea580c] to-[#f97316] text-white rounded-full ring-1 ring-white/40 shadow-[0_14px_30px_rgba(194,65,12,0.45)] hover:-translate-y-0.5 hover:shadow-[0_18px_36px_rgba(194,65,12,0.55)] transition-all text-lg font-semibold">
                Start Free Trial
              </button>
            </motion.div>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-3 justify-center"
            >
              <button className="group px-6 py-3 bg-orange-100/15 backdrop-blur-sm text-white rounded-xl border border-orange-100/35 hover:bg-orange-100/25 transition-all flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Sign Up as Tourist</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="group px-6 py-3 bg-orange-100/15 backdrop-blur-sm text-white rounded-xl border border-orange-100/35 hover:bg-orange-100/25 transition-all flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                <span>Join as Agency</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              <button className="group px-6 py-3 bg-orange-100/15 backdrop-blur-sm text-white rounded-xl border border-orange-100/35 hover:bg-orange-100/25 transition-all flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Become a Guide</span>
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-orange-50 to-orange-100/40 text-gray-700 py-16 px-4 sm:px-6 lg:px-8 border-t border-orange-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={logoImage}
                  alt="SwifTrip Logo"
                  className="w-10 h-10 object-contain"
                />
                <div>
                  <span className="text-xl text-gray-900 font-bold">
                    SwifTrip
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-500">
                      AI-Powered
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-6 max-w-xs">
                Pakistan's first AI-powered all-in-one travel platform
                connecting tourists, agencies, and local guides.
              </p>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-white border border-orange-200 text-orange-600 hover:bg-orange-600 hover:text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-gray-900 mb-4 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Mobile App
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    API Access
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            {/* For Users */}
            <div>
              <h4 className="text-gray-900 mb-4 font-semibold">For Users</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="hover:text-orange-400 transition-colors"
                  >
                    For Tourists
                  </a>
                </li>
                <li>
                  <a
                    href="#for-agencies"
                    className="hover:text-orange-400 transition-colors"
                  >
                    For Agencies
                  </a>
                </li>
                <li>
                  <a
                    href="#for-guides"
                    className="hover:text-orange-400 transition-colors"
                  >
                    For Guides
                  </a>
                </li>
                <li>
                  <a
                    href="#use-cases"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Success Stories
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-gray-900 mb-4 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Press Kit
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Info */}
          <div className="border-t border-orange-200 pt-8 mb-8">
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-orange-200 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Email</div>
                  <div className="text-sm text-gray-900">
                    support@swiftrip.pk
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-orange-200 rounded-xl flex items-center justify-center">
                  <Phone className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Phone</div>
                  <div className="text-sm text-gray-900">+92 XXX XXXXXXX</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-orange-200 rounded-xl flex items-center justify-center">
                  <MapPinned className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">Location</div>
                  <div className="text-sm text-gray-900">
                    Islamabad, Pakistan
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div className="border-t border-orange-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-600">
              © 2025 SwifTrip. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Disclaimer
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
