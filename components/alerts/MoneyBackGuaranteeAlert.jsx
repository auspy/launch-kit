"use client";

import * as React from "react";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Handshake, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { trackButtonClick, ButtonActions, Locations } from "@/lib/tracking";
import ButtonMainCTAClient from "@/components/buttons/ButtonMainCTA.client";

function MoneyBackGuaranteeAlert({
  icon = null,
  trigger,
  title = "",
  description = "",
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br from-white to-blue-50">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-full">
              {icon || <Shield className="h-5 w-5 text-blue-600" />}
            </div>
            <AlertDialogTitle className="text-2xl font-bold text-gray-900">
              {title || "30-Day Money-Back Guarantee"}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base text-gray-600">
            {description ||
              "Try Focusmo risk-free. If for some reason you're not completely happy with the purchase, simply"}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction className="bg-blue-600 hover:bg-blue-700 mt-4">
            Got it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function MoneyBackGuaranteeAlertLink({
  text = "30-day money-back guarantee",
}) {
  return (
    <MoneyBackGuaranteeAlert
      trigger={
        <Button
          className="text-blue-600 w-fit text-sm font-semibold p-0 h-fit"
          variant="link"
          onClick={() =>
            trackButtonClick(
              "money_back_guarantee_trigger",
              ButtonActions.OPEN_MODAL,
              {
                location: Locations.CTA_SECTION,
                context: "money_back_guarantee",
              }
            )
          }
        >
          {text} <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      }
      description={
        <>
          Try Focusmo risk-free. If for some reason you're not completely happy
          with the purchase, simply{" "}
          <Link
            href="/contact"
            className="text-blue-600 text-base hover:text-blue-700 font-medium underline decoration-blue-300 decoration-2 underline-offset-2"
            onClick={() =>
              trackButtonClick("contact_link", ButtonActions.CONTACT, {
                location: Locations.MODAL,
                context: "money_back_guarantee",
              })
            }
          >
            let us know.
          </Link>{" "}
        </>
      }
    />
  );
}

export function FreeForeverLink({
  text = "It's free. No credit card required.",
}) {
  return (
    <MoneyBackGuaranteeAlert
      icon=<Handshake className="h-5 w-5 text-blue-600" />
      trigger={
        <Button
          className="text-blue-600 w-fit text-sm font-semibold p-0 h-fit"
          variant="link"
          onClick={() =>
            trackButtonClick("free_forever_trigger", ButtonActions.OPEN_MODAL, {
              location: Locations.CTA_SECTION,
              context: "free_forever",
            })
          }
        >
          {text} <ArrowRight className="w-3 h-3 ml-2" />
        </Button>
      }
      title="The Focusmo Promise"
      description={
        <div>
          Focusmo is built for minds like mine, the ones who open their laptop
          to do one thing and close it three hours later having done fifteen
          other things instead.
          <br />
          <br />
          Our easily distracted minds deserve tools that actually help.
          <br />
          <br />
          <strong>
            To achieve this, the core of our product is and will remain free.
          </strong>
          <br />
          <br />
          <Link
            href="/promise#how-focusmo-stays-sustainable"
            className="text-blue-600 text-base hover:text-blue-700 font-medium underline decoration-blue-300 decoration-2 underline-offset-2"
            onClick={() =>
              trackButtonClick("promise_page", ButtonActions.NAVIGATE, {
                location: Locations.PROMISE_ALERT,
                context: "sustainable",
              })
            }
          >
            <div className="flex items-center">
              How do we stay sustainable?{" "}
              <ArrowRight className="w-3 h-3 ml-2" />
            </div>
          </Link>{" "}
        </div>
      }
    />
  );
}
