export default function Footer() {
  return (
    <footer className="z-10 flex min-h-footer w-full items-center justify-between gap-4 bg-blue-600 px-6 py-2 text-neutral-50 shadow-xl">
      <p>
        Authored by:{' '}
        <a className="underline" href="https://jwvbremen.nl/">
          Jan-Willem van Bremen
        </a>
      </p>
      <p>{`© ${new Date().getFullYear()}`}</p>
    </footer>
  );
}
