import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html className="scrollbar-thin scrollbar-thumb-neutral-500">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}