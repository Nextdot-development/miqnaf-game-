// Generates the OPD clinic illustration (1500x1000) in two states: "unwell" (coughing) and "recovered".
const fs = require("fs");

const C = {
  skin: "#b47b52", skinShade: "#9a6342", skinDark: "#86553a",
  hair: "#2a201b",
  sweater: "#dcc8a6", sweaterShade: "#c8b08a", sweaterRib: "#cdb58f",
  trousers: "#34425d", trousersShade: "#2a3650", shoe: "#1d2331",
  docSkin: "#7b4c33", docSkinShade: "#673d28", docHair: "#1c1411",
  coat: "#f8fafd", coatShade: "#dfe6ef", coatLine: "#c9d3e0", scrubs: "#4d84c4",
  steth: "#263149", metal: "#c9d0da",
};

const sleeve = (d, w, fill, edge) => `<path d="${d}" stroke="${edge}" stroke-width="${w + 6}" fill="none" stroke-linecap="round"/><path d="${d}" stroke="${fill}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;

function scene(state) {
  const well = state === "recovered";
  const out = [];
  const add = s => out.push(s);

  add(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1500 1000" width="1500" height="1000">
<defs>
  <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e6eff9"/><stop offset="1" stop-color="#d4e2f1"/></linearGradient>
  <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c7d5e6"/><stop offset="1" stop-color="#b3c4da"/></linearGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#cfe5f8"/><stop offset="1" stop-color="#f1f7fd"/></linearGradient>
  <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff" stop-opacity="0.55"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></linearGradient>
  <linearGradient id="couch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9dbde3"/><stop offset="1" stop-color="#7fa3d1"/></linearGradient>
  <linearGradient id="coat" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e3e9f2"/><stop offset="0.35" stop-color="#f8fafd"/><stop offset="1" stop-color="#e8edf4"/></linearGradient>
  <linearGradient id="sweater" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9b18b"/><stop offset="0.45" stop-color="#dcc8a6"/><stop offset="1" stop-color="#cfb994"/></linearGradient>
  <linearGradient id="monitor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f1f4f8"/><stop offset="1" stop-color="#dde3eb"/></linearGradient>
  <radialGradient id="shadow"><stop offset="0" stop-color="#5b6f8f" stop-opacity="0.35"/><stop offset="1" stop-color="#5b6f8f" stop-opacity="0"/></radialGradient>
  <clipPath id="torsoClip"><path d="M 468 528 Q 470 470 545 452 L 678 452 Q 752 470 754 528 L 738 728 Q 610 748 484 728 Z"/></clipPath>
</defs>`);

  // ---- Room ----
  add(`<rect width="1500" height="1000" fill="url(#wall)"/>`);
  add(`<rect y="842" width="1500" height="158" fill="url(#floor)"/><rect y="836" width="1500" height="10" fill="#bccbdd"/>`);
  // window with curtain
  add(`<rect x="70" y="88" width="334" height="446" rx="12" fill="#f5f8fc" stroke="#d2dce8" stroke-width="3"/>
  <rect x="90" y="108" width="294" height="406" rx="4" fill="url(#sky)"/>
  <path d="M 90 470 Q 150 430 210 452 Q 260 420 320 446 Q 360 432 384 446 L 384 514 L 90 514 Z" fill="#c5dfd0" opacity="0.6"/>
  <rect x="234" y="108" width="7" height="406" fill="#f5f8fc"/><rect x="90" y="300" width="294" height="7" fill="#f5f8fc"/>
  <path d="M 40 70 L 128 70 Q 112 300 132 560 L 40 560 Z" fill="#b8d0ea"/><path d="M 66 70 Q 58 300 74 560" stroke="#a3bfdf" stroke-width="5" fill="none"/><path d="M 98 70 Q 88 300 104 560" stroke="#a3bfdf" stroke-width="4" fill="none"/>
  <rect x="30" y="58" width="420" height="14" rx="7" fill="#c2cfdf"/>
`);
  // framed certificate
  add(`<rect x="672" y="128" width="120" height="92" rx="6" fill="#fdfdfb" stroke="#c5a46a" stroke-width="6"/><rect x="694" y="150" width="76" height="6" rx="3" fill="#c9d3e0"/><rect x="700" y="166" width="64" height="5" rx="2.5" fill="#dfe5ee"/><rect x="700" y="178" width="64" height="5" rx="2.5" fill="#dfe5ee"/><circle cx="752" cy="200" r="8" fill="#d9a441"/>`);
  // plant
  add(`<ellipse cx="1440" cy="900" rx="70" ry="14" fill="url(#shadow)"/>
  <path d="M 1408 830 L 1472 830 L 1462 900 L 1418 900 Z" fill="#e9eef5" stroke="#cfd8e4" stroke-width="3"/>
  <path d="M 1440 830 Q 1400 760 1372 700 Q 1420 740 1440 830" fill="#6fae8a"/><path d="M 1440 830 Q 1470 740 1500 690 Q 1480 760 1440 830" fill="#5d9c79"/><path d="M 1440 830 Q 1436 740 1446 660 Q 1456 750 1440 830" fill="#7cbb95"/>`);

  // ---- Examination couch ----
  add(`<ellipse cx="560" cy="905" rx="290" ry="26" fill="url(#shadow)"/>
  <rect x="350" y="742" width="420" height="128" rx="10" fill="#e8edf4" stroke="#cdd6e2" stroke-width="3"/>
  <line x1="560" y1="750" x2="560" y2="862" stroke="#cdd6e2" stroke-width="3"/><rect x="430" y="790" width="60" height="8" rx="4" fill="#c4cfdc"/><rect x="630" y="790" width="60" height="8" rx="4" fill="#c4cfdc"/>
  <rect x="320" y="696" width="480" height="54" rx="20" fill="url(#couch)"/>
  <rect x="340" y="702" width="440" height="20" rx="8" fill="#ffffff" opacity="0.7"/>`);

  // ---- Vitals monitor on a rolling stand (screen 860,166 250x200 is redrawn live by the app) ----
  add(`<ellipse cx="985" cy="922" rx="120" ry="18" fill="url(#shadow)"/>
  <rect x="978" y="388" width="14" height="510" rx="7" fill="#b9c4d2"/>
  <path d="M 985 892 L 905 920 M 985 892 L 1065 920 M 985 892 L 985 930" stroke="#a7b3c3" stroke-width="10" stroke-linecap="round"/>
  <circle cx="905" cy="924" r="9" fill="#55637a"/><circle cx="1065" cy="924" r="9" fill="#55637a"/><circle cx="985" cy="934" r="9" fill="#55637a"/>
  <rect x="930" y="470" width="110" height="64" rx="10" fill="#e7ecf2" stroke="#c9d2de" stroke-width="3"/>
  <rect x="845" y="150" width="280" height="250" rx="20" fill="url(#monitor)" stroke="#c6cfdb" stroke-width="3"/>
  <rect x="940" y="134" width="90" height="22" rx="10" fill="#cfd7e2"/>
  <rect x="860" y="166" width="250" height="200" rx="8" fill="#0b2240"/>
  <circle cx="1060" cy="383" r="6" fill="#4cc38a"/><circle cx="1082" cy="383" r="6" fill="#9aa7b8"/><circle cx="1104" cy="383" r="6" fill="#9aa7b8"/>
  <path d="M 1016 456 Q 1000 470 1004 520" stroke="#7d8aa0" stroke-width="5" fill="none"/>`);

  // ---- Patient ----
  // legs (behind torso hem)
  add(`<path d="M 478 712 Q 470 760 496 772 L 712 772 Q 738 760 728 712 Z" fill="${C.trousers}"/>
  <rect x="494" y="752" width="78" height="168" rx="30" fill="${C.trousers}"/><rect x="618" y="752" width="78" height="168" rx="30" fill="${C.trousersShade}"/>
  <path d="M 486 912 Q 486 892 520 892 L 572 892 Q 590 906 590 930 L 480 930 Q 474 920 486 912 Z" fill="${C.shoe}"/>
  <path d="M 612 912 Q 612 892 646 892 L 698 892 Q 716 906 716 930 L 606 930 Q 600 920 612 912 Z" fill="${C.shoe}"/>`);
  // torso + ribbing
  add(`<path d="M 468 528 Q 470 470 545 452 L 678 452 Q 752 470 754 528 L 738 728 Q 610 748 484 728 Z" fill="url(#sweater)"/>`);
  let ribs = "";
  for (let x = 480; x < 750; x += 13) ribs += `<line x1="${x}" y1="450" x2="${x + 4}" y2="750" stroke="${C.sweaterRib}" stroke-width="3" opacity="0.55"/>`;
  add(`<g clip-path="url(#torsoClip)">${ribs}<rect x="460" y="700" width="300" height="50" fill="${C.sweaterShade}" opacity="0.5"/></g>`);
  // neck + collar
  add(`<path d="M 584 404 L 642 404 L 646 466 Q 613 482 580 466 Z" fill="${C.skinShade}"/>
  <path d="M 556 456 Q 613 494 670 456 Q 672 470 668 476 Q 613 512 558 476 Q 554 468 556 456 Z" fill="${C.sweaterShade}"/>`);

  // head (tilted down a little when unwell)
  const tilt = well ? -2 : -7;
  add(`<g transform="rotate(${tilt} 612 400)">`);
  add(`<ellipse cx="551" cy="368" rx="14" ry="20" fill="${C.skinShade}"/><ellipse cx="673" cy="368" rx="14" ry="20" fill="${C.skinShade}"/>
  <ellipse cx="612" cy="362" rx="62" ry="78" fill="${C.skin}"/>
  <path d="M 552 352 Q 548 286 612 280 Q 676 286 672 352 Q 662 318 640 308 Q 612 300 584 308 Q 562 318 552 352 Z" fill="${C.hair}"/>
  <path d="M 554 378 Q 556 452 612 458 Q 668 452 670 378 Q 664 420 640 426 Q 612 414 584 426 Q 560 420 554 378 Z" fill="${C.hair}" opacity="0.92"/>`);
  if (well) {
    // relaxed brows, open soft eyes, smile
    add(`<path d="M 570 334 Q 586 326 602 332" stroke="${C.hair}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M 622 332 Q 638 326 654 334" stroke="${C.hair}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <ellipse cx="588" cy="356" rx="9" ry="6" fill="#ffffff"/><circle cx="590" cy="356" r="5" fill="#2b1a12"/>
    <ellipse cx="636" cy="356" rx="9" ry="6" fill="#ffffff"/><circle cx="638" cy="356" r="5" fill="#2b1a12"/>
    <path d="M 579 350 Q 588 345 598 350" stroke="#5a3522" stroke-width="2.5" fill="none"/><path d="M 627 350 Q 636 345 646 350" stroke="#5a3522" stroke-width="2.5" fill="none"/>
    <path d="M 612 362 Q 606 384 602 390 Q 612 396 622 390" stroke="${C.skinDark}" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 588 404 Q 612 400 636 404" stroke="${C.hair}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M 592 412 Q 612 430 632 412 Z" fill="#ffffff" stroke="#6a2e22" stroke-width="3" stroke-linejoin="round"/>`);
  } else {
    // furrowed brows, eyes squeezed shut
    add(`<path d="M 568 330 L 603 343" stroke="${C.hair}" stroke-width="8" stroke-linecap="round"/>
    <path d="M 656 330 L 621 343" stroke="${C.hair}" stroke-width="8" stroke-linecap="round"/>
    <path d="M 604 322 Q 612 316 620 322" stroke="${C.skinDark}" stroke-width="2.5" fill="none" opacity="0.7"/><path d="M 600 312 Q 612 306 624 312" stroke="${C.skinDark}" stroke-width="2.5" fill="none" opacity="0.6"/>
    <path d="M 576 358 Q 588 350 600 360" stroke="#3a2418" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M 624 360 Q 636 350 648 358" stroke="#3a2418" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M 578 366 Q 588 370 598 367" stroke="${C.skinDark}" stroke-width="2.5" fill="none"/><path d="M 626 367 Q 636 370 646 366" stroke="${C.skinDark}" stroke-width="2.5" fill="none"/>
    <path d="M 612 362 Q 606 384 602 390 Q 612 396 622 390" stroke="${C.skinDark}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  }
  add(`</g>`);

  // left arm (viewer's right): upper arm down, hand on chest (unwell) or on knee (recovered)
  add(sleeve("M 730 500 Q 770 560 766 650", 66, C.sweaterShade, "#b39a74"));
  if (well) {
    add(sleeve("M 766 650 Q 752 712 700 742", 58, C.sweater, "#b39a74") + `
    <ellipse cx="682" cy="760" rx="38" ry="24" fill="${C.skin}"/><path d="M 662 770 L 700 772 M 664 760 L 704 760" stroke="${C.skinShade}" stroke-width="3"/>`);
  } else {
    add(sleeve("M 766 650 Q 730 640 684 622", 56, C.sweater, "#b39a74") + `
    <rect x="676" y="598" width="16" height="46" rx="5" fill="#2a2f3c" transform="rotate(-20 684 621)"/>
    <path d="M 676 594 Q 648 566 598 570 Q 576 576 584 590 L 616 592 L 578 598 Q 570 612 586 616 L 620 612 L 584 624 Q 582 640 600 638 L 632 630 Q 656 646 680 636 Z" fill="${C.skin}" stroke="${C.skinDark}" stroke-width="3" stroke-linejoin="round"/>`);
  }
  // right arm (viewer's left): fist at the mouth (unwell) or resting on the thigh (recovered)
  add(sleeve("M 494 500 Q 462 570 488 650", 66, C.sweaterShade, "#b39a74"));
  if (well) {
    add(sleeve("M 488 650 Q 504 716 560 744", 58, C.sweater, "#b39a74") + `
    <ellipse cx="580" cy="760" rx="38" ry="24" fill="${C.skin}"/><path d="M 560 770 L 598 772 M 562 760 L 602 760" stroke="${C.skinShade}" stroke-width="3"/>`);
  } else {
    add(sleeve("M 488 650 Q 536 566 584 474", 58, C.sweater, "#b39a74") + `
    <path d="M 584 476 L 598 446" stroke="${C.skinShade}" stroke-width="30" stroke-linecap="round"/>
    <g transform="rotate(-12 612 424)">
      <rect x="580" y="400" width="66" height="50" rx="20" fill="#be8660" stroke="${C.skinDark}" stroke-width="3.5"/>
      <path d="M 597 402 L 597 420 M 613 401 L 613 420 M 629 402 L 629 420" stroke="${C.skinDark}" stroke-width="3" stroke-linecap="round" opacity="0.75"/>
      <path d="M 588 432 Q 612 440 638 432" stroke="${C.skinDark}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.6"/>
      <rect x="607" y="414" width="12" height="7" rx="3" fill="#d9b25a"/>
    </g>
    <path d="M 556 380 Q 544 396 556 412 M 540 368 Q 520 396 540 424 M 524 358 Q 498 396 524 434" stroke="#9fb4cf" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.8"/>`);
  }

  // ---- Doctor ----
  add(`<ellipse cx="1290" cy="962" rx="150" ry="20" fill="url(#shadow)"/>
  <rect x="1232" y="820" width="50" height="132" rx="18" fill="#2c3a57"/><rect x="1298" y="820" width="50" height="132" rx="18" fill="#26324c"/>
  <path d="M 1222 948 Q 1222 932 1250 932 L 1284 932 L 1284 962 L 1210 962 Q 1208 952 1222 948 Z" fill="#141924"/>
  <path d="M 1296 948 Q 1296 932 1324 932 L 1352 932 L 1352 962 L 1284 962 Q 1284 952 1296 948 Z" fill="#141924"/>`);
  // coat
  add(`<path d="M 1196 470 Q 1210 438 1260 432 L 1322 432 Q 1376 438 1388 474 L 1408 862 Q 1294 884 1178 862 Z" fill="url(#coat)" stroke="${C.coatLine}" stroke-width="3"/>
  <path d="M 1262 436 L 1290 560 L 1318 436 Z" fill="${C.scrubs}"/>
  <path d="M 1256 436 L 1240 520 L 1286 600 L 1290 864" stroke="${C.coatLine}" stroke-width="4" fill="none"/>
  <path d="M 1324 436 L 1342 520 L 1294 600" stroke="${C.coatLine}" stroke-width="4" fill="none"/>
  <rect x="1322" y="690" width="58" height="66" rx="8" fill="none" stroke="${C.coatLine}" stroke-width="3"/><rect x="1340" y="676" width="7" height="28" rx="3" fill="#2f5fa8"/>
  <rect x="1330" y="530" width="48" height="16" rx="4" fill="#28397f"/>`);
  // neck + head
  add(`<path d="M 1268 392 L 1312 392 L 1316 440 Q 1290 454 1264 440 Z" fill="${C.docSkinShade}"/>
  <ellipse cx="1290" cy="350" rx="56" ry="68" fill="${C.docSkin}"/>
  <ellipse cx="1338" cy="358" rx="11" ry="16" fill="${C.docSkinShade}"/><circle cx="1340" cy="378" r="4" fill="#e3b54d"/>
  <path d="M 1236 346 Q 1232 278 1296 272 Q 1352 276 1350 340 Q 1346 312 1324 302 Q 1290 292 1262 306 Q 1244 318 1236 346 Z" fill="${C.docHair}"/>
  <circle cx="1352" cy="300" r="28" fill="${C.docHair}"/>
  <path d="M 1350 330 Q 1356 352 1344 362 L 1338 340 Z" fill="${C.docHair}"/>`);
  if (well) {
    add(`<path d="M 1254 340 Q 1266 334 1278 338" stroke="${C.docHair}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M 1294 338 Q 1306 334 1316 340" stroke="${C.docHair}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M 1258 356 Q 1266 350 1274 356" stroke="#24150e" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M 1294 356 Q 1302 350 1310 356" stroke="#24150e" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M 1274 364 Q 1268 380 1266 386 Q 1272 390 1280 388" stroke="${C.docSkinShade}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M 1266 400 Q 1282 414 1300 400" stroke="#4a2018" stroke-width="4.5" fill="#ffffff" stroke-linecap="round"/>`);
  } else {
    add(`<path d="M 1254 342 Q 1266 338 1278 342" stroke="${C.docHair}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M 1294 342 Q 1306 338 1316 344" stroke="${C.docHair}" stroke-width="5" fill="none" stroke-linecap="round"/>
    <ellipse cx="1264" cy="362" rx="5.5" ry="4.5" fill="#24150e"/><ellipse cx="1298" cy="362" rx="5.5" ry="4.5" fill="#24150e"/>
    <path d="M 1256 357 Q 1265 352 1273 357" stroke="#24150e" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M 1290 357 Q 1299 352 1307 357" stroke="#24150e" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M 1274 364 Q 1268 380 1266 386 Q 1272 390 1280 388" stroke="${C.docSkinShade}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M 1268 404 Q 1282 400 1296 404" stroke="#4a2018" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  }
  // stethoscope
  add(`<path d="M 1262 440 Q 1236 480 1244 548" stroke="${C.steth}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M 1318 440 Q 1340 486 1330 520 Q 1318 556 1290 570 Q 1262 576 1250 566" stroke="${C.steth}" stroke-width="6" fill="none" stroke-linecap="round"/>
  <circle cx="1244" cy="560" r="14" fill="${C.metal}" stroke="#8d97a6" stroke-width="3"/><circle cx="1244" cy="560" r="6" fill="#8d97a6"/>`);
  // arms holding the clipboard towards the patient
  add(`<path d="M 1376 480 Q 1400 580 1352 640 Q 1300 660 1220 640" stroke="#e6ecf4" stroke-width="58" fill="none" stroke-linecap="round"/>
  <g transform="rotate(-16 1150 600)">
    <rect x="1086" y="520" width="132" height="172" rx="10" fill="#8a5a3a"/>
    <rect x="1098" y="540" width="108" height="140" rx="4" fill="#fbfbf7"/>
    <rect x="1124" y="510" width="56" height="22" rx="6" fill="${C.metal}" stroke="#8d97a6" stroke-width="2"/>
    <rect x="1112" y="562" width="80" height="6" rx="3" fill="#c9d3e0"/><rect x="1112" y="580" width="70" height="6" rx="3" fill="#dfe5ee"/><rect x="1112" y="598" width="76" height="6" rx="3" fill="#dfe5ee"/><rect x="1112" y="616" width="60" height="6" rx="3" fill="#dfe5ee"/>
  </g>
  <ellipse cx="1206" cy="652" rx="26" ry="18" fill="${C.docSkin}"/>
  <path d="M 1204 470 Q 1180 540 1150 586" stroke="#eef2f8" stroke-width="56" fill="none" stroke-linecap="round"/>
  <ellipse cx="1132" cy="596" rx="24" ry="19" fill="${C.docSkin}"/>`);

  add(`</svg>`);
  return out.join("\n");
}

fs.writeFileSync("clinic-scene.svg", scene("unwell"));
fs.writeFileSync("clinic-recovered.svg", scene("recovered"));
console.log("ok");
