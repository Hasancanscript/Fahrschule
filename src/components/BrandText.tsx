export default function BrandText({ text }: { text: string }) {
  const phrase = "fürs Leben";
  const parts = text.split(phrase);
  if (parts.length === 1) return text;
  return <>{parts.map((part, index) => <span key={index}>{index > 0 && <span className="font-bold text-accent-dark">{phrase}</span>}{part}</span>)}</>;
}
