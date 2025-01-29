import { FaceRecognitionSystemSection, Features, Footer, Hero, HowItWorksSection, LaboratoriesSection, NavbarHome, ProgramStudiSection } from "./shared/components";


export default function Home() {
  return (
    <>
      <NavbarHome />
      <main>
        <Hero />
        <div className="bg-gray-50 text-gray-900">
          <div className="container mx-auto px-8 py-12 space-y-12">
            <ProgramStudiSection />
            <LaboratoriesSection />
            <FaceRecognitionSystemSection />
            <HowItWorksSection />
          </div>
        </div>
        <Features />
      </main>
      <Footer />
    </>
  );
}
