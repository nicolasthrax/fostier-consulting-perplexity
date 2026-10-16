/**
 * Keeps the admin board's periodic refresh from undoing a save on screen. Saves go through
 * `track`; a refresh calls `begin` before fetching the list and uses the result only if
 * `fresh()` still holds: no save in flight, and none started or finished since. Counting
 * both ends catches a refresh that started and ended inside one save, which a counter of
 * finished saves alone would miss.
 */
export function writeTracker() {
  let pending = 0;
  let generation = 0;
  return {
    async track<T>(run: () => Promise<T>): Promise<T> {
      pending++;
      generation++;
      try {
        return await run();
      } finally {
        pending--;
        generation++;
      }
    },
    begin() {
      const at = generation;
      return () => pending === 0 && generation === at;
    },
  };
}
