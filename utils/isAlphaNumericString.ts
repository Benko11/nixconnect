export default function isAlphaNumericString(text: string) {
  const pattern = /^[a-zA-Z0-9]+$/;
  return pattern.test(text);
}
