import MainCTA, { CTA_TYPES } from "@/components/homePage/MainCTA";
import ButtonMainCTA from "@/components/buttons/ButtonMainCTA";
import Logo from "./Logo";
import { Locations } from "@/lib/tracking";

function CTASection() {
  return (
    <>
      <section className="max-w-[90%] lg:max-w-7xl w-full  rounded-3xl mx-auto bg-primary py-24 px-4 border-t border-primary/20">
        <div className=" contain flex flex-col items-center mx-auto text-center space-y-6">
          <Logo size={100} onlyLogo={true} />
          <h2
            className="text-3xl md:text-5xl tracking-tight leading-[1.10] font-bold max-w-xl mx-auto text-white"
            style={{
              lineHeight: "1.2",
            }}
          >
            Take your productivity to the next level!
            {/* <br /> Stop Procrastinating.
          <br /> Be More Productive. */}
          </h2>
          <p className="text-lg text-white/80">
            Join with peace of mind. We have a 30 day money back guarantee.
          </p>
          <div className="flex flex-col items-center mb-10 justify-center">
            <ButtonMainCTA
              location={Locations.CTA_SECTION}
              type="large"
              mode="dark"
            />
          </div>
        </div>
      </section>
      <div className="flex flex-col px-4  py-24 w-screen items-center justify-center gap-2">
        <h2 className="text-2xl font-bold text-zinc-800">Not a Mac user?</h2>
        <p className="mb-4 text-zinc-800/80">
          We will bring Focusmo to Windows soon. <br />
          So join waitlist now.
        </p>
        <MainCTA type={CTA_TYPES.EMAIL_WAITLIST} />
      </div>
    </>
  );
}

export default CTASection;
