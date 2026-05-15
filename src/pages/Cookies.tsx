import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Cookie } from "lucide-react";
import { ThemeToggle } from "@/components/privacy/ThemeToggle";
import { LanguageToggle } from "@/components/privacy/LanguageToggle";
import { useTheme } from "@/hooks/useTheme";
import { useT } from "@/i18n/LanguageContext";

const Cookies = () => {
  useTheme();
  const { t, lang } = useT();

  const seoTitle =
    lang === "en" ? "Cookies — Privacy Atlas" : "Cookies — Privacy Atlas";
  const seoDesc =
    lang === "en"
      ? "Full disclosure of every cookie set by Privacy Atlas. No analytics, no tracking — only strictly necessary infrastructure cookies."
      : "Detalle de todas las cookies que utiliza Privacy Atlas. Sin analítica ni tracking, solo cookies de infraestructura estrictamente necesarias.";

  const rows = [
    {
      name: "__cf_bm",
      provider: "Cloudflare",
      purpose: t("ck.cf_bm.purpose"),
      duration: t("ck.cf_bm.dur"),
    },
    {
      name: "__dplb",
      provider: "DigitalOcean App Platform",
      purpose: t("ck.dplb.purpose"),
      duration: t("ck.dplb.dur"),
    },
    {
      name: "session-id",
      provider: "Lovable",
      purpose: t("ck.session.purpose"),
      duration: t("ck.session.dur"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <html lang={lang} />
        <title>{seoTitle}</title>
        <meta name="description" content={seoDesc} />
        <link rel="canonical" href="https://atlas.privacyengineering.cl/cookies" />
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDesc} />
        <meta property="og:url" content="https://atlas.privacyengineering.cl/cookies" />
      </Helmet>

      <header className="border-b border-border bg-hero">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="text-xs uppercase tracking-[0.25em] text-muted-foreground hover:text-accent transition-colors"
          >
            {t("ck.back")}
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex items-end gap-4 md:gap-6 border-b border-border pb-4 mb-6">
          <Cookie className="h-12 w-12 md:h-16 md:w-16 text-accent shrink-0" aria-hidden />
          <div className="flex-1 pb-1">
            <h1 className="font-display text-3xl md:text-5xl font-black leading-tight">
              {t("ck.title")}
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-2 max-w-2xl">
              {t("ck.lead")}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-background/60 border-b border-border">
                <tr className="text-left">
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                    {t("ck.col.name")}
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                    {t("ck.col.provider")}
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs">
                    {t("ck.col.purpose")}
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                    {t("ck.col.duration")}
                  </th>
                  <th className="px-4 py-3 font-semibold uppercase tracking-wider text-xs whitespace-nowrap">
                    {t("ck.col.category")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.name} className="border-b border-border last:border-0 align-top">
                    <td className="px-4 py-3 font-mono text-xs whitespace-nowrap">{r.name}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{r.provider}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.purpose}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                      {r.duration}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-status-comprehensive/10 text-status-comprehensive border border-status-comprehensive/30">
                        {t("ck.cat.necessary")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <section className="mt-10 grid md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <h2 className="font-display text-lg font-bold mb-2">{t("ck.consent.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("ck.consent.body")}</p>
          </div>
          <div className="rounded-xl border border-border bg-card/40 p-5">
            <h2 className="font-display text-lg font-bold mb-2">{t("ck.clear.title")}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{t("ck.clear.body")}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Cookies;
