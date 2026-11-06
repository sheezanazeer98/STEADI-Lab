"use client";

import { useMemo } from "react";
import { FilterSelect, FilterToolbar } from "@/components/shared/filter-toolbar";
import { SearchInput } from "@/components/shared/search-input";
import { EmptyState } from "@/components/shared/empty-state";
import { ProductCard } from "@/components/products/product-card";
import { useUrlState } from "@/hooks/use-url-state";
import { matchesQuery } from "@/lib/search";
import { productCategoryValues, productStatusValues, type Product } from "@/types/content";

type ProductGalleryProps = {
  products: Product[];
};

const defaults = { q: "", category: "", status: "" };

export function ProductGallery({ products }: ProductGalleryProps) {
  const { state, update, reset } = useUrlState(defaults);

  const categories = useMemo(() => {
    const present = new Set(products.map((product) => product.category));
    return productCategoryValues.filter((category) => present.has(category));
  }, [products]);

  const statuses = useMemo(() => {
    const present = new Set(products.map((product) => product.status));
    return productStatusValues.filter((status) => present.has(status));
  }, [products]);

  const results = useMemo(
    () =>
      products.filter((product) => {
        if (state.category && product.category !== state.category) return false;
        if (state.status && product.status !== state.status) return false;
        return matchesQuery(state.q, [product.name, product.summary, product.techStack, product.category]);
      }),
    [products, state],
  );

  const isFiltered = Boolean(state.q || state.category || state.status);

  return (
    <div className="space-y-8">
      <FilterToolbar
        resultCount={results.length}
        resultLabel={results.length === 1 ? "product" : "products"}
        isFiltered={isFiltered}
        onReset={reset}
      >
        <SearchInput
          value={state.q}
          onChange={(q) => update({ q })}
          placeholder="Search tools, prototypes and software…"
          label="Search products"
          className="lg:flex-1"
        />
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <FilterSelect
            label="Category"
            value={state.category}
            onChange={(category) => update({ category })}
            options={categories.map((category) => ({ value: category, label: category }))}
            allLabel="All categories"
            className="sm:w-60"
          />
          <FilterSelect
            label="Status"
            value={state.status}
            onChange={(status) => update({ status })}
            options={statuses.map((status) => ({ value: status, label: status }))}
            allLabel="All statuses"
            className="sm:w-40"
          />
        </div>
      </FilterToolbar>

      {results.length === 0 ? (
        <EmptyState
          title="No products match these filters"
          description="Try a different search term or clear the filters."
        />
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {results.map((product) => (
            <li key={product.slug}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
