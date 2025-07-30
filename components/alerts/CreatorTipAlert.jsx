"use client";

import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

function CreatorTipAlert({ trigger, tipContent, tipTitle = "Creator's Tip" }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br from-white to-amber-50">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-100 rounded-full">
              <Lightbulb className="h-5 w-5 text-amber-600" />
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              {tipTitle}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-gray-600">
            {tipContent}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-amber-600 hover:bg-amber-700 mt-4">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function CreatorTipLink({
  text = "Creator's request",
  tipContent,
  tipTitle,
}) {
  return (
    <CreatorTipAlert
      tipContent={tipContent}
      tipTitle={tipTitle}
      trigger={
        <Button
          className="text-amber-600 w-fit text-sm font-semibold p-0 h-fit inline-flex items-center"
          variant="link"
        >
          👋 {text} <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      }
    />
  );
}
