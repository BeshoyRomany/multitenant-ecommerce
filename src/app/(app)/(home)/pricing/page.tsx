import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Pricing Plans | Sellroad - Choose Your Perfect Plan",
  description:
    "Explore Sellroad's flexible pricing plans for multitenant ecommerce. From startups to enterprises, find the perfect solution for your business needs.",
  keywords: "pricing, plans, ecommerce, multitenant, subscription, sellroad",
  openGraph: {
    title: "Pricing Plans | Sellroad",
    description: "Choose the perfect pricing plan for your ecommerce business.",
    type: "website",
  },
};

const Page = () => {
  const plans = [
    {
      name: "STARTER",
      price: "$29",
      period: "/month",
      description: "Perfect for small businesses just getting started",
      features: [
        "Up to 100 products",
        "Basic analytics",
        "Email support",
        "Mobile responsive",
        "1 store",
      ],
      popular: false,
      color: "bg-blue-400",
    },
    {
      name: "PRO",
      price: "$99",
      period: "/month",
      description: "Ideal for growing businesses with advanced needs",
      features: [
        "Up to 1000 products",
        "Advanced analytics",
        "Priority support",
        "Custom domain",
        "5 stores",
        "API access",
      ],
      popular: true,
      color: "bg-yellow-400",
    },
    {
      name: "ENTERPRISE",
      price: "$299",
      period: "/month",
      description: "For large businesses requiring full customization",
      features: [
        "Unlimited products",
        "Custom analytics",
        "24/7 phone support",
        "Multiple domains",
        "Unlimited stores",
        "White-label solution",
        "Dedicated account manager",
      ],
      popular: false,
      color: "bg-red-400",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-cyan-200 via-purple-200 to-pink-200 p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl font-black text-black mb-6 transform -rotate-1 bg-white p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] inline-block">
            CHOOSE YOUR PLAN
          </h1>
          <p className="text-2xl font-bold text-black bg-lime-300 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1 max-w-2xl mx-auto">
            Start your ecommerce journey today with our flexible pricing that
            grows with your business!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform ${
                index % 2 === 0 ? "rotate-1" : "-rotate-1"
              } ${plan.popular ? "scale-105" : ""} ${plan.color}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-black text-white text-lg font-black px-6 py-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  🔥 MOST POPULAR
                </Badge>
              )}

              <div className="text-center mb-6">
                <h2 className="text-4xl font-black text-black mb-2 bg-white p-3 border-4 border-black inline-block transform -rotate-1">
                  {plan.name}
                </h2>
                <div className="flex items-baseline justify-center mb-2">
                  <span className="text-6xl font-black text-black bg-white p-4 border-4 border-black transform rotate-2">
                    {plan.price}
                  </span>
                  <span className="text-2xl font-bold text-black ml-2">
                    {plan.period}
                  </span>
                </div>
                <p className="text-lg font-bold text-black bg-white p-2 border-2 border-black inline-block transform rotate-1">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li
                    key={featureIndex}
                    className="flex items-center text-lg font-bold text-black bg-white p-3 border-2 border-black transform hover:rotate-1 transition-transform"
                  >
                    <span className="text-2xl mr-3">✅</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full py-6 text-2xl font-black border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-all ${
                  plan.popular
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-white text-black hover:bg-gray-100"
                }`}
              >
                {plan.popular ? "🚀 GET STARTED NOW" : "CHOOSE PLAN"}
              </Button>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-5xl font-black text-black text-center mb-12 bg-white p-6 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
            FREQUENTLY ASKED QUESTIONS
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6 bg-orange-300 border-6 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <h3 className="text-2xl font-black text-black mb-3 bg-white p-2 border-2 border-black inline-block transform -rotate-1">
                Can I change plans anytime?
              </h3>
              <p className="text-lg font-bold text-black">
                Yes! You can upgrade or downgrade your plan at any time. Changes
                take effect immediately.
              </p>
            </Card>

            <Card className="p-6 bg-green-300 border-6 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h3 className="text-2xl font-black text-black mb-3 bg-white p-2 border-2 border-black inline-block transform rotate-1">
                Is there a free trial?
              </h3>
              <p className="text-lg font-bold text-black">
                Absolutely! Start with a 14-day free trial on any plan. No
                credit card required.
              </p>
            </Card>

            <Card className="p-6 bg-purple-300 border-6 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <h3 className="text-2xl font-black text-black mb-3 bg-white p-2 border-2 border-black inline-block transform -rotate-1">
                What payment methods do you accept?
              </h3>
              <p className="text-lg font-bold text-black">
                We accept all major credit cards, PayPal, and bank transfers for
                Enterprise plans.
              </p>
            </Card>

            <Card className="p-6 bg-pink-300 border-6 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h3 className="text-2xl font-black text-black mb-3 bg-white p-2 border-2 border-black inline-block transform rotate-1">
                Do you offer refunds?
              </h3>
              <p className="text-lg font-bold text-black">
                Yes, we offer a 30-day money-back guarantee on all plans. No
                questions asked!
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="p-12 bg-linear-to-r from-yellow-300 via-red-300 to-pink-300 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 max-w-4xl mx-auto">
            <h2 className="text-5xl font-black text-black mb-6 bg-white p-4 border-4 border-black inline-block transform rotate-2">
              READY TO GET STARTED?
            </h2>
            <p className="text-2xl font-bold text-black mb-8">
              Join thousands of businesses already using Sellroad to power their
              ecommerce success!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="px-8 py-6 text-2xl font-black bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:bg-gray-800 transition-all transform rotate-1">
                🚀 START YOUR FREE TRIAL
              </Button>
              <Button
                variant="outline"
                className="px-8 py-6 text-2xl font-black border-4 border-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-all transform -rotate-1"
              >
                📞 CONTACT SALES
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
