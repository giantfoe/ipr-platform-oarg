import { HeroSection } from "./_components/sections/HeroSection";
import { BriefIntroduction } from "./_components/sections/BriefIntroduction";
import { KeyFeatures } from "./_components/sections/KeyFeatures";
import { Benefits } from "./_components/sections/Benefits";
import { ProcessOverview } from "./_components/sections/ProcessOverview";
import { Testimonials } from "./_components/sections/Testimonials";
import { Resources } from "./_components/sections/Resources";
import { FAQ } from "./_components/sections/FAQ";
import { ContactSupport } from "./_components/sections/ContactSupport";
import { Footer } from "./_components/layout/Footer";

export default function Home() {
  return (
    <main className="flex flex-col space-y-16">
      <HeroSection />
      <BriefIntroduction />
      <KeyFeatures />
      <Benefits />
      <ProcessOverview />
      <Testimonials />
      <Resources />
      <FAQ />
      <ContactSupport />
      <Footer />
    </main>
  );
}