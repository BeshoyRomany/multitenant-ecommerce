import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Funroad - Revolutionizing Ecommerce",
  description:
    "Learn about Funroad's mission to revolutionize multitenant ecommerce. Meet our team, discover our values, and see our journey in transforming online businesses.",
  keywords:
    "about, company, team, mission, values, ecommerce, multitenant, funroad",
  openGraph: {
    title: "About Us | Funroad",
    description:
      "Discover the story behind Funroad and our mission to revolutionize ecommerce.",
    type: "website",
  },
};

const team = [
  {
    name: "Alex Rodriguez",
    role: "CEO & Founder",
    bio: "Former Shopify engineer with 10+ years in ecommerce. Passionate about making online business accessible to everyone.",
    color: "bg-blue-400",
  },
  {
    name: "Sarah Chen",
    role: "CTO",
    bio: "Tech visionary specializing in scalable architectures. Led engineering teams at major tech companies.",
    color: "bg-green-400",
  },
  {
    name: "Marcus Johnson",
    role: "Head of Design",
    bio: "Award-winning designer focused on user experience. Believes great design should be both beautiful and functional.",
    color: "bg-purple-400",
  },
  {
    name: "Emma Davis",
    role: "Head of Customer Success",
    bio: "Customer advocate with a background in retail. Ensures every Funroad customer achieves their goals.",
    color: "bg-pink-400",
  },
];

const values = [
  {
    title: "INNOVATION FIRST",
    description:
      "We constantly push boundaries to bring cutting-edge technology to ecommerce businesses.",
    icon: "🚀",
  },
  {
    title: "CUSTOMER OBSESSED",
    description:
      "Every decision we make starts and ends with our customers' success and satisfaction.",
    icon: "❤️",
  },
  {
    title: "TRANSPARENCY",
    description:
      "We believe in open communication, honest pricing, and building trust through clarity.",
    icon: "👁️",
  },
  {
    title: "COLLABORATION",
    description:
      "Great things happen when diverse minds work together towards a common goal.",
    icon: "🤝",
  },
];

const milestones = [
  {
    year: "2020",
    event: "Funroad founded with a vision to democratize ecommerce",
  },
  {
    year: "2021",
    event: "Launched our first multitenant platform serving 100+ stores",
  },
  { year: "2022", event: "Reached 1,000 active stores and $10M in GMV" },
  { year: "2023", event: "Expanded globally with offices in 3 continents" },
  {
    year: "2024",
    event: "Launched AI-powered features and crossed 10,000 stores",
  },
];

const stats = [
  {
    value: "10K+",
    label: "Stores Powered",
    color: "bg-red-400",
    rotation: "rotate-1",
  },
  {
    value: "$500M+",
    label: "GMV Processed",
    color: "bg-blue-400",
    rotation: "-rotate-1",
  },
  {
    value: "50+",
    label: "Countries Served",
    color: "bg-green-400",
    rotation: "rotate-1",
  },
  {
    value: "99.9%",
    label: "Customer Satisfaction",
    color: "bg-yellow-400",
    rotation: "-rotate-1",
  },
];

const heading =
  "text-5xl font-black text-black text-center mb-12 bg-white p-6 border-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block";
const cardBase =
  "border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transform";
const Section = ({
  title,
  rotation,
  children,
}: {
  title: string;
  rotation: string;
  children: React.ReactNode;
}) => (
  <div className="mb-16">
    <h2 className={`${heading} transform ${rotation}`}>{title}</h2>
    {children}
  </div>
);
const ValueCard = ({
  idx,
  value,
}: {
  idx: number;
  value: (typeof values)[number];
}) => (
  <Card
    className={`${cardBase} ${idx % 2 === 0 ? "rotate-1" : "-rotate-1"} bg-white border-6 p-8`}
  >
    <div className="text-center">
      <div className="text-5xl mb-4 bg-yellow-300 p-4 border-4 border-black inline-block transform rotate-3">
        {value.icon}
      </div>
      <h3 className="text-2xl font-black text-black mb-3 bg-red-300 p-2 border-2 border-black inline-block transform -rotate-1">
        {value.title}
      </h3>
      <p className="text-lg font-bold text-black leading-relaxed">
        {value.description}
      </p>
    </div>
  </Card>
);
const MemberCard = ({
  idx,
  member,
}: {
  idx: number;
  member: (typeof team)[number];
}) => (
  <Card
    className={`${cardBase} ${idx % 2 === 0 ? "rotate-1" : "-rotate-1"} ${member.color} border-6 p-6`}
  >
    <div className="text-center">
      <img
        src={`https://randomuser.me/api/portraits/${idx % 2 === 0 ? "men" : "women"}/${idx + 1}.jpg`}
        alt={`${member.name} avatar`}
        className="w-20 h-20 rounded-full border-4 border-black mx-auto mb-4"
      />
      <h3 className="text-xl font-black text-black mb-1 bg-white p-2 border-2 border-black inline-block transform -rotate-1">
        {member.name}
      </h3>
      <p className="text-sm font-bold text-black bg-white p-1 border border-black inline-block transform rotate-1 mb-3">
        {member.role}
      </p>
      <p className="text-sm font-bold text-black leading-relaxed">
        {member.bio}
      </p>
    </div>
  </Card>
);
const MilestoneCard = ({
  idx,
  item,
}: {
  idx: number;
  item: (typeof milestones)[number];
}) => (
  <Card
    className={`${cardBase} ${idx % 2 === 0 ? "rotate-1" : "-rotate-1"} bg-green-300 border-6 p-6`}
  >
    <div className="flex items-center">
      <div className="text-3xl font-black text-black bg-white p-3 border-4 border-black transform -rotate-2 mr-6">
        {item.year}
      </div>
      <p className="text-xl font-bold text-black flex-1">{item.event}</p>
    </div>
  </Card>
);

const Page = () => (
  <div className="min-h-screen bg-linear-to-br from-orange-200 via-red-200 to-pink-200 p-12">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-7xl font-black text-black mb-6 transform -rotate-1 bg-white p-8 border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] inline-block">
          ABOUT FUNROAD
        </h1>
        <p className="text-2xl font-bold text-black bg-yellow-300 p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block transform rotate-1 max-w-4xl mx-auto">
          We're on a mission to revolutionize ecommerce by making powerful,
          scalable solutions accessible to businesses of all sizes.
        </p>
      </div>
      <div className="mb-16">
        <Card className="p-12 bg-linear-to-br from-cyan-300 via-blue-300 to-purple-300 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1">
          <h2 className="text-5xl font-black text-black mb-6 bg-white p-4 border-4 border-black inline-block transform rotate-2">
            OUR MISSION
          </h2>
          <p className="text-2xl font-bold text-black leading-relaxed mb-6">
            To empower entrepreneurs and businesses worldwide by providing the
            most innovative, reliable, and user-friendly multitenant ecommerce
            platform.
          </p>
          <p className="text-xl font-bold text-black leading-relaxed">
            We believe that every business, regardless of size, deserves access
            to enterprise-grade technology. Our platform combines cutting-edge
            features with intuitive design to help you build, grow, and scale
            your online presence.
          </p>
        </Card>
      </div>
      <Section title="OUR VALUES" rotation="-rotate-1">
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, idx) => (
            <ValueCard key={value.title} idx={idx} value={value} />
          ))}
        </div>
      </Section>
      <Section title="MEET OUR TEAM" rotation="rotate-1">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, idx) => (
            <MemberCard key={member.name} idx={idx} member={member} />
          ))}
        </div>
      </Section>
      <Section title="OUR JOURNEY" rotation="-rotate-1">
        <div className="space-y-6">
          {milestones.map((item, idx) => (
            <MilestoneCard key={item.year} idx={idx} item={item} />
          ))}
        </div>
      </Section>
      <div className="mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
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
      <div className="text-center">
        <Card className="p-12 bg-linear-to-br from-indigo-300 via-purple-300 to-pink-300 border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 max-w-5xl mx-auto">
          <h2 className="text-5xl font-black text-black mb-6 bg-white p-4 border-4 border-black inline-block transform rotate-2">
            JOIN OUR MISSION
          </h2>
          <p className="text-2xl font-bold text-black mb-8">
            Ready to be part of the ecommerce revolution? Start building your
            dream online store today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="px-8 py-6 text-2xl font-black bg-black text-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 hover:bg-gray-800 transition-all transform rotate-1">
              🚀 START YOUR FREE TRIAL
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-2xl font-black border-4 border-black bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:-translate-y-1 transition-all transform -rotate-1"
            >
              💼 VIEW CAREERS
            </Button>
          </div>
        </Card>
      </div>
    </div>
  </div>
);

export default Page;
