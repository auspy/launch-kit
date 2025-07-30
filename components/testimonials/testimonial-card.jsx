import Image from "next/image";

export function TestimonialCard({ name, role, company, content, imageUrl }) {
  // Function to highlight specific phrases in text
  const highlightText = (text) => {
    // Split content by phrases we want to highlight
    const parts = text.split(/(\$\{.*?\})/);
    return parts.map((part, index) => {
      if (part.startsWith("${") && part.endsWith("}")) {
        // Remove the ${} markers and highlight the text
        const highlightedText = part.slice(2, -1);
        return (
          <span
            key={index}
            className="bg-blue-500/20 text-primary font-medium px-1 rounded"
          >
            {highlightedText}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="relative rounded-xl p-[1px]">
      <div className="bg-white rounded-xl border border-gray-200 p-6 break-inside-avoid shadow-sm">
        <p className="text-gray-800 text-lg leading-relaxed mb-6">
          {highlightText(content)}
        </p>

        <div className="h-px w-full bg-gray-200 my-4"></div>
        <div className="flex items-center">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={name}
              width={40}
              height={40}
              className="rounded-full mr-3"
            />
          )}
          {/* add hr line */}
          <div>
            <p className="font-medium text-gray-800">{name}</p>
            {(role || company) && (
              <p className="text-sm text-gray-600">
                {role}
                {company && role ? " at " : ""}
                {company}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
