import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Cpu, MapPin, Pencil, Plus, Trash2, UserRound } from "lucide-react";
import { useDevices, useLatestReadings, latestPerDevice } from "@/hooks/useSwps";
import { overallStatus, relativeTime, STATUS_STYLES } from "@/lib/water";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/dashboard/ui";
import StatusPill from "@/components/StatusPill";
import { cn } from "@/lib/utils";

const BLANK = {
  name: "",
  code: "",
  village: "",
  district: "",
  state: "Telangana",
  location_tag: "",
  lat: "",
  lng: "",
  population_served: "",
  mining_affected: false,
  status: "online",
  installed_on: "",
  notes: "",
};

const DEFAULT_THRESHOLD = {
  tds_max: 500,
  tds_warn: 300,
  turbidity_max: 5,
  turbidity_warn: 3,
  temp_min: 10,
  temp_max: 30,
  level_min: 20,
};

export default function Devices() {
  const { data: devices = [], isLoading } = useDevices();
  const { data: latest = [] } = useLatestReadings(200);
  const queryClient = useQueryClient();
  const byDevice = latestPerDevice(latest);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [toDelete, setToDelete] = useState(null);

  const startCreate = () => {
    setEditing(null);
    setForm(BLANK);
    setError("");
    setOpen(true);
  };

  const startEdit = (device) => {
    setEditing(device);
    setForm({
      ...BLANK,
      ...device,
      lat: device.lat ?? "",
      lng: device.lng ?? "",
      population_served: device.population_served ?? "",
    });
    setError("");
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        name: form.name.trim(),
        code: form.code.trim().toUpperCase(),
        village: form.village.trim(),
        district: form.district.trim(),
        state: form.state.trim(),
        location_tag: form.location_tag.trim(),
        lat: form.lat === "" ? null : Number(form.lat),
        lng: form.lng === "" ? null : Number(form.lng),
        population_served: form.population_served === "" ? null : Number(form.population_served),
        mining_affected: !!form.mining_affected,
        status: form.status,
        installed_on: form.installed_on,
        notes: form.notes,
      };

      if (editing) {
        await base44.entities.Device.update(editing.id, payload);
      } else {
        await base44.entities.Device.create({
          ...payload,
          filter_health: 100,
          total_cycles: 0,
          firmware: "swps-1.4.2",
          last_seen: new Date().toISOString(),
        });
        await base44.entities.Threshold.create({ device_code: payload.code, ...DEFAULT_THRESHOLD, updated_by: "System default (WHO)" });
      }
      await queryClient.invalidateQueries({ queryKey: ["swps"] });
      setOpen(false);
    } catch (err) {
      setError(err?.message || "Could not save the unit.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    await base44.entities.Device.delete(toDelete.id);
    await queryClient.invalidateQueries({ queryKey: ["swps"] });
    setToDelete(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-xl text-[12px] leading-relaxed text-muted-foreground">
          Registered purification units and their last known state. Adding a unit creates it with the
          WHO default thresholds, ready to accept readings.
        </p>
        <button
          type="button"
          onClick={startCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" /> Add unit
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-secondary/60" />
          ))}
        </div>
      ) : devices.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {devices.map((device) => {
            const reading = byDevice[device.code];
            const status = overallStatus(reading);
            const isOnline = device.status === "online";
            return (
              <article key={device.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("h-1.5 w-1.5 rounded-full", isOnline ? "bg-emerald-500" : "bg-muted-foreground/40")} />
                      <span className="font-mono text-[10.5px] text-muted-foreground">{device.code}</span>
                      {device.mining_affected && (
                        <span className="rounded-full bg-amber-50 px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                          mining
                        </span>
                      )}
                    </div>
                    <h3 className="mt-1.5 truncate text-[13px] font-bold">{device.name}</h3>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-[10.5px] text-muted-foreground">
                      <MapPin className="h-2.5 w-2.5 shrink-0" />
                      {device.location_tag} · {device.village}
                    </p>
                  </div>
                  <StatusPill status={status} />
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border/70 pt-3 text-[10.5px]">
                  <div>
                    <p className="text-muted-foreground">TDS</p>
                    <p className="font-mono text-[12px]">{reading?.tds ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">NTU</p>
                    <p className="font-mono text-[12px]">{reading?.turbidity ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Level</p>
                    <p className="font-mono text-[12px]">{reading?.level ?? "—"}%</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-border/70 pt-2.5">
                  <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <UserRound className="h-2.5 w-2.5" />
                    {device.population_served ?? "—"} served · {relativeTime(device.last_seen)}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => startEdit(device)}
                      aria-label={`Edit ${device.code}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-primary"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setToDelete(device)}
                      aria-label={`Remove ${device.code}`}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[10px]">
                  <span className="text-muted-foreground">Filter health</span>
                  <span className={cn("font-mono", STATUS_STYLES[status].text)}>
                    {Math.round(device.filter_health ?? 0)}%
                  </span>
                </div>
                <div className="mt-1 h-1 overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      "h-full rounded-full",
                      (device.filter_health ?? 0) < 50 ? "bg-rose-500" : (device.filter_health ?? 0) < 75 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${Math.max(3, Math.min(100, device.filter_health ?? 0))}%` }}
                  />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6">
          <EmptyState icon={Cpu} title="No units registered" hint="Add your first purification unit to begin monitoring." />
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.code}` : "Add a purification unit"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Unit name" required>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Village community unit" />
              </Field>
              <Field label="Device code" required>
                <Input
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  required
                  disabled={!!editing}
                  placeholder="SW-06"
                  className="font-mono"
                />
              </Field>
              <Field label="Village" required>
                <Input value={form.village} onChange={(e) => setForm({ ...form, village: e.target.value })} required />
              </Field>
              <Field label="District">
                <Input value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
              </Field>
              <Field label="Location tag">
                <Input value={form.location_tag} onChange={(e) => setForm({ ...form, location_tag: e.target.value })} placeholder="School water point" />
              </Field>
              <Field label="Population served">
                <Input
                  type="number"
                  min="0"
                  value={form.population_served}
                  onChange={(e) => setForm({ ...form, population_served: e.target.value })}
                />
              </Field>
              <Field label="Latitude">
                <Input type="number" step="0.0001" value={form.lat} onChange={(e) => setForm({ ...form, lat: e.target.value })} />
              </Field>
              <Field label="Longitude">
                <Input type="number" step="0.0001" value={form.lng} onChange={(e) => setForm({ ...form, lng: e.target.value })} />
              </Field>
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </Field>
              <Field label="Installed on">
                <Input type="date" value={form.installed_on || ""} onChange={(e) => setForm({ ...form, installed_on: e.target.value })} />
              </Field>
            </div>

            <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-[12px]">
              <input
                type="checkbox"
                checked={!!form.mining_affected}
                onChange={(e) => setForm({ ...form, mining_affected: e.target.checked })}
                className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
              />
              This source is in a mining-affected area
            </label>

            <Field label="Notes">
              <Textarea rows={2} value={form.notes || ""} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="resize-none" />
            </Field>

            {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-[11.5px] text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">{error}</p>}

            <DialogFooter className="pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full border border-border px-4 py-2 text-[12px] font-semibold text-muted-foreground"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground disabled:opacity-60"
              >
                {saving ? "Saving…" : editing ? "Save changes" : "Add unit"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!toDelete} onOpenChange={(v) => !v && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove {toDelete?.code}?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the unit from the dashboard. Its historical readings and alerts stay in the
              database for reporting.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={remove} className="bg-rose-600 hover:bg-rose-700">
              Remove unit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Field({ label, children, required }) {
  return (
    <div>
      <Label className="text-[11px]">
        {label} {required && <span className="text-rose-500">*</span>}
      </Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
