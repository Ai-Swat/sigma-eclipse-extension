import { Helmet } from 'react-helmet'

export function Metrics() {
  const isProduction = import.meta.env.VITE_NODE_ENV === 'production'

  if (!isProduction) {
    return null
  }

  const GTM_ID = 'GTM-P2MGSWZ4'

  return (
    <Helmet>
      {/* Google Tag Manager */}

      <script
        async
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
      />

      <script id='google-analytics-gtm'>
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','${GTM_ID}');
        `}
      </script>

      <script id='google-analytics-gtag'>
        {` 
        window.dataLayer = window.dataLayer || []; 
        function gtag(){dataLayer.push(arguments);} 
        gtag('js', new Date()); 
        gtag('config', ''); 
       `}
      </script>

      {/* End Google Tag Manager */}

      {/* Hotjar Tracking Code */}
      <script>
        {` 
            ;(function (h, o, t, j, a, r) {
            h.hj =
                h.hj ||
                function () {
                    ;(h.hj.q = h.hj.q || []).push(arguments)
                }
            h._hjSettings = { hjid: 5361082, hjsv: 6 }
            a = o.getElementsByTagName('head')[0]
            r = o.createElement('script')
            r.async = 1
            r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
            a.appendChild(r)
        })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
        `}
      </script>
    </Helmet>
  )
}
