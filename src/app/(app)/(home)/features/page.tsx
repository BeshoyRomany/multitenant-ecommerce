import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Features | Sellroad - Powerful Ecommerce Solutions",
  description:
    "Discover the powerful features of Sellroad's multitenant ecommerce platform. From advanced analytics to seamless integrations, build your online store with confidence.",
  keywords:
    "features, ecommerce, multitenant, analytics, integrations, online store, sellroad",
  openGraph: {
    title: "Features | Sellroad",
    description:
      "Explore the powerful features that make Sellroad the perfect ecommerce platform.",
    type: "website",
  },
};

const features = [
  {
    title: "MULTITENANT ARCHITECTURE",
    description:
      "Scale effortlessly with our advanced multitenant system. Manage multiple stores from a single dashboard with complete data isolation and security.",
    icon: "🏢",
    color: "bg-blue-400",
    benefits: [
      "Complete data isolation",
      "Centralized management",
      "Cost-effective scaling",
      "Enterprise-grade security",
    ],
  },
  {
    title: "ADVANCED ANALYTICS",
    description:
      "Get deep insights into your business performance with real-time analytics, custom reports, and predictive insights.",
    icon: "📊",
    color: "bg-green-400",
    benefits: [
      "Real-time dashboards",
      "Custom reporting",
      "Predictive analytics",
      "Conversion tracking",
    ],
  },
  {
    title: "SEAMLESS INTEGRATIONS",
    description:
      "Connect with your favorite tools and services. From payment gateways to marketing platforms, we've got you covered.",
    icon: "🔗",
    color: "bg-purple-400",
    benefits: [
      "200+ integrations",
      "API-first approach",
      "Webhook support",
      "Custom connectors",
    ],
  },
  {
    title: "MOBILE OPTIMIZATION",
    description:
      "Your store looks and performs perfectly on all devices. Mobile-first design with lightning-fast loading times.",
    icon: "📱",
    color: "bg-red-400",
    benefits: [
      "Mobile-first design",
      "PWA support",
      "Touch-optimized UI",
      "Offline capabilities",
    ],
  },
  {
    title: "AI-POWERED FEATURES",
    description:
      "Leverage artificial intelligence to optimize your store. From smart recommendations to automated marketing.",
    icon: "🤖",
    color: "bg-yellow-400",
    benefits: [
      "Smart recommendations",
      "Automated marketing",
      "Chat support",
      "Image recognition",
    ],
  },
  {
    title: "GLOBAL PAYMENT SUPPORT",
    description:
      "Accept payments from anywhere in the world with support for 150+ currencies and all major payment methods.",
    icon: "💳",
    color: "bg-pink-400",
    benefits: [
      "150+ currencies",
      "Multiple gateways",
      "Fraud protection",
      "Subscription billing",
    ],
  },
];

const stats = [
  {
    label: "Happy Customers",
    value: "10K+",
    color: "bg-red-400",
    rotation: "rotate-1",
  },
  {
    label: "Products Sold",
    value: "1M+",
    color: "bg-blue-400",
    rotation: "-rotate-1",
  },
  {
    label: "Uptime",
    value: "99.9%",
    color: "bg-green-400",
    rotation: "rotate-1",
  },
  {
    label: "Support",
    value: "24/7",
    color: "bg-yellow-400",
    rotation: "-rotate-1",
  },
];

const testimonials = [
  {
    quote:
      "Sellroad transformed our business! The multitenant features allowed us to expand to 5 different markets without any hassle.",
    name: "Sarah Johnson",
    role: "CEO, TechStart Inc.",
    color: "bg-pink-300",
    rotation: "-rotate-1",
  },
  {
    quote:
      "The analytics and AI features helped us increase conversions by 40%. Absolutely game-changing!",
    name: "Mike Chen",
    role: "Founder, EcoShop",
    color: "bg-cyan-300",
    rotation: "rotate-1",
  },
];

const sectionHeading =
  "text-5xl font-black text-black text-center mb-12 bg-white p-6 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block";

const getFeatureRotation = (index: number) =>
  index % 2 === 0 ? "rotate-1" : "-rotate-1";

const FeatureCard = ({
  feature,
  index,
}: {
  feature: (typeof features)[number];
  index: number;
}) => (
  <Card
    className={`p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform ${getFeatureRotation(
      index,
    )} hover:scale-105 transition-transform ${feature.color}`}
  >
    <div className="text-center mb-6">
      <div className="text-6xl mb-4 bg-white p-4 border-4 border-black inline-block transform rotate-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        {feature.icon}
      </div>
      <h2 className="text-2xl font-black text-black mb-3 bg-white p-3 border-4 border-black inline-block transform -rotate-1">
        {feature.title}
      </h2>
      <p className="text-lg font-bold text-black leading-relaxed">
        {feature.description}
      </p>
    </div>
    <ul className="space-y-2">
      {feature.benefits.map((benefit) => (
        <li
          key={benefit}
          className="flex items-center text-base font-bold text-black bg-white p-2 border-2 border-black transform hover:rotate-1 transition-transform"
        >
          <span className="text-lg mr-2">✨</span>
          {benefit}
        </li>
      ))}
    </ul>
  </Card>
);

const Page = () => (
  <div className="min-h-screen bg-linear-to-br from-indigo-200 via-cyan-200 to-green-200 p-12">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-black text-black mb-6 transform -rotate-1 bg-white p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] inline-block">
          POWERFUL FEATURES
        </h1>
        <p className="text-2xl font-bold text-black bg-orange-300 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1 max-w-3xl mx-auto">
          Everything you need to build, manage, and scale your ecommerce
          business with confidence and style!
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <FeatureCard key={feature.title} feature={feature} index={index} />
        ))}
      </div>
      <div className="mb-16">
        <h2 className={`${sectionHeading} transform -rotate-1`}>
          BY THE NUMBERS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className={`p-6 text-center ${stat.color} border-6 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform ${stat.rotation}`}
            >
              <div className="text-4xl font-black text-black bg-white p-3 border-2 border-black inline-block transform -rotate-2 mb-2">
                {stat.value}
              </div>
              <p className="text-lg font-bold text-black">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>
      <div className="mb-16">
        <h2 className={`${sectionHeading} transform rotate-1`}>
          WHAT OUR CUSTOMERS SAY
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.name}
              className={`p-8 ${testimonial.color} border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform ${testimonial.rotation}`}
            >
              <div className="text-6xl mb-4">"</div>
              <p className="text-lg font-bold text-black mb-4 leading-relaxed">
                {testimonial.quote}
              </p>
              <div className="flex items-center">
                <img
                  src={`https://randomuser.me/api/portraits/${index === 0 ? "women" : "men"}/1.jpg`}
                  className="w-12 h-12 rounded-full border-2 border-black mr-4"
                  alt="Avatar"
                />
                <div>
                  <p className="font-black text-black">{testimonial.name}</p>
                  <p className="text-sm font-bold text-black">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      <div className="text-center">
        <Card className="p-12 bg-linear-to-br from-purple-300 via-pink-300 to-red-300 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 max-w-5xl mx-auto">
          <h2 className="text-5xl font-black text-black mb-6 bg-white p-4 border-4 border-black inline-block transform rotate-2">
            READY TO EXPERIENCE THE POWER?
          </h2>
          <p className="text-2xl font-bold text-black mb-8">
            Join thousands of successful businesses using Sellroad to power
            their ecommerce growth!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-6 text-2xl font-black bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:bg-gray-800 transition-all transform rotate-1">
              🚀 START YOUR FREE TRIAL
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-2xl font-black border-4 border-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-all transform -rotate-1"
            >
              📖 VIEW PRICING
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
);
export default Page;
