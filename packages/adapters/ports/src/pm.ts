// PM provider port — the Delivery workspace's data source.
//
// The provider returns the raw card hierarchy (Epic → Story → Task) plus the raw
// signals a deployment's derive-stage rule reads (board column / status / label).
// The lifecycle stage is DERIVED downstream from one configurable rule, never stored
// here — so the port deliberately carries signals, not a stage.

/** Raw fields a derive-stage rule may key off. All optional; providers fill what they have. */
export interface CardSignals {
  status?: string;
  column?: string;
  labels?: string[];
}

export interface Epic {
  id: string;
  key: string;
  title: string;
  signals: CardSignals;
}

export interface Story {
  id: string;
  key: string;
  epicId: string;
  title: string;
  signals: CardSignals;
}

export interface Task {
  id: string;
  key: string;
  storyId: string;
  title: string;
  signals: CardSignals;
}

export interface PmProvider {
  /** Adapter id, e.g. 'mock' or 'jira'. */
  readonly id: string;
  listEpics(): Promise<Epic[]>;
  listStories(epicId: string): Promise<Story[]>;
  listTasks(storyId: string): Promise<Task[]>;
}
