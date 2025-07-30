import Image from "next/image";
import { Star } from "lucide-react";

export default function Testimonial({
  images = ["ishan.png", "abel.png", "franc.png", "will.png"],
}) {
  return (
    <div className="flex items-center gap-4 rounded-lg py-4">
      <div className="flex -space-x-4">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-white"
          >
            <Image
              src={`/testimonials/${image}`}
              alt="User avatar"
              className="object-cover"
              fill
              sizes="40px"
            />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((index) => (
            <Star key={index} className="h-3 w-3 fill-accent text-accent" />
          ))}
        </div>
        <p className="text-sm font-medium text-gray-500">
          600+ ppl now stay focused
        </p>
      </div>
    </div>
  );
}
