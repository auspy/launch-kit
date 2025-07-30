import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import PageHeader from "@/components/PageHeader";

export default function BlogListPage({ 
  posts = [], 
  config = {},
  metadata = {}
}) {
  const {
    title = "Blog",
    description = "Welcome to our blog. Read about our latest updates and insights.",
    showHeader = true,
    showFooter = true,
    layout = {
      grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
      gap: "gap-10",
      container: "container contain max-w-6xl"
    },
    cardStyle = "default",
    dateFormat = {
      month: "long",
      day: "numeric", 
      year: "numeric"
    }
  } = config;

  const renderCard = (post) => {
    if (cardStyle === "minimal") {
      return (
        <Link
          href={`/blog/${post.slug}`}
          key={post.slug}
          className="group hover:no-underline block"
        >
          <article className="py-4 border-b border-gray-200 last:border-0">
            <time className="text-sm text-gray-500">
              {new Date(post.date).toLocaleDateString("en-US", dateFormat)}
            </time>
            <h2 className="text-xl font-semibold mt-1 mb-2 group-hover:text-blue-600 transition-colors">
              {post.title}
            </h2>
            <p className="text-gray-600">{post.excerpt}</p>
          </article>
        </Link>
      );
    }

    // Default card style
    return (
      <Link
        href={`/blog/${post.slug}`}
        key={post.slug}
        className="group hover:no-underline block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
      >
        {post.coverImage && (
          <div className="relative h-52 w-full overflow-hidden">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>
              {new Date(post.date).toLocaleDateString("en-US", dateFormat)}
            </span>
            {post.tags && post.tags.length > 0 && (
              <>
                <span className="mx-2">•</span>
                <span>{post.tags[0]}</span>
              </>
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
            {post.title}
          </h2>
          <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
        </div>
      </Link>
    );
  };

  return (
    <>
      {showHeader && <Header />}
      <main className="bg-white">
        <PageHeader
          title={title}
          description={description}
        />

        <div className={`grid ${layout.container} px-4 py-12 md:py-16 ${layout.gap} ${layout.grid}`}>
          {posts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No blog posts found.</p>
            </div>
          ) : (
            posts.map(renderCard)
          )}
        </div>
      </main>
      {showFooter && <SiteFooter />}
    </>
  );
}