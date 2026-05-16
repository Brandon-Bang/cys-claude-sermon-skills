"use client";

import { useUi } from "@/lib/store";

type Device = "desktop" | "tablet" | "phone";

export function DeviceToggle() {
  const device = useUi((s) => s.device);
  const setDevice = useUi((s) => s.setDevice);

  return (
    <div className="float-toggle" role="group" aria-label="Device preview">
      <DevBtn current={device} value="desktop" onClick={setDevice} title="데스크탑">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
      </DevBtn>
      <DevBtn current={device} value="tablet" onClick={setDevice} title="태블릿">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
      </DevBtn>
      <DevBtn current={device} value="phone" onClick={setDevice} title="핸드폰">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
      </DevBtn>
    </div>
  );
}

function DevBtn({
  current, value, onClick, title, children,
}: {
  current: Device;
  value: Device;
  onClick: (d: Device) => void;
  title: string;
  children: React.ReactNode;
}) {
  const active = current === value;
  return (
    <button
      className={`ft-btn${active ? " active" : ""}`}
      onClick={() => onClick(value)}
      title={title}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
