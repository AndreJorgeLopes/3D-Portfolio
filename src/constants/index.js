import {
	mobile,
	backend,
	web,
	javascript,
	typescript,
	html,
	css,
	reactjs,
	redux,
	tailwind,
	nodejs,
	mongodb,
	git,
	jungleai,
	sixt,
	tyson,
	freelance,
	threejs,
	marvelCharacter,
	motohub,
	skyquest,
} from '../assets';

export const navLinks = [
	{
		id: 'about',
		title: 'About',
	},
	{
		id: 'work',
		title: 'Work',
	},
	{
		id: 'contact',
		title: 'Contact',
	},
];

const services = [
	{
		title: 'Frontend Developer',
		icon: web,
	},
	{
		title: 'React Native Developer',
		icon: mobile,
	},
	{
		title: 'Backend Developer',
		icon: backend,
	},
];

const technologies = [
	{
		name: 'HTML 5',
		icon: html,
	},
	{
		name: 'CSS 3',
		icon: css,
	},
	{
		name: 'JavaScript',
		icon: javascript,
	},
	{
		name: 'TypeScript',
		icon: typescript,
	},
	{
		name: 'React JS',
		icon: reactjs,
	},
	{
		name: 'Next JS',
		icon: nextjs,
	},
	{
		name: 'Redux Toolkit',
		icon: redux,
	},
	{
		name: 'Tailwind CSS',
		icon: tailwind,
	},
	{
		name: 'Node JS',
		icon: nodejs,
	},
	{
		name: 'MongoDB',
		icon: mongodb,
	},
	{
		name: 'Three JS',
		icon: threejs,
	},
	{
		name: 'git',
		icon: git,
	},
	{
		name: 'Jest',
		icon: jest,
	},
	{
		name: 'Playwrite',
		icon: playwrite,
	},
];

const experiences = [
	{
		title: 'Senior Software Engineer',
		company_name: 'SIXT',
		icon: sixt,
		iconBg: '#E6DEDD',
		date: 'Aug 2023 - Jul 2024',
		points: [
			"Led development initiatives for SIXT's global car rental platform serving 2M+ monthly users.",
			'Improved platform performance by 40% through code optimization and implementing lazy loading.',
			'Reduced planning cycle by at least 25% through UX improvements.',
			'Migrated from legacy codebase to modern React/TypeScript stack.',
			'Mentored junior developers and established engineering best practices.',
			'Implemented automated testing strategy achieving 90%+ coverage.',
			'Reduced bundle size by 35% through code splitting and optimization.',
			'Collaborated with the UX team to implement responsive design patterns.',
		],
	},
	{
		title: 'Software Engineer - Digital Marketing',
		company_name: 'Tyson Foods',
		icon: tyson,
		iconBg: '#E6DEDD',
		date: 'Apr 2022 - Aug 2023',
		points: [
			"Developed solutions to meet business requirements for Fortune 500 company's digital presence.",
			'Participated in project development throughout the entire Software Development Lifecycle (SDLC).',
			'Studied user requirements and implemented solutions serving 3M+ monthly users.',
			'Investigated and resolved application issues for web-based programs.',
			'Maintained quality assurance through automated testing achieving 85% coverage.',
			'Presented projects to the marketing department to promote web applications.',
			'Collaborated with global teams across multiple time zones.',
		],
	},
	{
		title: 'Software Engineer',
		company_name: 'Jungle.ai',
		icon: jungleai,
		iconBg: '#383E56',
		date: 'Aug 2021 - Jan 2022',
		points: [
			'Contributed to scalable applications for predictive maintenance through machine learning solutions.',
			'Contributed to data processing pipeline improvements.',
			'Helped implement permissions and monitoring dashboard features.',
			'Participated in code reviews and documentation.',
			'Collaborated with senior developers on system optimization.',
		],
	},
	{
		title: 'Full stack Developer',
		company_name: 'Freelance',
		icon: freelance,
		iconBg: '#E6DEDD',
		date: 'Jan 2018 - Dec 2021',
		points: [
			'Worked as a freelancer for local companies, mainly working on full-stack solutions (backend, frontend, and mobile).',
			'Developed and maintained web applications using React.js and other related technologies.',
			'Collaborated with cross-functional teams including designers, product managers, and other developers to create high-quality products.',
			'Implemented responsive design and ensuring cross-browser compatibility.',
			'Participated in code reviews and providing constructive feedback to other developers.',
		],
	},
];

const projects = [
	{
		name: 'SkyQuest',
		description: 'AI-Powered SaaS platform that transforms the way people search for flights.',
		tags: [
			{
				name: 'react',
				color: 'blue-text-gradient',
			},
			{
				name: 'mongodb',
				color: 'green-text-gradient',
			},
			{
				name: 'tailwind',
				color: 'pink-text-gradient',
			},
		],
		image: skyquest,
		source_code_link: 'https://skyquest.dev/',
	},
	{
		name: 'MotoHUB',
		description:
			'A comprehensive motorcycle marketplace that allows users to buy, sell, and explore motorcycles. Features include user authentication, listing management, and advanced search capabilities.',
		tags: [
			{
				name: 'react',
				color: 'blue-text-gradient',
			},
			{
				name: 'restapi',
				color: 'green-text-gradient',
			},
			{
				name: 'scss',
				color: 'pink-text-gradient',
			},
		],
		image: motohub,
		source_code_link: 'https://github.com/AndreJorgeLopes/MotoHUB-Frontend',
	},
	{
		name: 'Marvel Universe Explorer',
		description:
			'An interactive web application that allows users to explore the vast Marvel universe. Select any Marvel character to discover their backstory, powers, and comic appearances. Filter by comics to dive deep into specific storylines.',
		tags: [
			{
				name: 'react',
				color: 'blue-text-gradient',
			},
			{
				name: 'marvel api',
				color: 'green-text-gradient',
			},
			{
				name: 'css',
				color: 'pink-text-gradient',
			},
		],
		image: marvelCharacter,
		source_code_link: 'https://github.com/AndreJorgeLopes/MarvelUniverseExplorer',
	},
];

export { services, technologies, experiences, testimonials, projects };
