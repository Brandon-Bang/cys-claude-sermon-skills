"use client";

import { useEffect, useRef, useState } from "react";
import { useUi } from "@/lib/store";
import { MODEL_OPTIONS, getModelOption } from "@/lib/models";

export function ModelPicker() {
  const model = useUi((s) => s.model);
  const setModel = useUi((s) => s.setModel);
  const hydrateModel = useUi((s) => s.hydrateModel);

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Pull persisted choice from localStorage once on mount (avoids SSR mismatch).
  useEffect(() => {
    hydrateModel();
  }, [hydrateModel]);

  // Close on outside click / Escape.
  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const current = getModelOption(model);

  return (
    <div className="model-picker" ref={rootRef}>
      <button
        type="button"
        className="model-picker-trigger"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        title={`현재 모델: ${current.label} — ${current.hint}`}
      >
        <span className="model-picker-icon" aria-hidden="true">◆</span>
        <span className="model-picker-label">{current.short}</span>
        <span className="model-picker-caret" aria-hidden="true">▾</span>
      </button>

      {open && (
        <ul className="model-picker-menu" role="listbox" aria-label="Claude 모델 선택">
          <li className="model-picker-heading">실행 모델</li>
          {MODEL_OPTIONS.map((opt) => {
            const active = opt.id === model;
            return (
              <li key={opt.id}>
                <button
                  type="button"
                  className={`model-picker-item${active ? " active" : ""}`}
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setModel(opt.id);
                    setOpen(false);
                  }}
                >
                  <span className="model-picker-item-main">
                    <span className="model-picker-item-name">{opt.label}</span>
                    {active && <span className="model-picker-check" aria-hidden="true">✓</span>}
                  </span>
                  <span className="model-picker-item-hint">{opt.hint}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
