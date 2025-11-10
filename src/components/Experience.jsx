import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import { motion } from "framer-motion";

import "react-vertical-timeline-component/style.min.css";

import { styles } from "../styles";
import { experiences, tokenMap } from "../constants";
import { SectionWrapper } from "../hoc";
import { textVariant } from "../utils/motion";
import AnimatedWord from "./AnimatedWord";

function isWordChar(ch) {
  return /[A-Za-z0-9]/.test(ch);
}

function renderPoint(text) {
  const entries = Object.keys(tokenMap).filter((tok) => !/\s/.test(tok));
  const out = [];
  let remaining = text;
  while (remaining.length) {
    let matchTok = null;
    let matchIdx = -1;
    for (const tok of entries) {
      const lower = remaining.toLowerCase();
      const t = tok.toLowerCase();
      let i = lower.indexOf(t);
      while (i !== -1) {
        const before = i > 0 ? remaining[i - 1] : "";
        const after =
          i + tok.length < remaining.length ? remaining[i + tok.length] : "";
        const leftOk = i === 0 || !isWordChar(before);
        const rightOk =
          i + tok.length === remaining.length || !isWordChar(after);
        if (leftOk && rightOk) {
          if (
            matchIdx === -1 ||
            i < matchIdx ||
            (i === matchIdx && tok.length > (matchTok?.length || 0))
          ) {
            matchIdx = i;
            matchTok = tok;
          }
          break;
        }
        i = lower.indexOf(t, i + 1);
      }
    }
    if (matchIdx === -1) {
      out.push(remaining);
      break;
    }
    if (matchIdx > 0) {
      out.push(remaining.slice(0, matchIdx));
    }
    const tokenText = remaining.slice(matchIdx, matchIdx + matchTok.length);
    out.push(
      <AnimatedWord
        key={`${tokenText}-${out.length}`}
        word={tokenText}
        color={tokenMap[matchTok]}
        baseDelay={0.06 + out.length * 0.01}
      />
    );
    remaining = remaining.slice(matchIdx + matchTok.length);
  }
  return out;
}

// Minimal HTML parser (SSR-safe) to preserve spans and highlight tokens in text nodes
function parseHtmlTree(html) {
  const root = { type: "root", children: [] };
  const stack = [root];
  const tagRe = /(<\/?[^>]+>)/g;
  let lastIndex = 0;
  let m;
  while ((m = tagRe.exec(html)) !== null) {
    const text = html.slice(lastIndex, m.index);
    if (text) {
      stack[stack.length - 1].children.push({ type: "text", text });
    }
    const tag = m[1];
    if (tag.startsWith("</")) {
      if (stack.length > 1) stack.pop();
    } else {
      const tagMatch = /^<\s*([a-zA-Z0-9]+)([^>]*)>$/s.exec(tag);
      if (!tagMatch) {
        stack[stack.length - 1].children.push({ type: "text", text: tag });
      } else {
        const tagName = tagMatch[1].toLowerCase();
        const attrStr = tagMatch[2] || "";
        const attrs = {};
        const classMatch = /class\s*=\s*['"]([^'"]*)['"]/i.exec(attrStr);
        if (classMatch) attrs.className = classMatch[1];
        const node = { type: "element", tagName, attrs, children: [] };
        stack[stack.length - 1].children.push(node);
        stack.push(node);
      }
    }
    lastIndex = tagRe.lastIndex;
  }
  const tail = html.slice(lastIndex);
  if (tail) {
    stack[stack.length - 1].children.push({ type: "text", text: tail });
  }
  return root.children;
}

function renderHtmlNodes(nodes, keyPrefix = "n") {
  const out = [];
  nodes.forEach((node, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (node.type === "text") {
      const parts = renderPoint(node.text);
      parts.forEach((p, i) => {
        if (typeof p === "string" && p.length === 0) return;
        out.push(
          typeof p === "string"
            ? p
            : React.cloneElement(p, { key: `${key}-t-${i}` })
        );
      });
    } else if (node.type === "element") {
      const children = renderHtmlNodes(node.children, key);
      out.push(
        React.createElement(node.tagName, { ...node.attrs, key }, ...children)
      );
    }
  });
  return out;
}

function renderRichPoint(html) {
  try {
    const tree = parseHtmlTree(html);
    return renderHtmlNodes(tree);
  } catch {
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  }
}

const ExperienceCard = ({ experience }) => {
  return (
    <VerticalTimelineElement
      contentStyle={{ background: "#1d1836", color: "#fff" }}
      contentArrowStyle={{ borderRight: "7px solid #1d1836" }}
      date={experience.date}
      iconStyle={{ background: experience.iconBg }}
      icon={
        <div className="flex justify-center items-center w-full h-full border-2 border-primary rounded-full">
          <img
            src={experience.icon.src}
            alt={experience.company_name}
            className="w-[60%] h-[60%] object-contain"
          />
        </div>
      }
    >
      <div>
        <h3 className="text-white text-[24px] font-bold">{experience.title}</h3>
        <p
          className="text-secondary text-[16px] font-semibold"
          style={{ margin: 0 }}
        >
          {experience.company_name}
        </p>
      </div>

      <ul className="mt-5 list-disc ml-5 space-y-2">
        {experience.points.map((point, index) => (
          <li
            key={`experience-point-${index}`}
            className="text-white-100 text-[14px] pl-1 tracking-wider"
          >
            {typeof point === "string"
              ? point.includes("<")
                ? renderRichPoint(point)
                : renderPoint(point)
              : point}
          </li>
        ))}
      </ul>
    </VerticalTimelineElement>
  );
};
const Experience = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I have done so far</p>
        <h2 className={styles.sectionHeadText}>Work Experience.</h2>
      </motion.div>

      <div className="mt-20 flex flex-col">
        <VerticalTimeline>
          {experiences.map((experience, index) => (
            <ExperienceCard key={index} experience={experience} />
          ))}
        </VerticalTimeline>
      </div>
    </>
  );
};

export default SectionWrapper(Experience, "work");
