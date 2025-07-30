import React from "react";
import ReactMarkdown from "react-markdown";

const ChangelogEntry = ({ version, content }) => {
  return (
    <div className="mb-12 border-b pb-8 last:border-b-0">
      <h2 className="text-2xl font-bold mb-6" id={`version-${version}`}>
        Focusmo {version}
      </h2>
      <div className="prose max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ChangelogEntry;
