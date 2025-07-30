"use client";
import serviceVideoStatus from "@/lib/api/videoService";
import Testbot from "./Testbot";
import { useState } from "react";
import { zodCheckYtUrlSchema } from "@/lib/zod/zodCheckYtUrlSchema";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../LoadingSpinner";

export default function SignUpForm() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const { userId } = useAuth();
  const [currentToast, setToast] = useState();
  const [loading, setLoading] = useState(false);
  // const [statusId, setStatusId] = useState(0); // 0 = video_not_found, 1 = processing, 2 = video_exists, 3 = error
  const handleStatus = (status, msg, newUrl, title = "") => {
    if (status === "video_exists") {
      // show the video
      toast.dismiss("processing");
      setToast({
        type: "success",
        message:
          msg || "Your video is ready! You can start asking questions now.",
        toastId: "video_exists" + title,
        // autoClose: false,
      });
      // console.log("setting url", newUrl);
      setUrl(newUrl);
    } else if (status === "processing") {
      // show the video is being processe
      setToast({
        type: "info",
        message:
          msg ||
          "Your video is being processed. This typically takes about 15 seconds, but it might take a upto few mins during high traffic. Meanwhile search for more videos to process.",
        toastId: "processing" + title,
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: false,
        draggable: false,
        icon: <LoadingSpinner />,
        closeButton: false,
      });
    } else if (status === "video_not_found") {
      // show error
      setToast({
        type: "info",
        message:
          msg ||
          "Wooow, this is a new video for us. Please give us a few seconds to get it ready for you.",
        toastId: "video_not_found" + title,
      });
    } else {
      // show error
      toast.dismiss("processing");
      setToast({
        type: "error",
        message:
          msg ||
          "Video processing failed! Check if captions exist and if video url is correct",
        toastId: "video_process_error" + title,
        // autoClose: false,
      });
    }
    setLoading(false);
  };
  const handleVideoUrl = async (e) => {
    e.preventDefault();
    setToast();
    if (!userId) {
      setToast({
        type: "error",
        message: "Login to continue!",
        toastId: "login_error",
      });
      return;
    }
    setLoading(true);

    const newUrl = e.target.elements[0].value;
    // console.log("newUrl", newUrl);
    // check url
    let verifiedUrl = zodCheckYtUrlSchema
      .refine((str) => {
        if (str === input) {
          return;
        }
        return str;
      }, "Video is already being processed")
      .safeParse(newUrl);
    // console.log("verifiedUrl", verifiedUrl);
    if (!verifiedUrl.success) {
      setToast({
        type: "error",
        message: verifiedUrl.error.issues[0].message,
        toastId: "url_error",
      });
      setLoading(false);
      return;
    }

    verifiedUrl = verifiedUrl.data;
    setInput(verifiedUrl);
    // send the url to the server
    let status = "";
    let count = 0;
    let timeout = 5000;
    while (status !== "video_exists" && status !== "error" && count < 24) {
      count += 1;
      const res = await serviceVideoStatus({ videoId: verifiedUrl });
      status = res?.status;
      const message = res?.message;
      const title = res?.title;
      console.log("status", status, message);
      // show status of the video to user
      handleStatus(status, message, newUrl, title);
      // wait for few seconds
      await new Promise((resolve) => setTimeout(resolve, timeout));
    }
  };
  // handle toast
  useEffect(() => {
    if (currentToast && currentToast.message) {
      const { message, type, ...rest } = currentToast;
      const options = {
        ...rest,
      };
      toast[currentToast.type || "info"](currentToast.message, options);
    }
  }, [currentToast]);
  return (
    <>
      <div className="contain flex flex-col gap-1 pb-15 w-full lg:w-fit  ">
        <p className="text-xs opacity-60">
          For now, this works only for YT videos with <b>captions</b>. So, pls
          make sure your video has captions.
        </p>
        <form className="flex flex-row gap-1  " onSubmit={handleVideoUrl}>
          <input
            className="border border-zinc-800 px-4 py-2 rounded-[10px] w-full  lg:w-[500px]"
            type="text"
            defaultValue={input}
            placeholder="https://www.youtube.com/watch?v=xxxxxx"
          />
          <button
            disabled={loading}
            type="submit"
            className="disabled:opacity-60 hover:opacity-90 transition-opacity  bg-zinc-800 border border-zinc-800 text-white px-4 py-2 rounded-[10px]"
          >
            {loading ? "Loading" : "Submit"}
          </button>
        </form>
        <p className="opacity-60 text-xs">
          {"Example Input: https://www.youtube.com/watch?v=xxxxxx"}
        </p>
      </div>
      <Testbot url={url} />
    </>
  );
}
