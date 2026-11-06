/**
 * Minimal external store that tracks client-side navigations so the page shell
 * can show a "loading" treatment while the next route is being fetched and
 * animate the new route in once it commits.
 *
 * - `target` is the pathname the user is navigating to, or `null` when idle.
 * - `navigations` counts client-side navigations since page load; it stays `0`
 *   for the initial server-rendered view so the first paint is never animated.
 */
export type NavigationState = {
  readonly target: string | null;
  readonly navigations: number;
};

const IDLE: NavigationState = { target: null, navigations: 0 };

/** Pending navigations are abandoned after this long (e.g. a cancelled fetch). */
const PENDING_TIMEOUT_MS = 8_000;

let state: NavigationState = IDLE;
let timer: ReturnType<typeof setTimeout> | undefined;
const listeners = new Set<() => void>();

function set(next: NavigationState) {
  state = next;
  for (const listener of listeners) listener();
}

function clearTimer() {
  if (timer !== undefined) {
    clearTimeout(timer);
    timer = undefined;
  }
}

export const navigationStore = {
  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot(): NavigationState {
    return state;
  },
  getServerSnapshot(): NavigationState {
    return IDLE;
  },
  /** A navigation to `target` has been requested but not yet committed. */
  start(target: string) {
    clearTimer();
    set({ target, navigations: state.navigations + 1 });
    timer = setTimeout(() => navigationStore.finish(), PENDING_TIMEOUT_MS);
  },
  /** Record a navigation that needs no pending state (browser back/forward). */
  mark() {
    clearTimer();
    set({ target: null, navigations: state.navigations + 1 });
  },
  /** The route has committed (or the navigation was abandoned). */
  finish() {
    clearTimer();
    if (state.target !== null) set({ ...state, target: null });
  },
};
