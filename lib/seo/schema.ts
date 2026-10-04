import { amenities, club } from "@/content/amenities";
import { faq } from "@/content/faq";
import { project, site } from "@/content/project";
import { CONTENT_REQUIRED } from "@/content/types";

const orgId = `${site.url}/#organization`;
const placeId = `${site.url}/#residence`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: project.developerBrand,
    legalName: project.developerEntity,
    url: "https://www.skyi.com",
    foundingDate: "2004",
    sameAs: Object.values(project.social),
  };
}

export function websiteSchema() {
  return { "@context": "https://schema.org", "@type": "WebSite", "@id": `${site.url}/#website`, url: site.url, name: `${project.name} by ${project.developerBrand}`, publisher: { "@id": orgId } };
}

export function residenceSchema() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: project.address.street,
    addressLocality: project.address.city,
    addressRegion: project.address.region,
    addressCountry: project.address.country,
    ...(project.address.postalCode !== CONTENT_REQUIRED ? { postalCode: project.address.postalCode } : {}),
  };
  return {
    "@context": "https://schema.org",
    "@type": "ApartmentComplex",
    "@id": placeId,
    name: project.name,
    description: project.description,
    url: site.url,
    address,
    ...(project.address.geo ? { geo: { "@type": "GeoCoordinates", latitude: project.address.geo.lat, longitude: project.address.geo.lng } } : {}),
    containsPlace: {
      "@type": "Apartment",
      name: "One Plus Home (725 L)",
      numberOfRooms: 1,
      numberOfBathroomsTotal: 2,
      floorSize: { "@type": "QuantitativeValue", value: 490, unitCode: "FTK" },
    },
    amenityFeature: [{ "@type": "LocationFeatureSpecification", name: `${club.name} (${club.area})`, value: true }, ...amenities.map((a) => ({ "@type": "LocationFeatureSpecification", name: a.name, value: true }))],
    identifier: { "@type": "PropertyValue", propertyID: "MahaRERA", value: project.rera.number },
    brand: { "@id": orgId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${site.url}${it.path}` })),
  };
}

/** Only verified answers are emitted; [CONTENT REQUIRED] items are excluded from schema. */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.filter((f) => !f.a.includes(CONTENT_REQUIRED)).map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
