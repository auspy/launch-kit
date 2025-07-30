"use client";

import { TestimonialCard } from "./testimonial-card";
import { useEffect, useRef } from "react";
import SectionHeading from "@/components/SectionHeading";
import TestimonialHero from "@/components/testimonials/TestimonialHero";
const basicTestimonials = [
  {
    name: "Ishan Mandhan",
    role: "Software Engineer",
    content:
      "Was looking for an app like this for a long time. It's ${simple and extremely effective} in keeping me on track and not getting distracted by 20 different tasks. I've been ${a lot more productive} since using it. And as a bonus, ${the creator is very responsive} and actively working on improving the app.",
    imageUrl: "/testimonials/ishan.png",
  },
  {
    name: "Will K",
    role: "Web Engineer/Architect",
    content:
      "I've only been using Focusmo for about a week, but it's allowed me to organize tasks and ${manage my time more effectively} while also ${keeping health and mental breaks in mind}. The timer and break reminders have been extremely effective. I'd love to see features like task tagging with colors, configurable visuals, and ways to change timer states more easily.",
    imageUrl: "/testimonials/will.png",
  },
  {
    name: "Garratt Grenier",
    role: "Senior Area Manager Construction Products",
    content:
      "As an avid app user who has explored thousands of applications, I often download multiple apps within a category to thoroughly test and identify the best options. Among all the focus-oriented apps I’ve tried, this one stands out as ${my favorite}. The ${developer is highly responsive, actively engaging with users} and implementing several suggestions to enhance the app’s functionality. This is an essential tool for anyone aiming to boost their productivity.",
    imageUrl: "/testimonials/garrat.png",
  },
  {
    name: "The 9th",
    role: "Web Developer",
    content:
      "The features you've been adding especially the status bar icon have been really great. One thing that gets me to use an app more is ${how frictionless the experience is} and quick access to access bar icon is one of those things that is a game-changer for that. Thanks again.",
    imageUrl: "/testimonials/the9th.jpg",
  },
  {
    name: "Elena Rodriguez",
    role: "Project Manager",
    // company: "Asana",
    content:
      "I usually have to multitask and juggle lots of competing priorities at work, leading to overwhelm and reduced productivity. Focusmo has helped me ${focus on one task at a time}, really helping me get my work done ${more efficiently}.",
  },

  {
    name: "Marcus Chen",
    role: "Lead Developer",
    // company: "Shopify",
    content:
      "I've always struggled with prioritizing and actually getting tasks done. I will admit this week, I have been ${the most productive} that I have probably been in the last couple of months. Because this tool has helped me to ${focus on one task at a time}.",
  },
  {
    name: "Aiden Thompson",
    role: "Software Engineer",
    // company: "Notion",
    content:
      "I've been using Focusmo everyday now. The ${blue waves in banner} really helps me visualize time especially when I am time blind, really helps the ADHD brain. I have it ${always visible} so I get reminded constantly of my current task.",
  },
  {
    name: "Sophia Patel",
    role: "Marketing Director",
    // company: "Buffer",
    content:
      "Y'all need to try this thing called Focusmo. It's ${crazy how simple} it is but ${how much it helps me focus}.",
  },

  {
    name: "Wei Zhang",
    role: "UX Designer",
    // company: "Canva",
    content:
      "Using Focusmo I've been ${getting more productivity} than I ever had been. Also managed to edit more designs in a single day than I ever had been able to as well.",
  },
  {
    name: "Frank Mattes",
    role: "Thought Leader and Author",
    content:
      "Focusmo is my ${go-to tool} for staying focused ;-). When I need to dive into ${deep work} like research, brainstorming, or creative tasks, I start by making a simple commitment to myself: 'I'll dedicate an hour to this.' Then, I follow a straightforward routine: ${block time} for deep work, ${activate Focusmo}, and ${fully immerse} myself in the task.",
    imageUrl: "/testimonials/franc.png",
  },
  {
    name: "Misha Ivanov",
    role: "Product Manager",
    // company: "Monday.com",
    content:
      "It's crazy how well the tool fits into my workflow. I used to use a real timer on my desk with sticky notes for every task… I've ${completely replaced it}. Anyone who wants to be the get the most of out their day, I ${definitely recommend Focusmo}!",
  },
  {
    name: "David Kim",
    role: "Technical Lead",
    // company: "Atlassian",
    content:
      "I can't believe ${how much more productive} I am with Focusmo. It's so simple and easy to use, and the ${floating timer really helps}!",
  },
  // {
  //   name: "Amara Okafor",
  //   role: "Product Manager",
  //   // company: "Linear",
  //   content:
  //     "Focusmo has been a ${game changer} for me. I've been able to focus on one task at a time and ${get more done} than I ever have before.",
  //   imageUrl:
  //     "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=faces",
  // },
];

function TestimonialSection({ testimonials = basicTestimonials }) {
  const columnRefs = [useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      let minHeight = Infinity;
      let minColumn = 0;

      columnRefs.forEach((ref, index) => {
        if (ref.current && ref.current.offsetHeight < minHeight) {
          minHeight = ref.current.offsetHeight;
          minColumn = index;
        }
      });

      testimonials.forEach((_, index) => {
        const column = index % 3;
        if (column !== minColumn) {
          const element = document.getElementById(`testimonial-${index}`);
          if (element) {
            element.style.breakInside = "avoid";
            element.style.pageBreakInside = "avoid";
          }
        }
      });
    });

    columnRefs.forEach((ref) => {
      if (ref.current) {
        resizeObserver.observe(ref.current);
      }
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section id="reviews" className="  px-2 md:px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center mb-6 flex-col">
          <SectionHeading
            title="People ❤️ Focusmo"
            headingSize="h3"
            containerClassName="!mb-2"
          />
          <TestimonialHero />
        </div>
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              id={`testimonial-${index}`}
              ref={columnRefs[index % 3]}
              className="mb-6 break-inside-avoid"
            >
              <TestimonialCard {...testimonial} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
