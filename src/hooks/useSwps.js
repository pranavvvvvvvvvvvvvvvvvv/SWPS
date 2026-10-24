import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const unwrap = (res, fallback = []) => (Array.isArray(res) ? res : res?.items ?? fallback);

export function useDevices() {
  return useQuery({
    queryKey: ["swps", "devices"],
    queryFn: async () => unwrap(await base44.entities.Device.list({ sort: "code", limit: 50 })),
    staleTime: 15000,
    refetchInterval: 60000,
  });
}

export function useReadings({ deviceCode, from, to, limit = 600 } = {}) {
  return useQuery({
    queryKey: ["swps", "readings", deviceCode || "all", from || "", to || "", limit],
    queryFn: async () => {
      const filter = {};
      if (deviceCode) filter.device_code = deviceCode;
      if (from || to) {
        filter.recorded_at = {};
        if (from) filter.recorded_at.$gte = from;
        if (to) filter.recorded_at.$lte = to;
      }
      const page = await base44.entities.Reading.filter(filter, { sort: "-recorded_at", limit });
      return unwrap(page);
    },
    refetchInterval: 30000,
    staleTime: 10000,
  });
}

const LAST_READINGS_KEY = "swps:last-readings";

function cachedReadings() {
  try {
    return JSON.parse(window.localStorage.getItem(LAST_READINGS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useLatestReadings(limit = 100) {
  return useQuery({
    queryKey: ["swps", "latest-readings", limit],
    queryFn: async () => {
      try {
        const rows = unwrap(await base44.entities.Reading.list({ sort: "-recorded_at", limit }));
        try {
          window.localStorage.setItem(LAST_READINGS_KEY, JSON.stringify(rows.slice(0, 40)));
        } catch {
          /* storage full or unavailable — offline cache is best effort */
        }
        return rows;
      } catch (error) {
        const cached = cachedReadings();
        if (cached.length) return cached;
        throw error;
      }
    },
    refetchInterval: 20000,
    staleTime: 8000,
  });
}

export function useAlerts() {
  return useQuery({
    queryKey: ["swps", "alerts"],
    queryFn: async () => unwrap(await base44.entities.Alert.list({ sort: "-raised_at", limit: 200 })),
    refetchInterval: 30000,
  });
}

export function useControlLogs({ deviceCode, limit = 60 } = {}) {
  return useQuery({
    queryKey: ["swps", "control-logs", deviceCode || "all", limit],
    queryFn: async () => {
      const filter = deviceCode ? { device_code: deviceCode } : {};
      return unwrap(await base44.entities.ControlLog.filter(filter, { sort: "-logged_at", limit }));
    },
    refetchInterval: 30000,
  });
}

export function useThresholds() {
  return useQuery({
    queryKey: ["swps", "thresholds"],
    queryFn: async () => unwrap(await base44.entities.Threshold.list({ limit: 50 })),
    staleTime: 20000,
  });
}

export function useManualReadings() {
  return useQuery({
    queryKey: ["swps", "manual-readings"],
    queryFn: async () => unwrap(await base44.entities.ManualReading.list({ sort: "-recorded_at", limit: 100 })),
  });
}

/** Most recent reading per device code. */
export function latestPerDevice(readings) {
  const map = {};
  (readings || []).forEach((r) => {
    if (!map[r.device_code]) map[r.device_code] = r;
  });
  return map;
}
