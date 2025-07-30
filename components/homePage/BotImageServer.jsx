import Image from "next/image";

export function BotImageServer() {
  return (
    <Image
      src={"/botWhite.png"}
      alt="bot example"
      className="max-h-[245px] object-cover object-top md:max-h-full"
      height={756}
      width={440}
    />
  );
}
export function BotImageServerDark() {
  return (
    <Image
      src={"/botDark.png"}
      alt="bot example"
      className=""
      height={756}
      width={440}
    />
  );
}
