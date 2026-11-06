import type { MetadataRoute } from "next";
import {
  getNewsPosts,
  getPeople,
  getProducts,
  getProjects,
  getPublications,
  getResearchAreas,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

type StaticRoute = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const staticRoutes: StaticRoute[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/research", priority: 0.9, changeFrequency: "monthly" },
  { path: "/publications", priority: 0.9, changeFrequency: "weekly" },
  { path: "/projects", priority: 0.9, changeFrequency: "weekly" },
  { path: "/products", priority: 0.8, changeFrequency: "weekly" },
  { path: "/people", priority: 0.8, changeFrequency: "monthly" },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" },
  { path: "/events", priority: 0.6, changeFrequency: "weekly" },
  { path: "/resources", priority: 0.6, changeFrequency: "monthly" },
  { path: "/opportunities", priority: 0.6, changeFrequency: "monthly" },
  { path: "/collaborate", priority: 0.6, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
  { path: "/faq", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: absoluteUrl(route.path),
    priority: route.priority,
    changeFrequency: route.changeFrequency,
  }));

  const dynamic: MetadataRoute.Sitemap = [
    ...getResearchAreas().map((area) => ({
      url: absoluteUrl(`/research/${area.slug}`),
      priority: 0.7,
      changeFrequency: "monthly" as const,
    })),
    ...getPublications().map((publication) => ({
      url: absoluteUrl(`/publications/${publication.slug}`),
      priority: 0.6,
      changeFrequency: "yearly" as const,
    })),
    ...getProjects().map((project) => ({
      url: absoluteUrl(`/projects/${project.slug}`),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    })),
    ...getProducts().map((product) => ({
      url: absoluteUrl(`/products/${product.slug}`),
      priority: 0.5,
      changeFrequency: "monthly" as const,
    })),
    ...getPeople().map((person) => ({
      url: absoluteUrl(`/people/${person.slug}`),
      priority: 0.5,
      changeFrequency: "monthly" as const,
    })),
    ...getNewsPosts().map((post) => ({
      url: absoluteUrl(`/news/${post.slug}`),
      lastModified: post.updated ?? post.date,
      priority: 0.5,
      changeFrequency: "yearly" as const,
    })),
  ];

  return [...entries, ...dynamic];
}
