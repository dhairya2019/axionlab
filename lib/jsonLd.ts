export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AXIONLAB",
    url: "https://www.axionlab.in",
    logo: "https://www.axionlab.in/opengraph-image",
    description:
      "Independent systems engineering lab designing commerce infrastructure, AI agent systems, and high-performance applications.",
    sameAs: [],
  }
}

export function webSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AXIONLAB",
    url: "https://www.axionlab.in",
  }
}

export function articleJsonLd(post: {
  title: string
  description: string
  date: string
  slug: string
  author: string
  tags: string[]
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: {
      "@type": "Organization",
      name: post.author || "AXIONLAB",
      url: "https://www.axionlab.in",
    },
    publisher: {
      "@type": "Organization",
      name: "AXIONLAB",
      url: "https://www.axionlab.in",
      logo: {
        "@type": "ImageObject",
        url: "https://www.axionlab.in/opengraph-image",
      },
    },
    datePublished: post.date,
    dateModified: post.date,
    mainEntityOfPage: `https://www.axionlab.in/insights/${post.slug}`,
    keywords: post.tags.join(", "),
    image: "https://www.axionlab.in/opengraph-image",
  }
}
