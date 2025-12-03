export default function Title({ text, className }: { text: string; className?: string }) {
  return (
    <p
      className={`text-[36px] font-bold leading-[44px] text-text-nomral break-words whitespace-pre-wrap ${className}`}
    >
      {text}
    </p>
  );
}
