/**
 * Validates and normalizes GitHub repository URLs for analysis.
 */

const GITHUB_REPO_REGEX =
  /^https?:\/\/(www\.)?github\.com\/([a-zA-Z0-9_.-]+)\/([a-zA-Z0-9_.-]+)\/?$/i;

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  cloneUrl: string;
  displayUrl: string;
}

export function parseGitHubUrl(input: string): ParsedGitHubUrl | null {
  const trimmed = input.trim().replace(/\.git\/?$/i, "").replace(/\/$/, "");
  const match = trimmed.match(GITHUB_REPO_REGEX);
  if (!match) return null;

  const owner = match[2];
  const repo = match[3].replace(/\.git$/, "");

  return {
    owner,
    repo,
    cloneUrl: `https://github.com/${owner}/${repo}.git`,
    displayUrl: `https://github.com/${owner}/${repo}`,
  };
}
