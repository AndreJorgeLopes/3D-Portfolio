import Document, { Html, Head, Main, NextScript } from "next/document";
import { getAssetPath } from "../utils/getAssetPath";

class MyDocument extends Document {
  render() {
    const computerModelHref = getAssetPath("/desktop_pc/scene.glb");
    const planetModelHref = getAssetPath("/planet/scene.glb");

    return (
      <Html>
        <Head>
          {/* Prefetch main .glb files */}
          <link
            rel="prefetch"
            href={computerModelHref}
            as="fetch"
            type="model/gltf-binary"
            crossOrigin="anonymous"
          />
          <link
            rel="prefetch"
            href={planetModelHref}
            as="fetch"
            type="model/gltf-binary"
            crossOrigin="anonymous"
          />
          {/* Meta tags for better SEO and PWA support */}
          <meta name="application-name" content="3D Portfolio" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="3D Portfolio" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="theme-color" content="#050816" />
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
