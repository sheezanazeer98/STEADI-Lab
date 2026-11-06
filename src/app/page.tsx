import { HeroSection } from "@/components/home/hero-section";
import { ResearchMap } from "@/components/home/research-map";
import {
  AboutSection,
  AffiliationSection,
  CollaborationSection,
  FeaturedProjectsSection,
  NewsSection,
  PipelineSection,
  ProductsSection,
  RecentPublicationsSection,
  ResearchAreasSection,
  TeamSection,
  ThesisSection,
} from "@/components/home/home-sections";
import {
  getFeaturedPeople,
  getFeaturedProducts,
  getFeaturedProjects,
  getFeaturedResearchAreas,
  getProjectsForResearchArea,
  getPublicationsForResearchArea,
  getRecentNews,
  getRecentPublications,
  getResearchAreas,
} from "@/lib/content";

export default function HomePage() {
  const allAreas = getResearchAreas();
  const areas = getFeaturedResearchAreas(6);
  const areaTitles = Object.fromEntries(allAreas.map((area) => [area.slug, area.title]));
  const counts = Object.fromEntries(
    allAreas.map((area) => [
      area.slug,
      {
        projects: getProjectsForResearchArea(area.slug).length,
        publications: getPublicationsForResearchArea(area.slug).length,
      },
    ]),
  );

  return (
    <>
      <HeroSection />
      <div className="relative container-wide -mt-2">
        <ResearchMap />
      </div>
      <ThesisSection />
      <AboutSection />
      <ResearchAreasSection areas={areas} total={allAreas.length} counts={counts} />
      <FeaturedProjectsSection projects={getFeaturedProjects(3)} />
      <RecentPublicationsSection publications={getRecentPublications(4)} areaTitles={areaTitles} />
      <ProductsSection products={getFeaturedProducts(3)} />
      <PipelineSection />
      <TeamSection people={getFeaturedPeople(4)} />
      <NewsSection posts={getRecentNews(3)} />
      <CollaborationSection />
      <AffiliationSection />
    </>
  );
}
