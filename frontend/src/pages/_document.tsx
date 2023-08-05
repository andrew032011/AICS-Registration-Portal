import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap"
        />
      </Head>
      <body
        style={{
          minHeight: "100vh",
          position: "relative",
          paddingBottom: "10rem",
          backgroundColor: "#011627",
          fontFamily: "Montserrat, sans-serif",
          color: "#FFFFFF"
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
