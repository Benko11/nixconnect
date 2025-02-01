export function getDeltaTime(timestamp: string) {
  const timestamp1 = new Number(new Date(timestamp));
  const timestamp2 = new Number(new Date());
  const deltaTime = +timestamp2 - +timestamp1;

  const seconds = Math.floor(deltaTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${Math.ceil(days)} day${days > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    return `${Math.ceil(hours)} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${Math.ceil(minutes)} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${Math.ceil(seconds)} second${seconds > 1 ? "s" : ""}`;
  }
}
