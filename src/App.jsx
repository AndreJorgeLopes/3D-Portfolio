import { BrowserRouter as Router } from 'react-router-dom';

import { About, Contact, Experience, Hero, Navbar, Tech, Works, StarsCanvas, GithubContributions } from './components';

const App = () => {
	return (
		<Router>
			<div className='relative z-0 bg-primary'>
				<div className='bg-cover bg-hero-pattern'>
					<Navbar />
					<Hero />
				</div>
				<About />
				<Experience />
				<Tech />
				<Works />
				<GithubContributions />
				<div className='relative z-0'>
					<Contact />
					<StarsCanvas />
				</div>
			</div>
		</Router>
	);
};

export default App;
