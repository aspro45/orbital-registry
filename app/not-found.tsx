import Link from "next/link";
export const metadata = { title: "Lost object - Orbital Registry" };
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60svh] max-w-reading flex-col justify-center px-4 py-16 sm:px-5 md:px-8">
      <span className="label">Error 404</span>
      <h1 className="mt-2 font-head text-fluid-page text-starlight">Lost object.</h1>
      <p className="mt-3 text-lg text-starlight/80">No object holds this orbit. It may have been archived, or the link mistyped.</p>
      <Link href="/" className="mt-6 inline-flex min-h-[48px] w-fit items-center rounded bg-cyan px-6 font-medium text-space">Back to the registry</Link>
    </div>
  );
}
