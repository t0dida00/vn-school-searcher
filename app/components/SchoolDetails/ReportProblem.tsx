"use client";
import React, { useId, useState } from "react";
import { CheckCircle2, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { schoolId } from "@/app/utils/schoolId";
import { useCountry } from "@/app/utils/useCountry";
import { REPORT_NOTE_MAX, REPORT_REASONS, type ReportReason } from "@/app/lib/reports";

type Status = "closed" | "open" | "sending" | "failed";

// "Report a problem" at the end of a school's details: opens in place (no dialog over the dialog, which works
// badly in the phone drawer) and posts to /api/reports, then thanks the sender in a small dialog and folds back
// to the button. Opened from a campus pin, the campus goes along too.
export default function ReportProblem({ school }: { school: any }) {
    const country = useCountry();
    const [status, setStatus] = useState<Status>("closed");
    const [reason, setReason] = useState<ReportReason | "">("");
    const [note, setNote] = useState("");
    const [thanked, setThanked] = useState(false);
    const ids = useId();

    // Shown over the school's details once the report is stored
    const thanks = (
        <Dialog open={thanked} onOpenChange={setThanked}>
            <DialogContent className="max-w-[calc(100%-2rem)] sm:max-w-sm">
                <DialogHeader className="items-center text-center sm:items-center sm:text-center">
                    <CheckCircle2 aria-hidden className="mb-1 size-10 text-green-600" />
                    <DialogTitle>Thanks for your report</DialogTitle>
                    <DialogDescription>
                        We&apos;ll check {school?.properties?.name ?? "the school"} and fix the data. Reports help keep the
                        information right for everyone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-center">
                    <Button type="button" onClick={() => setThanked(false)} className="w-full sm:w-auto">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    if (status === "closed") {
        return (
            <div className="border-t pt-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setStatus("open")} className="-ml-2 text-muted-foreground">
                    <Flag />
                    Report a problem
                </Button>
                {thanks}
            </div>
        );
    }

    const send = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!reason) return;
        setStatus("sending");
        try {
            const res = await fetch("/api/reports", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country, schoolId: schoolId(school), reason, note, campus: school?.properties?.campus }),
            });
            if (!res.ok) return setStatus("failed");
            setStatus("closed");
            setReason("");
            setNote("");
            setThanked(true);
        } catch {
            setStatus("failed");
        }
    };

    return (
        <form onSubmit={send} className="flex flex-col gap-4 rounded-xl border p-4" aria-labelledby={`${ids}-title`}>
            <h3 id={`${ids}-title`} className="font-semibold">
                What&apos;s wrong with {school?.properties?.campus ? `${school.properties.campus} of ` : ""}this school?
            </h3>
            <RadioGroup value={reason} onValueChange={(v) => setReason(v as ReportReason)} aria-labelledby={`${ids}-title`} className="gap-2.5">
                {REPORT_REASONS.map(({ value, label }) => (
                    <div key={value} className="flex items-center gap-2.5">
                        <RadioGroupItem value={value} id={`${ids}-${value}`} />
                        <Label htmlFor={`${ids}-${value}`} className="cursor-pointer font-normal">
                            {label}
                        </Label>
                    </div>
                ))}
            </RadioGroup>
            <div className="flex flex-col gap-1.5">
                <Label htmlFor={`${ids}-note`} className="font-normal text-muted-foreground">
                    Details, such as the correct value or a link to the source (optional)
                </Label>
                {/* 16px so iOS doesn't zoom in on focus */}
                <textarea
                    id={`${ids}-note`}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    maxLength={REPORT_NOTE_MAX}
                    rows={3}
                    className="min-h-20 w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
            </div>
            {status === "failed" && (
                <p role="alert" className="text-sm text-destructive">
                    The report didn&apos;t go through. Check your connection and send it again.
                </p>
            )}
            <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={!reason || status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send report"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setStatus("closed")} disabled={status === "sending"}>
                    Cancel
                </Button>
            </div>
            <p className="text-xs text-muted-foreground">
                Reports are anonymous: we store the school, the reason and your note, nothing about you.
            </p>
        </form>
    );
}
