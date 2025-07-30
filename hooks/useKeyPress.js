import { useEffect } from "react";

export default function useKeyPress({
  ref,
  id,
  onSubmit,
  submitCondition = true,
}) {
  if ((!ref && !id) || typeof onSubmit !== "function") {
    console.warn(
      "useKeyPress: Either ref or id and onSubmit function are required parameters",
    );
    return;
  }

  const handleKeypress = (e) => {
    if (e.key === "Enter" && submitCondition) {
      onSubmit(e);
    }
  };

  useEffect(() => {
    const element = ref?.current || (id && document.getElementById(id));
    if (element) {
      element.addEventListener("keydown", handleKeypress);
    } else {
      console.warn(
        `useKeyPress: No element found with ${ref ? "ref" : `id "${id}"`}`,
      );
    }

    return () => {
      if (element) {
        element.removeEventListener("keydown", handleKeypress);
      }
    };
  }, [ref, id, submitCondition]); // Add dependencies to re-run the effect if ref, id, or submitCondition changes
}
