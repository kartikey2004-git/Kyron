import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { CtaBand } from "./cta-band";
import { Hero } from "./sections/hero";
import { HowItWorks } from "./sections/how-it-works";
import { Features } from "./sections/features";
import { Benefits } from "./sections/benefits";
import { UseCases } from "./sections/use-cases";
import { Pricing } from "./sections/pricing";
import { Faq } from "./sections/faq";

export function MainPage() {
  return (
    <div>
      <SiteHeader />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <UseCases />
        <Benefits />
        <Pricing />
        <Faq />
        <CtaBand />
      </main>
      <SiteFooter />
    </div>
  );
}
