import { Cache } from "../cache.util";

describe("Cache", () => {
  beforeEach(() => {
    Cache.clear();
  });

  describe("set and get", () => {
    it("should store and retrieve values", () => {
      Cache.set("key1", "value1");
      expect(Cache.get("key1")).toBe("value1");
    });

    it("should store complex objects", () => {
      const obj = { name: "test", nested: { value: 42 } };
      Cache.set("obj", obj);
      expect(Cache.get("obj")).toEqual(obj);
    });

    it("should return null for non-existent keys", () => {
      expect(Cache.get("nonexistent")).toBeNull();
    });

    it("should overwrite existing values", () => {
      Cache.set("key", "value1");
      Cache.set("key", "value2");
      expect(Cache.get("key")).toBe("value2");
    });
  });

  describe("TTL expiration", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should expire values after TTL", () => {
      Cache.set("expiring", "value", 1); // 1 second TTL
      expect(Cache.get("expiring")).toBe("value");

      jest.advanceTimersByTime(1100); // Advance past TTL
      expect(Cache.get("expiring")).toBeNull();
    });

    it("should not expire values before TTL", () => {
      Cache.set("alive", "value", 10); // 10 second TTL
      jest.advanceTimersByTime(5000); // Advance 5 seconds
      expect(Cache.get("alive")).toBe("value");
    });

    it("should use default TTL of 300 seconds", () => {
      Cache.set("default", "value");
      jest.advanceTimersByTime(299000);
      expect(Cache.get("default")).toBe("value");

      jest.advanceTimersByTime(2000);
      expect(Cache.get("default")).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete existing keys", () => {
      Cache.set("toDelete", "value");
      Cache.delete("toDelete");
      expect(Cache.get("toDelete")).toBeNull();
    });

    it("should not throw for non-existent keys", () => {
      expect(() => Cache.delete("nonexistent")).not.toThrow();
    });
  });

  describe("clear", () => {
    it("should remove all entries", () => {
      Cache.set("key1", "value1");
      Cache.set("key2", "value2");
      Cache.set("key3", "value3");

      Cache.clear();

      expect(Cache.get("key1")).toBeNull();
      expect(Cache.get("key2")).toBeNull();
      expect(Cache.get("key3")).toBeNull();
    });
  });

  describe("cleanup", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should remove only expired entries", () => {
      Cache.set("short", "value", 1);
      Cache.set("long", "value", 100);

      jest.advanceTimersByTime(2000);
      Cache.cleanup();

      expect(Cache.get("short")).toBeNull();
      expect(Cache.get("long")).toBe("value");
    });
  });

  describe("getOrSet", () => {
    it("should return cached value if exists", async () => {
      Cache.set("cached", "existing");
      const fn = jest.fn().mockResolvedValue("new");

      const result = await Cache.getOrSet("cached", fn);

      expect(result).toBe("existing");
      expect(fn).not.toHaveBeenCalled();
    });

    it("should execute function and cache result if not cached", async () => {
      const fn = jest.fn().mockResolvedValue("computed");

      const result = await Cache.getOrSet("new", fn);

      expect(result).toBe("computed");
      expect(fn).toHaveBeenCalledTimes(1);
      expect(Cache.get("new")).toBe("computed");
    });

    it("should use custom TTL", async () => {
      jest.useFakeTimers();
      const fn = jest.fn().mockResolvedValue("value");

      await Cache.getOrSet("custom", fn, 5);

      jest.advanceTimersByTime(6000);
      expect(Cache.get("custom")).toBeNull();
      jest.useRealTimers();
    });
  });
});
