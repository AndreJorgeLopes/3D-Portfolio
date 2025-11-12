import React from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

import { styles } from "../styles";
import AnimatedWord from "./AnimatedWord";

const ComputersCanvas = dynamic(
  () => import("../components/canvas/Computers"),
  { ssr: false }
);

const Hero = () => {
  return (
    <section className="relative w-full min-h-[100svh] mx-auto">
      {/* Computer canvas - middle z-index, no pointer events to prevent flickering */}
      <div className="absolute inset-0 z-10">
        <ComputersCanvas />
      </div>

      <div
        className={`${styles.paddingX} absolute inset-x-0 top-[11vh] sm:top-[13vh] lg:top-[15vh] z-20 max-w-7xl mx-auto flex flex-row items-start gap-5 pointer-events-auto`}
      >
        <div className="flex flex-col items-center justify-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915eff]" />
          <div className="w-1 h-40 sm:h-80 violet-gradient" />
        </div>

        <div>
          <h1
            className={`${styles.heroHeadText} flex flex-nowrap items-baseline gap-1 sm:gap-2`}
          >
            <AnimatedWord word="Howdy" color="#915eff" baseDelay={0.05} />
            <span className="inline-block underline decoration-[1.5px] underline-offset-6">
              Stranger
            </span>
            <span className="inline-block">,</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            My name's{" "}
            <AnimatedWord word="André" color="#915eff" baseDelay={0.15} /> and
            I'm a Full-stack Developer,
            <br className="hidden sm:block" />
            currently looking for a role in{" "}
            <AnimatedWord
              word="Amsterdam"
              color="#915eff"
              baseDelay={0.25}
            />, <AnimatedWord word="Lisbon" color="#915eff" baseDelay={0.35} />{" "}
            or <AnimatedWord word="Fully" color="#915eff" baseDelay={0.45} />
            <AnimatedWord word="remote" color="#915eff" baseDelay={0.45} />.
          </p>
        </div>
      </div>

      {/* Scroll indicator - highest z-index */}
      <div className="absolute flex items-center justify-center w-full bottom-[5vh] z-20">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 mb-1 rounded-full bg-secondary"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;
