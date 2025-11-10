import React from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";

const TechTag = ({ color, children, duration = 3 }) => (
  <motion.span
    className="font-semibold underline underline-offset-4 decoration-2"
    style={{ color, textDecorationColor: color }}
    animate={{ y: [0, -2, 0] }}
    transition={{
      duration,
      repeat: Infinity,
      repeatType: "loop",
      ease: "easeInOut",
    }}
    whileHover={{ scale: 1.05 }}
  >
    {children}
  </motion.span>
);

const ServiceCard = ({ index, title, icon, ...rest }) => (
  <Tilt
    className="w-full"
    options={{
      max: 45,
      scale: 1,
      speed: 450,
    }}
  >
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col">
        <img
          src={icon.src}
          alt="web-development"
          className="w-16 h-16 object-contain"
        />

        <h3 className="text-white text-[20px] font-bold text-center max-h-14 w-52">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a skilled software developer with experience in{" "}
        <TechTag color="#3178C6" duration={2.6}>
          TypeScript
        </TechTag>{" "}
        and{" "}
        <TechTag color="#F7DF1E" duration={2.9}>
          JavaScript
        </TechTag>
        , and expertise in frameworks like{" "}
        <TechTag color="#61DAFB" duration={3.2}>
          React
        </TechTag>
        ,{" "}
        <TechTag color="#68A063" duration={3.5}>
          Node.js
        </TechTag>
        , and more. I'm a quick learner and collaborate closely with clients to
        create efficient, scalable, and user-friendly solutions that solve
        real-world problems. Let's work together to bring your ideas to life!
      </motion.p>

      <div className="mt-20 grid gap-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 justify-items-center xl:justify-items-start">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
