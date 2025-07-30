import Link from "next/link";
import { supportEmail } from "@/constants";
import { Github, Twitter } from "lucide-react";
import Logo from "./Logo";

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms and Conditions" },
  { href: "/contact", label: "Contact Us" },
];

const contentLinks = [
  { href: "/blog", label: "Blog" },
  { href: "/challenges", label: "Challenges" },
  { href: process.env.NEXT_PUBLIC_DISCORD_URL, label: "Join Discord" },
];

const socialLinks = [
  {
    href: "https://github.com/auspy",
    label: "github.com/auspy",
    icon: <Github className="h-4 w-4" />,
  },
  {
    href: "https://x.com/kshetezvinayak",
    label: "x.com/kshetezvinayak",
    icon: <Twitter className="h-4 w-4" />,
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t w-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company info */}
          <div className="space-y-3">
            <Logo />

            <p className="text-sm text-gray-600">
              Helping you stay focused and productive.
            </p>
            <p className="text-sm text-gray-600">
              © {new Date().getFullYear()} Focusmo
            </p>
          </div>

          {/* Content & Community */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Content & Community
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Features
                </Link>
              </li>
              {contentLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
                    target={
                      link.href?.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      link.href?.startsWith("http") ? "noreferrer" : undefined
                    }
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">Support</h3>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1.5"
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Meet the Creator */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-900">
              Meet the Creator
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http") ? "noreferrer" : undefined
                    }
                  >
                    {link.icon}
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter;
