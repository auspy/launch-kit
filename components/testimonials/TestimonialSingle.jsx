import { Star } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const Structure = ({
  stars,
  quote,
  authorImage,
  authorName,
  authorTitle,
  showStars,
  size,
}) => {
  return (
    <div
      className={cn(
        "",
        size === "large" ? "py-16 px-8 max-w-3xl" : " max-w-lg"
      )}
    >
      {/* Stars */}
      {showStars && (
        <div className="flex gap-1 mb-4">
          {[...Array(stars)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 md:w-5 md:h-5 fill-accent stroke-accent"
            />
          ))}
        </div>
      )}

      {/* Quote */}
      <blockquote
        className={cn(
          " leading-relaxed",
          size === "large"
            ? "text-lg md:text-2xl mb-6 font-semibold"
            : "text-sm md:text-base mb-4"
        )}
      >
        {quote}
      </blockquote>

      {/* Author */}
      <div className="flex items-center gap-4">
        <Image
          src={authorImage}
          alt="Profile picture"
          width={size === "large" ? 52 : 42}
          height={size === "large" ? 52 : 42}
          className="rounded-full"
        />
        <div>
          <div
            className={cn(
              "font-semibold flex items-center gap-2",
              size === "large" ? "text-lg md:text-xl" : "text-base "
            )}
          >
            {authorName}
            {/* <span className="text-[10px] leading-none border border-accent bg-accent/10 text-accent px-1.5 py-0.5 rounded-xl font-medium">
              PRO
            </span> */}
          </div>
          <div
            className={cn(
              "text-gray-500",
              size === "large" ? "text-base md:text-lg" : "text-sm"
            )}
          >
            {authorTitle}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialSingle({
  person,
  showStars = true,
  size = "large",
}) {
  const testimonials = {
    ishan: {
      stars: 5,
      quote: (
        <>
          It's{" "}
          <span className=" bg-blue-500/20 font-semibold text-primary  px-1 rounded">
            simple and extremely effective
          </span>{" "}
          in keeping me on track and not getting distracted by 20 different
          tasks. And as a bonus,{" "}
          <span className=" bg-blue-500/20 font-semibold text-primary  px-1 rounded">
            the creator is very responsive
          </span>{" "}
          and actively working on improving the app.
        </>
      ),
      authorImage: "/testimonials/ishan.png",
      authorName: "Ishan Mandhan",
      authorTitle: "Software Engineer",
    },
    franc: {
      stars: 5,
      quote: (
        <>
          &ldquo;Focusmo is my{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            go-to tool
          </span>{" "}
          for staying focused ;-). When I need to dive into{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            deep work
          </span>{" "}
          like research, brainstorming, or creative tasks, I start by making a
          simple commitment to myself: 'I'll dedicate an hour to this.' Then, I
          follow a straightforward routine:{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            block time
          </span>{" "}
          for deep work,{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            activate Focusmo
          </span>{" "}
          , and{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            fully immerse
          </span>{" "}
          myself in the task.&rdquo;
        </>
      ),
      authorImage: "/testimonials/franc.png",
      authorName: "Frank Mattes",
      authorTitle: "Thought Leader and Author",
    },
    will: {
      stars: 5,
      quote: (
        <>
          &ldquo;I've only been using Focusmo for about a week, but it's allowed
          me to{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            organize tasks
          </span>{" "}
          and manage my time more effectively while also{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            keeping health and mental breaks in mind
          </span>
          . The timer and break reminders have been extremely effective.&rdquo;
        </>
      ),
      authorImage: "/testimonials/will.png",
      authorName: "Will Davidow",
      authorTitle: "Web Engineer/Architect with 15+ years of experience",
    },
    the9th: {
      stars: 5,
      quote: (
        <>
          Just wanted to say{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            appreciate the swiftness and amount of updates
          </span>{" "}
          you've done since launching the app. Good stuff man. The features
          you've been adding especially the status bar icon have been really
          great. One thing that gets me to use an app more is how{" "}
          <span className="bg-blue-500/20 text-primary  px-1 rounded">
            frictionless the experience is
          </span>{" "}
          and quick access to access bar icon is one of those things that is a
          game-changer for that. Thanks again.
        </>
      ),
      authorImage: "/testimonials/the9th.jpg",
      authorName: "The 9th",
      authorTitle: "Web Developer",
    },
    garratt: {
      stars: 5,
      quote: (
        <>
          As an avid app user who has explored thousands of applications, I
          often download multiple apps within a category to thoroughly test and
          identify the best options. Among all the focus-oriented apps I&apos;ve
          tried,{" "}
          <span className="bg-blue-500/20 text-primary px-1 rounded">
            my favorite
          </span>
          . The{" "}
          <span className="bg-blue-500/20 text-primary px-1 rounded">
            developer is highly responsive, actively engaging with users
          </span>{" "}
          and implementing several suggestions to enhance the app&apos;s
          functionality. This is an essential tool for anyone aiming to boost
          their productivity.
        </>
      ),
      authorImage: "/testimonials/garrat.png",
      authorName: "Garratt Grenier",
      authorTitle: "Senior Area Manager Construction Products",
    },
  };

  let testimonial = testimonials[person];

  if (!testimonial) {
    // random testimonial
    const person =
      Object.keys(testimonials)[
        Math.floor(Math.random() * Object.keys(testimonials).length)
      ];
    testimonial = testimonials[person == "ishan" ? "franc" : person];
  }

  return <Structure {...testimonial} showStars={showStars} size={size} />;
}
