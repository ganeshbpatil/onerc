import Script from "next/script";

/**
 * GTM with Google Consent Mode v2. Defaults are "denied" until CookieConsent
 * grants them; GTM loads after hydration so it never blocks LCP.
 * Meta Pixel, GA4 and any other tags are configured inside GTM, not here.
 */
export function Analytics() {
  const gtm = process.env.NEXT_PUBLIC_GTM_ID;
  if (!gtm || !/^GTM-[A-Z0-9]+$/.test(gtm)) return null;
  return (
    <>
      {/* Inline, parser-blocking and tiny: consent defaults must exist before GTM boots. */}
      <script
        id="consent-default"
        dangerouslySetInnerHTML={{
          __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
try{var c=localStorage.getItem('orc_consent');if(c==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}`,
        }}
      />
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
      </Script>
    </>
  );
}
