import React from "react";
import { Check, X } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
/**
 * Component for comparing Focusmo features with alternatives
 * @param {Object} props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Optional subtitle
 * @param {Array} props.features - List of features to compare
 * @param {Array} props.competitors - List of competitors to compare against
 */
const FeatureComparison = ({
  title = "How We Compare",
  subtitle = "See why our solution stands out",
  features = [],
  competitors = [],
}) => {
  if (!features.length || !competitors.length) return null;

  return (
    <section className="mt-20">
      <SectionHeading title={title} description={subtitle} headingSize="h3" />

      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          {/* Table header */}
          <thead>
            <tr>
              <th className="text-left p-4 bg-primary/5 rounded-tl-lg">
                Features
              </th>
              <th className="text-center p-4 bg-primary/10 font-bold text-primary">
                Focusmo
              </th>
              {competitors.map((competitor, index) => (
                <th
                  key={index}
                  className={`text-center p-4 bg-gray-100 ${
                    index === competitors.length - 1 ? "rounded-tr-lg" : ""
                  }`}
                >
                  {competitor.name}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {features.map((feature, featureIndex) => (
              <tr
                key={featureIndex}
                className={`border-b border-gray-200 ${
                  featureIndex === features.length - 1 ? "border-b-0" : ""
                }`}
              >
                <td className="p-4 bg-primary/5 font-medium">
                  {feature.name}
                  {feature.description && (
                    <p className="text-sm text-gray-500 mt-1">
                      {feature.description}
                    </p>
                  )}
                </td>
                <td className="p-4 text-center bg-primary/10">
                  {renderFeatureSupport(feature.focusMode)}
                </td>
                {competitors.map((competitor, competitorIndex) => (
                  <td
                    key={competitorIndex}
                    className="p-4 text-center bg-gray-100"
                  >
                    {renderFeatureSupport(feature[competitor.id])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {/* Table footer */}
          <tfoot>
            <tr>
              <td className="p-4 bg-primary/5 rounded-bl-lg font-bold">
                Overall
              </td>
              <td className="p-4 bg-primary/10 text-center font-bold text-primary">
                Best Choice
              </td>
              {competitors.map((competitor, index) => (
                <td
                  key={index}
                  className={`p-4 bg-gray-100 text-center ${
                    index === competitors.length - 1 ? "rounded-br-lg" : ""
                  }`}
                >
                  {competitor.summary}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
};

/**
 * Helper function to render feature support indicators
 */
const renderFeatureSupport = (support) => {
  if (support === true) {
    return <Check className="h-5 w-5 text-green-500 mx-auto" />;
  } else if (support === false) {
    return <X className="h-5 w-5 text-red-500 mx-auto" />;
  } else if (typeof support === "string") {
    return <span className="text-sm">{support}</span>;
  } else {
    return <span className="text-gray-400">-</span>;
  }
};

export default FeatureComparison;
