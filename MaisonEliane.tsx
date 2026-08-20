/**
 * Maison Éliane — Modest Bridal Atelier (landing page)
 *
 * ── Add these tokens to the project's index.css (inside @layer base) ──────────
 * :root {
 *   --ivory: 38 44% 97%;
 *   --cream: 36 33% 93%;
 *   --sand: 33 28% 86%;
 *   --champagne: 34 30% 78%;
 *   --blush: 18 32% 92%;
 *   --gold: 36 32% 57%;
 *   --gold-deep: 34 30% 46%;
 *   --ink: 30 12% 18%;
 *   --muted-ink: 30 8% 42%;
 *   --hairline: 33 22% 84%;
 * }
 *
 * ── tailwind.config.ts → theme.extend ────────────────────────────────────────
 * colors: {
 *   ivory: "hsl(var(--ivory))", cream: "hsl(var(--cream))", sand: "hsl(var(--sand))",
 *   champagne: "hsl(var(--champagne))", blush: "hsl(var(--blush))",
 *   gold: "hsl(var(--gold))", "gold-deep": "hsl(var(--gold-deep))",
 *   ink: "hsl(var(--ink))", "muted-ink": "hsl(var(--muted-ink))",
 *   hairline: "hsl(var(--hairline))",
 * },
 * fontFamily: { serif: ['"Cormorant Garamond"', 'Georgia', 'serif'], sans: ['Jost', 'system-ui', 'sans-serif'] },
 *
 * ── assets ───────────────────────────────────────────────────────────────────
 * Copy the 7 files from images/ into the project as public/images/
 * (hero.jpg, gown-aurelie.jpg, gown-seraphine.jpg, gown-noor.jpg,
 * gown-amalia.jpg, atelier.jpg, detail.jpg). Imagery generated with Seedream 5 Pro.
 *
 * ── enquiries ────────────────────────────────────────────────────────────────
 * The booking form writes to the `enquiries` table in Supabase. RLS allows the
 * publishable key to INSERT only — it cannot read anyone's details back.
 * Reading goes through the `get_enquiries(p_password)` database function, which
 * the static admin page (admin.html) calls. The password lives in the database.
 *
 * ── index.html <head> ────────────────────────────────────────────────────────
 * <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet">
 */

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/* Supabase — safe to publish: RLS lets this key INSERT enquiries and nothing else. */
const SUPABASE_URL = "https://jclvyahmxbxveebzvaqi.supabase.co";
const SUPABASE_KEY = "sb_publishable_F5ghtfOBBNu9bzyR7PIBnw_xssmSwV2";

/* ── scroll reveal ─────────────────────────────────────────────────────────── */
function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          window.setTimeout(() => setShown(true), delay);
          io.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-[opacity,transform] duration-1000 ease-[cubic-bezier(.2,.7,.3,1)] motion-reduce:transition-none ${
        shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-7 motion-reduce:opacity-100 motion-reduce:translate-y-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

const Eyebrow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <p className={`text-[0.68rem] uppercase tracking-[0.34em] text-gold-deep ${className}`}>{children}</p>
);

const Rule = ({ className = "" }: { className?: string }) => (
  <div className={`h-px w-16 bg-gold/60 my-6 ${className}`} />
);

/* ── gown photography ──────────────────────────────────────────────────────── */
type GownKey = "aline" | "ballgown" | "sheath" | "empire";

const GOWN_IMAGES: Record<GownKey, string> = {
  aline: "/images/gown-aurelie.jpg",
  ballgown: "/images/gown-seraphine.jpg",
  sheath: "/images/gown-noor.jpg",
  empire: "/images/gown-amalia.jpg",
};

function Gown({ variant, alt }: { variant: GownKey; alt: string }) {
  return (
    <img
      src={GOWN_IMAGES[variant]}
      alt={alt}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(.2,.7,.3,1)] group-hover:scale-[1.05]"
    />
  );
}

/* ── data ──────────────────────────────────────────────────────────────────── */
const NAV = [
  { href: "#collection", label: "Collection" },
  { href: "#atelier", label: "The Atelier" },
  { href: "#experience", label: "Experience" },
  { href: "#brides", label: "Brides" },
  { href: "#visit", label: "Visit" },
];

const STATS = [
  { num: "13", lbl: "Years of Atelier" },
  { num: "900+", lbl: "Brides Dressed" },
  { num: "100%", lbl: "Made to Measure" },
  { num: "4–6", lbl: "Months Lead Time" },
];

const GOWNS: { key: GownKey; tag: string; name: string; meta: string; price: string }[] = [
  { key: "aline", tag: "A-Line", name: "Aurélie", meta: "Illusion Sleeve · Chantilly Lace", price: "From $2,480" },
  { key: "ballgown", tag: "Ballgown", name: "Séraphine", meta: "High Neck · Silk Mikado", price: "From $3,150" },
  { key: "sheath", tag: "Sheath", name: "Noor", meta: "Long Sleeve · Heavy Crepe", price: "From $2,240" },
  { key: "empire", tag: "Empire", name: "Amalia", meta: "Bishop Sleeve · Pearled Tulle", price: "From $2,890" },
];

const CODES = [
  {
    numeral: "I",
    kicker: "Sleeve & Neckline",
    title: "Modest, by default",
    copy: "Sleeves, a closed neckline and a fully lined bodice are drawn into the pattern at the first sketch. Never added afterwards, never a favour, never a surcharge.",
  },
  {
    numeral: "II",
    kicker: "Pattern & Fit",
    title: "Cut for you alone",
    copy: "We draft a fresh pattern to your measurements instead of grading a sample up or down. It is slower and it costs us more — and it is why the gown stays where you left it when you dance.",
  },
  {
    numeral: "III",
    kicker: "Hand Finishing",
    title: "Finished at the bench",
    copy: "Hems, buttons and beadwork are worked by hand, roughly a hundred and forty hours to a gown. A machine is faster. It cannot follow a curve the way a thumb can.",
  },
];

const STEPS = [
  ["Consultation", "Ninety private minutes. We talk silhouette, fabric, venue and coverage — and you try on the house collection at your own pace."],
  ["Design & Draft", "Your gown is sketched, costed and patterned to your measurements. Sleeve length, neckline and lining are decided here."],
  ["Fittings", "Two to three fittings across ten weeks, adjusting drape and length until the gown moves the way you do."],
  ["The Reveal", "Final press, veil styling and a full dressing rehearsal, so nothing about the morning is a surprise."],
];

const QUOTES = [
  ["I visited four salons before Éliane, and every one of them handed me a shawl. Here, the sleeves were already there.", "Rivka M. · Manchester"],
  ["The fit was so exact that I forgot I was wearing something made for me. I danced for five hours and never once adjusted it.", "Talia B. · Antwerp"],
  ["My mother's lace was worked into the cuffs. They did it without being asked twice, and without charging me for the sentiment.", "Naomi K. · Golders Green"],
];

/* ── page ──────────────────────────────────────────────────────────────────── */
export default function MaisonEliane() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("We reply within two working days.");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const fullName = String(data.get("fullname") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    if (!fullName || !email) {
      setNote("Please add your name and email.");
      return;
    }

    setSending(true);
    setNote("Sending…");

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/enquiries`, {
        method: "POST",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          wedding_date: String(data.get("date") ?? "") || null,
          style: String(data.get("style") ?? ""),
          message: String(data.get("message") ?? "").trim() || null,
        }),
      });
      if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);

      setNote("Thank you — we have your request and will reply within two working days.");
      form.reset();
    } catch (err) {
      console.error(err);
      setNote("We could not send that just now. Please email hello@maisoneliane.com instead.");
    } finally {
      setSending(false);
    }
  };

  const onLight = !solid && !open;

  return (
    <div className="min-h-[100dvh] w-full overflow-x-hidden bg-ivory font-sans text-base font-light leading-[1.75] text-ink antialiased">
      {/* NAV */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background,box-shadow,padding] duration-500 ${
          solid ? "bg-ivory/95 py-3.5 shadow-[0_1px_0_hsl(var(--hairline))] backdrop-blur-xl" : "py-6"
        }`}
      >
        <div className="mx-auto flex w-[min(1200px,100%-3rem)] items-center justify-between gap-8">
          <a href="#top" className={`font-serif text-2xl uppercase leading-tight tracking-[0.3em] transition-colors duration-500 ${onLight ? "text-ivory" : "text-ink"}`}>
            Éliane
            <span className="mt-1 block font-sans text-[0.53rem] tracking-[0.42em] opacity-75">Bridal Atelier</span>
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className={`group relative pb-1 text-[0.7rem] uppercase tracking-[0.2em] transition-colors duration-500 ${
                  solid ? "text-muted-ink hover:text-ink" : "text-ivory/90"
                }`}
              >
                {n.label}
                <span className="absolute inset-x-0 bottom-0 h-px w-0 bg-current transition-[width] duration-500 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <Button
            asChild
            className={`hidden rounded-sm border px-6 py-5 text-[0.72rem] uppercase tracking-[0.22em] transition-colors duration-500 md:inline-flex ${
              solid
                ? "border-ink bg-ink text-ivory hover:bg-transparent hover:text-ink"
                : "border-ivory/50 bg-transparent text-ivory hover:bg-ivory hover:text-ink"
            }`}
          >
            <a href="#visit">Book a Fitting</a>
          </Button>

          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className={`md:hidden ${onLight ? "text-ivory" : "text-ink"}`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* mobile drawer */}
        <div
          className={`fixed inset-0 -z-10 flex flex-col items-center justify-center gap-8 bg-ivory transition-transform duration-500 ease-[cubic-bezier(.2,.7,.3,1)] md:hidden ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="text-base uppercase tracking-[0.28em] text-ink">
              {n.label}
            </a>
          ))}
          <a href="#visit" onClick={() => setOpen(false)} className="mt-4 border border-ink bg-ink px-8 py-4 text-[0.72rem] uppercase tracking-[0.22em] text-ivory">
            Book a Fitting
          </a>
        </div>
      </header>

      {/* HERO */}
      <section
        id="top"
        className="relative grid min-h-[100dvh] place-items-center overflow-hidden px-0 pb-20 pt-36 text-center text-ivory lg:justify-items-start lg:text-left"
        style={{ background: "radial-gradient(120% 90% at 50% 0%, hsl(30 14% 34%) 0%, hsl(28 13% 22%) 45%, hsl(28 14% 15%) 100%)" }}
      >
        <img
          src="/images/hero.jpg"
          alt="Bride in a long-sleeved lace gown holding a bouquet"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[50%_28%] lg:object-[70%_22%]"
        />
        <div
          className="pointer-events-none absolute inset-0 lg:hidden"
          style={{ background: "linear-gradient(180deg,hsl(28 14% 10% / .78) 0%,hsl(28 14% 12% / .52) 38%,hsl(28 14% 10% / .74) 78%,hsl(28 14% 10% / .9) 100%)" }}
        />
        <div
          className="pointer-events-none absolute inset-0 hidden lg:block"
          style={{
            background:
              "linear-gradient(100deg,hsl(28 14% 8% / .92) 0%,hsl(28 14% 9% / .82) 30%,hsl(28 14% 10% / .55) 50%,hsl(28 14% 10% / .12) 76%,hsl(28 14% 10% / .38) 100%),linear-gradient(to top,hsl(28 14% 10% / .78) 0%,transparent 32%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[11%] bg-gradient-to-t from-ivory from-[8%] to-transparent" />

        <Reveal className="relative z-10 mx-auto max-w-[52rem] px-6 lg:mx-0 lg:max-w-[40rem] lg:px-0 lg:ml-[max(1.5rem,calc((100vw-1200px)/2))]">
          <Eyebrow className="text-champagne">Bridal Atelier · Established 2012</Eyebrow>
          <h1 className="mt-6 font-serif text-[clamp(2.9rem,8.2vw,6.4rem)] font-light leading-[1.02] tracking-[-0.01em] lg:text-[clamp(3.2rem,5.4vw,5rem)]">
            Modest by design.
            <br />
            <em className="italic text-champagne">Radiant</em> by nature.
          </h1>
          <p className="mx-auto mt-8 max-w-[34rem] text-[clamp(0.95rem,1.5vw,1.08rem)] leading-[1.9] text-ivory/[0.86] lg:mx-0 lg:max-w-[31rem]">
            Hand-finished gowns for the bride who wants to be seen for herself. Full coverage, exquisite fabric, and a
            silhouette cut for no one else.
          </p>
          <div className="mt-11 flex flex-wrap justify-center gap-4 lg:justify-start">
            <Button asChild className="rounded-sm border border-ivory/50 bg-transparent px-9 py-6 text-[0.72rem] uppercase tracking-[0.22em] text-ivory hover:bg-ivory hover:text-ink">
              <a href="#visit">Book a Private Fitting</a>
            </Button>
            <Button asChild variant="ghost" className="rounded-sm px-9 py-6 text-[0.72rem] uppercase tracking-[0.22em] text-ivory underline underline-offset-[6px] hover:bg-transparent hover:text-champagne">
              <a href="#collection">View the Collection</a>
            </Button>
          </div>
        </Reveal>

        <div className="absolute bottom-9 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-ivory/60">
          <span>Scroll</span>
          <i className="block h-11 w-px animate-pulse bg-gradient-to-b from-champagne to-transparent" />
        </div>
      </section>

      {/* STATS */}
      <div className="relative z-10 border-y border-hairline bg-cream">
        <div className="mx-auto grid w-[min(1200px,100%)] grid-cols-1 gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.lbl} delay={i * 90}>
              <div className="h-full bg-cream px-6 py-10 text-center">
                <div className="font-serif text-[2.4rem] leading-none text-gold-deep">{s.num}</div>
                <div className="mt-3 text-[0.63rem] uppercase tracking-[0.24em] text-muted-ink">{s.lbl}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* COLLECTION */}
      <section id="collection" className="py-[clamp(5rem,11vw,9.5rem)]">
        <div className="mx-auto w-[min(1200px,100%-3rem)]">
          <Reveal className="mx-auto max-w-[44rem] text-center">
            <Eyebrow>The Collection</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.12]">
              Signature gowns, <em className="italic text-gold-deep">quietly</em> extraordinary.
            </h2>
            <Rule className="mx-auto" />
            <p className="mt-5 text-[1.02rem] text-muted-ink">
              Every silhouette in the house collection is designed with full sleeves, a closed neckline and a lined
              bodice — then tailored to your measurements, your fabric, your day.
            </p>
          </Reveal>

          <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-[clamp(1.2rem,2.6vw,2.2rem)]">
            {GOWNS.map((g, i) => (
              <Reveal key={g.name} delay={(i % 4) * 90}>
                <article className="group flex h-full flex-col overflow-hidden rounded-sm border border-hairline bg-cream transition-all duration-500 ease-[cubic-bezier(.2,.7,.3,1)] hover:-translate-y-2 hover:border-champagne hover:shadow-[0_24px_60px_-28px_hsl(30_20%_30%/.34)]">
                  <figure className="relative m-0 aspect-[3/4] overflow-hidden">
                    <span className="absolute left-4 top-4 z-10 bg-ivory/90 px-3 py-1.5 text-[0.56rem] uppercase tracking-[0.22em] text-gold-deep">
                      {g.tag}
                    </span>
                    <Gown variant={g.key} alt={g.name + " — " + g.meta} />
                  </figure>
                  <div className="flex flex-1 flex-col border-t border-hairline bg-ivory px-6 pb-7 pt-6">
                    <h3 className="font-serif text-[1.75rem] font-light leading-tight">{g.name}</h3>
                    <div className="mt-2 text-[0.68rem] uppercase tracking-[0.16em] text-muted-ink">{g.meta}</div>
                    <div className="mt-auto flex items-baseline justify-between gap-4 border-t border-hairline pt-4">
                      <span className="font-serif text-[1.25rem]">{g.price}</span>
                      <a href="#visit" className="whitespace-nowrap text-[0.63rem] uppercase tracking-[0.2em] text-gold-deep">
                        Enquire →
                      </a>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROMISE — the house code */}
      <section className="relative overflow-hidden border-y border-hairline bg-cream py-[clamp(5rem,11vw,9.5rem)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(64% 52% at 84% 8%, hsl(36 32% 57% / .11), transparent 68%)" }}
        />

        <div className="relative z-10 mx-auto grid w-[min(1200px,100%-3rem)] grid-cols-1 items-start gap-[clamp(3rem,7vw,7rem)] lg:grid-cols-[1fr_1.45fr]">
          <Reveal className="lg:sticky lg:top-[7.5rem]">
            <Eyebrow>Our Promise</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4.2vw,3.1rem)] font-light leading-[1.14]">
              Coverage is never a <em className="italic text-gold-deep">compromise</em>.
            </h2>
            <Rule />
            <p className="m-0 max-w-[26rem] text-[0.97rem] text-muted-ink">
              Three rules the house has kept since the first gown left the room above the fabric merchant. They are not
              options, and they are not extras.
            </p>
            <div className="mt-11 max-w-[26rem] border-t border-hairline pt-7">
              <div className="font-serif text-[1.85rem] font-normal italic leading-none">Éliane Benhamou</div>
              <div className="mt-3 text-[0.6rem] uppercase tracking-[0.26em] text-muted-ink">
                Founder · Head of Atelier
              </div>
            </div>
          </Reveal>

          <ol className="m-0 list-none p-0">
            {CODES.map(({ numeral, kicker, title, copy }, i) => (
              <Reveal key={numeral} delay={i * 90}>
                <li
                  className={`group relative grid grid-cols-[3.4rem_1fr] gap-[1.1rem] border-t border-hairline py-[2.1rem] sm:grid-cols-[5rem_1fr] sm:gap-6 sm:py-10 ${
                    i === CODES.length - 1 ? "border-b" : ""
                  }`}
                >
                  {/* a gold hairline draws itself across the rule on hover */}
                  <span className="absolute -top-px left-0 h-px w-0 bg-gold transition-[width] duration-[900ms] ease-[cubic-bezier(.2,.7,.3,1)] group-hover:w-full" />
                  <span className="font-serif text-[2.3rem] leading-[0.86] tracking-[0.04em] text-gold opacity-50 transition-[opacity,color] duration-500 group-hover:text-gold-deep group-hover:opacity-100 sm:text-[2.9rem]">
                    {numeral}
                  </span>
                  <div>
                    <span className="mb-[0.65rem] block text-[0.58rem] uppercase tracking-[0.3em] text-gold-deep">
                      {kicker}
                    </span>
                    <h3 className="mb-[0.55rem] font-serif text-[1.62rem] font-light leading-[1.25]">{title}</h3>
                    <p className="m-0 max-w-[36rem] text-[0.95rem] text-muted-ink">{copy}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ATELIER */}
      <section id="atelier" className="py-[clamp(5rem,11vw,9.5rem)]">
        <div className="mx-auto grid w-[min(1200px,100%-3rem)] grid-cols-1 items-center gap-[clamp(2.5rem,6vw,5.5rem)] lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden border border-hairline bg-sand">
              <div className="pointer-events-none absolute inset-[14px] z-10 border border-ivory/45" />
              <img src="/images/atelier.jpg" alt="Bride in a high-neck lace gown with long sleeves" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>The Atelier</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4.4vw,3.2rem)] font-light leading-[1.14]">
              A small house, <em className="italic text-gold-deep">by choice</em>.
            </h2>
            <Rule />
            <p className="text-muted-ink">
              Éliane began in a single room above a fabric merchant, with one seamstress and one belief: that a bride
              should never have to choose between her values and her dress. Thirteen years on, we still take a limited
              number of brides each season — because a gown made properly cannot be made quickly.
            </p>
            <p className="mt-5 text-muted-ink">
              Fabrics are sourced from mills in Como and Calais. Patterns are drafted in-house. And the woman who fits
              you at your first appointment is the same one who presses your gown before it leaves us.
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-sm border-hairline bg-transparent px-9 py-6 text-[0.72rem] uppercase tracking-[0.22em] text-ink hover:border-ink hover:bg-ink hover:text-ivory">
              <a href="#visit">Meet the Atelier</a>
            </Button>
          </Reveal>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="pb-[clamp(5rem,11vw,9.5rem)]">
        <div className="mx-auto grid w-[min(1200px,100%-3rem)] grid-cols-1 items-center gap-[clamp(2.5rem,6vw,5.5rem)] lg:grid-cols-2">
          <Reveal>
            <Eyebrow>The Experience</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.1rem,4.4vw,3.2rem)] font-light leading-[1.14]">
              Four appointments, <em className="italic text-gold-deep">one gown</em>.
            </h2>
            <ol className="mt-10 list-none p-0">
              {STEPS.map(([title, copy], i) => (
                <li key={title} className={`relative border-t border-hairline py-6 pl-[4.2rem] ${i === STEPS.length - 1 ? "border-b" : ""}`}>
                  <span className="absolute left-0 top-6 font-serif text-[1.5rem] text-gold">0{i + 1}</span>
                  <b className="mb-0.5 block font-serif text-[1.4rem] font-medium">{title}</b>
                  <span className="text-[0.94rem] text-muted-ink">{copy}</span>
                </li>
              ))}
            </ol>
          </Reveal>

          <Reveal delay={120}>
            <div className="relative aspect-square overflow-hidden border border-hairline bg-sand">
              <div className="pointer-events-none absolute inset-[14px] z-10 border border-ivory/45" />
              <img src="/images/detail.jpg" alt="Hand-worked lace detail on a bridal sleeve" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* BRIDES */}
      <section id="brides" className="border-y border-hairline bg-cream py-[clamp(5rem,11vw,9.5rem)]">
        <div className="mx-auto w-[min(1200px,100%-3rem)]">
          <Reveal className="mx-auto max-w-[44rem] text-center">
            <Eyebrow>Our Brides</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.12]">
              In their <em className="italic text-gold-deep">own</em> words.
            </h2>
            <Rule className="mx-auto" />
          </Reveal>

          <div className="mt-16 grid grid-cols-[repeat(auto-fit,minmax(265px,1fr))] gap-[clamp(1.5rem,3vw,2.6rem)]">
            {QUOTES.map(([text, who], i) => (
              <Reveal key={who} delay={i * 90}>
                <figure className="m-0 h-full rounded-sm border border-hairline bg-ivory px-8 py-10">
                  <span className="block h-6 font-serif text-[4.5rem] leading-[0.6] text-champagne">&ldquo;</span>
                  <p className="my-4 font-serif text-[1.3rem] italic leading-[1.6] text-ink">{text}</p>
                  <figcaption className="text-[0.65rem] uppercase not-italic tracking-[0.22em] text-muted-ink">{who}</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT */}
      <section
        id="visit"
        className="py-[clamp(5rem,11vw,9.5rem)] text-ivory"
        style={{ background: "radial-gradient(120% 120% at 20% 0%, hsl(30 14% 30%), hsl(28 14% 16%))" }}
      >
        <div className="mx-auto w-[min(1200px,100%-3rem)]">
          <Reveal className="max-w-[44rem]">
            <Eyebrow className="text-champagne">Visit the Salon</Eyebrow>
            <h2 className="mt-4 font-serif text-[clamp(2.2rem,5vw,3.6rem)] font-light leading-[1.12]">
              Come and be <em className="italic text-champagne">measured</em>.
            </h2>
            <Rule />
            <p className="text-ivory/[0.72]">
              Appointments are private and by request only — one bride in the salon at a time. Tell us your date and we
              will find you an hour.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-[1fr_1.1fr]">
            <Reveal>
              <dl className="grid gap-7">
                {[
                  ["The Salon", ["18 Marlowe Court", "London NW11 8QT"]],
                  ["Appointments", ["Sun – Thu · 10:00 – 19:00", "Friday by arrangement"]],
                  ["Enquiries", ["hello@maisoneliane.com", "+44 20 7946 0182"]],
                ].map(([term, lines]) => (
                  <div key={term as string}>
                    <dt className="text-[0.62rem] uppercase tracking-[0.26em] text-champagne">{term as string}</dt>
                    <dd className="mt-2 font-serif text-[1.35rem] leading-[1.5] text-ivory/[0.92]">
                      {(lines as string[]).map((l) => (
                        <span key={l} className="block">{l}</span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={120}>
              <form onSubmit={onSubmit} className="grid gap-5" noValidate>
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/60">Full name</span>
                    <Input name="fullname" placeholder="Your name" className="h-auto rounded-none border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-ivory placeholder:text-ivory/35 focus-visible:border-champagne focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/60">Email</span>
                    <Input name="email" type="email" placeholder="you@email.com" className="h-auto rounded-none border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-ivory placeholder:text-ivory/35 focus-visible:border-champagne focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2">
                    <span className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/60">Wedding date</span>
                    <Input name="date" type="date" className="h-auto rounded-none border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-ivory [color-scheme:dark] focus-visible:border-champagne focus-visible:ring-0 focus-visible:ring-offset-0" />
                  </label>
                  <label className="grid gap-2">
                    <span className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/60">Interested in</span>
                    <select name="style" className="h-auto rounded-none border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-ivory outline-none focus:border-champagne">
                      {["The house collection", "A bespoke gown", "Aurélie", "Séraphine", "Noor", "Amalia"].map((o) => (
                        <option key={o} className="text-ink">{o}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <label className="grid gap-2">
                  <span className="text-[0.6rem] uppercase tracking-[0.24em] text-ivory/60">Anything we should know</span>
                  <Textarea name="message" placeholder="Venue, coverage preferences, fabrics you love…" className="min-h-[74px] resize-y rounded-none border-0 border-b border-ivory/30 bg-transparent px-0 py-3 text-ivory placeholder:text-ivory/35 focus-visible:border-champagne focus-visible:ring-0 focus-visible:ring-offset-0" />
                </label>

                <Button type="submit" disabled={sending} className="mt-3 justify-self-start disabled:opacity-55 rounded-sm border border-ivory/50 bg-transparent px-9 py-6 text-[0.72rem] uppercase tracking-[0.22em] text-ivory hover:bg-ivory hover:text-ink">
                  Request an Appointment
                </Button>
                <p className="m-0 text-[0.75rem] text-ivory/50">{note}</p>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-hairline bg-ivory px-0 pb-10 pt-[4.5rem]">
        <div className="mx-auto w-[min(1200px,100%-3rem)]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
            <div>
              <div className="font-serif text-2xl uppercase tracking-[0.3em]">Éliane</div>
              <p className="mt-4 max-w-[24rem] text-[0.9rem] text-muted-ink">
                Modest bridal couture, made to measure in London since 2012. A small house, deliberately kept small.
              </p>
            </div>
            {[
              ["Explore", NAV.slice(0, 4)],
              ["Salon", [
                { href: "#visit", label: "Book a Fitting" },
                { href: "#visit", label: "Opening Hours" },
                { href: "#visit", label: "Bespoke Enquiries" },
                { href: "#visit", label: "Alterations" },
              ]],
            ].map(([heading, links]) => (
              <div key={heading as string}>
                <h4 className="mb-4 font-sans text-[0.62rem] font-normal uppercase tracking-[0.26em] text-gold-deep">{heading as string}</h4>
                {(links as { href: string; label: string }[]).map((l) => (
                  <a key={l.label} href={l.href} className="block py-1 text-[0.92rem] text-muted-ink transition-colors hover:text-ink">
                    {l.label}
                  </a>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap justify-between gap-4 border-t border-hairline pt-7 text-[0.75rem] text-muted-ink">
            <span>© 2026 Maison Éliane. All rights reserved.</span>
            <span>Instagram · Pinterest · Privacy</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
