export function handleNewLines(content: string) {
  const formattedContent = content.replaceAll(/\n/g, "<br />");
  return formattedContent;
}
