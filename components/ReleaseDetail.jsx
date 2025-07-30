import React from "react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowLeftCircle,
  ArrowRightCircle,
  Download,
  Calendar,
  Tag,
} from "lucide-react";
import { getReleaseData } from "@/lib/changelog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ButtonMainCTA from "./buttons/ButtonMainCTA";
import { Locations } from "@/lib/tracking";

const ReleaseDetail = ({ version, content, date, title, slug }) => {
  // Get all releases to determine prev/next
  const allReleases = getReleaseData();
  const currentIndex = allReleases.findIndex(
    (release) => release.version === version
  );

  // Determine previous and next releases
  const prevRelease =
    currentIndex < allReleases.length - 1
      ? allReleases[currentIndex + 1]
      : null;
  const nextRelease = currentIndex > 0 ? allReleases[currentIndex - 1] : null;

  return (
    <div className="max-w-4xl mx-auto py-8 px-2 md:px-4">
      <div className="mb-8">
        <Button
          variant="ghost"
          asChild
          className="hover:bg-primary/5 hover:text-primary -ml-4 group"
        >
          <Link href="/changelog">
            <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to all releases
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden border-primary/20">
        <CardHeader className="border-b bg-gradient-to-br from-primary/[0.075] to-primary/[0.035] space-y-5">
          <div className="flex flex-wrap gap-2 items-center">
            <Badge variant="default" className="bg-primary text-white">
              v{version}
            </Badge>
            <time
              dateTime={date}
              className="text-sm text-muted-foreground flex items-center"
              itemProp="datePublished"
            >
              <Calendar className="h-4 w-4 mr-1 opacity-70" />
              {date}
            </time>
          </div>
          <div className="py-3">
            <h1 className="text-3xl font-bold tracking-tight" itemProp="name">
              {title}
            </h1>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-8">
          <div
            className="prose prose-blue max-w-none prose-headings:tracking-tight prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground/90 prose-p:leading-relaxed"
            itemProp="description"
          >
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center tracking-tight">
              <Download className="h-5 w-5 mr-2 text-primary" />
              Download This Version
            </h3>
            <div className="flex flex-wrap gap-4">
              <ButtonMainCTA
                variant="outline"
                size="lg"
                downloadMethod="direct"
                location={Locations.RELEASE_DETAIL}
              />
              <ButtonMainCTA
                variant="outline"
                size="lg"
                className="hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                downloadMethod="direct"
                fileType="zip"
                location={Locations.RELEASE_DETAIL}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t bg-muted/5 px-1 py-2 md:p-6">
          <nav className="w-full flex justify-between items-center">
            <div>
              {prevRelease && (
                <Button
                  variant="ghost"
                  asChild
                  className="group hover:bg-primary/5 hover:text-primary"
                >
                  <Link
                    href={`/releases/${prevRelease.slug}`}
                    className="flex items-center"
                  >
                    <ArrowLeftCircle className="h-5 w-5 mr-2 text-primary transition-transform group-hover:-translate-x-1" />
                    <div className="text-left">
                      <div className="text-xs text-muted-foreground">
                        Previous Release
                      </div>
                      <div className="font-medium">v{prevRelease.version}</div>
                    </div>
                  </Link>
                </Button>
              )}
            </div>
            <div>
              {nextRelease && (
                <Button
                  variant="ghost"
                  asChild
                  className="group hover:bg-primary/5 hover:text-primary"
                >
                  <Link
                    href={`/releases/${nextRelease.slug}`}
                    className="flex items-center"
                  >
                    <div className="text-right">
                      <div className="text-xs text-muted-foreground">
                        Next Release
                      </div>
                      <div className="font-medium">v{nextRelease.version}</div>
                    </div>
                    <ArrowRightCircle className="h-5 w-5 ml-2 text-primary transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ReleaseDetail;
