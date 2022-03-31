import Document, { Html, Head, Main, NextScript } from "next/document";
import { GA_ID } from "@/constants";

class MyDocument extends Document {
	render() {
		return (
			<Html>
				<Head>
					{!!GA_ID && (
						<>
							<script
								async
								src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
							/>
							<script
								dangerouslySetInnerHTML={{
									__html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', {
                page_path: window.location.pathname,
              });
            `,
								}}
							/>
						</>
					)}
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,600&display=swap"
					/>
					<meta name="description" content="App Hub powered by CENNZnet" />
					<link rel="icon" href="/favicon.svg" />
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
