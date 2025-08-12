import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					{/* Prefetch main .glb files */}
					<link
						rel='prefetch'
						href='/desktop_pc/scene.glb'
						as='fetch'
						type='model/gltf-binary'
						crossOrigin='anonymous'
					/>
					<link rel='prefetch' href='/planet/scene.glb' as='fetch' type='model/gltf-binary' crossOrigin='anonymous' />
					{/* Meta tags for better SEO and PWA support */}
					<meta name='application-name' content='3D Portfolio' />
					<meta name='apple-mobile-web-app-capable' content='yes' />
					<meta name='apple-mobile-web-app-status-bar-style' content='default' />
					<meta name='apple-mobile-web-app-title' content='3D Portfolio' />
					<meta name='format-detection' content='telephone=no' />
					<meta name='mobile-web-app-capable' content='yes' />
					<meta name='theme-color' content='#050816' />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
