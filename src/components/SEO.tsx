import { useEffect } from 'react';
import type { SEOProps } from '../types';

export function SEO({
  title,
  description,
  keywords = [],
  image = 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200',
  url = typeof window !== 'undefined' ? window.location.href : '',
  type = 'website',
  structuredData
}: SEOProps) {
  useEffect(() => {
    // Update document title
    document.title = `${title} | Rental Mobil Premium`;

    // Meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Meta keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }

    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:image', content: image },
      { property: 'og:url', content: url },
      { property: 'og:type', content: type },
      { property: 'og:locale', content: 'id_ID' }
    ];

    ogTags.forEach(({ property, content }) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image }
    ];

    twitterTags.forEach(({ name, content }) => {
      let tag = document.querySelector(`meta[name="${name}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', name);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    });

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Structured Data
    if (structuredData) {
      let script = document.querySelector('#structured-data');
      if (!script) {
        script = document.createElement('script');
        script.id = 'structured-data';
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Optionally remove structured data on unmount
    };
  }, [title, description, keywords, image, url, type, structuredData]);

  return null;
}

export function generateCarStructuredData(car: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.name,
    description: car.description,
    image: car.images[0],
    brand: {
      '@type': 'Brand',
      name: car.brand
    },
    offers: {
      '@type': 'Offer',
      price: car.pricePerDay,
      priceCurrency: 'IDR',
      availability: car.availability ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: car.rating,
      reviewCount: car.reviewCount
    }
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Rental Mobil Premium',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    logo: typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : '',
    sameAs: [
      'https://facebook.com/rentalmobil',
      'https://instagram.com/rentalmobil',
      'https://twitter.com/rentalmobil'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+62-21-1234-5678',
      contactType: 'customer service',
      availableLanguage: ['Indonesian', 'English']
    }
  };
}

export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CarRental',
    name: 'Rental Mobil Premium',
    image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200',
    '@id': typeof window !== 'undefined' ? window.location.origin : '',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    telephone: '+62-21-1234-5678',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jl. Sudirman No. 123',
      addressLocality: 'Jakarta',
      postalCode: '12190',
      addressCountry: 'ID'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -6.2088,
      longitude: 106.8456
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '08:00',
      closes: '20:00'
    },
    priceRange: '$$$'
  };
}
