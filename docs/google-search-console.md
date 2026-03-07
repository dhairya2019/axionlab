# Google Search Console Setup — axionlab.in

## Prerequisites

- Access to the DNS provider for axionlab.in (your domain registrar or Vercel DNS)
- A Google account

## Step 1: Open Google Search Console

1. Go to https://search.google.com/search-console
2. Sign in with your Google account
3. Click "Add property"

## Step 2: Add Property

1. Select "URL prefix" method
2. Enter: `https://axionlab.in`
3. Click "Continue"

## Step 3: Verify Ownership

**Recommended method: DNS TXT record**

1. Google will provide a TXT record value (starts with `google-site-verification=...`)
2. Go to your DNS provider (if using Vercel DNS: Vercel Dashboard > Domains > axionlab.in > DNS Records)
3. Add a new TXT record:
   - **Type:** TXT
   - **Name:** @ (or leave blank)
   - **Value:** The `google-site-verification=...` string Google provided
   - **TTL:** 3600 (or default)
4. Save the record
5. Return to Google Search Console and click "Verify"
6. DNS propagation may take up to 24 hours, but usually completes within minutes

**Alternative method: HTML meta tag**

If DNS access is not available, use the HTML meta tag method:
1. Google will provide a meta tag like `<meta name="google-site-verification" content="..." />`
2. Add it to `app/layout.tsx` inside the metadata export:
   ```tsx
   verification: {
     google: 'YOUR_VERIFICATION_CODE_HERE',
   },
   ```
3. Deploy the site and click "Verify" in GSC

## Step 4: Submit Sitemap

1. In the GSC left sidebar, click "Sitemaps"
2. Enter: `sitemap.xml` (the sitemap is already generated at https://axionlab.in/sitemap.xml)
3. Click "Submit"
4. Status should change to "Success" within a few hours

## Step 5: Request Indexing

1. In the GSC URL inspection tool, enter: `https://axionlab.in`
2. Click "Request Indexing"
3. Repeat for key pages:
   - `https://axionlab.in/capabilities`
   - `https://axionlab.in/insights`
   - `https://axionlab.in/philosophy`
   - `https://axionlab.in/work`

## What to Expect

- **Indexing:** Pages typically appear in Google within 1-7 days after GSC submission
- **Rankings:** For a new domain with zero authority, expect 3-6 months for any meaningful rankings
- **Sitemap updates:** The sitemap at /sitemap.xml automatically includes all pages and blog posts. After publishing new content, redeploy the site to update sitemap dates.

## Troubleshooting

- **"Could not verify":** DNS propagation can take up to 24 hours. Wait and retry.
- **"URL is not on Google":** Use "Request Indexing" in URL inspection. Google prioritizes sites with sitemaps.
- **Sitemap errors:** Verify https://axionlab.in/sitemap.xml loads correctly in a browser.
- **Coverage issues:** Check the "Coverage" report in GSC for crawl errors or excluded pages.
