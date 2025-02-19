import { getDeltaTime } from "@/utils/getDeltaTime";
import { describe, expect, it } from "@jest/globals";

describe("getDeltaTime", () => {
  it("should return the correct number of seconds", () => {
    const timestamp = new Date(Date.now() - 5000).toISOString();
    expect(getDeltaTime(timestamp)).toBe("5 seconds ago");
  });

  it("should return the correct number of minutes", () => {
    const timestamp = new Date(Date.now() - 2 * 60 * 1000).toISOString();
    expect(getDeltaTime(timestamp)).toBe("2 minutes ago");
  });

  it("should return the correct number of hours", () => {
    const timestamp = new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString();
    expect(getDeltaTime(timestamp)).toBe("3 hours ago");
  });

  it("should return the correct number of days", () => {
    const timestamp = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    expect(getDeltaTime(timestamp)).toBe("1 day ago");
  });

  it("should handle future timestamps", () => {
    const timestamp = new Date(Date.now() + 5000).toISOString();
    expect(getDeltaTime(timestamp)).toBe("5 seconds in the future");
  });

  it("should return correct number of months", () => {
    const timestamp = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 30 * 5
    ).toISOString();
    expect(getDeltaTime(timestamp)).toBe("5 months ago");
  });

  it("should return correct number of years", () => {
    const timestamp = new Date(
      Date.now() - 1000 * 60 * 60 * 24 * 366 * 10
    ).toISOString();
    expect(getDeltaTime(timestamp)).toBe("10 years ago");
  });
});
