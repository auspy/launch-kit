import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import ReleaseDetail from "@/components/ReleaseDetail";

const ReleaseDetailPage = ({
  siteConfig,
  release,
  allReleases = [],
  backToChangelogPath = "/changelog",
  className = "min-h-screen bg-gray-50",
  pageTitle = "Release Notes",
  pageDescription = "Detailed information about app releases and updates"
}) => {
  if (!release) {
    return (
      <div className={className}>
        <Header siteConfig={siteConfig} />
        <main>
          <div className="bg-white border-b">
            <div className="max-w-4xl mx-auto py-12 px-4 text-center">
              <h1 className="text-4xl font-bold mb-3">Release Not Found</h1>
              <p className="text-gray-600">
                The requested release could not be found.
              </p>
            </div>
          </div>
        </main>
        <SiteFooter siteConfig={siteConfig} />
      </div>
    );
  }

  return (
    <div className={className}>
      <Header siteConfig={siteConfig} />

      <main>
        <div className="bg-white border-b">
          <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-bold mb-3 text-center">
              {pageTitle}
            </h1>
            <p className="text-gray-600 text-center">
              {pageDescription}
            </p>
          </div>
        </div>

        <ReleaseDetail
          version={release.version}
          content={release.content}
          date={release.date}
          title={release.title}
          slug={release.slug}
          allReleases={allReleases}
          backToChangelogPath={backToChangelogPath}
          siteConfig={siteConfig}
        />
      </main>

      <SiteFooter siteConfig={siteConfig} />
    </div>
  );
};

export default ReleaseDetailPage;