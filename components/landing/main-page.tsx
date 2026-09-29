import { Hero } from "./hero";
import ReplyRateSection from "./reply-rate";
import ReviewEngineSection from "./work-engine";
import PricingSection from "./pricing";
import FAQSection from "./faq";
import { SiteFooter } from "@/features/marketing";

export function MainPage() {
  return (
    <div className="w-full space-y-12 pt-20 md:space-y-16 md:pt-24 lg:space-y-24 lg:pt-28">
      <Hero />
      <ReplyRateSection />
      <ReviewEngineSection />
      <PricingSection />
      <FAQSection />
      <SiteFooter />
    </div>
  );
}
