import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Terminal, Lightbulb } from "lucide-react";

export default function AlertMessage({
  title = "Heads up!",
  description,
  className = "wrapper my-10",
}) {
  return (
    <div className={className}>
      <Alert className="">
        <Lightbulb className="h-4 w-4 stroke-accent" />
        <AlertTitle className="">{title}</AlertTitle>
        <AlertDescription className="">{description}</AlertDescription>
      </Alert>
    </div>
  );
}
