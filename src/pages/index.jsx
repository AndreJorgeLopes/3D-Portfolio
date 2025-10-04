import dynamic from 'next/dynamic';
import { About, Contact, Experience, Hero, Navbar, Tech, Works, GithubContributions } from '../components';

// Dynamically import 3D components with SSR disabled
const StarsCanvas = dynamic(() => import('../components/canvas/Stars'), { ssr: false });

const Home = () => {
	return (
		<div className='relative bg-primary z-0'>
			<div className='bg-hero-pattern bg-no-repeat relative z-10'>
				<StarsCanvas />
				<Navbar />
				<Hero />
			</div>
			<div>
				<About />
				<Experience />
				<Tech />
				<Works />
				<GithubContributions />
				<div className='relative z-0'>
					<Contact />
				</div>
			</div>
		</div>
	);
};

export default Home;
