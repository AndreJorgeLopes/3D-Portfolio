import dynamic from "next/dynamic";
import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Tech,
  Works,
  GithubContributions,
} from "../components";

// Dynamically import 3D components with SSR disabled
const StarsCanvas = dynamic(() => import("../components/canvas/Stars"), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="bg-primary">
      <Navbar />

      {/* Hero section */}
      <div className="bg-hero-pattern bg-no-repeat bg-center bg-cover min-h-screen relative">
        <StarsCanvas />,
        <Hero />
      </div>

      {/* Main content section */}
      <div className="relative">
        <div className="absolute inset-0">
          <StarsCanvas variant="bottom" />
        </div>
        <About />
        <Experience />
        <Tech />
        <Works />
        <GithubContributions />
        <Contact />
      </div>
    </div>
  );
};

export default Home;
