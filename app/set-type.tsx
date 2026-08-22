// a heading arriving one word at a time, the way a line of type is set by hand
export default function SetType({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`set-type ${className ?? ""}`}>
      {text.split(" ").map((word, i) => (
        <span key={`${word}-${i}`} style={{ animationDelay: `${0.06 * i}s` }}>
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </span>
  );
}
