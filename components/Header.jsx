"use client";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Menu,
  ChevronDown,
  Binoculars,
  Megaphone,
  User,
  Key,
  Timer,
  Clock,
  Calendar,
  Layout,
  CheckSquare,
  Search,
  Cloud,
  Keyboard,
  BarChart,
  Minimize2,
  Bell,
  AlarmClock,
  Palette,
  RotateCcw,
  Mail,
  MessageCircle,
  Twitter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supportEmail } from "@/constants";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import ButtonMainCTAClient from "@/components/buttons/ButtonMainCTA.client";
import { useAuth } from "@/contexts/auth.context";
import { trackButtonClick, ButtonActions, Locations } from "@/lib/tracking";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { getAllFeatures } from "@/lib/features/features";
import React from "react";

// Icon mapping for feature icons
const iconMap = {
  Timer: Timer,
  Clock: Clock,
  Calendar: Calendar,
  Layout: Layout,
  CheckSquare: CheckSquare,
  Search: Search,
  Cloud: Cloud,
  Keyboard: Keyboard,
  BarChart: BarChart,
  Minimize2: Minimize2,
  Bell: Bell,
  AlarmClock: AlarmClock,
  Palette: Palette,
  RotateCcw: RotateCcw,
};

// Feature Menu Item Component
const FeatureMenuItem = ({ item, menuIndex }) => {
  return (
    <NavigationMenuLink asChild key={menuIndex}>
      <Link
        href={item.href}
        className={cn(
          "flex flex-col p-3 rounded-md h-full",
          "transition-colors duration-150",
          "hover:bg-blue-600 hover:no-underline group/menuItem"
        )}
      >
        <div className="flex items-start gap-2.5">
          <span
            className={cn(
              "inline-flex items-center justify-center w-8 h-8 rounded-md shrink-0",
              "bg-blue-50 text-blue-600 transition-colors duration-150",
              "group-hover/menuItem:bg-blue-500 group-hover/menuItem:text-white"
            )}
          >
            {item.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-gray-800 group-hover/menuItem:text-white">
                {item.label}
              </span>
              {item.isPro && (
                <span className="text-[10px] whitespace-nowrap font-semibold uppercase bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded group-hover/menuItem:bg-white group-hover/menuItem:text-blue-600">
                  Pro
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 leading-snug line-clamp-2 group-hover/menuItem:text-blue-50">
              {item.description}
            </p>
          </div>
        </div>
      </Link>
    </NavigationMenuLink>
  );
};

// Simple Menu Item Component
const SimpleMenuItem = ({ item, menuIndex }) => {
  return (
    <li key={menuIndex}>
      <NavigationMenuLink asChild>
        <Link
          href={item.href}
          className={cn(
            "flex items-center gap-2 w-full p-2",
            "text-sm font-medium text-gray-700",
            "rounded-md transition-colors duration-150",
            "hover:bg-blue-50 hover:text-blue-600"
          )}
        >
          {item.icon}
          <span>{item.label}</span>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

// DesktopNavigation Component
const DesktopNavigation = ({ navigation, router, bootstrap }) => {
  return (
    <div className="hidden md:flex items-center gap-5">
      <NavigationMenu>
        <NavigationMenuList className="flex items-center gap-5">
          {navigation.map((item, index) => {
            // For download button
            if (item.isDownloadButton) {
              return (
                <NavigationMenuItem key={index}>
                  <ButtonMainCTAClient
                    text="Download"
                    type="small"
                    location={Locations.HEADER}
                    bootstrap={bootstrap}
                  />
                </NavigationMenuItem>
              );
            }

            // For menu items with dropdown
            if (item.menu) {
              return (
                <NavigationMenuItem key={index} className="relative">
                  <NavigationMenuTrigger
                    className={cn(
                      "text-sm font-medium text-foreground",
                      "bg-transparent hover:bg-transparent",
                      "data-[state=open]:bg-transparent",
                      "px-0 py-1.5"
                    )}
                    onClick={
                      item.href
                        ? (e) => {
                            e.preventDefault();
                            router.push(item.href);
                          }
                        : undefined
                    }
                  >
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent
                    className={cn(
                      "absolute left-0 top-full",
                      "bg-white rounded-md shadow-lg",
                      "border border-gray-100",
                      item.label === "Features"
                        ? "w-[700px] p-4"
                        : "min-w-[180px]"
                    )}
                  >
                    {item.label === "Features" ? (
                      <div>
                        <div className="grid grid-cols-3 gap-3">
                          {item.menu
                            .filter((menuItem) => !menuItem.isViewAll)
                            .map((menuItem, menuIndex) => (
                              <FeatureMenuItem
                                key={menuIndex}
                                item={menuItem}
                                menuIndex={menuIndex}
                              />
                            ))}
                        </div>
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <NavigationMenuLink asChild>
                            <Link
                              href="/features"
                              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                            >
                              View All Features
                              <ChevronDown className="h-3.5 w-3.5 ml-1 rotate-[-90deg]" />
                            </Link>
                          </NavigationMenuLink>
                        </div>
                      </div>
                    ) : (
                      <ul className="p-1.5">
                        {item.menu.map((menuItem, menuIndex) => (
                          <SimpleMenuItem
                            key={menuIndex}
                            item={menuItem}
                            menuIndex={menuIndex}
                          />
                        ))}
                      </ul>
                    )}
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            // For items with click handler
            if (item.onClick) {
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink asChild>
                    <button
                      className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors duration-150"
                      onClick={item.onClick}
                    >
                      {item.label}
                    </button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            // For simple link items
            if (item.href) {
              return (
                <NavigationMenuItem key={index}>
                  <NavigationMenuLink
                    href={item.href}
                    className="text-sm font-medium text-foreground hover:text-blue-600 transition-colors duration-150 hover:no-underline"
                  >
                    {item.label}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            }

            // For divider
            return (
              <NavigationMenuItem key={index}>
                <div className="h-[20px] w-[1px] bg-border" />
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

// MobileNavigation Component
const MobileNavigation = ({ navigation, bootstrap }) => {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-foreground hover:text-foreground/80"
          >
            <Menu className="h-5 w-5 text-gray-700" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] sm:w-[400px]">
          <nav className="flex flex-col gap-4 mt-8">
            {navigation.map((item, index) => {
              // Download button
              if (item.isDownloadButton) {
                return (
                  <ButtonMainCTAClient
                    text="Download"
                    key={index}
                    type="small"
                    location={Locations.HEADER}
                    bootstrap={bootstrap}
                  />
                );
              }

              // Menu items with dropdown
              if (item.menu) {
                return (
                  <div key={index} className="flex flex-col gap-4">
                    {item.href && (
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-gray-700 px-2 py-1.5"
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.label === "Features" ? (
                      <></>
                    ) : (
                      item.menu.map((menuItem, menuIndex) => (
                        <Link
                          key={menuIndex}
                          href={menuItem.href}
                          className="text-sm font-medium text-gray-700 flex items-center gap-2 w-full px-2 py-1.5 hover:bg-gray-100 rounded-md"
                        >
                          {/* {menuItem.icon} */}
                          {menuItem.label}
                        </Link>
                      ))
                    )}
                  </div>
                );
              }

              // Items with click handler
              if (item.onClick) {
                return (
                  <button
                    key={index}
                    className="text-sm link font-medium text-gray-700 flex items-center gap-4 w-full text-left px-2 py-1.5 hover:bg-gray-100 rounded-md"
                    onClick={item.onClick}
                  >
                    {item.label}
                  </button>
                );
              }

              // Simple link items
              if (item.href) {
                return (
                  <Link
                    key={index}
                    href={item.href}
                    className="text-sm link !font-medium text-gray-700 flex items-center gap-4 w-full px-2 py-1.5 hover:bg-gray-100 rounded-md"
                  >
                    {item.label}
                  </Link>
                );
              }

              return null;
            })}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default function Header({ bootstrap = null }) {
  const { toast } = useToast();
  const router = useRouter();
  const { user, loading, logout } = useAuth();

  const handleScroll = async (e, href) => {
    e.preventDefault();

    trackButtonClick("nav_link", ButtonActions.SCROLL_TO, {
      destination: href,
      location: Locations.HEADER,
    });

    if (!window.location.pathname.match(/^\/(?:#.*)?$/)) {
      router.push(href);
      return;
    }

    const element = document.querySelector(href.replace("/", ""));
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleContactClick = () => {
    trackButtonClick("contact_support", ButtonActions.CONTACT, {
      location: Locations.HEADER,
    });

    toast({
      title: "Contact Us",
      description: `Email us at: ${supportEmail}`,
    });
  };

  const handleManageLicenseClick = (e) => {
    e.preventDefault();

    trackButtonClick("manage_license", ButtonActions.NAVIGATE, {
      location: Locations.HEADER,
      is_authenticated: !!user,
    });

    if (user) {
      router.push("/license/dashboard");
    } else {
      router.push("/license/login?returnUrl=/license/dashboard");
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();

    trackButtonClick("logout", ButtonActions.LOGOUT, {
      location: Locations.HEADER,
    });

    await logout();
    router.push("/");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const featuresData = getAllFeatures().slice(0, 6); // Get first 6 features for the menu

  const navigation = [
    {
      label: "Features",
      href: "/features",
      menu: [
        ...featuresData.map((feature) => ({
          icon: feature.icon && (
            <span
              className={cn(
                "inline-flex items-center justify-center w-8 h-8 rounded-md shrink-0",
                "bg-blue-50 text-blue-600"
              )}
            >
              {iconMap[feature.icon] &&
                React.createElement(iconMap[feature.icon], { size: 16 })}
            </span>
          ),
          label: feature.title,
          description: feature.shortDescription,
          href: `/features#${feature.id}`,
          isPro: feature.isPro,
        })),
        {
          isViewAll: true,
          label: "View All Features",
          href: "/features",
        },
      ],
    },

    {
      label: "Roadmap",
      menu: [
        // {
        //   icon: <Brain style={{ height: 18 }} className="text-cyan-500" />,
        //   label: "Challenges",
        //   description: "Solutions for common focus and attention problems",
        //   href: "/challenges",
        // },
        // {
        //   icon: <BookOpen style={{ height: 18 }} className="text-indigo-500" />,
        //   label: "Blog",
        //   description: "Articles, guides and focus techniques",
        //   href: "/blog",
        // },
        {
          icon: (
            <Binoculars style={{ height: 18 }} className="text-purple-500" />
          ),
          label: "What's Next?",
          href: "/whats-next",
        },
        {
          icon: (
            <Megaphone
              height={16}
              style={{ height: 18 }}
              className="text-primary"
            />
          ),
          label: "What's New?",
          href: "/changelog",
        },
      ],
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Support",
      menu: [
        {
          icon: <Mail style={{ height: 18 }} className="text-blue-600" />,
          label: "Contact Us",
          href: "/contact",
        },
        {
          icon: (
            <MessageCircle style={{ height: 18 }} className="text-indigo-500" />
          ),
          label: "Discord",
          href: process.env.NEXT_PUBLIC_DISCORD_URL,
        },
        {
          icon: <Twitter style={{ height: 18 }} className="text-sky-500" />,
          label: "Twitter",
          href: "https://twitter.com/focusmoapp",
        },
      ],
    },
    {},
    {
      label: "Manage License",
      menu: [
        {
          icon: <User style={{ height: 18 }} className="text-yellow-600" />,
          label: "License Dashboard",
          href: "/license/dashboard",
        },
        {
          icon: <Key style={{ height: 18 }} className="text-green-500" />,
          label: "Get License Key",
          href: "/get-license-key",
        },
      ],
    },
    {
      isDownloadButton: true,
    },
  ].filter(Boolean);

  return (
    <div className="w-screen z-50 sticky top-0 bg-white border-b border-primary/15 flex justify-center">
      <div className="h-[60px] contain flex justify-between items-center w-full">
        <div className="flex">
          <Logo />
          {/* <p className="ml-1 mb-1 text-[10px] opacity-60 font-medium self-end">
            BETA
          </p> */}
        </div>
        <div className="flex items-center gap-5">
          {/* Desktop Navigation */}
          <DesktopNavigation
            bootstrap={bootstrap}
            navigation={navigation}
            router={router}
          />

          {/* Mobile Navigation */}
          <MobileNavigation bootstrap={bootstrap} navigation={navigation} />
        </div>
      </div>
    </div>
  );
}
