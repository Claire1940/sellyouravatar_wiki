"use client";

import { useState, Suspense, lazy } from "react";
import type { ComponentType } from "react";
import {
  ArrowRight,
  Backpack,
  BookOpen,
  Check,
  ChevronDown,
  Coins,
  Crown,
  Gift,
  Newspaper,
  Package,
  Shirt,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useMessages } from "next-intl";
import { VideoFeature } from "@/components/home/VideoFeature";
import { LatestGuidesAccordion } from "@/components/home/LatestGuidesAccordion";
import { NativeBannerAd, AdBanner } from "@/components/ads";
import { getPreferredMobileBannerSelection } from "@/components/ads/mobileAdConfigs";
import { scrollToSection } from "@/lib/scrollToSection";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { ContentItemWithType } from "@/lib/getLatestArticles";
import type { ModuleLinkMap } from "@/lib/buildModuleLinkMap";

// Lazy load heavy components
const HeroStats = lazy(() => import("@/components/home/HeroStats"));
const FAQSection = lazy(() => import("@/components/home/FAQSection"));
const CTASection = lazy(() => import("@/components/home/CTASection"));

// Loading placeholder
const LoadingPlaceholder = ({ height = "h-64" }: { height?: string }) => (
  <div
    className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`}
  />
);

// 状态徽章样式：仅使用主题色 + 中性色，禁止硬编码颜色
const STATUS_STYLES: Record<string, string> = {
  ok: "bg-[hsl(var(--nav-theme)/0.15)] border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]",
  inactive: "bg-white/5 border-border text-muted-foreground",
  expired: "bg-white/5 border-border text-muted-foreground",
  warn: "bg-white/5 border-border text-muted-foreground",
  info: "bg-white/5 border-border text-muted-foreground",
};

function statusStyle(type?: string) {
  return STATUS_STYLES[type || "info"] || STATUS_STYLES.info;
}

// 模块统一头部（展示型辅助组件，不替换独立 section）
function ModuleHeader({
  eyebrow,
  icon: Icon,
  title,
  subtitle,
  intro,
}: {
  eyebrow: string;
  icon: ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  intro?: string;
}) {
  return (
    <div className="text-center mb-8 md:mb-12 scroll-reveal">
      <div className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-3 md:mb-4 bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
        <Icon className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
        <span className="text-xs md:text-sm font-medium uppercase tracking-wide">
          {eyebrow}
        </span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 leading-tight">
        {title}
      </h2>
      <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
        {subtitle}
      </p>
      {intro ? (
        <p className="mt-4 md:mt-5 mx-auto max-w-3xl text-sm md:text-base text-muted-foreground/90 leading-7">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[];
  moduleLinkMap: ModuleLinkMap;
  locale: string;
}

export default function HomePageClient({
  latestArticles,
  locale,
}: HomePageClientProps) {
  const t = useMessages() as any;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.sellyouravatar.wiki";

  // Structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Sell Your Avatar Wiki",
        description:
          "Complete Sell Your Avatar Wiki covering codes, Coins, booths, outfits, trading, and shop guides for the Roblox social avatar marketplace game.",
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Sell Your Avatar - Roblox Social Avatar Marketplace",
        },
        potentialAction: {
          "@type": "SearchAction",
          target: `${siteUrl}/search?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Sell Your Avatar Wiki",
        alternateName: "Sell Your Avatar",
        url: siteUrl,
        description:
          "Complete Sell Your Avatar Wiki resource hub for codes, Coins, booths, outfits, trading, and shop guides",
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          "@type": "ImageObject",
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Sell Your Avatar Wiki - Roblox Social Avatar Marketplace",
        },
        sameAs: [
          "https://www.roblox.com/games/102612844247090/SELL-YOUR-AVATAR",
          "https://www.youtube.com/watch?v=-q-6MbRnILg",
        ],
      },
      {
        "@type": "VideoGame",
        name: "Sell Your Avatar",
        gamePlatform: ["PC", "Mac", "Mobile", "Roblox"],
        applicationCategory: "Game",
        genre: ["Social", "Avatar", "Marketplace", "Simulation"],
        numberOfPlayers: {
          minValue: 1,
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: "https://www.roblox.com/games/102612844247090/SELL-YOUR-AVATAR",
        },
      },
      {
        "@type": "VideoObject",
        name: "How to Sell Your AVATAR for ROBUX!",
        description:
          "Related Roblox avatar guide showing how to sell your avatar for Robux.",
        uploadDate: "2026-07-11",
        thumbnailUrl: `${siteUrl}/images/hero.webp`,
        embedUrl: "https://www.youtube.com/embed/-q-6MbRnILg",
        url: "https://www.youtube.com/watch?v=-q-6MbRnILg",
      },
    ],
  };

  // 模块内嵌手风琴展开状态
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null);
  const mobileBannerAd = getPreferredMobileBannerSelection();

  const codes = t.modules.sellYourAvatarCodes;
  const beginner = t.modules.sellYourAvatarBeginnerGuide;
  const coins = t.modules.sellYourAvatarCoinsGuide;
  const booth = t.modules.sellYourAvatarBoothOutfitGuide;
  const items = t.modules.sellYourAvatarItemsRewardsGuide;
  const inventory = t.modules.sellYourAvatarInventoryEquipGuide;
  const plus = t.modules.sellYourAvatarRobloxPlusBenefits;
  const vip = t.modules.sellYourAvatarVipServersUpdates;

  return (
    <div className="home-shell min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 顶部固定横幅 */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-24 pb-14 md:pt-32 md:pb-20">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 md:px-4 md:py-2
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-4 md:mb-6"
            >
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-xs md:text-sm font-medium">
                {t.hero.badge}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 md:mb-6 leading-[1.05]">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg md:mb-10 md:max-w-3xl md:text-2xl">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="mb-10 flex flex-col justify-center gap-3 sm:flex-row md:mb-12 md:gap-4">
              <button
                onClick={() => scrollToSection("codes")}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-base md:text-lg transition-colors"
              >
                <Gift className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://www.roblox.com/games/102612844247090/SELL-YOUR-AVATAR"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 md:px-8 md:py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-base md:text-lg transition-colors"
              >
                {t.hero.playOnRobloxCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* Video Section - 紧跟 Hero 之后，max-w-5xl 避免挤压广告 */}
      <section className="px-4 py-10 md:py-12">
        <div className="scroll-reveal container mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-2xl">
            <VideoFeature
              videoId="-q-6MbRnILg"
              title="How to Sell Your AVATAR for ROBUX!"
            />
          </div>
        </div>
      </section>

      {/* Tools Grid - 模块导航区（首屏顺序：Hero → Video → Tools Grid），max-w-5xl */}
      <section className="px-4 py-14 md:py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8 md:mb-12 scroll-reveal">
            <h2 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4">
              {t.tools.title}{" "}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 卡片锚点跳转到对应模块 section
              const sectionIds = [
                "codes",
                "beginner-guide",
                "coins-guide",
                "booth-outfit-guide",
                "items-and-rewards-guide",
                "inventory-and-equip-guide",
                "roblox-plus-benefits",
                "vip-servers-and-updates",
              ];
              const sectionId = sectionIds[index];

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group rounded-xl border border-border p-4 md:p-6
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className="mb-3 h-10 w-10 rounded-lg md:mb-4 md:h-12 md:w-12
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors"
                  >
                    <DynamicIcon
                      name={card.icon}
                      className="h-5 w-5 md:h-6 md:w-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="mb-1.5 text-sm md:text-base font-semibold">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {card.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 广告位 2: 首屏内容之后 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ""} />

      {/* 广告位 3: 移动端方形 / 桌面横幅 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Latest Updates Section - 仅有文章时显示 */}
      {latestArticles && latestArticles.length > 0 ? (
        <LatestGuidesAccordion articles={latestArticles} locale={locale} max={12} />
      ) : null}

      {/* Module 1: Codes */}
      <section id="codes" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={codes.eyebrow}
            icon={Gift}
            title={codes.title}
            subtitle={codes.subtitle}
            intro={codes.intro}
          />

          {/* Status Cards */}
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 md:mb-10">
            {codes.statusCards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl"
              >
                <span
                  className={`inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-full border mb-3 ${statusStyle(card.status)}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {card.status === "inactive" ? "Active" : "Expired"}
                </span>
                <h3 className="text-lg font-bold mb-1.5">{card.title}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </div>
            ))}
          </div>

          {/* Redeem Steps */}
          <div className="scroll-reveal">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6 text-center">
              How to Redeem Sell Your Avatar Codes
            </h3>
            <div className="space-y-3 md:space-y-4">
              {codes.redeemSteps.map((step: any, index: number) => (
                <div
                  key={index}
                  className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
                >
                  <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                    <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                      {step.title}
                    </h4>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 广告位 4: 第一模块后 */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-468x60"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60}
        className="hidden md:flex"
      />

      {/* Module 2: Beginner Guide */}
      <section
        id="beginner-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={beginner.eyebrow}
            icon={BookOpen}
            title={beginner.title}
            subtitle={beginner.subtitle}
            intro={beginner.intro}
          />

          {/* Steps */}
          <div className="scroll-reveal space-y-3 md:space-y-4">
            {beginner.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  {step.tip ? (
                    <p className="text-sm text-[hsl(var(--nav-theme-light))] flex items-start gap-2">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">Tip: </span>
                        {step.tip}
                      </span>
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Coins Guide */}
      <section id="coins-guide" className="scroll-mt-24 px-4 py-14 md:py-20">
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={coins.eyebrow}
            icon={Coins}
            title={coins.title}
            subtitle={coins.subtitle}
            intro={coins.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {coins.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <span className="inline-flex text-xs px-2.5 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))] mb-3">
                  {card.category}
                </span>
                <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {card.description}
                </p>
                <ul className="space-y-1.5">
                  {card.details.map((d: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-muted-foreground">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Booth and Outfit Guide */}
      <section
        id="booth-outfit-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={booth.eyebrow}
            icon={Shirt}
            title={booth.title}
            subtitle={booth.subtitle}
            intro={booth.intro}
          />

          <div className="scroll-reveal space-y-3 md:space-y-4">
            {booth.steps.map((step: any, index: number) => (
              <div
                key={index}
                className="flex gap-3 md:gap-4 p-4 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex h-10 w-10 md:h-12 md:w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-[hsl(var(--nav-theme)/0.5)] bg-[hsl(var(--nav-theme)/0.2)]">
                  <span className="text-base md:text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                    {step.step}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-bold mb-1.5 md:mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  {step.examples && step.examples.length > 0 ? (
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2">
                      {step.examples.map((ex: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{ex}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 5: 移动端横幅 */}
      {mobileBannerAd && (
        <AdBanner
          type={mobileBannerAd.type}
          adKey={mobileBannerAd.adKey}
          className="md:hidden"
        />
      )}

      {/* Module 5: Items and Rewards Guide (Table) */}
      <section
        id="items-and-rewards-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={items.eyebrow}
            icon={Package}
            title={items.title}
            subtitle={items.subtitle}
            intro={items.intro}
          />

          {/* Responsive table */}
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.12)] text-[hsl(var(--nav-theme-light))]">
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">
                    {items.tableHeaders.action}
                  </th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">
                    {items.tableHeaders.cost}
                  </th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">
                    {items.tableHeaders.reward}
                  </th>
                  <th className="p-3 md:p-4 font-semibold">
                    {items.tableHeaders.destination}
                  </th>
                  <th className="p-3 md:p-4 font-semibold hidden lg:table-cell">
                    {items.tableHeaders.details}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.rows.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 md:p-4 font-medium">{row.action}</td>
                    <td className="p-3 md:p-4 text-muted-foreground">{row.cost}</td>
                    <td className="p-3 md:p-4">
                      <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-[hsl(var(--nav-theme-light))]">
                        {row.reward}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-muted-foreground">
                      {row.destination}
                    </td>
                    <td className="p-3 md:p-4 text-muted-foreground hidden lg:table-cell">
                      {row.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 移动端 details 单独展示（table 中隐藏列） */}
          <div className="lg:hidden mt-3 space-y-2">
            {items.rows.map((row: any, index: number) => (
              <p key={index} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {row.action}:
                </span>{" "}
                {row.details}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Module 6: Inventory and Equip Guide (Accordion) */}
      <section
        id="inventory-and-equip-guide"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={inventory.eyebrow}
            icon={Backpack}
            title={inventory.title}
            subtitle={inventory.subtitle}
            intro={inventory.intro}
          />

          <div className="scroll-reveal space-y-2">
            {inventory.items.map((item: any, index: number) => (
              <div
                key={index}
                className="border border-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between gap-3 p-4 md:p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold text-sm md:text-base">
                    {item.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`}
                  />
                </button>
                {faqExpanded === index ? (
                  <div className="px-4 md:px-5 pb-5">
                    <p className="text-sm text-muted-foreground mb-3">
                      {item.summary}
                    </p>
                    <ol className="space-y-1.5">
                      {item.steps.map((s: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="flex-shrink-0 mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[hsl(var(--nav-theme)/0.15)] text-xs font-bold text-[hsl(var(--nav-theme-light))]">
                            {i + 1}
                          </span>
                          <span className="text-sm text-muted-foreground">{s}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Roblox Plus Benefits (Comparison Table) */}
      <section
        id="roblox-plus-benefits"
        className="scroll-mt-24 px-4 py-14 md:py-20"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={plus.eyebrow}
            icon={Crown}
            title={plus.title}
            subtitle={plus.subtitle}
            intro={plus.intro}
          />

          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-[hsl(var(--nav-theme)/0.12)] text-[hsl(var(--nav-theme-light))]">
                  <th className="p-3 md:p-4 font-semibold">
                    {plus.tableHeaders.benefit}
                  </th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">
                    {plus.tableHeaders.plus}
                  </th>
                  <th className="p-3 md:p-4 font-semibold whitespace-nowrap">
                    {plus.tableHeaders.standard}
                  </th>
                  <th className="p-3 md:p-4 font-semibold hidden md:table-cell">
                    {plus.tableHeaders.impact}
                  </th>
                </tr>
              </thead>
              <tbody>
                {plus.rows.map((row: any, index: number) => (
                  <tr
                    key={index}
                    className="border-t border-border align-top hover:bg-white/5 transition-colors"
                  >
                    <td className="p-3 md:p-4 font-medium">{row.benefit}</td>
                    <td className="p-3 md:p-4">
                      <span className="inline-flex text-xs px-2 py-0.5 rounded-full bg-[hsl(var(--nav-theme)/0.15)] border border-[hsl(var(--nav-theme)/0.4)] text-[hsl(var(--nav-theme-light))]">
                        {row.plus}
                      </span>
                    </td>
                    <td className="p-3 md:p-4 text-muted-foreground">
                      {row.standard}
                    </td>
                    <td className="p-3 md:p-4 text-muted-foreground hidden md:table-cell">
                      {row.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 移动端 impact 列单独展示 */}
          <div className="md:hidden mt-3 space-y-2">
            {plus.rows.map((row: any, index: number) => (
              <p key={index} className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{row.benefit}:</span>{" "}
                {row.impact}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: VIP Servers and Updates (Status Cards) */}
      <section
        id="vip-servers-and-updates"
        className="scroll-mt-24 px-4 py-14 md:py-20 bg-white/[0.02]"
      >
        <div className="container mx-auto max-w-5xl">
          <ModuleHeader
            eyebrow={vip.eyebrow}
            icon={Newspaper}
            title={vip.title}
            subtitle={vip.subtitle}
            intro={vip.intro}
          />

          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {vip.cards.map((card: any, index: number) => (
              <div
                key={index}
                className="p-5 md:p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-base md:text-lg font-bold">{card.title}</h3>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border whitespace-nowrap ${statusStyle(card.statusType)}`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {card.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {card.description}
                </p>
                <p className="text-sm flex items-start gap-2 text-[hsl(var(--nav-theme-light))]">
                  <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{card.action}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner before footer */}
      <AdBanner
        type="banner-300x250"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250}
        className="md:hidden"
      />
      <AdBanner
        type="banner-728x90"
        adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90}
        className="hidden md:flex"
      />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t.footer.description}
              </p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://www.roblox.com/games/102612844247090/SELL-YOUR-AVATAR"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.roblox}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.youtube.com/watch?v=-q-6MbRnILg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.youtube}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.roblox.com/support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.support}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href={locale === "en" ? "/about" : `/${locale}/about`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/terms-of-service" : `/${locale}/terms-of-service`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href={locale === "en" ? "/copyright" : `/${locale}/copyright`}
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                {t.footer.copyright}
              </p>
              <p className="text-xs text-muted-foreground">
                {t.footer.disclaimer}
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
