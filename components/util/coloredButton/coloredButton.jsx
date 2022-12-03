export default function ColoredButton({ className, text, type }) {
  return (
    <button
      type={type}
      className={`rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-100 focus:outline-none focus:ring-4 ${className}`}
    >
      {text}
    </button>
  );
}
``;
