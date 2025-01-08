import React from 'react';
import GitHubCalendar from 'react-github-calendar';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';

const GitHubContributions = () => {
	const theme = {
		level0: '#161B22',
		level1: '#0e4429',
		level2: '#006d32',
		level3: '#26a641',
		level4: '#39d353',
	};

	return (
		<>
			<motion.div variants={textVariant()}>
				<p className={styles.sectionSubText}>My GitHub Activity</p>
				<h2 className={styles.sectionHeadText}>Contributions</h2>
			</motion.div>

			<motion.div variants={fadeIn('', '', 0.1, 1)} className='mt-4 bg-tertiary rounded-[20px] p-8'>
				<GitHubCalendar
					username='AndreJorgeLopes'
					theme={theme}
					fontSize={16}
					blockSize={12}
					blockMargin={5}
					year='last'
				/>
			</motion.div>
		</>
	);
};

export default SectionWrapper(GitHubContributions, '');
