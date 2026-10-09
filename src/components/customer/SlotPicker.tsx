"use client";
import { useLanguage } from "@/lib/i18n";
import TranslatedContent from "@/components/TranslatedContent";
import { useId } from "react";
import { bookingDate, bookingRange } from "@/lib/customer";
type Slot = { id: string; startTime: string; endTime: string };
type CommonProps = { slots: Slot[]; label: string; name: string };
type Props = CommonProps & ({ multiple?: false; value: string; onChange: (id: string) => void } | { multiple: true; value: string[]; onChange: (ids: string[]) => void; maxSelections: number });
export default function SlotPicker(props: Props) {
  const { slots, label, name } = props;
  const { lang } = useLanguage();
  const id = useId();
  const values = props.multiple ? props.value : props.value ? [props.value] : [];
  const selected = slots.filter(slot => values.includes(slot.id));
  const atLimit = props.multiple && values.length >= props.maxSelections;
  return <TranslatedContent>{<fieldset className="min-w-0">
    <legend className="text-sm font-semibold">{label}</legend>
    <p className="mt-2 text-xs text-ink/60">{props.multiple ? (lang === "fr" ? "Choisis un ou plusieurs créneaux libres. Toutes les heures sont celles de la Suisse." : "Wähle einen oder mehrere freie Termine. Alle Zeiten gelten für die Schweiz.") : "Wähle einen freien Termin. Alle Zeiten gelten für die Schweiz."}</p>
    {props.multiple && <p className="mt-1 text-xs text-ink/60">{lang === "fr" ? "Tu peux sélectionner jusqu’à " : "Du kannst bis zu "}{props.maxSelections}{lang === "fr" ? " créneaux à la fois." : " Termine gleichzeitig auswählen."}</p>}
    {slots.length > 0 && <div className="mt-3 max-h-80 overflow-y-auto rounded-xl border border-ink/30 p-2">
      <div aria-hidden="true" className="hidden grid-cols-[minmax(0,1fr)_8rem] sm:grid gap-3 px-3 pb-2 pl-10 text-xs font-semibold text-ink/60"><span>Datum</span><span>Uhrzeit</span></div>
      <div className="space-y-2">{[...slots].sort((a,b) => a.startTime.localeCompare(b.startTime)).map(slot => {
        const checked = values.includes(slot.id);
        const disabled = atLimit && !checked;
        return <label key={slot.id} htmlFor={id + "-" + slot.id} className={"grid min-h-16 grid-cols-[1rem_minmax(0,1fr)] items-center gap-3 rounded-lg border p-3 transition sm:grid-cols-[1rem_minmax(0,1fr)_8rem] " + (disabled ? "cursor-not-allowed opacity-50 " : "cursor-pointer ") + (checked ? "border-accent-dark bg-accent-soft" : "border-ink/15 bg-white hover:border-accent-dark hover:bg-surface-2")}>
          <input id={id + "-" + slot.id} type={props.multiple ? "checkbox" : "radio"} name={name} value={slot.id} checked={checked} disabled={disabled} onChange={() => {
            if (props.multiple) props.onChange(checked ? values.filter(value => value !== slot.id) : [...values, slot.id]);
            else props.onChange(slot.id);
          }} required={!props.multiple} className="h-4 w-4 accent-accent-dark" />
          <span className="text-sm font-semibold">{bookingDate(slot.startTime, lang)}</span>
          <span className="col-start-2 whitespace-nowrap text-sm tabular-nums sm:col-start-auto">{bookingRange(slot, lang)}</span>
        </label>;
      })}</div>
    </div>}
    {!!selected.length && <div className="mt-2 text-xs font-semibold text-accent-dark"><p>{lang === "fr" ? "Sélection:" : "Ausgewählt:"}{props.multiple ? " " + selected.length : ""}</p><ul className="mt-1 space-y-1">{selected.map(slot => <li key={slot.id}>{bookingDate(slot.startTime, lang)} · {bookingRange(slot, lang)}</li>)}</ul></div>}
  </fieldset>}</TranslatedContent>;
}
