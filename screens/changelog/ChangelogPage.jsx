import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronRight } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PageHeader from "@/components/PageHeader";

const ChangelogPage = ({ 
  siteConfig,
  releases = [],
  pageHeader = {
    badge: "Release Notes",
    title: "What's New?",
    description: "Keep track of the latest features, improvements, and bug fixes"
  },
  showVersionNavigation = true,
  versionNavigationThreshold = 5,
  releaseDetailPath = "/releases",
  className = "min-h-screen bg-gradient-to-b from-primary/5 to-background"
}) => {
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
          {/* Version Navigation */}
          {showVersionNavigation && releases.length > versionNavigationThreshold && (
            <Card className="mb-8">
              <CardContent className="pt-6 pb-4">
                <h2 className="text-lg font-semibold mb-4">
                  Version Quick Jump
                </h2>
                <div className="flex flex-wrap gap-2">
                  {releases.map((release) => (
                    <Button
                      key={release.version}
                      variant="outline"
                      size="sm"
                      asChild
                      className="rounded-full hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                      <Link href={`${releaseDetailPath}/${release.slug}`}>
                        v{release.version}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Release Entries */}
          <div className="space-y-6">
            {releases.length > 0 ? (
              releases.map((release, index) => (
                <Card
                  key={release.version}
                  className={`overflow-hidden transition-all hover:shadow-md ${
                    index === 0
                      ? "border-primary/20 bg-gradient-to-br from-primary/[0.075] to-primary/[0.035]"
                      : "hover:border-primary/20 hover:bg-primary/[0.02]"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-wrap items-baseline justify-between mb-2">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge
                            variant={index === 0 ? "default" : "outline"}
                            className={
                              index === 0
                                ? "bg-primary/90 hover:bg-primary/80 text-white"
                                : "text-primary/90 border-primary/20 bg-primary/5"
                            }
                          >
                            v{release.version}
                          </Badge>
                          {index === 0 && (
                            <Badge
                              variant="outline"
                              className="bg-primary/5 border-primary/20 text-primary/90"
                            >
                              Latest
                            </Badge>
                          )}
                        </div>
                        <h2 className=" font-bold tracking-tight">
                          <Link
                            href={`${releaseDetailPath}/${release.slug}`}
                            className="hover:text-primary transition-colors text-xl font-medium"
                          >
                            {release.title}
                          </Link>
                        </h2>
                      </div>
                      <time className="text-sm text-muted-foreground flex items-center whitespace-nowrap">
                        <Calendar className="h-4 w-4 mr-1.5 opacity-70" />
                        {release.date}
                      </time>
                    </div>

                    <div className="prose prose-sm max-w-none mb-6">
                      <p className="text-muted-foreground/90 leading-relaxed">
                        {release.seoDescription}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="group hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                    >
                      <Link href={`${releaseDetailPath}/${release.slug}`}>
                        Read release notes
                        <ChevronRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-muted-foreground">
                  No release information available.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <SiteFooter siteConfig={siteConfig} />
    </div>
  );
};

export default ChangelogPage;