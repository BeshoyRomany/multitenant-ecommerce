import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Contact Us | Funroad - Get in Touch",
  description:
    "Reach out to Funroad for inquiries, support, or collaboration. We're here to help with your multitenant ecommerce needs.",
  keywords: "contact, support, ecommerce, multitenant, funroad",
  openGraph: {
    title: "Contact Us | Funroad",
    description: "Get in touch with Funroad for your ecommerce solutions.",
    type: "website",
  },
};

const Page = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-yellow-200 via-pink-200 to-purple-200 p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-black mb-4 transform -rotate-1 bg-white p-6 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
            GET IN TOUCH
          </h1>
          <p className="text-xl font-bold text-black bg-lime-300 p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1">
            We'd love to hear from you! Drop us a message and let's make
            something awesome together.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="p-8 bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-4xl font-black text-black mb-6 bg-red-400 p-3 border-4 border-black inline-block transform -rotate-2">
              SEND MESSAGE
            </h2>
            <form className="space-y-6">
              <div>
                <label className="text-lg font-bold text-black mb-2 bg-cyan-300 p-2 border-2 border-black inline-block transform -rotate-1">
                  NAME
                </label>
                <Input
                  type="text"
                  placeholder="Your awesome name"
                  className="w-full p-4 text-lg font-bold border-4 border-black bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                />
              </div>
              <div>
                <label className="text-lg font-bold text-black mb-2 bg-cyan-300 p-2 border-2 border-black inline-block transform -rotate-1">
                  EMAIL
                </label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  className="w-full p-4 text-lg font-bold border-4 border-black bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow"
                />
              </div>
              <div>
                <label className="text-lg font-bold text-black mb-2 bg-cyan-300 p-2 border-2 border-black inline-block transform -rotate-1">
                  MESSAGE
                </label>
                <Textarea
                  placeholder="Tell us what's on your mind..."
                  rows={6}
                  className="w-full p-4 text-lg font-bold border-4 border-black bg-yellow-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-shadow resize-none"
                />
              </div>
              <Button
                type="submit"
                className="w-full py-6 text-2xl font-black bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:bg-gray-800 transition-all"
              >
                🚀 SEND IT!
              </Button>
            </form>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 bg-orange-400 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h2 className="text-3xl font-black text-black mb-4 bg-white p-3 border-4 border-black inline-block transform rotate-2">
                📍 FIND US
              </h2>
              <p className="text-lg font-bold text-black">
                123 Fun Street
                <br />
                Cairo City, AC 12345
                <br />
                Egypt
              </p>
            </Card>

            <Card className="p-6 bg-blue-400 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <h2 className="text-3xl font-black text-black mb-4 bg-white p-3 border-4 border-black inline-block transform -rotate-1">
                📞 CALL US
              </h2>
              <p className="text-lg font-bold text-black">
                +1 (555) 123-4567
                <br />
                Mon-Fri: 9AM-6PM EST
              </p>
            </Card>

            <Card className="p-6 bg-green-400 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
              <h2 className="text-3xl font-black text-black mb-4 bg-white p-3 border-4 border-black inline-block transform rotate-1">
                ✉️ EMAIL US
              </h2>
              <p className="text-lg font-bold text-black">
                hello@funroad.com
                <br />
                support@funroad.com
              </p>
            </Card>

            <Card className="p-6 bg-purple-400 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
              <h2 className="text-3xl font-black text-black mb-4 bg-white p-3 border-4 border-black inline-block transform -rotate-2">
                💬 SOCIAL
              </h2>
              <div className="flex space-x-4">
                <div className="bg-black text-white p-3 border-2 border-black font-bold transform hover:rotate-12 transition-transform cursor-pointer rounded-md">
                  TWITTER
                </div>
                <div className="bg-black text-white p-3 border-2 border-black font-bold transform hover:-rotate-12 transition-transform cursor-pointer rounded-md">
                  LINKEDIN
                </div>
                <div className="bg-black text-white p-3 border-2 border-black font-bold transform hover:rotate-12 transition-transform cursor-pointer rounded-md">
                  GITHUB
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12">
          <div className="bg-black text-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block transform -rotate-1">
            <p className="text-2xl font-black">
              LET'S BUILD SOMETHING INCREDIBLE TOGETHER! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
