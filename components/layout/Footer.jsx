export default function Footer() {
  return (
    <footer className="h-footer w-full items-center bg-blue-600 px-6 text-neutral-50 shadow-xl">
      <div className="flex h-full items-center justify-between">
        <p>
          Authored by:{' '}
          <a className="underline" href="https://jwvbremen.nl/">
            Jan-Willem van Bremen
          </a>
        </p>
        <p>2023</p>
      </div>
    </footer>
  );
}