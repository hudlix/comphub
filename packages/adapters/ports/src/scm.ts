// SCM provider port — source control, used by Continuity (standardize-repo PR) and as
// a shared integration. Mutations are dry-run / human-in-the-loop and land later; the
// port defines only read shape for now.

export interface Repo {
  id: string;
  name: string;
  /** owner/name, e.g. 'acme/payments'. */
  fullName: string;
  defaultBranch: string;
}

export interface ScmProvider {
  readonly id: string;
  listRepos(): Promise<Repo[]>;
}
