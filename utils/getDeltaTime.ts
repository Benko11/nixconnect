export function getDeltaTime(timestamp: string) {
  const timestamp1 = new Number(new Date(timestamp));
  const timestamp2 = new Number(new Date());
  const deltaTime = +timestamp2 - +timestamp1;

  const seconds = Math.floor(deltaTime / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let time = `${Math.ceil(Math.abs(seconds))} second${Math.abs(seconds) > 1 ? "s" : ""}`;
  if (years > 0) {
    time = `${Math.ceil(Math.abs(years))} year${Math.abs(years) > 1 ? "s" : ""}`;
  } else if (months > 0) {
    time = `${Math.ceil(Math.abs(months))} month${Math.abs(months) > 1 ? "s" : ""}`;
  } else if (days > 0) {
    time = `${Math.ceil(Math.abs(days))} day${Math.abs(days) > 1 ? "s" : ""}`;
  } else if (hours > 0) {
    time = `${Math.ceil(Math.abs(hours))} hour${Math.abs(hours) > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    time = `${Math.ceil(Math.abs(minutes))} minute${Math.abs(minutes) > 1 ? "s" : ""}`;
  }

  if (deltaTime > 0) {
    time += " ago";
  } else {
    time += " in the future";
  }

  return time;
}
