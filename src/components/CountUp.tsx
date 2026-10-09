"use client";
export default function CountUp({ value, suffix = "" }: { value: number; suffix?: string; duration?: number }) { return <span>{value}{suffix}</span>; }
