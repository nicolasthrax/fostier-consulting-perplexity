import { notFound } from "next/navigation";

/**
 * Unknown paths under the portal, closed listings included, go to ./not-found so they get
 * the portal's frame. Without this, /careers/en/… fell through to the site's own
 * [lang]/[...missing] (as the locale "careers") and showed a bare 404.
 */
export default function MissingPage() {
  notFound();
}
