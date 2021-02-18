import Head from 'next/head'

const GA = () => {
    return (
        <Head>
            <script
                async
                src="https://www.googletagmanager.com/gtag/js?id=G-KJP5HJWTK0" >
            </script>
            <script dangerouslySetInnerHTML={
                { __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments)}
                    gtag("js", new Date());
                    gtag("config", "G-KJP5HJWTK0");
                `}
            }>
            </script>
        </Head>
    )
}
export default GA