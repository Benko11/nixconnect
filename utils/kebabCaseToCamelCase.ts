const kebabCaseToCamelCase = (s: string) =>
  s.replace(/-./g, (x) => x[1].toUpperCase());
export default kebabCaseToCamelCase;
