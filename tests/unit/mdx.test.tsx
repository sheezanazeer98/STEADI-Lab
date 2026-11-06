import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { MdxContent, renderMdx } from "@/lib/content/mdx";

describe("mdx rendering", () => {
  it("renders GitHub-flavoured markdown with heading ids", () => {
    const html = renderToStaticMarkup(<>{renderMdx("## Technical approach\n\nSome **bold** text.")}</>);
    expect(html).toContain('<h2 id="technical-approach">Technical approach</h2>');
    expect(html).toContain("<strong>bold</strong>");
  });

  it("opens external links in a new tab and keeps internal links routable", () => {
    const html = renderToStaticMarkup(<>{renderMdx("[ext](https://example.com) and [int](/research)")}</>);
    expect(html).toContain('href="https://example.com"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('href="/research"');
  });

  it("returns null for empty sources", () => {
    expect(renderToStaticMarkup(<MdxContent source="   " />)).toBe("");
  });
});
