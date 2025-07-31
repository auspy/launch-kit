import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Zap, Target, Shield, Users } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PageHeader from "@/components/PageHeader";

const RoadmapPage = ({
  siteConfig,
  pageHeader = {
    badge: "Vision",
    title: "What's Next",
    description: "Enhancing your experience, one feature at a time."
  },
  progressSection = {
    title: "Our Progress",
    description: "Recent improvements and accomplishments",
    changelogLink: "/changelog",
    items: []
  },
  comingSoonSection = {
    title: "Coming Soon",
    items: []
  },
  longTermSection = {
    title: "On Our Radar",
    items: []
  },
  callToAction = {
    title: "Help Shape the Future",
    description: "Your feedback drives our development. Share your thoughts on these upcoming features.",
    buttonText: "Share Your Thoughts",
    buttonLink: "/contact"
  },
  className = "min-h-screen bg-gradient-to-b from-primary/5 to-background"
}) => {
  const getIconComponent = (iconName) => {
    const iconMap = {
      sparkles: Sparkles,
      zap: Zap,
      target: Target,
      shield: Shield,
      users: Users
    };
    return iconMap[iconName?.toLowerCase()] || Sparkles;
  };

  return (
    <div className={className}>
      <Header siteConfig={siteConfig} />

      <main>
        <PageHeader
          badge={pageHeader.badge}
          title={pageHeader.title}
          description={pageHeader.description}
        />

        <div className="max-w-4xl mx-auto py-12 px-4">
          {/* Progress Recap */}
          {progressSection.items.length > 0 && (
            <Card className="mb-12">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {progressSection.title}
                  </h2>
                  {progressSection.changelogLink && (
                    <Button variant="ghost" asChild size="sm" className="p-2 h-6">
                      <Link href={progressSection.changelogLink}>
                        View Changelog
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground">
                  {progressSection.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-3 text-muted-foreground">
                  {progressSection.items.map((item, index) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <li key={index} className="flex items-start gap-2">
                        <IconComponent className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span>
                          <strong>{item.title}:</strong> {item.description}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Coming Soon */}
          {comingSoonSection.items.length > 0 && (
            <div className="space-y-8 mb-16">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-6">
                  {comingSoonSection.title}
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {comingSoonSection.items.map((item, index) => {
                    const IconComponent = getIconComponent(item.icon);
                    return (
                      <Card key={index} className="relative overflow-hidden">
                        <CardContent className="pt-6">
                          <div className="mb-4">
                            <Badge
                              variant={item.priority === 'high' ? "default" : "outline"}
                              className={
                                item.priority === 'high'
                                  ? "bg-primary/90 text-white"
                                  : "border-primary/20 text-primary/90"
                              }
                            >
                              {item.badge || "Coming Soon"}
                            </Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground mb-4">
                            {item.description}
                          </p>
                          {item.features && (
                            <ul className="space-y-2 text-sm text-muted-foreground">
                              {item.features.map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start gap-2">
                                  <IconComponent className="h-4 w-4 text-primary mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Long-term Plans */}
          {longTermSection.items.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold tracking-tight mb-6">
                {longTermSection.title}
              </h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {longTermSection.items.map((item, index) => {
                      const IconComponent = getIconComponent(item.icon);
                      return (
                        <div key={index}>
                          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                            <IconComponent className="h-5 w-5 text-primary" />
                            {item.title}
                          </h3>
                          <p className="text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Call to Action */}
          {callToAction.title && (
            <Card className="bg-primary/[0.03] border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-semibold">
                    {callToAction.title}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    {callToAction.description}
                  </p>
                  {callToAction.buttonLink && (
                    <Button
                      asChild
                      className="bg-primary text-white hover:bg-primary/90"
                    >
                      <Link href={callToAction.buttonLink}>
                        {callToAction.buttonText}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <SiteFooter siteConfig={siteConfig} />
    </div>
  );
};

export default RoadmapPage;