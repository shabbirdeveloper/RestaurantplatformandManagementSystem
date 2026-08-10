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
const OUT = "C:\\Users\\ARIFA OVERSEAS 4\\Documents\\naseebcapati\\.tnr_presentation_update\\TNR_Digital_Platform_Presentation_Full_Modules_Static.pptx";
const PREVIEW_DIR = "C:\\Users\\ARIFA OVERSEAS 4\\Documents\\naseebcapati\\.tnr_presentation_update\\previews";
const ASSET_DIR = "C:\\Users\\ARIFA OVERSEAS 4\\Documents\\naseebcapati\\.tnr_presentation_update";
const LOGO_PATH = path.join(ASSET_DIR, "assets", "tnr-logo-transparent.png");
const HERO_PATH = path.join(ASSET_DIR, "assets", "hero.jpg");
const DASHBOARD_PATH = path.join(ASSET_DIR, "assets", "tnr portal dashbaoard.png");
const CARD_FRONT_PATH = path.join(ASSET_DIR, "pdf_renders", "tnr-card-front.png");
const CARD_BACK_PATH = path.join(ASSET_DIR, "pdf_renders", "tnr-card-back.png");
const CERTIFICATE_PATH = path.join(ASSET_DIR, "pdf_renders", "tnr-certificate-cropped.png");
const AI_ASSISTANT_PATH = path.join(ASSET_DIR, "assets", "ai-assistant-real.png");
const ELECTION_RESULTS_PATH = path.join(ASSET_DIR, "assets", "election-results-real.png");

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
async function readBinary(filePath) {
  const fileBytes = await fs.readFile(filePath);
  return fileBytes.buffer.slice(fileBytes.byteOffset, fileBytes.byteOffset + fileBytes.byteLength);
}

const logoBytes = await readBinary(LOGO_PATH);
const heroBytes = await readBinary(HERO_PATH);
const dashboardBytes = await readBinary(DASHBOARD_PATH);
const cardFrontBytes = await readBinary(CARD_FRONT_PATH);
const cardBackBytes = await readBinary(CARD_BACK_PATH);
const certificateBytes = await readBinary(CERTIFICATE_PATH);
const aiAssistantBytes = await readBinary(AI_ASSISTANT_PATH);
const electionResultsBytes = await readBinary(ELECTION_RESULTS_PATH);

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

function addRasterImage(slide, name, blob, contentType, x, y, w, h, fit = "contain", alt = name) {
  return slide.images.add({
    blob,
    contentType,
    alt,
    fit,
    position: { left: x, top: y, width: w, height: h },
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

function addNotes(slide, extra = "", sources = []) {
  const notes = [
    extra,
    "[Sources]",
    "- Platform content and presenter details: user-provided TNR Digital Platform brief, 2026-08-04.",
    "- Official TNR logo: user-provided transparent PNG, tnr-logo-transparent.png.",
    "- Icons: Lucide v1.8.0, ISC License, bundled runtime — https://lucide.dev/.",
    ...sources.map((source) => `- ${source}`),
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

  addRasterImage(slide, "cover-hero", heroBytes, "image/jpeg", 0, 0, 1280, 720, "cover", "TNR community hero artwork supplied for the platform");
  addRect(slide, "cover-left-overlay", 0, 0, 738, 720, "#071E18F2");
  addRect(slide, "cover-image-wash", 738, 0, 150, 720, "#071E1878");
  addRect(slide, "cover-divider", 736, 0, 5, 720, C.gold);
  addRect(slide, "cover-logo-halo", 72, 46, 92, 92, C.white, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 2 } });
  addOfficialLogo(slide, "cover-official-logo", 79, 53, 78);

  addRect(slide, "cover-tag-line", 190, 78, 74, 5, C.gold);
  addText(slide, "cover-eyebrow", "TNR • DIGITAL TRANSFORMATION", 190, 95, 430, 24, {
    fontSize: 15,
    bold: true,
    color: C.gold2,
  });
  addText(slide, "cover-title", "TNR DIGITAL\nPLATFORM", 72, 188, 620, 142, {
    fontSize: 59,
    bold: true,
    color: C.white,
    verticalAlignment: "middle",
    lineSpacing: 0.94,
  });
  addLine(slide, "cover-title-rule", 72, 352, 168, 0, C.gold, 4);
  addText(slide, "cover-subtitle", "Building a Connected, Transparent and\nFuture-Ready Roundu Community", 72, 382, 620, 92, {
    fontSize: 26,
    color: C.gold2,
    lineSpacing: 1.12,
  });

  addText(slide, "cover-presenter", "SHABBIR HUSSAIN", 72, 570, 370, 30, {
    fontSize: 21,
    bold: true,
    color: C.white,
  });
  addText(slide, "cover-role", "Technical Coordinator – TNR", 72, 606, 370, 26, {
    fontSize: 17,
    color: "#AFC4BA",
  });
  addText(slide, "cover-date", "OFFICIAL PLATFORM OVERVIEW", 72, 666, 380, 18, {
    fontSize: 11,
    bold: true,
    color: C.gold,
  });
  addText(slide, "cover-site", "EVOTEGB.COM", 1020, 669, 188, 18, { fontSize: 11, bold: true, color: C.white, alignment: "right" });
  addNotes(
    slide,
    "Open by framing the platform as community infrastructure, not simply a website.",
    ["Hero artwork: user-provided hero.jpg, also used by the live TNR election portal."],
  );
}

// Slide 2 — Why TNR Digital Platform?
{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addHeader(slide, "One platform brings TNR into view", "A shared digital foundation replaces fragmented records, tools and communication.", false, 40);

  addRect(slide, "why-left-band", 0, 202, 390, 430, C.green);
  addText(slide, "why-kicker", "WHY NOW", 72, 229, 220, 22, { fontSize: 13, bold: true, color: C.gold });
  addText(slide, "why-statement", "One reliable\nsource of truth.", 72, 267, 260, 94, {
    fontSize: 34,
    bold: true,
    color: C.white,
    lineSpacing: 1.05,
  });
  addText(slide, "why-support", "Centralization makes information easier to find, services easier to access, and decisions easier to understand.", 72, 382, 258, 76, {
    fontSize: 17,
    color: "#C4D3CC",
    lineSpacing: 1.2,
  });
  const pillars = ["Members", "Records", "Services", "Communication", "Transparency"];
  pillars.forEach((label, i) => {
    const y = 478 + i * 29;
    addRect(slide, `why-item-${i}-dot`, 72, y + 6, 10, 10, i === 4 ? C.gold : C.gold2, { geometry: "ellipse" });
    addText(slide, `why-label-${i}`, label, 96, y, 230, 23, { fontSize: 17, bold: true, color: C.white, verticalAlignment: "middle" });
  });

  addText(slide, "dashboard-live-label", "REAL MEMBER PORTAL VIEW", 896, 181, 312, 18, { fontSize: 11, bold: true, color: C.gold, alignment: "right" });
  addRect(slide, "dashboard-shadow", 470, 206, 738, 460, "#00000018", { radius: 18 });
  addRect(slide, "dashboard-frame", 456, 192, 752, 460, C.white, { radius: 18, line: { style: "solid", fill: C.line, width: 1 } });
  addRasterImage(slide, "dashboard-real-screenshot", dashboardBytes, "image/png", 470, 206, 724, 432, "contain", "Real TNR member portal dashboard screenshot");
  addFooter(slide, 2, false);
  addNotes(slide, "Use the member dashboard to show how identity, services, records and communication meet in one interface.", ["Member portal dashboard: user-provided tnr portal dashbaoard.png."]);
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
  addHeader(slide, "Twenty-four implemented modules power the platform", "A complete operating layer across access, trust, member services, governance and intelligence.", false, 36);

  const completedGroups = [
    {
      title: "FOUNDATION & ACCESS",
      items: [
        "TNR Public Website",
        "Membership Management System",
        "Member Registration and Login",
        "Member Profile Management",
        "Admin Dashboard",
        "Role-Based Portals",
        "Security and Verification",
        "Reports and Analytics",
      ],
    },
    {
      title: "MEMBER SERVICES & TRUST",
      items: [
        "TNR Digital Membership Card",
        "QR Code Membership Verification",
        "Certificate Management System",
        "QR Code Certificate Verification",
        "TNR AI Assistant",
        "Professional CV Builder",
        "Announcements and Notifications",
        "Roundu Information and Statistics Database",
      ],
    },
    {
      title: "GOVERNANCE & ELECTIONS",
      items: [
        "Election Management System",
        "Online Voting Portal",
        "Candidate Management System",
        "Election Results and Reporting",
        "Advisory Council Management",
        "CEC Member Portal",
        "Applications and Approval System",
        "Executive and Organizational Management",
      ],
    },
  ];
  const completedXs = [72, 459, 846];
  addLine(slide, "completed-divider-0", 435, 211, 0, 414, C.line, 1);
  addLine(slide, "completed-divider-1", 822, 211, 0, 414, C.line, 1);
  let completedIndex = 0;
  completedGroups.forEach((group, col) => {
    const x = completedXs[col];
    addText(slide, `completed-column-header-${col}`, group.title, x, 211, 340, 22, { fontSize: 12.5, bold: true, color: C.gold });
    addLine(slide, `completed-column-rule-${col}`, x, 239, 332, 0, C.gold2, 2);
    group.items.forEach((label, row) => {
      const y = 255 + row * 46;
      addText(slide, `completed-number-${completedIndex}`, String(completedIndex + 1).padStart(2, "0"), x, y + 2, 36, 30, { fontSize: 12, bold: true, color: C.gold });
      addText(slide, `completed-label-${completedIndex}`, label, x + 44, y, 292, 38, { fontSize: 15, bold: true, color: C.ink2, verticalAlignment: "middle", lineSpacing: 0.95 });
      completedIndex += 1;
    });
  });
  addFooter(slide, 4, false);
  addNotes(slide, "The TNR Digital Platform now includes twenty-four implemented modules across access, member services, trust, governance and reporting.", [
    "Module status and wording: user-provided TNR Digital Platform Modules list, 2026-08-05.",
  ]);
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
  addHeader(slide, "Digital identity is visible—and instantly verifiable", "The actual member card and certificate carry the credentials needed to confirm identity and status.", false, 38);

  addText(slide, "identity-front-label", "DIGITAL CARD • FRONT", 72, 199, 222, 20, { fontSize: 11, bold: true, color: C.gold, alignment: "center" });
  addText(slide, "identity-back-label", "QR VERIFICATION • BACK", 316, 199, 222, 20, { fontSize: 11, bold: true, color: C.gold, alignment: "center" });
  addText(slide, "identity-certificate-label", "MEMBERSHIP CERTIFICATE • QR + REFERENCE", 668, 199, 540, 20, { fontSize: 11, bold: true, color: C.gold, alignment: "center" });

  addRect(slide, "identity-front-shadow", 80, 238, 222, 341, "#00000018", { radius: 18 });
  addRect(slide, "identity-back-shadow", 324, 238, 222, 341, "#00000018", { radius: 18 });
  addRect(slide, "identity-certificate-shadow", 678, 238, 530, 378, "#00000016", { radius: 16 });
  addRasterImage(slide, "identity-card-front", cardFrontBytes, "image/png", 72, 229, 222, 341, "contain", "Actual TNR digital membership card front");
  addRasterImage(slide, "identity-card-back", cardBackBytes, "image/png", 316, 229, 222, 341, "contain", "Actual TNR digital membership card QR verification back");
  addRasterImage(slide, "identity-certificate", certificateBytes, "image/png", 668, 229, 540, 385, "contain", "Actual TNR membership certificate with QR and reference number");

  addLine(slide, "identity-divider", 603, 232, 0, 368, C.gold2, 2);
  addRect(slide, "identity-feature-band", 72, 620, 1136, 42, C.green, { radius: 21 });
  addText(slide, "identity-features", "Unique Membership ID   •   QR-verified Digital Card   •   Certificate Verification   •   Reference Number Verification   •   Secure Member Records", 92, 629, 1096, 24, {
    fontSize: 15,
    bold: true,
    color: C.white,
    alignment: "center",
    verticalAlignment: "middle",
  });
  addFooter(slide, 6, false);
  addNotes(slide, "Show the card front, QR-enabled back and certificate as one trust system rather than three separate documents.", [
    "Membership card: user-provided TNR Card.pdf, rendered from the original PDF.",
    "Membership certificate: user-provided tnr certificate.pdf, rendered from the original PDF.",
  ]);
}

// Slide 7 — AI Assistant and CV Builder
{
  const slide = presentation.slides.add();
  slide.background.fill = C.paper;
  addHeader(slide, "AI turns member data into guidance and opportunity", "Two practical tools extend the value of every completed member profile.", false, 38);

  addRect(slide, "ai-left-panel", 0, 196, 640, 440, C.green);
  addText(slide, "ai-left-label", "AI ASSISTANT", 72, 218, 260, 24, { fontSize: 13, bold: true, color: C.gold });
  addText(slide, "ai-real-label", "REAL PLATFORM VIEW", 72, 241, 244, 18, { fontSize: 10, bold: true, color: C.gold2, alignment: "center" });
  addRect(slide, "ai-real-shadow", 80, 272, 244, 350, "#00000028", { radius: 18 });
  addRect(slide, "ai-real-frame", 72, 264, 244, 350, C.white, { radius: 18, line: { style: "solid", fill: C.gold, width: 1 } });
  addRasterImage(slide, "ai-real-screenshot", aiAssistantBytes, "image/png", 78, 270, 232, 338, "contain", "Real TNR AI Assistant interface screenshot");

  addText(slide, "ai-proof-title", "GUIDANCE, ON DEMAND", 350, 270, 230, 22, { fontSize: 13, bold: true, color: C.gold2 });
  addCheckLine(slide, "ai-check-1", "24/7 member guidance", 350, 315, 240, true);
  addCheckLine(slide, "ai-check-2", "TNR-related information", 350, 383, 240, true);
  addCheckLine(slide, "ai-check-3", "Smart assistance", 350, 451, 240, true);
  addLine(slide, "ai-proof-rule", 350, 522, 165, 0, C.gold, 3);
  addText(slide, "ai-source-label", "Answers grounded in official TNR information.", 350, 546, 228, 52, { fontSize: 16, color: "#C4D3CC", lineSpacing: 1.18 });

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
  addNotes(slide, "Use the real AI Assistant screenshot to demonstrate that member guidance is already available within the platform.", [
    "AI Assistant screenshot: user-provided platform capture, ai-assistant-real.png.",
    "No real CV Builder screenshot was provided; the CV frame remains clearly labeled as a screenshot placeholder.",
  ]);
}

// Slide 8 — Election and Organizational Management
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;
  addHeader(slide, "Secure participation strengthens governance", "Verified voting and structured organizational workflows support transparent decisions.", true, 40);

  addText(slide, "election-live-tag", "REAL RESULTS VIEW • EVOTEGB.COM", 882, 181, 326, 18, { fontSize: 11, bold: true, color: C.gold, alignment: "right" });
  addText(slide, "election-left-header", "SECURE ONLINE VOTING", 72, 218, 470, 24, { fontSize: 14, bold: true, color: C.gold });
  addText(slide, "election-left-big", "ONE MEMBER.\nONE VERIFIED VOTE.", 72, 255, 470, 80, { fontSize: 31, bold: true, color: C.white, lineSpacing: 1.02 });
  addText(slide, "election-process-proof", "EMAIL OTP  •  IDENTITY CHECK  •  BALLOT RECEIPT", 72, 342, 480, 22, { fontSize: 12, bold: true, color: C.gold2 });

  const voteItems = [
    [Vote, "Secure Online Voting"],
    [Smartphone, "OTP Verification"],
    [CopyX, "Duplicate Vote Prevention"],
    [ChartUp, "Live Results"],
  ];
  voteItems.forEach(([icon, label], i) => {
    const x = i % 2 === 0 ? 72 : 302;
    const y = i < 2 ? 382 : 456;
    addIconDisc(slide, `vote-item-${i}`, icon, x, y, 48, C.green2, C.gold2);
    addText(slide, `vote-label-${i}`, label, x + 62, y - 1, 162, 48, { fontSize: 17, bold: true, color: C.white, verticalAlignment: "middle" });
  });

  addText(slide, "org-left-header", "ORGANIZATIONAL MANAGEMENT", 72, 535, 470, 22, { fontSize: 13, bold: true, color: C.gold });
  const orgItems = ["Application Review", "CEC Management", "Advisory Council Management"];
  const orgXs = [72, 231, 373];
  const orgWs = [145, 128, 190];
  orgItems.forEach((label, i) => {
    addRect(slide, `org-dot-${i}`, orgXs[i], 577, 9, 9, C.gold, { geometry: "ellipse" });
    addText(slide, `org-label-${i}`, label, orgXs[i] + 18, 565, orgWs[i], 38, { fontSize: 15, bold: true, color: C.white, verticalAlignment: "middle" });
  });

  addRect(slide, "election-results-shadow", 638, 222, 570, 414, "#00000028", { radius: 18 });
  addRect(slide, "election-results-frame", 626, 210, 582, 414, C.white, { radius: 18, line: { style: "solid", fill: C.gold, width: 1 } });
  addRasterImage(slide, "election-results-screenshot", electionResultsBytes, "image/png", 640, 224, 554, 386, "contain", "Real TNR election results dashboard screenshot");
  addFooter(slide, 8, true);
  addNotes(slide, "The live election portal verifies a registered email with a six-digit OTP, confirms member identity, supports a reviewed ballot, issues a unique receipt code, and publishes results views.", [
    "TNR Election Portal and process details: https://www.evotegb.com/election-portal, accessed 2026-08-04.",
    "Election results screenshot: user-provided platform capture, election-results-real.png.",
  ]);
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

// Slide 10 — Upcoming Modules
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;
  addHeader(slide, "Thirty planned modules define the next TNR ecosystem", "The roadmap expands opportunity, inclusion, resilience, learning and participation.", true, 36);

  const upcomingGroups = [
    {
      title: "COMMUNITY & SERVICES",
      items: [
        "Jobs and Opportunities Portal",
        "Scholarships and Education Portal",
        "Events and Programs Management",
        "Community Service and Charity",
        "Blood Donor Management",
        "Media and Publications",
        "Document Management",
        "Complaint and Feedback System",
        "Meeting Management",
        "Member Communication System",
      ],
    },
    {
      title: "INCLUSION & NETWORKS",
      items: [
        "Islamic Services",
        "Recognition and Achievement",
        "Donations and Financial Transparency",
        "Women Wing Portal",
        "Overseas Chapters Portal",
        "Regional and UC-Level Portals",
        "Volunteer Management System",
        "Mentorship and Guidance System",
        "TNR Mobile Application",
        "Online Learning Platform",
      ],
    },
    {
      title: "TALENT & FUTURE READINESS",
      items: [
        "Digital Library",
        "Youth Skills Marketplace",
        "Business and Entrepreneur Directory",
        "Student Talent Database",
        "TNR Alumni Network",
        "Internship Matching System",
        "Mobile Voting Application",
        "Roundu Emergency Response Network",
        "Member Contribution Points and Badges",
        "TNR Research and Policy Centre",
      ],
    },
  ];
  const upcomingXs = [72, 459, 846];
  addLine(slide, "upcoming-divider-0", 435, 211, 0, 423, C.green3, 1);
  addLine(slide, "upcoming-divider-1", 822, 211, 0, 423, C.green3, 1);
  let upcomingIndex = 0;
  upcomingGroups.forEach((group, col) => {
    const x = upcomingXs[col];
    addText(slide, `upcoming-column-header-${col}`, group.title, x, 211, 340, 22, { fontSize: 12.5, bold: true, color: C.gold });
    addLine(slide, `upcoming-column-rule-${col}`, x, 239, 332, 0, C.gold, 2);
    group.items.forEach((label, row) => {
      const y = 251 + row * 38;
      addText(slide, `upcoming-number-${upcomingIndex}`, String(upcomingIndex + 1).padStart(2, "0"), x, y + 1, 36, 30, { fontSize: 11.5, bold: true, color: C.gold });
      addText(slide, `upcoming-label-${upcomingIndex}`, label, x + 44, y, 292, 32, { fontSize: 14.25, bold: true, color: C.white, verticalAlignment: "middle", lineSpacing: 0.92 });
      upcomingIndex += 1;
    });
  });
  addFooter(slide, 10, true);
  addNotes(slide, "Present these thirty modules as the planned expansion roadmap for the TNR Digital Platform.", [
    "Planned module status and wording: user-provided TNR Digital Platform Modules list, 2026-08-05.",
  ]);
}

// Slide 11 — Closing
{
  const slide = presentation.slides.add();
  slide.background.fill = C.deep;

  addRect(slide, "closing-side-panel", 934, 0, 346, 720, C.green);
  addRect(slide, "closing-logo-halo", 953, 96, 308, 308, C.white, { geometry: "ellipse", line: { style: "solid", fill: C.gold, width: 2 } });
  addOfficialLogo(slide, "closing-official-logo", 960, 103, 294);

  addRect(slide, "closing-rule-top", 72, 78, 82, 5, C.gold);
  addText(slide, "closing-eyebrow", "TNR DIGITAL PLATFORM", 72, 101, 330, 24, { fontSize: 14, bold: true, color: C.gold2 });
  addText(slide, "closing-main", "THANK YOU", 72, 184, 760, 76, {
    fontSize: 60,
    bold: true,
    color: C.white,
    verticalAlignment: "middle",
  });
  addText(slide, "closing-qa", "Questions & Answers", 72, 275, 720, 48, { fontSize: 32, bold: true, color: C.gold });
  addText(slide, "closing-purpose", "Together, we are building the digital future of TNR.", 72, 345, 750, 36, { fontSize: 21, bold: true, color: C.white });
  addLine(slide, "closing-rule-mid", 72, 411, 180, 0, C.gold, 4);
  addText(slide, "closing-quote", "Technology becomes meaningful\nwhen it serves the community.", 72, 448, 700, 88, {
    fontSize: 27,
    color: C.gold2,
    italic: true,
    lineSpacing: 1.1,
  });
  addText(slide, "closing-presenter", "SHABBIR HUSSAIN  •  TECHNICAL COORDINATOR – TNR", 72, 646, 650, 24, { fontSize: 12, bold: true, color: "#AFC4BA" });

  addLine(slide, "closing-logo-rule", 1003, 446, 208, 0, C.gold, 3);
  addText(slide, "closing-platform", "TNR DIGITAL PLATFORM", 958, 470, 300, 28, { fontSize: 15, bold: true, color: C.white, alignment: "center", verticalAlignment: "middle" });
  addText(slide, "closing-connected", "ONE CONNECTED COMMUNITY", 958, 507, 300, 24, { fontSize: 11, bold: true, color: C.gold2, alignment: "center" });
  addNotes(slide, "Thank the audience, invite questions and close on the community purpose: technology is the enabler, not the destination.");
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
