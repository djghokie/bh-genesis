import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
	    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css" />
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v6.1.1/css/all.css" crossOrigin="anonymous" />
	  </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}