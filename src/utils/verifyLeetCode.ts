/**
 * Utility to verify ownership of a LeetCode profile by searching
 * the profile "Summary" / bio area for a unique verification code.
 *
 * Notes:
 * - Prefer using this on a server or serverless function to avoid CORS issues.
 * - If used in the browser, requests to LeetCode will be blocked by CORS.
 */

export function verifyCodeInSummary(
  summaryHtml: string,
  code: string,
): boolean {
  if (!summaryHtml || !code) return false;
  try {
    // A simple substring search is sufficient for most cases. Trim and normalize.
    const normalized = summaryHtml.replace(/\s+/g, " ").toLowerCase();
    return normalized.includes(code.trim().toLowerCase());
  } catch (err) {
    return false;
  }
}

/**
 * Fetch the public LeetCode profile page and return the summary HTML string.
 * This function works server-side (Node) or in environments that allow cross-origin requests.
 */
export async function fetchLeetCodeProfileSummary(
  username: string,
): Promise<string> {
  if (!username) throw new Error("username required");
  const url = `https://leetcode.com/${encodeURIComponent(username)}/`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "DevMetrics/1.0 (+https://github.com)",
    },
  });

  if (!res.ok) throw new Error(`failed to fetch profile: ${res.status}`);
  const html = await res.text();

  // Heuristic: LeetCode embeds user summary in a div with class 'profile-summary' or in meta tags.
  // We'll attempt to extract the <meta name="description" content="..."> first.
  const metaMatch = html.match(
    /<meta\s+name="description"\s+content="([^"]*)"/i,
  );
  if (metaMatch && metaMatch[1]) return metaMatch[1];

  // Fallback: look for a profile summary div
  const divMatch = html.match(
    /<div[^>]*class=["'][^"']*(profile-summary|bio|user-summary)[^"']*["'][^>]*>([\s\S]*?)<\/div>/i,
  );
  if (divMatch && divMatch[2]) return divMatch[2];

  // As a last resort return the whole HTML (caller should handle parsing)
  return html;
}

/**
 * High-level utility: verify that the given code exists in the user's LeetCode profile.
 * Runs fetch + search; intended for server-side use.
 */
export async function verifyLeetCodeOwnership(
  username: string,
  code: string,
): Promise<boolean> {
  if (!username || !code) return false;
  try {
    const summary = await fetchLeetCodeProfileSummary(username);
    return verifyCodeInSummary(summary, code);
  } catch (err) {
    return false;
  }
}
