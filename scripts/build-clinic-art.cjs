// OPD clinic scene, close-up and blue-lit to sit alongside the painted ICU illustration.
// 1500x1000 units; two states: "unwell" (coughing into his fist) and "recovered" (smiling).
const fs = require("fs");

// Outlined sleeve: a darker edge, the knit colour, then a soft highlight along the lit side.
const arm = (d, w) => `<path d="${d}" stroke="#7d7a80" stroke-width="${w + 8}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#cbbb9f" stroke-width="${w}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#ece2cf" stroke-width="${w * 0.35}" fill="none" stroke-linecap="round" opacity="0.7" transform="translate(-${w * 0.18} -${w * 0.08})"/>`;

function scene(state) {
  const well = state === "recovered";
  const o = [];
  const add = s => o.push(s);

  add(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 1000" width="1500" height="1000">
<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="1" y2="0.3">
    <stop offset="0" stop-color="#2f78c9"/><stop offset="0.45" stop-color="#1b56a3"/><stop offset="1" stop-color="#0d356f"/>
  </linearGradient>
  <radialGradient id="windowGlow" cx="0.12" cy="0.3" r="0.55">
    <stop offset="0" stop-color="#e9f7ff" stop-opacity="0.95"/><stop offset="0.35" stop-color="#9fd4fb" stop-opacity="0.55"/><stop offset="1" stop-color="#2f78c9" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="bokehWarm"><stop offset="0" stop-color="#ffd27a"/><stop offset="0.5" stop-color="#ffb347" stop-opacity="0.7"/><stop offset="1" stop-color="#ff9a2e" stop-opacity="0"/></radialGradient>
  <radialGradient id="bokehCool"><stop offset="0" stop-color="#d9f2ff"/><stop offset="1" stop-color="#7cc4ff" stop-opacity="0"/></radialGradient>
  <filter id="bgBlur" x="-5%" y="-5%" width="110%" height="110%"><feGaussianBlur stdDeviation="7"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="1.2"/></filter>
  <filter id="shadowBlur"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.5  0 0 0 0 0.55  0 0 0 0 0.65  0 0 0 0.09 0"/>
  </filter>

  <!-- skin: lit from the window on the left, cool shadow on the right -->
  <linearGradient id="skin" x1="0" y1="0" x2="1" y2="0.2">
    <stop offset="0" stop-color="#e3a77c"/><stop offset="0.4" stop-color="#c4875d"/><stop offset="0.8" stop-color="#8d5e4a"/><stop offset="1" stop-color="#5f4550"/>
  </linearGradient>
  <radialGradient id="cheekLight" cx="0.32" cy="0.45" r="0.45"><stop offset="0" stop-color="#f2c09a" stop-opacity="0.75"/><stop offset="1" stop-color="#f2c09a" stop-opacity="0"/></radialGradient>
  <linearGradient id="skinHand" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#e2a57a"/><stop offset="0.55" stop-color="#b9794f"/><stop offset="1" stop-color="#6c4a4a"/>
  </linearGradient>
  <linearGradient id="hair" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a3d4f"/><stop offset="0.5" stop-color="#1d1a1f"/><stop offset="1" stop-color="#14121a"/></linearGradient>
  <linearGradient id="sweater" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#e7dcc6"/><stop offset="0.35" stop-color="#cbbb9f"/><stop offset="0.75" stop-color="#9c9a9e"/><stop offset="1" stop-color="#6f7894"/>
  </linearGradient>
  <linearGradient id="sleeve" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#efe5d1"/><stop offset="0.6" stop-color="#cdbda1"/><stop offset="1" stop-color="#8f8f98"/>
  </linearGradient>
  <linearGradient id="coat" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#eef6ff"/><stop offset="0.5" stop-color="#c9dcf3"/><stop offset="1" stop-color="#7f9fcb"/>
  </linearGradient>
  <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#dfe9f6"/><stop offset="1" stop-color="#8ea6c6"/></linearGradient>
  <radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stop-color="#06204a" stop-opacity="0"/><stop offset="1" stop-color="#06204a" stop-opacity="0.45"/></radialGradient>
  <pattern id="knit" width="16" height="22" patternUnits="userSpaceOnUse">
    <path d="M 2 0 Q 8 11 2 22 M 10 0 Q 16 11 10 22" stroke="#5b5550" stroke-opacity="0.16" stroke-width="3" fill="none"/>
  </pattern>
</defs>`);

  // ---- Background clinic, out of focus ----
  add(`<g filter="url(#bgBlur)">
  <rect width="1500" height="1000" fill="url(#wall)"/>
  <rect x="40" y="40" width="360" height="560" rx="10" fill="#d9f0ff" opacity="0.9"/>
  ${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<rect x="40" y="${60 + i * 45}" width="360" height="14" fill="#8fc3ee" opacity="0.55"/>`).join("")}
  <rect width="1500" height="1000" fill="url(#windowGlow)"/>
  <rect x="420" y="560" width="520" height="440" rx="12" fill="#1a4f97"/>
  <rect x="440" y="600" width="230" height="140" rx="8" fill="#245fae"/><rect x="690" y="600" width="230" height="140" rx="8" fill="#245fae"/>
  <rect x="440" y="300" width="300" height="200" rx="10" fill="#2a66b3" opacity="0.8"/>
  <rect x="470" y="330" width="80" height="140" rx="6" fill="#3d7fca"/><rect x="570" y="350" width="60" height="120" rx="6" fill="#4789d4"/><rect x="650" y="320" width="64" height="150" rx="6" fill="#3779c4"/>
  <rect x="860" y="250" width="160" height="260" rx="14" fill="#2c6dbd" opacity="0.85"/>
  <rect x="880" y="280" width="120" height="80" rx="6" fill="#5a9be0" opacity="0.8"/>
  <circle cx="905" cy="400" r="9" fill="url(#bokehWarm)"/><circle cx="940" cy="400" r="9" fill="#62d39b"/>
  <circle cx="1010" cy="560" r="26" fill="url(#bokehWarm)"/><circle cx="830" cy="470" r="18" fill="url(#bokehWarm)"/>
  <circle cx="480" cy="250" r="30" fill="url(#bokehCool)" opacity="0.7"/><circle cx="760" cy="200" r="22" fill="url(#bokehCool)" opacity="0.6"/>
  <rect x="1400" y="0" width="100" height="1000" fill="#0b2c5e"/>
</g>`);

  // ---- Wall-mounted vitals monitor (in focus). Screen 1060,120 280x210 is redrawn live by the app. ----
  add(`<rect x="1170" y="380" width="40" height="120" rx="10" fill="#5d7aa3"/>
  <rect x="1032" y="92" width="336" height="300" rx="26" fill="url(#bezel)"/>
  <rect x="1040" y="100" width="320" height="284" rx="22" fill="none" stroke="#f4f9ff" stroke-opacity="0.6" stroke-width="3"/>
  <rect x="1060" y="120" width="280" height="210" rx="10" fill="#071b38"/>
  <circle cx="1250" cy="356" r="8" fill="#3fbf8a"/><circle cx="1278" cy="356" r="8" fill="#3fbf8a"/><circle cx="1306" cy="356" r="8" fill="#ffb347"/>
  <rect x="1080" y="350" width="120" height="12" rx="6" fill="#7d93b4"/>`);

  // ---- Doctor at the right edge (coat, stethoscope, clipboard), face out of frame ----
  add(`<ellipse cx="1250" cy="980" rx="320" ry="60" fill="#04173a" opacity="0.45" filter="url(#shadowBlur)"/>
  <path d="M 1150 470 Q 1240 420 1340 430 Q 1450 440 1500 470 L 1500 1000 L 1060 1000 Q 1080 700 1150 470 Z" fill="url(#coat)"/>
  <path d="M 1300 432 L 1262 560 L 1340 760 L 1330 1000" stroke="#9fb8da" stroke-width="5" fill="none"/>
  <path d="M 1300 432 Q 1330 500 1360 520 L 1388 440" fill="#3e78c2"/>
  <path d="M 1236 470 Q 1200 560 1222 640 Q 1238 690 1270 700" stroke="#1b2438" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M 1390 470 Q 1410 560 1370 640 Q 1330 700 1286 706" stroke="#1b2438" stroke-width="10" fill="none" stroke-linecap="round"/>
  <circle cx="1280" cy="712" r="24" fill="#c9d4e2" stroke="#7d8aa0" stroke-width="5"/><circle cx="1280" cy="712" r="10" fill="#7d8aa0"/>
  <path d="M 1180 560 Q 1120 700 1000 760" stroke="url(#coat)" stroke-width="120" fill="none" stroke-linecap="round"/>
  <path d="M 1180 560 Q 1120 700 1000 760" stroke="#7f9fcb" stroke-opacity="0.35" stroke-width="122" fill="none" stroke-linecap="round" transform="translate(6 10)"/>
  <g transform="rotate(-24 940 760)">
    <rect x="860" y="660" width="170" height="220" rx="12" fill="#6b4a37"/>
    <rect x="874" y="686" width="142" height="182" rx="5" fill="#eef3fa"/>
    <rect x="910" y="650" width="70" height="28" rx="7" fill="#b9c4d4"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="892" y="${712 + i * 26}" width="${100 - (i % 2) * 24}" height="7" rx="3.5" fill="#aebfd8"/>`).join("")}
  </g>
  <path d="M 1040 730 Q 1000 724 966 744 Q 952 760 968 770 L 1000 766 Q 980 784 992 798 Q 1030 806 1060 784 Z" fill="#7b4c35" stroke="#4e2e22" stroke-width="3" stroke-linejoin="round"/>
  <path d="M 972 752 Q 990 744 1010 748" stroke="#a5704f" stroke-width="4" fill="none" opacity="0.7" stroke-linecap="round"/>`);

  // ---- Patient ----
  // shoulders + torso
  add(`<path d="M 250 1000 Q 240 760 360 700 Q 450 660 520 650 L 700 650 Q 790 660 880 710 Q 990 780 980 1000 Z" fill="url(#sweater)"/>
  <path d="M 250 1000 Q 240 760 360 700 Q 450 660 520 650 L 700 650 Q 790 660 880 710 Q 990 780 980 1000 Z" fill="url(#knit)"/>
  <path d="M 520 650 Q 610 700 700 650 Q 712 668 704 684 Q 610 742 516 684 Q 508 668 520 650 Z" fill="#a99a84"/>`);
  // neck
  add(`<path d="M 548 560 L 668 560 L 676 660 Q 612 690 540 660 Z" fill="url(#skin)"/><path d="M 600 600 Q 640 640 676 650 L 676 600 Z" fill="#5f4550" opacity="0.35"/>`);

  const tilt = well ? -2 : -6;
  add(`<g transform="rotate(${tilt} 600 560)">`);
  // ears
  add(`<path d="M 492 410 Q 462 404 462 446 Q 466 494 500 500 Z" fill="#c78a60"/><path d="M 708 412 Q 742 406 742 448 Q 738 494 702 502 Z" fill="#7a5250"/>`);
  // face
  add(`<path d="M 490 400 C 488 320 530 268 600 266 C 672 268 714 320 712 400 C 712 470 700 530 668 570 C 645 598 625 612 600 612 C 575 612 555 598 532 570 C 500 530 490 470 490 400 Z" fill="url(#skin)"/>
  <path d="M 490 400 C 488 320 530 268 600 266 C 672 268 714 320 712 400 C 712 470 700 530 668 570 C 645 598 625 612 600 612 C 575 612 555 598 532 570 C 500 530 490 470 490 400 Z" fill="url(#cheekLight)"/>`);
  // hair, with lighter strands catching the window light
  add(`<path d="M 484 410 C 470 300 528 228 606 228 C 686 230 734 300 718 410 C 712 360 694 320 664 302 C 630 290 570 290 540 304 C 510 322 492 360 484 410 Z" fill="url(#hair)"/>
  <path d="M 520 290 Q 560 262 610 260 M 540 300 Q 580 280 630 280 M 500 340 Q 520 300 556 286" stroke="#6f7690" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
  <path d="M 486 410 Q 482 440 492 460 L 500 410 Z" fill="#1d1a1f"/><path d="M 716 410 Q 720 440 710 462 L 702 410 Z" fill="#14121a"/>`);
  // beard and moustache
  add(`<path d="M 494 452 Q 500 540 548 590 Q 600 632 652 590 Q 700 540 708 452 Q 700 520 664 540 Q 640 520 600 522 Q 560 520 536 540 Q 502 520 494 452 Z" fill="#1f1b20" opacity="0.92"/>
  <path d="M 540 532 Q 600 506 662 532 Q 640 548 600 546 Q 560 548 540 532 Z" fill="#1f1b20"/>
  ${Array.from({ length: 40 }, (_, i) => { const a = Math.PI * (0.1 + 0.8 * (i / 39)); const x = 600 - Math.cos(a) * 100, y = 540 + Math.sin(a) * 70; return `<path d="M ${x.toFixed(0)} ${y.toFixed(0)} l ${(Math.random() * 6 - 3).toFixed(1)} 9" stroke="#4a4552" stroke-width="2" opacity="0.6"/>`; }).join("")}`);
  // nose
  add(`<path d="M 602 410 Q 594 460 578 482 Q 590 500 610 496 Q 628 500 636 486" stroke="#7a4c3a" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M 610 420 Q 612 460 622 478" stroke="#f0c19c" stroke-width="5" fill="none" opacity="0.6" stroke-linecap="round"/>`);
  if (well) {
    add(`<path d="M 516 372 Q 548 352 580 364" stroke="#1d1a1f" stroke-width="13" fill="none" stroke-linecap="round"/><path d="M 622 364 Q 656 352 688 372" stroke="#14121a" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M 526 412 Q 552 396 580 412 Q 552 424 526 412 Z" fill="#f4ede6"/><circle cx="555" cy="410" r="9" fill="#2a1a12"/><circle cx="558" cy="407" r="3" fill="#fff"/>
    <path d="M 622 412 Q 650 396 678 412 Q 650 424 622 412 Z" fill="#e6dcd6"/><circle cx="651" cy="410" r="9" fill="#2a1a12"/><circle cx="654" cy="407" r="3" fill="#fff"/>
    <path d="M 522 410 Q 552 388 584 408 M 618 408 Q 650 388 682 410" stroke="#4a2e24" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 530 426 Q 552 436 576 428 M 626 428 Q 650 436 674 426" stroke="#8d5e4a" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M 556 552 Q 600 590 646 552 Q 600 572 556 552 Z" fill="#fbf6f0" stroke="#5c2a22" stroke-width="5" stroke-linejoin="round"/>`);
  } else {
    add(`<path d="M 512 362 L 590 388" stroke="#1d1a1f" stroke-width="15" stroke-linecap="round"/><path d="M 692 362 L 614 388" stroke="#14121a" stroke-width="15" stroke-linecap="round"/>
    <path d="M 588 340 Q 602 330 616 340 M 584 324 Q 602 312 620 324" stroke="#8d5e4a" stroke-width="3.5" fill="none" opacity="0.75"/>
    <path d="M 526 420 Q 554 404 584 422" stroke="#2a1a12" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M 620 422 Q 650 404 678 420" stroke="#2a1a12" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M 520 432 L 506 442 M 522 424 L 504 424 M 684 432 L 698 442 M 682 424 L 700 424" stroke="#8d5e4a" stroke-width="3" stroke-linecap="round" opacity="0.8"/>
    <path d="M 534 436 Q 556 446 580 438 M 624 438 Q 648 446 670 436" stroke="#8d5e4a" stroke-width="3" fill="none" opacity="0.7"/>`);
  }
  add(`</g>`);

  if (!well) {
    // right forearm rising to a fist at his mouth
    add(arm("M 500 1020 Q 520 820 566 676", 128) + `
    <path d="M 566 684 L 586 610" stroke="#b07250" stroke-width="88" stroke-linecap="round"/>
    <path d="M 566 684 L 586 610" stroke="#7a5250" stroke-width="30" stroke-linecap="round" opacity="0.35" transform="translate(24 6)"/>
    <g transform="rotate(-14 610 560)">
      <rect x="530" y="502" width="160" height="118" rx="48" fill="url(#skinHand)" stroke="#6a4434" stroke-width="4"/>
      <path d="M 568 508 L 568 552 M 606 504 L 606 552 M 644 506 L 644 552" stroke="#6a4434" stroke-width="4" stroke-linecap="round" opacity="0.7"/>
      <path d="M 552 584 Q 610 602 670 584" stroke="#6a4434" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.6"/>
      <path d="M 548 520 Q 580 508 620 512" stroke="#f3c7a3" stroke-width="6" fill="none" opacity="0.55" stroke-linecap="round"/>
      <rect x="616" y="534" width="22" height="13" rx="5" fill="#e0b64f"/>
    </g>
    <path d="M 492 520 Q 474 548 492 576 M 466 504 Q 438 548 466 594 M 440 488 Q 402 548 440 610" stroke="#d6ecff" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.7"/>`);
  }

  // grade + grain + vignette
  add(`<rect width="1500" height="1000" fill="#1d5aa8" opacity="${well ? 0.04 : 0.08}" style="mix-blend-mode:multiply"/>
  <rect width="1500" height="1000" filter="url(#grain)"/>
  <rect width="1500" height="1000" fill="url(#vignette)"/>`);
  add(`</svg>`);
  return o.join("\n");
}

fs.writeFileSync("clinic-paint-scene.svg", scene("unwell"));
fs.writeFileSync("clinic-paint-recovered.svg", scene("recovered"));
console.log("ok");
