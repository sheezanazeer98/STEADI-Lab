import type { Metadata } from "next";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductGallery } from "@/components/products/product-gallery";
import { getProducts } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { productCategoryValues } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Products & Open Source",
  description:
    "Research-oriented software from STEADI Lab: AI applications, blockchain tools, agents, smart contract analysis tools, prototypes and open-source libraries, with honest development status.",
  path: "/products",
});

export default function ProductsPage() {
  const products = getProducts();

  return (
    <>
      <PageHero
        eyebrow="Products & open source"
        title={
          <>
            Research tools, <span className="text-primary">shipped</span> in the open.
          </>
        }
        current="Products"
        breadcrumbs={[]}
        description="Prototypes, libraries and experimental platforms that come out of our research. Every entry carries its real development status — concept, prototype, alpha, beta or released — so nothing is presented as more mature than it is."
      >
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Product categories">
          {productCategoryValues.map((category) => (
            <li
              key={category}
              className="rounded-sm border border-border px-2 py-1 label-mono text-muted-foreground"
            >
              {category}
            </li>
          ))}
        </ul>
      </PageHero>
      <Section spacing="sm" className="border-t border-border pt-10">
        {products.length ? (
          <ProductGallery products={products} />
        ) : (
          <EmptyState
            title="No products have been listed yet"
            description="Product entries include a technology stack, development status, screenshots, documentation, repository and demo links, and the research they came from."
            hint="src/content/products/"
          />
        )}
      </Section>
    </>
  );
}
