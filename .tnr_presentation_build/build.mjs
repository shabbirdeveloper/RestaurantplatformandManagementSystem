import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

import UsersRound from "lucide/dist/esm/icons/users-round.js";
import BadgeCheck from "lucide/dist/esm/icons/badge-check.js";
import QrCode from "lucide/dist/esm/icons/qr-code.js";
import FileCheck from "lucide/dist/esm/icons/file-check.js";
import Bot from "lucide/dist/esm/icons/bot.js";
import FileUser from "lucide/dist/esm/icons/file-user.js";
import Vote from "lucide/dist/esm/icons/vote.js";
import Landmark from "lucide/dist/esm/icons/landmark.js";
import ShieldCheck from "lucide/dist/esm/icons/shield-check.js";
import Database from "lucide/dist/esm/icons/database.js";
import FolderArchive from "lucide/dist/esm/icons/folder-archive.js";
import Blocks from "lucide/dist/esm/icons/blocks.js";
import MessagesSquare from "lucide/dist/esm/icons/messages-square.js";
import Eye from "lucide/dist/esm/icons/eye.js";
import UserRound from "lucide/dist/esm/icons/user-round.js";
import IdCard from "lucide/dist/esm/icons/id-card.js";
import Fingerprint from "lucide/dist/esm/icons/fingerprint-pattern.js";
import Network from "lucide/dist/esm/icons/network.js";
import UserPlus from "lucide/dist/esm/icons/user-plus.js";
import ClipboardCheck from "lucide/dist/esm/icons/clipboard-check.js";
import UserCog from "lucide/dist/esm/icons/user-cog.js";
import LayoutDashboard from "lucide/dist/esm/icons/layout-dashboard.js";
import Hash from "lucide/dist/esm/icons/hash.js";
import SearchCheck from "lucide/dist/esm/icons/search-check.js";
import MessageCircleQuestion from "lucide/dist/esm/icons/message-circle-question-mark.js";
import Sparkles from "lucide/dist/esm/icons/sparkles.js";
import Download from "lucide/dist/esm/icons/download.js";
import Smartphone from "lucide/dist/esm/icons/smartphone.js";
import CopyX from "lucide/dist/esm/icons/copy-x.js";
import ChartUp from "lucide/dist/esm/icons/chart-no-axes-column-increasing.js";
import Globe from "lucide/dist/esm/icons/globe.js";
import BriefcaseBusiness from "lucide/dist/esm/icons/briefcase-business.js";
import PanelsTopLeft from "lucide/dist/esm/icons/panels-top-left.js";
import MessageCircle from "lucide/dist/esm/icons/message-circle.js";
import ArrowRight from "lucide/dist/esm/icons/arrow-right.js";
import Check from "lucide/dist/esm/icons/check.js";

const W = 1280;
const H = 720;
const OUT = "C:\\Users\\ARIFA OVERSEAS 4\\Documents\\naseebcapati\\TNR_Digital_Platform_Presentation_Official_Logo.pptx";
const PREVIEW_DIR = "C:\\Users\\ARIFA OVERSEAS 4\\Documents\\naseebcapati\\.tnr_presentation_build\\previews_official_logo";
const LOGO_PATH = "F:\\TNR\\tnr-logo-transparent.png";

const C = {
  deep: "#071E18",
  green: "#0D3B2E",
  green2: "#174E3B",
  green3: "#2D6552",
  gold: "#C6A15B",
  gold2: "#E8D6AB",
  paper: "#F6F4EE",
  white: "#FFFFFF",
  black: "#101412",
  ink2: "#34423B",
  muted: "#6E7A73",
  line: "#DADDD7",
  fog: "#E9ECE7",
};

const FONT_HEAD = "Aptos Display";
const FONT_BODY = "Aptos";
const logoFileBytes = await fs.readFile(LOGO_PATH);
const logoBytes = logoFileBytes.buffer.slice(
  logoFileBytes.byteOffset,
  logoFileBytes.byteOffset + logoFileBytes.byteLength,
);

function addRect(slide, name, x, y, w, h, fill, opts = {}) {
  return slide.shapes.add({
    geometry: opts.geometry || "rect",
    name,
    position: { left: x, top: y, width: w, height: h, rotation: opts.rotation || 0 },
    fill,
    line: opts.line || { style: "solid", fill: "none", width: 0 },
    ...(opts.radius ? { borderRadius: opts.radius } : {}),
    ...(opts.shadow ? { shadow: opts.shadow } : {}),
  });
}

function addLine(slide, name, x, y, w, h, color, width = 2, style = "solid") {
  const horizontalFlip = w < 0;
  const verticalFlip = h < 0;
  if (horizontalFlip) {
    x += w;
    w = Math.abs(w);
  }
  if (verticalFlip) {
    y += h;
    h = Math.abs(h);
  }
  return slide.shapes.add({
    geometry: "line",
    name,
    position: { left: x, top: y, width: w, height: h, horizontalFlip, verticalFlip },
    fill: "none",
    line: { style, fill: color, width },
  });
}

function addText(slide, name, text, x, y, w, h, style = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    name,
    position: { left: x, top: y, width: w, height: h },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: style.fontSize ?? 20,
    color: style.color ?? C.black,
    bold: style.bold ?? false,
    italic: style.italic ?? false,
    typeface: style.typeface || (style.bold ? FONT_HEAD : FONT_BODY),
    alignment: style.alignment || "left",
    verticalAlignment: style.verticalAlignment || "top",
    autoFit: style.autoFit || "none",
    wrap: style.wrap || "square",
    lineSpacing: style.lineSpacing,
    insets: style.insets || { top: 0, right: 0, bottom: 0, left: 0 },
  };
  return shape;
}

function attrsToString(attrs) {
  return Object.entries(attrs)
    .map(([key, value]) => `${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}="${String(value)}"`)
    .join(" ");
}

function iconDataUrl(iconNodes, color = C.green, strokeWidth = 1.8) {
  const body = iconNodes.map(([tag, attrs]) => `<${tag} ${attrsToString(attrs)} />`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg, "utf8").toString("base64")}`;
}

function addIcon(slide, name, iconNodes, x, y, size, color = C.green, strokeWidth = 1.8) {
  return slide.images.add({
    dataUrl: iconDataUrl(iconNodes, color, strokeWidth),
    alt: `${name} line icon`,
    fit: "contain",
    position: { left: x, top: y, width: size, height: size },
  });
}

function addOfficialLogo(slide, name, x, y, size) {
  return slide.images.add({
    blob: logoBytes,
    contentType: "image/png",
    alt: "Official TNR community logo",
    fit: "contain",
    position: { left: x, top: y, width: size, height: size },
  });
}

function addIconDisc(slide, name, iconNodes, x, y, size = 48, fill = C.paper, iconColor = C.green) {
  addRect(slide, `${name}-disc`, x, y, size, size, fill, { geometry: "ellipse" });
  addIcon(slide, name, iconNodes, x + size * 0.25, y + size * 0.25, size * 0.5, iconColor, 1.9);
}

function addBrandTag(slide, dark = false) {
  addRect(slide, "brand-gold-square", 72, 42, 10, 10, C.gold);
  addText(slide, "brand-tag", "TNR DIGITAL PLATFORM", 94, 36, 260, 22, {
    fontSize: 14,
    bold: true,
    color: dark ? C.white : C.green,
    verticalAlignment: "middle",
  });
}

function addHeader(slide, title, subtitle, dark = false, titleSize = 40) {
  addBrandTag(slide, dark);
  addText(slide, "slide-title", title, 72, 82, 1136, 54, {
    fontSize: titleSize,
    bold: true,
    color: dark ? C.white : C.green,
    verticalAlignment: "middle",
  });
  if (subtitle) {
    addText(slide, "slide-subtitle", subtitle, 72, 141, 1030, 32, {
      fontSize: 18,
      color: dark ? C.gold2 : C.muted,
      verticalAlignment: "middle",
    });
  }
}

function addFooter(slide, slideNumber, dark = false) {
  const color = dark ? "#A7BBB2" : C.muted;
  addLine(slide, `footer-rule-${slideNumber}`, 72, 671, 1136, 0, dark ? C.green3 : C.line, 1);
  addText(slide, `footer-label-${slideNumber}`, "CONNECTED • TRANSPARENT • FUTURE-READY", 72, 680, 420, 16, {
    fontSize: 11,
    bold: true,
    color,
  });
  addText(slide, `footer-page-${slideNumber}`, String(slideNumber).padStart(2, "0"), 1160, 678, 48, 18, {
    fontSize: 12,
    bold: true,
    color: dark ? C.gold : C.green,
    alignment: "right",
  });
}

function addNotes(slide, extra = "") {
  const notes = [
    extra,
    "[Sources]",
    "- Platform content and presenter details: user-provided TNR Digital Platform brief, 2026-08-04.",
    "- Official TNR logo: user-provided transparent PNG, tnr-logo-transparent.png.",
    "- Icons: Lucide v1.8.0, ISC License, bundled runtime — https://lucide.dev/.",
    "- No external or AI-generated website screenshots used; interface frames are clearly labeled placeholders.",
    "[/Sources]",
  ].filter(Boolean).join("\n");
  slide.speakerNotes.textFrame.setText(notes);
}

function addCheckLine(slide, name, text, x, y, w, dark = false) {
  addRect(slide, `${name}-dot`, x, y + 2, 32, 32, dark ? C.green2 : C.paper, { geometry: "ellipse" });
  addIcon(slide, `${name}-check`, Check, x + 8, y + 10, 16, dark ? C.gold : C.green, 2.2);
  addText(slide, `${name}-text`, text, x + 46, y, w - 46, 36, {
    fontSize: 20,
    bold: true,
    color: dark ? C.white : C.ink2,
    verticalAlignment: "middle",
  });
}

function addBrowserFrame(slide, name, x, y, w, h, label, accent = C.green) {
  addRect(slide, `${name}-shadow`, x + 8, y + 10, w, h, "#00000014", { radius: 18 });
  addRect(slide, `${name}-frame`, x, y, w, h, C.white, {
    radius: 18,
    line: { style: "solid", fill: C.line, width: 1 },
  });
  addRect(slide, `${name}-chrome`, x, y, w, 42, C.fog, { radius: 18 });
  addRect(slide, `${name}-chrome-cover`, x, y + 25, w, 17, C.fog);
  for (let i = 0; i < 3; i += 1) addRect(slide, `${name}-dot-${i}`, x + 18 + i * 15, y + 16, 7, 7, i === 0 ? C.gold : "#B9C0BB", { geometry: "ellipse" });
  addText(slide, `${name}-label`, label, x + 76, y + 8, w - 94, 26, {
    fontSize: 11,
    bold: true,
    color: accent,
    alignment: "right",
    verticalAlignment: "middle",
  });
  return { x, y, w, h };
}

function addModuleRow(slide, name, icon, label, x, y, w) {
  addIconDisc(slide, name, icon, x, y, 42, C.paper, C.green);
  addText(slide, `${name}-label`, label, x + 58, y - 1, w - 58, 44, {
    fontSize: 18,
    bold: true,
    color: C.ink2,
    verticalAlignment: "middle",
  });
}

const presentation = Presentation.create({ slideSize: { width: W, height: H } });

// Slide 1 — Cover
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;

  addRect(slide, "cover-right-panel", 898, 0, 382, 720, C.green);
  addRect(slide, "cover-logo-halo", 919, 117, 340, 340, C.white, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 2 } });
  addOfficialLogo(slide, "cover-official-logo", 927, 125, 324);

  addRect(slide, "cover-tag-line", 72, 66, 74, 5, C.gold);
  addText(slide, "cover-eyebrow", "TNR • DIGITAL TRANSFORMATION", 72, 88, 440, 24, {
    fontSize: 15,
    bold: true,
    color: C.gold2,
  });
  addText(slide, "cover-title", "TNR DIGITAL PLATFORM", 72, 190, 820, 82, {
    fontSize: 62,
    bold: true,
    color: C.white,
    verticalAlignment: "middle",
  });
  addLine(slide, "cover-title-rule", 72, 292, 168, 0, C.gold, 4);
  addText(slide, "cover-subtitle", "Building a Connected, Transparent and\nFuture-Ready Roundu Community", 72, 324, 700, 98, {
    fontSize: 28,
    color: C.gold2,
    lineSpacing: 1.12,
  });

  addText(slide, "cover-presenter", "SHABBIR HUSSAIN", 72, 566, 370, 30, {
    fontSize: 21,
    bold: true,
    color: C.white,
  });
  addText(slide, "cover-role", "Technical Coordinator – TNR", 72, 602, 370, 26, {
    fontSize: 17,
    color: "#AFC4BA",
  });
  addText(slide, "cover-date", "OFFICIAL PLATFORM OVERVIEW", 72, 666, 380, 18, {
    fontSize: 11,
    bold: true,
    color: C.gold,
  });

  addLine(slide, "cover-logo-rule", 986, 494, 206, 0, C.gold, 3);
  addText(slide, "cover-platform-mark", "TNR DIGITAL PLATFORM", 930, 518, 318, 28, {
    fontSize: 16,
    bold: true,
    color: C.white,
    alignment: "center",
    verticalAlignment: "middle",
  });
  addText(slide, "cover-community-mark", "ONE CONNECTED COMMUNITY", 930, 554, 318, 20, { fontSize: 11, bold: true, color: C.gold2, alignment: "center" });
  addNotes(slide, "Open by framing the platform as community infrastructure, not simply a website.");
}

// Slide 2 — Why TNR Digital Platform?
{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addHeader(slide, "One platform brings TNR into view", "A shared digital foundation replaces fragmented records, tools and communication.", false, 40);

  addRect(slide, "why-left-band", 0, 202, 380, 430, C.green);
  addText(slide, "why-kicker", "WHY NOW", 72, 242, 220, 22, { fontSize: 13, bold: true, color: C.gold });
  addText(slide, "why-statement", "Community trust\nneeds one reliable\nsource of truth.", 72, 282, 255, 142, {
    fontSize: 33,
    bold: true,
    color: C.white,
    lineSpacing: 1.05,
  });
  addText(slide, "why-support", "Centralization makes information easier to find, services easier to access, and decisions easier to understand.", 72, 460, 250, 96, {
    fontSize: 18,
    color: "#C4D3CC",
    lineSpacing: 1.2,
  });
  addLine(slide, "why-gold-rule", 72, 585, 88, 0, C.gold, 4);

  const items = [
    [UsersRound, "Members", "One recognized community"],
    [FolderArchive, "Records", "Structured and secure"],
    [Blocks, "Services", "Available from one place"],
    [MessagesSquare, "Communication", "Clear and consistent"],
    [Eye, "Transparency", "Visible processes and status"],
  ];
  const startX = 438;
  const startY = 222;
  const gapY = 78;
  items.forEach(([icon, label, desc], i) => {
    const y = startY + i * gapY;
    addIconDisc(slide, `why-item-${i}`, icon, startX, y, 50, C.white, C.green);
    addText(slide, `why-label-${i}`, label, startX + 68, y - 1, 190, 26, { fontSize: 21, bold: true, color: C.green });
    addText(slide, `why-desc-${i}`, desc, startX + 68, y + 29, 250, 20, { fontSize: 15, color: C.muted });
    addLine(slide, `why-link-${i}`, 765, y + 25, 105, 0, C.gold2, 2);
  });

  addRect(slide, "why-core-shadow", 884, 254, 278, 278, "#00000010", { geometry: "ellipse" });
  addRect(slide, "why-core-outer", 870, 240, 278, 278, C.white, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 3 } });
  addRect(slide, "why-core-inner", 912, 282, 194, 194, C.green, { geometry: "ellipse" });
  addIcon(slide, "why-core-icon", Network, 978, 319, 62, C.gold2, 1.6);
  addText(slide, "why-core-title", "ONE\nSYSTEM", 946, 390, 126, 64, {
    fontSize: 25,
    bold: true,
    color: C.white,
    alignment: "center",
    verticalAlignment: "middle",
    lineSpacing: 0.95,
  });
  addText(slide, "why-core-caption", "Connected • Trusted • Accountable", 870, 550, 278, 26, {
    fontSize: 15,
    bold: true,
    color: C.green,
    alignment: "center",
  });
  addFooter(slide, 2, false);
  addNotes(slide);
}

// Slide 3 — Platform Vision
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;
  addHeader(slide, "One identity connects the whole community", "Every step builds on the one before it—ending in a connected Roundu community.", true, 40);

  addText(slide, "vision-one", "ONE", 72, 210, 355, 162, {
    fontSize: 128,
    bold: true,
    color: C.gold,
    verticalAlignment: "middle",
  });
  addText(slide, "vision-caption", "A SIMPLE PRINCIPLE.\nA COMPLETE DIGITAL FOUNDATION.", 80, 390, 310, 72, {
    fontSize: 18,
    bold: true,
    color: C.gold2,
    lineSpacing: 1.3,
  });
  addLine(slide, "vision-rule", 80, 492, 170, 0, C.green3, 3);
  addText(slide, "vision-promise", "Identity becomes the bridge between people, services, governance and opportunity.", 80, 520, 310, 74, {
    fontSize: 17,
    color: "#AFC4BA",
    lineSpacing: 1.25,
  });

  addLine(slide, "vision-spine", 503, 244, 0, 330, C.gold, 3);
  const steps = [
    [UserRound, "One Member", "Recognized in the community"],
    [IdCard, "One Profile", "Always-current member record"],
    [Fingerprint, "One Digital Identity", "Trusted credentials and access"],
    [Database, "One Centralized Database", "A shared source of truth"],
    [Network, "One Connected Community", "People, services and opportunity"],
  ];
  steps.forEach(([icon, label, desc], i) => {
    const y = 218 + i * 83;
    addRect(slide, `vision-node-${i}`, 484, y + 20, 38, 38, i === 4 ? C.gold : C.green2, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 2 } });
    addText(slide, `vision-num-${i}`, `0${i + 1}`, 552, y, 46, 24, { fontSize: 13, bold: true, color: C.gold });
    addIcon(slide, `vision-icon-${i}`, icon, 613, y + 5, 32, C.gold2, 1.7);
    addText(slide, `vision-label-${i}`, label, 670, y - 1, 470, 34, { fontSize: 25, bold: true, color: C.white, verticalAlignment: "middle" });
    addText(slide, `vision-desc-${i}`, desc, 670, y + 38, 430, 24, { fontSize: 16, color: "#AFC4BA" });
  });
  addFooter(slide, 3, true);
  addNotes(slide);
}

// Slide 4 — Completed Modules
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "Ten completed modules form one operating layer", "Member experience, trusted verification, organizational management and shared data.", false, 38);

  addRect(slide, "modules-stat-band", 0, 201, 330, 431, C.green);
  addText(slide, "modules-big-number", "10", 66, 238, 220, 122, { fontSize: 102, bold: true, color: C.gold, alignment: "center", verticalAlignment: "middle" });
  addText(slide, "modules-stat-title", "COMPLETED\nMODULES", 70, 371, 210, 76, { fontSize: 24, bold: true, color: C.white, alignment: "center", lineSpacing: 1.0 });
  addLine(slide, "modules-stat-rule", 110, 475, 110, 0, C.gold, 4);
  addText(slide, "modules-stat-copy", "Designed to work together as one digital ecosystem.", 66, 506, 220, 68, { fontSize: 17, color: "#C4D3CC", alignment: "center", lineSpacing: 1.2 });

  addText(slide, "modules-left-header", "CONNECTED EXPERIENCE", 382, 218, 330, 22, { fontSize: 13, bold: true, color: C.gold });
  addText(slide, "modules-right-header", "TRUSTED OPERATIONS", 798, 218, 330, 22, { fontSize: 13, bold: true, color: C.gold });
  addLine(slide, "modules-divider", 760, 220, 0, 354, C.line, 1);

  const left = [
    [UsersRound, "Membership Portal"],
    [BadgeCheck, "Digital Membership Card"],
    [QrCode, "QR Verification"],
    [FileCheck, "Certificate Verification"],
    [FileUser, "CV Builder"],
  ];
  const right = [
    [Bot, "AI Assistant"],
    [Vote, "Election Management System"],
    [Landmark, "CEC Portal"],
    [ShieldCheck, "Advisory Council Portal"],
    [Database, "Centralized Community Database"],
  ];
  left.forEach(([icon, label], i) => addModuleRow(slide, `module-left-${i}`, icon, label, 382, 258 + i * 68, 330));
  right.forEach(([icon, label], i) => addModuleRow(slide, `module-right-${i}`, icon, label, 798, 258 + i * 68, 380));
  addFooter(slide, 4, false);
  addNotes(slide);
}

// Slide 5 — Membership Journey
{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addHeader(slide, "Membership becomes one clear digital journey", "A visible path from first registration to full access.", false, 40);

  addLine(slide, "journey-track", 112, 365, 1056, 0, C.gold, 4);
  for (let i = 0; i < 5; i += 1) {
    addRect(slide, `journey-arrow-${i}`, 252 + i * 198, 355, 20, 20, C.gold, { geometry: "chevron" });
  }

  const stages = [
    [UserPlus, "Registration", "Create account"],
    [UserCog, "Profile\nCompletion", "Complete details"],
    [ClipboardCheck, "Admin Review", "Records checked"],
    [ShieldCheck, "Approval", "Membership confirmed"],
    [BadgeCheck, "Digital Membership\nCard", "Verified identity"],
    [LayoutDashboard, "Member\nDashboard", "Services unlocked"],
  ];
  stages.forEach(([icon, label, desc], i) => {
    const x = 58 + i * 198;
    addText(slide, `journey-step-${i}`, `0${i + 1}`, x + 42, 234, 78, 28, { fontSize: 13, bold: true, color: C.gold, alignment: "center" });
    addRect(slide, `journey-node-${i}`, x + 45, 318, 70, 70, i === 5 ? C.green : C.white, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 3 }, shadow: "shadow-sm" });
    addIcon(slide, `journey-icon-${i}`, icon, x + 67, 340, 27, i === 5 ? C.gold2 : C.green, 1.9);
    addText(slide, `journey-label-${i}`, label, x, 414, 160, 58, { fontSize: 20, bold: true, color: C.green, alignment: "center", verticalAlignment: "middle", lineSpacing: 0.95 });
    addText(slide, `journey-desc-${i}`, desc, x, 486, 160, 24, { fontSize: 14, color: C.muted, alignment: "center" });
  });
  addRect(slide, "journey-outcome", 350, 555, 580, 54, C.green, { radius: 27 });
  addText(slide, "journey-outcome-text", "Every stage is trackable, reviewable and connected.", 380, 568, 520, 28, { fontSize: 19, bold: true, color: C.white, alignment: "center", verticalAlignment: "middle" });
  addFooter(slide, 5, false);
  addNotes(slide);
}

// Slide 6 — Digital Identity and Verification
{
  const slide = presentation.slides.add();
  slide.background.fill = C.white;
  addHeader(slide, "Every credential is built to be trusted", "Fast verification for members, administrators and the wider community.", false, 40);

  addRect(slide, "identity-card-shadow", 72 + 10, 220 + 12, 576, 352, "#00000016", { radius: 24 });
  addRect(slide, "identity-card", 72, 220, 576, 352, C.green, { radius: 24 });
  addRect(slide, "identity-card-gold-band", 72, 220, 16, 352, C.gold, { radius: 24 });
  addText(slide, "identity-card-placeholder", "ILLUSTRATIVE DIGITAL CARD LAYOUT", 112, 242, 340, 20, { fontSize: 11, bold: true, color: C.gold2 });
  addText(slide, "identity-card-tnr", "TNR", 112, 282, 120, 58, { fontSize: 44, bold: true, color: C.white, verticalAlignment: "middle" });
  addText(slide, "identity-card-platform", "DIGITAL MEMBERSHIP", 112, 339, 250, 22, { fontSize: 12, bold: true, color: C.gold });

  addRect(slide, "identity-photo", 112, 393, 94, 112, C.green2, { radius: 14, line: { style: "solid", fill: C.green3, width: 1 } });
  addIcon(slide, "identity-photo-icon", UserRound, 138, 418, 42, C.gold2, 1.5);
  addText(slide, "identity-member-name", "MEMBER NAME", 230, 393, 210, 28, { fontSize: 21, bold: true, color: C.white });
  addText(slide, "identity-member-id-label", "UNIQUE MEMBERSHIP ID", 230, 438, 220, 18, { fontSize: 10, bold: true, color: "#AFC4BA" });
  addText(slide, "identity-member-id", "TNR-XXXXXX", 230, 462, 230, 28, { fontSize: 20, bold: true, color: C.gold2 });

  addRect(slide, "identity-qr-frame", 482, 372, 126, 126, C.white, { radius: 12 });
  addIcon(slide, "identity-qr", QrCode, 506, 395, 78, C.green, 1.5);
  addText(slide, "identity-verified", "QR VERIFIED", 482, 515, 126, 18, { fontSize: 10, bold: true, color: C.gold2, alignment: "center" });

  const verificationItems = [
    [Hash, "Unique Membership ID"],
    [QrCode, "QR-verified Digital Card"],
    [FileCheck, "Certificate Verification"],
    [SearchCheck, "Reference Number Verification"],
    [ShieldCheck, "Secure Member Records"],
  ];
  addText(slide, "identity-list-header", "VERIFICATION LAYER", 720, 228, 350, 22, { fontSize: 13, bold: true, color: C.gold });
  verificationItems.forEach(([icon, label], i) => {
    const y = 272 + i * 62;
    addIconDisc(slide, `identity-item-${i}`, icon, 720, y, 42, C.paper, C.green);
    addText(slide, `identity-item-label-${i}`, label, 779, y - 1, 388, 44, { fontSize: 20, bold: true, color: C.ink2, verticalAlignment: "middle" });
  });
  addText(slide, "identity-trust", "TRUST, CONFIRMED IN SECONDS", 720, 594, 420, 24, { fontSize: 14, bold: true, color: C.green });
  addFooter(slide, 6, false);
  addNotes(slide);
}

// Slide 7 — AI Assistant and CV Builder
{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addHeader(slide, "AI turns member data into guidance and opportunity", "Two practical tools extend the value of every completed member profile.", false, 38);

  addRect(slide, "ai-left-panel", 0, 196, 640, 440, C.green);
  addText(slide, "ai-left-label", "AI ASSISTANT", 72, 218, 260, 24, { fontSize: 13, bold: true, color: C.gold });
  addBrowserFrame(slide, "ai-browser", 72, 258, 476, 260, "SCREENSHOT PLACEHOLDER • AI ASSISTANT", C.green);
  addRect(slide, "ai-avatar", 100, 326, 42, 42, C.green, { geometry: "ellipse" });
  addIcon(slide, "ai-avatar-icon", Bot, 110, 336, 22, C.gold2, 1.8);
  addRect(slide, "ai-bubble-1", 158, 322, 330, 56, C.paper, { radius: 15 });
  addText(slide, "ai-bubble-1-text", "How can I help with your TNR membership?", 176, 337, 294, 24, { fontSize: 14, color: C.ink2, verticalAlignment: "middle" });
  addRect(slide, "ai-bubble-2", 238, 399, 250, 48, C.green, { radius: 15 });
  addText(slide, "ai-bubble-2-text", "Guide me to member services.", 254, 412, 218, 22, { fontSize: 13, color: C.white, alignment: "right", verticalAlignment: "middle" });
  addRect(slide, "ai-input", 100, 466, 388, 28, C.fog, { radius: 14 });

  addCheckLine(slide, "ai-check-1", "24/7 member guidance", 72, 542, 260, true);
  addCheckLine(slide, "ai-check-2", "TNR-related information", 340, 542, 250, true);
  addCheckLine(slide, "ai-check-3", "Smart assistance", 72, 586, 260, true);

  addText(slide, "cv-right-label", "CV BUILDER", 708, 218, 260, 24, { fontSize: 13, bold: true, color: C.gold });
  addBrowserFrame(slide, "cv-browser", 708, 258, 500, 260, "SCREENSHOT PLACEHOLDER • CV BUILDER", C.green);
  addRect(slide, "cv-page", 752, 310, 152, 172, C.white, { line: { style: "solid", fill: C.line, width: 1 }, shadow: "shadow-sm" });
  addRect(slide, "cv-photo", 770, 328, 38, 38, C.green, { geometry: "ellipse" });
  addIcon(slide, "cv-photo-icon", UserRound, 780, 338, 18, C.gold2, 1.7);
  addRect(slide, "cv-name-line", 824, 330, 54, 6, C.green);
  addRect(slide, "cv-sub-line", 824, 345, 43, 4, C.gold2);
  [0, 1, 2, 3, 4].forEach((i) => addRect(slide, `cv-line-${i}`, 770, 386 + i * 15, 108 - (i % 2) * 18, 4, i === 0 ? C.gold : C.fog));
  addText(slide, "cv-arrow-copy", "MEMBER PROFILE", 944, 330, 210, 20, { fontSize: 11, bold: true, color: C.muted, alignment: "center" });
  addIcon(slide, "cv-arrow", ArrowRight, 1008, 365, 46, C.gold, 1.9);
  addText(slide, "cv-output-copy", "PROFESSIONAL CV", 944, 425, 210, 22, { fontSize: 15, bold: true, color: C.green, alignment: "center" });

  addCheckLine(slide, "cv-check-1", "Automatic CV generation from member profile", 708, 542, 500, false);
  addCheckLine(slide, "cv-check-2", "Downloadable professional CV", 708, 586, 500, false);
  addFooter(slide, 7, false);
  addNotes(slide);
}

// Slide 8 — Election and Organizational Management
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;
  addHeader(slide, "Secure participation strengthens governance", "Verified voting and structured organizational workflows support transparent decisions.", true, 40);

  addRect(slide, "election-divider-band", 618, 202, 2, 418, C.green3);
  addText(slide, "election-left-header", "SECURE ONLINE VOTING", 72, 218, 440, 24, { fontSize: 14, bold: true, color: C.gold });
  addText(slide, "election-left-big", "ONE MEMBER.\nONE VERIFIED VOTE.", 72, 264, 470, 92, { fontSize: 32, bold: true, color: C.white, lineSpacing: 1.05 });

  const voteItems = [
    [Vote, "Secure Online Voting"],
    [Smartphone, "OTP Verification"],
    [CopyX, "Duplicate Vote Prevention"],
    [ChartUp, "Live Results"],
  ];
  voteItems.forEach(([icon, label], i) => {
    const x = i % 2 === 0 ? 72 : 332;
    const y = i < 2 ? 390 : 492;
    addIconDisc(slide, `vote-item-${i}`, icon, x, y, 52, C.green2, C.gold2);
    addText(slide, `vote-label-${i}`, label, x + 68, y - 1, 185, 52, { fontSize: 18, bold: true, color: C.white, verticalAlignment: "middle" });
  });

  addText(slide, "org-right-header", "ORGANIZATIONAL MANAGEMENT", 690, 218, 460, 24, { fontSize: 14, bold: true, color: C.gold });
  addText(slide, "org-right-big", "Clear workflows.\nVisible responsibility.", 690, 264, 470, 92, { fontSize: 32, bold: true, color: C.white, lineSpacing: 1.05 });
  const orgItems = [
    [ClipboardCheck, "Application Review", "Structured evaluation"],
    [Landmark, "CEC Management", "Central executive coordination"],
    [UsersRound, "Advisory Council Management", "Connected oversight"],
  ];
  orgItems.forEach(([icon, label, desc], i) => {
    const y = 383 + i * 74;
    addIconDisc(slide, `org-item-${i}`, icon, 690, y, 48, C.green2, C.gold2);
    addText(slide, `org-label-${i}`, label, 754, y - 1, 405, 28, { fontSize: 20, bold: true, color: C.white });
    addText(slide, `org-desc-${i}`, desc, 754, y + 31, 380, 20, { fontSize: 14, color: "#AFC4BA" });
  });
  addFooter(slide, 8, true);
  addNotes(slide);
}

// Slide 9 — Benefits for TNR Members
{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addHeader(slide, "Member value grows with every interaction", "Identity, services, communication and opportunity come together in one place.", false, 40);

  const leftYs = [235, 329, 423, 517];
  const rightYs = [235, 329, 423, 517];
  leftYs.forEach((y, i) => addLine(slide, `benefit-left-link-${i}`, 372, y + 29, 126, 0, C.gold2, 2));
  rightYs.forEach((y, i) => addLine(slide, `benefit-right-link-${i}`, 768, y + 29, 140, 0, C.gold2, 2));

  addRect(slide, "benefit-core-shadow", 498, 266, 284, 284, "#00000012", { geometry: "ellipse" });
  addRect(slide, "benefit-core", 484, 252, 284, 284, C.green, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 4 } });
  addIcon(slide, "benefit-core-icon", UserRound, 592, 304, 68, C.gold2, 1.5);
  addText(slide, "benefit-core-label", "MEMBER\nVALUE", 550, 390, 152, 76, { fontSize: 29, bold: true, color: C.white, alignment: "center", verticalAlignment: "middle", lineSpacing: 0.95 });
  addText(slide, "benefit-core-copy", "One connected experience", 520, 478, 212, 22, { fontSize: 14, color: "#BFD0C7", alignment: "center" });

  const leftBenefits = [
    [IdCard, "Digital Identity"],
    [BadgeCheck, "Verified Membership"],
    [PanelsTopLeft, "Easy Access to Services"],
    [FileUser, "Professional CV"],
  ];
  const rightBenefits = [
    [MessageCircle, "Better Communication"],
    [Eye, "Transparency"],
    [Globe, "Global Networking"],
    [BriefcaseBusiness, "Centralized Opportunities"],
  ];
  leftBenefits.forEach(([icon, label], i) => {
    const y = leftYs[i];
    addRect(slide, `benefit-left-box-${i}`, 72, y, 300, 58, C.white, { radius: 14, line: { style: "solid", fill: C.line, width: 1 } });
    addIcon(slide, `benefit-left-icon-${i}`, icon, 92, y + 15, 28, C.green, 1.8);
    addText(slide, `benefit-left-label-${i}`, label, 136, y, 215, 58, { fontSize: 18, bold: true, color: C.ink2, verticalAlignment: "middle" });
  });
  rightBenefits.forEach(([icon, label], i) => {
    const y = rightYs[i];
    addRect(slide, `benefit-right-box-${i}`, 908, y, 300, 58, C.white, { radius: 14, line: { style: "solid", fill: C.line, width: 1 } });
    addIcon(slide, `benefit-right-icon-${i}`, icon, 928, y + 15, 28, C.green, 1.8);
    addText(slide, `benefit-right-label-${i}`, label, 972, y, 215, 58, { fontSize: 18, bold: true, color: C.ink2, verticalAlignment: "middle" });
  });
  addFooter(slide, 9, false);
  addNotes(slide);
}

// Slide 10 — Closing
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;

  addRect(slide, "closing-side-panel", 934, 0, 346, 720, C.green);
  addRect(slide, "closing-logo-halo", 953, 96, 308, 308, C.white, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 2 } });
  addOfficialLogo(slide, "closing-official-logo", 960, 103, 294);

  addRect(slide, "closing-rule-top", 72, 78, 82, 5, C.gold);
  addText(slide, "closing-eyebrow", "TNR DIGITAL PLATFORM", 72, 101, 330, 24, { fontSize: 14, bold: true, color: C.gold2 });
  addText(slide, "closing-main", "Together, We Are Building\nthe Digital Future of TNR.", 72, 203, 820, 154, {
    fontSize: 49,
    bold: true,
    color: C.white,
    lineSpacing: 1.03,
  });
  addLine(slide, "closing-rule-mid", 72, 405, 180, 0, C.gold, 4);
  addText(slide, "closing-quote", "Technology becomes meaningful\nwhen it serves the community.", 72, 447, 700, 88, {
    fontSize: 28,
    color: C.gold2,
    italic: true,
    lineSpacing: 1.1,
  });
  addText(slide, "closing-presenter", "SHABBIR HUSSAIN  •  TECHNICAL COORDINATOR – TNR", 72, 646, 650, 24, { fontSize: 12, bold: true, color: "#AFC4BA" });

  addLine(slide, "closing-logo-rule", 1003, 446, 208, 0, C.gold, 3);
  addText(slide, "closing-platform", "TNR DIGITAL PLATFORM", 958, 470, 300, 28, { fontSize: 15, bold: true, color: C.white, alignment: "center", verticalAlignment: "middle" });
  addText(slide, "closing-connected", "ONE CONNECTED COMMUNITY", 958, 507, 300, 24, { fontSize: 11, bold: true, color: C.gold2, alignment: "center" });
  addNotes(slide, "Close on the community purpose: technology is the enabler, not the destination.");
}

await fs.mkdir(PREVIEW_DIR, { recursive: true });
for (const [index, slide] of presentation.slides.items.entries()) {
  const stem = `slide-${String(index + 1).padStart(2, "0")}`;
  const png = await presentation.export({ slide, format: "png", scale: 1 });
  await fs.writeFile(path.join(PREVIEW_DIR, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
  const layout = await slide.export({ format: "layout" });
  await fs.writeFile(path.join(PREVIEW_DIR, `${stem}.layout.json`), await layout.text(), "utf8");
}

const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
await fs.writeFile(path.join(PREVIEW_DIR, "deck-montage.webp"), new Uint8Array(await montage.arrayBuffer()));

const inspect = await presentation.inspect({ kind: "slide,textbox,shape,image,notes", maxChars: 30000 });
await fs.writeFile(path.join(PREVIEW_DIR, "deck-inspect.ndjson"), inspect.ndjson, "utf8");

const pptx = await PresentationFile.exportPptx(presentation);
await pptx.save(OUT);
console.log(OUT);
