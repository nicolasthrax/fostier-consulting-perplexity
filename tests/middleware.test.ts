import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";

const ORIGIN = "https://example.test";
const run = (pathname: string) => middleware(new NextRequest(new URL(pathname, ORIGIN)));
const rewrittenTo = (res: Response) => {
  const header = res.headers.get("x-middleware-rewrite");
  return header ? new URL(header).pathname : null;
};
const redirectedTo = (res: Response) => {
  const location = res.headers.get("location");
  return location ? new URL(location).pathname : null;
};
const passesThrough = (res: Response) => res.headers.get("x-middleware-next") === "1";
const noindexed = (res: Response) => expect(res.headers.get("x-robots-tag")).toContain("noindex");
const indexable = (res: Response) => expect(res.headers.get("x-robots-tag")).toBeNull();
const robots = (res: Response) => res.headers.get("x-robots-tag");

/** The page is served from `pathname`: either passed through or rewritten to itself. */
const servedAt = (res: Response, pathname: string) => {
  expect(res.status).toBe(200);
  expect(passesThrough(res) || rewrittenTo(res) === pathname).toBe(true);
};

describe("middleware, default portal at /careers", () => {
  beforeEach(() => {
    delete process.env.CAREERS_PORTAL_SLUG;
  });

  it("rewrites /careers to the French pages", () => {
    const res = run("/careers");
    expect(rewrittenTo(res)).toBe("/careers/fr");
    indexable(res);
  });

  it("rewrites French sub-pages to /careers/fr/...", () => {
    const res = run("/careers/jobs/x");
    expect(rewrittenTo(res)).toBe("/careers/fr/jobs/x");
    indexable(res);
  });

  it("serves English pages as they are", () => {
    const res = run("/careers/en/jobs/x");
    servedAt(res, "/careers/en/jobs/x");
    indexable(res);
    indexable(run("/careers/en"));
  });

  it("keeps the application forms and candidate notice out of results, following their links", () => {
    for (const p of ["/careers/jobs/x/apply", "/careers/en/jobs/x/apply", "/careers/privacy", "/careers/en/privacy"]) {
      expect(robots(run(p)), p).toBe("noindex, noarchive");
    }
  });

  it("marks unknown portal paths fully private", () => {
    expect(robots(run("/careers/jobs/x/other"))).toBe("noindex, nofollow, noarchive");
  });

  it("redirects /careers/fr/... to the unprefixed URL with a 308", () => {
    const res = run("/careers/fr/jobs/x");
    expect(res.status).toBe(308);
    expect(redirectedTo(res)).toBe("/careers/jobs/x");
    noindexed(res);
    expect(redirectedTo(run("/careers/fr"))).toBe("/careers");
  });

  it("serves the API and admin as they are, fully private", () => {
    for (const p of ["/careers/api/apply", "/careers/admin", "/careers/admin/abc"]) {
      const res = run(p);
      servedAt(res, p);
      expect(robots(res), p).toBe("noindex, nofollow, noarchive");
    }
  });

  it("leaves paths that only start with 'careers' to the locale redirect", () => {
    const res = run("/careersx");
    expect(redirectedTo(res)).toBe("/fr/careersx");
  });
});

describe("middleware, secret portal slug", () => {
  beforeEach(() => {
    process.env.CAREERS_PORTAL_SLUG = "join-abc";
  });
  afterEach(() => {
    delete process.env.CAREERS_PORTAL_SLUG;
  });

  it("serves the portal at /<slug>", () => {
    const res = run("/join-abc");
    expect(rewrittenTo(res)).toBe("/careers/fr");
    indexable(res);
    expect(rewrittenTo(run("/join-abc/jobs/x"))).toBe("/careers/fr/jobs/x");
    expect(rewrittenTo(run("/join-abc/en/jobs/x"))).toBe("/careers/en/jobs/x");
    indexable(run("/join-abc/en/jobs/x"));
  });

  it("applies the same robots rules under the slug", () => {
    expect(robots(run("/join-abc/jobs/x/apply"))).toBe("noindex, noarchive");
    expect(robots(run("/join-abc/privacy"))).toBe("noindex, noarchive");
    expect(robots(run("/join-abc/admin"))).toBe("noindex, nofollow, noarchive");
  });

  it("redirects /<slug>/fr/... under the slug", () => {
    const res = run("/join-abc/fr/jobs/x");
    expect(res.status).toBe(308);
    expect(redirectedTo(res)).toBe("/join-abc/jobs/x");
  });

  it("404s the default /careers pages", () => {
    for (const p of ["/careers", "/careers/jobs/x", "/careers/en", "/careers/admin"]) {
      const res = run(p);
      expect(res.status, p).toBe(404);
      noindexed(res);
    }
  });

  it("keeps the API at /careers/api", () => {
    const res = run("/careers/api/apply");
    servedAt(res, "/careers/api/apply");
    noindexed(res);
  });

  it("accepts a slug written with slashes", () => {
    process.env.CAREERS_PORTAL_SLUG = "/join-abc/";
    expect(rewrittenTo(run("/join-abc"))).toBe("/careers/fr");
  });
});

describe("middleware, rest of the site", () => {
  it("permanently redirects known unprefixed pages to French", () => {
    const res = run("/about");
    expect(res.status).toBe(308);
    expect(redirectedTo(res)).toBe("/fr/about");
    expect(res.headers.get("x-robots-tag")).toBeNull();
  });

  it("permanently redirects /contact to the French contact page", () => {
    const res = run("/contact");
    expect(res.status).toBe(308);
    expect(redirectedTo(res)).toBe("/fr/contact");
  });

  it("temporarily redirects unknown unprefixed paths", () => {
    const res = run("/nope");
    expect(res.status).toBe(307);
    expect(redirectedTo(res)).toBe("/fr/nope");
  });

  it("serves the French home at / and redirects /fr there", () => {
    expect(rewrittenTo(run("/"))).toBe("/fr");
    const res = run("/fr");
    expect(res.status).toBe(308);
    expect(redirectedTo(res)).toBe("/");
    expect(passesThrough(run("/fr/about"))).toBe(true);
    expect(passesThrough(run("/en/about"))).toBe(true);
  });
});
