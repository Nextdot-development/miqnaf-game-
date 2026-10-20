/* eslint-disable @next/next/no-img-element -- local kiosk assets */
"use client";

import { QrCode, X } from "lucide-react";
import { MIQNAF } from "@/data/brand";
import { MiqnafWordmark, PlaceholderTag } from "./MiqnafWordmark";
import { Modal } from "./Modal";
import { PrimaryButton } from "./PrimaryButton";

/** MIQNAF information. All content comes from data/brand.ts and stays a placeholder until approved. */
export function LearnMoreModal({ onClose }: { onClose: () => void }) {
  const { learnMore } = MIQNAF;
  return (
    <Modal labelledBy="learn-more-title" onClose={onClose} panelClassName="max-w-[88rem]">
      <div className="flex flex-col gap-10 p-8 wide:flex-row wide:gap-14 wide:p-14">
        <div className="flex flex-col gap-6 wide:w-[24rem] wide:shrink-0">
          <MiqnafWordmark height={5} />
          <p className="text-body leading-snug text-navy/75">{MIQNAF.scientificMessage.text}</p>
          <div className="flex flex-col items-start gap-3">
            {learnMore.qrCodeSrc ? (
              <img src={learnMore.qrCodeSrc} alt={learnMore.qrCaption} className="h-52 w-52 rounded-xl bg-white p-3" />
            ) : (
              <div className="flex h-52 w-52 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-navy/25 bg-paper text-center text-navy/50">
                <QrCode size="4rem" aria-hidden />
                <span className="px-4 text-tag leading-tight">QR code pending approval</span>
              </div>
            )}
            <span className="text-label text-navy/60">{learnMore.qrCaption}</span>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <h2 id="learn-more-title" className="font-display text-popup font-bold uppercase leading-none">
              {learnMore.title}
            </h2>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label="Close"
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-navy transition-colors hover:bg-navy/10"
            >
              <X size="2.25rem" aria-hidden />
            </button>
          </div>

          <div className="flex flex-col divide-y divide-navy/10">
            {learnMore.sections.map((section) => (
              <section key={section.heading} className="py-5 first:pt-0">
                <div className="flex items-center gap-4">
                  <h3 className="text-label font-bold uppercase tracking-[0.08em] text-red">{section.heading}</h3>
                  {section.body.placeholder && <PlaceholderTag />}
                </div>
                <p className="mt-2 text-body leading-snug text-navy/80">{section.body.text}</p>
              </section>
            ))}
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
            <p className="text-label text-navy/50">{learnMore.footnote}</p>
            <PrimaryButton size="md" onClick={onClose}>
              Close
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
}
