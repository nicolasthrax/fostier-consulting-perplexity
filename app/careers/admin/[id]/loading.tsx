/** Shown the moment a candidate is clicked, while the record is read from storage. */
export default function CandidateLoading() {
  const block = "animate-pulse rounded-sm bg-white";
  return (
    <div className="container-site py-8 sm:py-12" aria-busy="true" aria-label="Loading candidate">
      <div className="h-5 w-32 animate-pulse rounded-sm bg-line" />
      <div className="mt-5 h-10 w-72 animate-pulse rounded-sm bg-line" />
      <div className="mt-3 h-5 w-48 animate-pulse rounded-sm bg-line" />
      <div className="mt-8 grid gap-6 lg:grid-cols-[22rem_1fr]">
        <div className="space-y-6">
          <div className={`${block} h-72`} />
          <div className={`${block} h-56`} />
        </div>
        <div className={`${block} h-[75vh]`} />
      </div>
    </div>
  );
}
