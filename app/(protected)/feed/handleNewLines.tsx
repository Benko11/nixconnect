export function handleNewLines(content: string) {
  const formattedContent = content.split("\n").map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  return <div>{formattedContent}</div>;
}
