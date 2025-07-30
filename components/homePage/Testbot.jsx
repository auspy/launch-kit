"use client";
import { isDev } from "@/constants";
import getYtId from "@/lib/getYtId";
import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { useState } from "react";
import { NewAIScreen, YoutubePlayer } from "vizolv";
import { toast } from "react-toastify";

export default function Testbot({ url }) {
  const [videoId, setVideoId] = useState("3qHkcs3kG44");
  const [error, setError] = useState(null);
  // console.log("new video id", videoId);
  // NewAIScreen States
  const [generating, setGenerating] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputDisabled, setInputDisabled] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [followups, setFollowups] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const { userId } = useAuth();
  // console.log("userId", userId);
  const store = {
    userId,
  };
  // To get the video id from the url
  useEffect(() => {
    if (url) {
      const id = getYtId(url);
      if (!id) {
        return;
      }
      setVideoId(id);
      localStorage.setItem("videoId", id);
    }
  }, [url]);
  // To get the video id from local storage
  useEffect(() => {
    const id = localStorage.getItem("videoId");
    // console.log("id", id);
    if (id && id.length == 11) {
      setVideoId(id);
    }
  }, []);
  // For toast
  useEffect(() => {
    if (error) {
      console.log("error in chatbot", error);
      if (error === "no_thread_id") {
        toast.error(
          "Login to continue! If you are already logged in, please wait for chat to load or refresh the page.",
        );
      } else {
        toast.error(error);
      }
      setError(null);
    }
  }, [error]);
  return (
    <>
      <div
        style={{
          backgroundImage: "url('testbotbg.png')",
        }}
        className="hero lg:w-2/3 md:max-w-[1000px] lg:px-6 w-screen contain py-6  md:rounded-[10px]"
      >
        <div className="bg-white  flex flex-wrap lg:flex-nowrap items-center p-4 rounded-[10px] gap-6 border border-slate-100">
          <div className="min-h-1 w-full h-full min-w-1">
            <YoutubePlayer
              autoplay={isDev ? false : true}
              videoId={videoId}
              timestamps={timestamps}
            />
          </div>
          {/* youtube player with video id */}
          <div className="bg-slate-50 border border-slate-100 rounded-[10px] w-full lg:max-w-[45%] h-[400px]">
            <NewAIScreen
              setError={setError}
              storeData={store}
              searchIds={{
                ytVidId: videoId,
              }}
              userInput={userInput}
              setUserInput={setUserInput}
              messages={messages}
              setMessages={setMessages}
              inputDisabled={inputDisabled}
              setInputDisabled={setInputDisabled}
              threadId={threadId}
              // showTimestamps={true}
              showClear={true}
              allowChatClearOnVidChange={true}
              setThreadId={setThreadId}
              // showVideoTitle={true}
              followups={followups}
              setFollowups={setFollowups}
              timestamps={timestamps}
              setTimestamps={setTimestamps}
              generating={generating}
              setGenerating={setGenerating}
            />
          </div>
        </div>
      </div>
    </>
  );
}
