import type { Epic, PmProvider, Story, Task } from '@comphub/adapters-ports';

// Deterministic, vendor-neutral demo data. `column` carries the raw signal that the
// Delivery derive-stage rule reads downstream — the stage itself is never stored here.

const EPICS: Epic[] = [
  {
    id: 'epic-1',
    key: 'DEL-1',
    title: 'checkout-service redesign',
    signals: { column: 'Dev', status: 'In Progress', labels: ['frontend'] },
  },
  {
    id: 'epic-2',
    key: 'DEL-2',
    title: 'payments-api hardening',
    signals: { column: 'Scoping', status: 'To Do', labels: ['security'] },
  },
  {
    id: 'epic-3',
    key: 'DEL-3',
    title: 'web-storefront performance',
    signals: { column: 'QA', status: 'In Review', labels: ['performance'] },
  },
];

const STORIES: Record<string, Story[]> = {
  'epic-1': [
    {
      id: 'story-1',
      key: 'DEL-11',
      epicId: 'epic-1',
      title: 'New cart summary panel',
      signals: { column: 'Dev', status: 'In Progress' },
    },
    {
      id: 'story-2',
      key: 'DEL-12',
      epicId: 'epic-1',
      title: 'Guest checkout flow',
      signals: { column: 'Planning', status: 'To Do' },
    },
  ],
  'epic-2': [
    {
      id: 'story-3',
      key: 'DEL-21',
      epicId: 'epic-2',
      title: 'Rotate signing keys',
      signals: { column: 'Scoping', status: 'To Do' },
    },
  ],
  'epic-3': [
    {
      id: 'story-4',
      key: 'DEL-31',
      epicId: 'epic-3',
      title: 'Defer offscreen images',
      signals: { column: 'QA', status: 'In Review' },
    },
  ],
};

const TASKS: Record<string, Task[]> = {
  'story-1': [
    {
      id: 'task-1',
      key: 'DEL-111',
      storyId: 'story-1',
      title: 'Build summary component',
      signals: { column: 'Dev', status: 'In Progress' },
    },
    {
      id: 'task-2',
      key: 'DEL-112',
      storyId: 'story-1',
      title: 'Wire totals endpoint',
      signals: { column: 'Prod', status: 'Done' },
    },
  ],
  'story-2': [
    {
      id: 'task-3',
      key: 'DEL-121',
      storyId: 'story-2',
      title: 'Spec guest session model',
      signals: { column: 'Planning', status: 'To Do' },
    },
  ],
  'story-3': [
    {
      id: 'task-4',
      key: 'DEL-211',
      storyId: 'story-3',
      title: 'Inventory key usage',
      signals: { column: 'Scoping', status: 'To Do' },
    },
  ],
  'story-4': [
    {
      id: 'task-5',
      key: 'DEL-311',
      storyId: 'story-4',
      title: 'Add lazy-load attribute',
      signals: { column: 'QA', status: 'In Review' },
    },
  ],
};

export class MockPmProvider implements PmProvider {
  readonly id = 'mock';

  async listEpics(): Promise<Epic[]> {
    return EPICS;
  }

  async listStories(epicId: string): Promise<Story[]> {
    return STORIES[epicId] ?? [];
  }

  async listTasks(storyId: string): Promise<Task[]> {
    return TASKS[storyId] ?? [];
  }
}
