import type { Repo, ScmProvider } from '@comphub/adapters-ports';

const REPOS: Repo[] = [
  { id: 'repo-1', name: 'payments', fullName: 'acme/payments', defaultBranch: 'main' },
  { id: 'repo-2', name: 'checkout', fullName: 'acme/checkout', defaultBranch: 'main' },
  { id: 'repo-3', name: 'storefront', fullName: 'acme/storefront', defaultBranch: 'main' },
];

export class MockScmProvider implements ScmProvider {
  readonly id = 'mock';

  async listRepos(): Promise<Repo[]> {
    return REPOS;
  }
}
