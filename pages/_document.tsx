import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

import createEmotionServer from '@emotion/server/create-instance';
import { cache } from '@styles/emotion-cache';

const GTM_CONTAINER_ID = process.env.NEXT_PUBLIC_GTM_CONTAINER_ID;

class CustomDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;
    const { extractCriticalToChunks } = createEmotionServer(cache);
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);

      const emotionStyles = extractCriticalToChunks(initialProps.html);
      const emotionStyleTags = emotionStyles.styles.map(style => (
        <style
          data-emotion={`${style.key} ${style.ids.join(' ')}`}
          key={style.key}
          dangerouslySetInnerHTML={{ __html: style.css }}
        />
      ));

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="ko">
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width" />
          <meta name="description" content="가방끈 긴 당신을 위한 서비스" />

          {/* open graph */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.bagstrap.team" />
          <meta property="og:title" content="똑똑한 대학원 커뮤니티 생활, 가방끈" />
          <meta
            property="og:description"
            content="가방끈 긴 당신을 위한 서비스: 대학원 커뮤니티 가방끈에서 시간표 마법사와 입시 멘토를 만나보세요"
          />
          <meta
            property="og:image"
            content="https://www.bagstrap.team/logos/defaultPreview.png"
          />

          {/* twitter card */}
          <meta name="twitter:title" content="똑똑한 대학원 커뮤니티 생활, 가방끈" />
          <meta name="twitter:creator" content="Bagstrap" />
          <meta name="twitter:site" content="@" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:description"
            content="가방끈 긴 당신을 위한 서비스: 대학원 커뮤니티 가방끈에서 시간표 마법사와 입시 멘토를 만나보세요"
          />

        </Head>
        <body>
          {/* <!-- Google Tag Manager (noscript) --> */}
          {GTM_CONTAINER_ID && (
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}`}
                height="0"
                width="0"
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>
          )}
          {/* <!-- End Google Tag Manager (noscript) --> */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default CustomDocument;
