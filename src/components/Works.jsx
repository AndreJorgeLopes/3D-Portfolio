import React, { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects, technologies } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const TechBallsCanvas = dynamic(() => import("./canvas/TechBalls"), {
  ssr: false,
});

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  innerRef,
  minHeight,
}) => {
  return (
    <motion.div
      ref={innerRef}
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      style={{ minHeight: minHeight || undefined }}
      className="h-full"
    >
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl w-full h-full flex flex-col"
      >
        <div className="relative w-full h-[230px]">
          <img
            src={image.src}
            alt={name}
            className="w-full h-full object-cover rounded-2xl"
          />

          <div className="absolute  gap-1 inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={() => window.open(source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github.src}
                alt="github"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-5 flex-1">
          <h3 className="text-white font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <p key={tag.name} className={`text-[14px] ${tag.color}`}>
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
    </motion.div>
  );
};

const Works = () => {
  // Equal-height across all cards: measure tallest card and set as minHeight
  const cardRefs = useRef([]);
  const gridRef = useRef(null);
  const [maxCardHeight, setMaxCardHeight] = useState(0);

  const measureHeights = useCallback(() => {
    const nodes = cardRefs.current.filter(Boolean);
    if (!nodes.length) {
      setMaxCardHeight(0);
      return;
    }

    // Determine current grid column count from computed styles
    let cols = 1;
    if (gridRef.current) {
      try {
        const cs = window.getComputedStyle(gridRef.current);
        const tpl = cs.getPropertyValue("grid-template-columns");
        cols = tpl ? tpl.split(" ").length : 1;
      } catch {
        cols = 1;
      }
    }

    // In single-column mode, allow natural heights (no equalization)
    if (cols <= 1) {
      setMaxCardHeight(0);
      return;
    }

    const heights = nodes.map((el) => el.offsetHeight);
    const max = Math.max(...heights);
    setMaxCardHeight(max);
  }, []);

  useEffect(() => {
    measureHeights();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => measureHeights());
      cardRefs.current.forEach((el) => el && ro.observe(el));
      if (gridRef.current) ro.observe(gridRef.current);
      window.addEventListener("resize", measureHeights);
      return () => {
        ro.disconnect();
        window.removeEventListener("resize", measureHeights);
      };
    } else {
      window.addEventListener("resize", measureHeights);
      return () => window.removeEventListener("resize", measureHeights);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length, measureHeights]);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Tech toolkit</p>
        <h2 className={styles.sectionHeadText}>Stack Highlights.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        These are the tools and technologies I work with every day. The rotating
        spheres reflects the frameworks and platforms I rely on to turn ideas
        into polished, performant and engaging experiences.
      </motion.p>

      <motion.div variants={fadeIn("", "", 0.15, 1)} className="mt-10 w-full">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-tertiary/20 p-4 sm:p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur-sm">
          <TechBallsCanvas technologies={technologies} height={360} />
        </div>
      </motion.div>

      <motion.div variants={textVariant()} className="mt-24">
        <p className={styles.sectionSubText}>My work</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.25, 1)}
        className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I possess a diverse portfolio of projects that demonstrate my skills and
        experience in solving real-world problems. Each project is succinctly
        described and includes links to code repositories. These examples
        showcase my ability to handle complex challenges, work with different
        technologies, and effectively manage projects.
      </motion.p>

      {/* Responsive auto-fit grid:
          - Uses minmax(280px,1fr) so cards wrap once they'd shrink below ~280px
          - Ensures no 3/1 orphan layout (auto-fit balances rows)
          - Falls back to 4 columns explicitly at xl when enough width for uniform wide cards
      */}
      <div
        ref={gridRef}
        className="mt-16 w-full grid gap-7 items-stretch grid-cols-[repeat(auto-fit,minmax(280px,1fr))]"
      >
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            innerRef={(el) => (cardRefs.current[index] = el)}
            minHeight={maxCardHeight > 0 ? maxCardHeight : undefined}
            {...project}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "projects");
