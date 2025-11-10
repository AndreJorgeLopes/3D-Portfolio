import React from "react";
import {
  web,
  backend,
  mobile,
  design,
  javascript,
  typescript,
  html,
  css,
  reactjs,
  nextjs,
  jest,
  playwrite,
  redux,
  tailwind,
  nodejs,
  mongodb,
  git,
  jungleai,
  sixt,
  tyson,
  freelance,
  marvelCharacter,
  motohub,
  skyquest,
} from "../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "projects",
    title: "Projects",
  },
  {
    id: "contributions",
    title: "Contributions",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Frontend Developer",
    icon: web,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "React Native Developer",
    icon: mobile,
  },
  {
    title: "Certified Ctrl+Z Specialist",
    icon: design,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "Next JS",
    icon: nextjs,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "git",
    icon: git,
  },
  {
    name: "Jest",
    icon: jest,
  },
  {
    name: "Playwrite",
    icon: playwrite,
  },
];

const tokenMap = {
  React: "#61DAFB",
  "React.js": "#61DAFB",
  "React JS": "#61DAFB",
  "React Native": "#61DAFB",
  TypeScript: "#3178C6",
  JavaScript: "#F7DF1E",
  "Node.js": "#68A063",
  "Next.js": "#FFF",
  tRPC: "#2596BE",
  Prisma: "#2D3748",
  Jest: "#C21325",
  "React Testing Library": "#E33332",
  Cypress: "#69D3A7",
  ESLint: "#4B32C3",
  Prettier: "#F7B93E",
  Redux: "#764ABC",
  "Redux Toolkit": "#764ABC",
  "React Query": "#FF4154",
  "Material-UI": "#007FFF",
  "Material UI": "#007FFF",
  "CSS-IN-JS": "#FF7F50",
  "styled-components": "#DB7093",
  "Tailwind CSS": "#38BDF8",
  Zustand: "#A16207",
  Drizzle: "#00E599",
  TypeORM: "#FF3C00",
  Sequelize: "#52B0E7",
  Storybook: "#FF4785",
  GraphQL: "#E10098",
  PostgreSQL: "#336791",
  PosteSQL: "#336791",
  AWS: "#FF9900",
  GCP: "#4285F4",
  Linux: "#FCC624",
  UNIX: "#DAA520",
  "CI/CD": "#F05032",
  GitFlow: "#F05032",
  "Trunk based development": "#F05032",
  Waterfall: "#00B3E6",
  Agile: "#00B3E6",
  Scrum: "#6DB33F",
  "Chakra UI": "#319795",
  "Gatsby.js": "#663399",
  Drupal: "#0678BE",
  "Content CMS": "#915eff",
  AEM: "#FA0F00",
  "Server Side UI Generation": "#FFFFFF",
  "Vue.js": "#41B883",
  FastAPI: "#009688",
  Python: "#3776AB",
  Docker: "#2496ED",
  MongoDB: "#47A248",
  Git: "#F05032",
};

const experiences = [
  {
    title: "Independent Developer: Recovery & Open Source",
    company_name: "Personal Chapter",
    icon: design,
    iconBg: "#1a1a1a",
    date: "2024 - Present",
    points: [
      "After wrapping up my last role, life threw a curveball... A <span class='font-semibold underline'>serious motorcycle crash</span>. That meant a long hospital stay, <span class='font-semibold underline'>multiple surgeries</span>, and a recovery process that became its own full-time job. <span class='opacity-80'>(10/10 would not recommend as a career coach)</span>.",
      "While I was immobile, I invested the time in my craft: reading, building, and shipping code. I deepened my skills in React and Node.js, stayed up to date with the frontend/full-stack ecosystem, and kept momentum with <span class='font-semibold underline'>open‑source</span> on GitHub and remote freelance work.",
      "I'm currently finishing a full-stack rebuild for three Portuguese companies: <span class='font-semibold underline'>Spotless Home</span>, <span class='font-semibold underline'>Oficina do Condomínio</span>, and <span class='font-semibold underline'>Select and Style</span>.",
      "This chapter gave me clarity: I want to contribute to a company whose values I believe in and where my work creates <span class='font-semibold underline'>tangible value</span>. I'm back with <span class='font-semibold underline'>focus and grit</span>! Treating my career like the priority it deserves.",
    ],
  },
  {
    title: "Senior Software Engineer",
    company_name: "SIXT",
    icon: sixt,
    iconBg: "#1a1a1a",
    date: "Aug 2023 - Jul 2024",
    points: [
      "Led development initiatives for SIXT's global car rental platform serving <span class='font-semibold underline'>2M+ monthly users</span>.",
      "Improved platform performance by <span class='font-semibold underline'>40%</span> through code optimization and implementing lazy loading with Node.js and Next.js.",
      "Reduced planning cycle by at least <span class='font-semibold underline'>25%</span> through UX improvements.",
      "Migrated from legacy codebase to modern React/TypeScript stack.",
      "Mentored junior developers and established engineering best practices.",
      "Implemented automated testing strategy achieving <span class='font-semibold underline'>90%+</span> coverage with Jest and Cypress.",
      "Reduced bundle size by <span class='font-semibold underline'>35%</span> through Next.js code splitting and optimization.",
      "Collaborated with the UX team to implement responsive design patterns.",
    ],
  },
  {
    title: "Software Engineer: Digital Marketing",
    company_name: "Tyson Foods",
    icon: tyson,
    iconBg: "#fff",
    date: "Apr 2022 - Aug 2023",
    points: [
      "Developed solutions to meet business requirements for <span class='font-semibold underline'>Fortune 500</span> company's digital presence using React and Next.js.",
      "Participated in project development throughout the entire Software Development Lifecycle (SDLC).",
      "Studied user requirements and implemented solutions serving <span class='font-semibold underline'>3M+ monthly users</span> with Node.js.",
      "Investigated and resolved application issues for web-based programs.",
      "Maintained quality assurance through automated testing achieving <span class='font-semibold underline'>85%</span> coverage with Jest.",
      "Presented projects to the marketing department to promote web applications.",
      "Collaborated with global teams across multiple time zones.",
    ],
  },
  {
    title: "Software Engineer",
    company_name: "Jungle.ai",
    icon: jungleai,
    iconBg: "#ffcc0c",
    date: "Aug 2021 - Jan 2022",
    points: [
      "Contributed to scalable applications for <span class='font-semibold underline'>predictive maintenance</span> through <span class='font-semibold underline'>machine learning</span> solutions with Vue.js and FastAPI.",
      "Contributed to <span class='font-semibold underline'>data processing pipeline</span> improvements on AWS and PostgreSQL.",
      "Helped implement <span class='font-semibold underline'>permissions</span> and <span class='font-semibold underline'>monitoring dashboard</span> features.",
      "Participated in code reviews and documentation.",
      "Collaborated with senior developers on <span class='font-semibold underline'>system optimization</span>.",
    ],
  },
  {
    title: "Full stack Developer",
    company_name: "Freelance",
    icon: freelance,
    iconBg: "#28B2FE",
    date: "Jan 2018 - Dec 2021",
    points: [
      "Worked as a freelancer for local companies, mainly working on <span class='font-semibold underline'>full-stack</span> solutions (backend, frontend, and mobile) with PostgreSQL.",
      "Developed and maintained web applications using React.js and other related technologies, plus Node.js and MongoDB.",
      "Collaborated with <span class='font-semibold underline'>cross-functional teams</span> including designers, product managers, and other developers to create high-quality products.",
      "Implemented <span class='font-semibold underline'>responsive design</span> and ensuring cross-browser compatibility.",
    ],
  },
];

const projects = [
  {
    name: "SkyQuest",
    description:
      "AI-Powered SaaS platform that transforms the way people search for flights.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "mongodb",
        color: "green-text-gradient",
      },
      {
        name: "tailwind",
        color: "pink-text-gradient",
      },
    ],
    image: skyquest,
    source_code_link: "https://skyquest.dev/",
  },
  {
    name: "MotoHUB",
    description:
      "A comprehensive motorcycle marketplace that allows users to buy, sell, and explore motorcycles. Features include user authentication, listing management, and advanced search capabilities.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "restapi",
        color: "green-text-gradient",
      },
      {
        name: "scss",
        color: "pink-text-gradient",
      },
    ],
    image: motohub,
    source_code_link: "https://github.com/AndreJorgeLopes/MotoHUB-Frontend",
  },
  {
    name: "Marvel Universe Explorer",
    description:
      "An interactive web application that allows users to explore the vast Marvel universe. Select any Marvel character to discover their backstory, powers, and comic appearances. Filter by comics to dive deep into specific storylines.",
    tags: [
      {
        name: "react",
        color: "blue-text-gradient",
      },
      {
        name: "marvel api",
        color: "green-text-gradient",
      },
      {
        name: "css",
        color: "pink-text-gradient",
      },
    ],
    image: marvelCharacter,
    source_code_link:
      "https://github.com/AndreJorgeLopes/MarvelUniverseExplorer",
  },
];

export { services, technologies, experiences, projects, tokenMap };
