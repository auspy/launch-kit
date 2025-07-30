import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";

export default function BlogPostPage({ 
  post, 
  config = {},
  relatedPosts = []
}) {
  if (!post) {
    notFound();
  }

  const {
    showHeader = true,
    showFooter = true,
    showBackLink = true,
    showAuthor = false,
    showCoverImage = true,
    showTags = true,
    showRelatedPosts = true,
    dateFormat = {
      month: "long",
      day: "numeric",
      year: "numeric"
    },
    layout = {
      container: "container max-w-4xl",
      prose: "prose prose-lg dark:prose-invert prose-blue"
    },
    customComponents = {}
  } = config;

  const formattedDate = new Date(post.date).toLocaleDateString("en-US", dateFormat);

  return (
    <>
      {showHeader && <Header />}
      <main className={`${layout.container} mx-auto px-4 py-12`}>
        {showBackLink && (
          <Link
            href="/blog"
            className="inline-flex items-center text-blue-600 mb-8 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Back to Blog
          </Link>
        )}

        <article className={`${layout.prose} mx-auto`}>
          <header className="mb-10 not-prose">
            <h1 className="text-4xl font-bold mb-4 text-left">{post.title}</h1>

            <div className="flex items-center my-6">
              {showAuthor && post.author && (
                <div className="flex items-center">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full">
                    {post.authorImage ? (
                      <Image
                        src={post.authorImage}
                        alt={post.author}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-gray-200"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium">{post.author}</p>
                    <p className="text-sm text-gray-500">{formattedDate}</p>
                  </div>
                </div>
              )}

              {!showAuthor && (
                <p className="text-sm text-gray-500">{formattedDate}</p>
              )}

              {showTags && post.tags && post.tags.length > 0 && (
                <div className="ml-auto flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-medium text-gray-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {showCoverImage && post.coverImage && (
              <div className="relative h-[400px] w-full overflow-hidden rounded-xl mb-10">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}
          </header>

          {customComponents.beforeContent}

          <ReactMarkdown
            rehypePlugins={[rehypeHighlight]}
            className="max-w-none"
            components={customComponents.markdown}
          >
            {post.content}
          </ReactMarkdown>

          {customComponents.afterContent}
        </article>

        {showRelatedPosts && (
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {relatedPosts.length > 0 ? "Related Posts" : "Continue Reading"}
            </h2>
            {relatedPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {relatedPosts.slice(0, 2).map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="block p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow text-left"
                  >
                    <h3 className="font-semibold text-lg mb-2">{relatedPost.title}</h3>
                    <p className="text-gray-600 text-sm">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                href="/blog"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                View All Posts
              </Link>
            )}
          </div>
        )}
      </main>
      {showFooter && <SiteFooter />}
    </>
  );
}