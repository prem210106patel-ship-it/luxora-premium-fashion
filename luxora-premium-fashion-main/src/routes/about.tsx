import { createFileRoute } from "@tanstack/react-router";
import aboutAtelier from "@/assets/about-atelier.jpg";
import lookbook from "@/assets/lookbook.jpg";
import heroCoat from "@/assets/hero-coat.jpg";

export const Route = createFileRoute("/about")({
  component: AboutPage,
});

const STATS = [
  { value: "2019", label: "Founded" },
  { value: "40+", label: "Workshop partners" },
  { value: "12k", label: "Happy customers" },
  { value: "30+", label: "Countries shipped" },
];

const VALUES = [
  {
    title: "Materials first",
    body: "We start with the cloth, the leather, the metal. If the raw material isn't exceptional, nothing downstream can fix it.",
  },
  {
    title: "Small runs",
    body: "We produce in limited quantities to reduce waste and ensure every piece meets our standards.",
  },
  {
    title: "Fair workshops",
    body: "We work directly with workshops in Italy, Scotland, Portugal and India, paying fair wages and visiting often.",
  },
  {
    title: "Built to last",
    body: "Every piece is designed to be worn for years, not seasons. We offer free repairs for the lifetime of each item.",
  },
];

function AboutPage() {
  return (
    <div>
      <section className="relative -mt-20 flex min-h-[60vh] items-center overflow-hidden">
        <img
          src={heroCoat}
          alt="LUXORA atelier"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 py-20 lg:px-10">
          <div className="max-w-xl text-background">
            <p className="rise text-[12px] uppercase tracking-[0.3em] text-background/80">
              Our Story
            </p>
            <h1
              className="rise mt-4 font-display text-4xl leading-[1.1] tracking-tight sm:text-5xl"
              style={{ animationDelay: "100ms" }}
            >
              Considered clothing,
              <br />
              made to be kept.
            </h1>
            <p
              className="rise mt-6 max-w-md text-[15px] leading-relaxed text-background/85"
              style={{ animationDelay: "200ms" }}
            >
              LUXORA began with a simple frustration: beautiful clothes that fell apart after a
              season. We set out to make things differently.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">The brand</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">
              A quiet approach to dressing
            </h2>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-foreground/80">
              <p>
                LUXORA was founded in 2019 with a single goal: to make clothing worth keeping. We
                believe the fashion industry has lost its way — chasing trends, cutting corners,
                and producing more than the world can wear.
              </p>
              <p>
                Our approach is different. We design pieces that sit outside the trend cycle, using
                materials and construction methods that have served generations. We work with
                workshops we trust, in small runs, and we stand behind everything we make.
              </p>
              <p>
                The result is a collection that's quietly confident — pieces that don't shout but
                that you'll reach for again and again.
              </p>
            </div>
          </div>
          <div className="overflow-hidden rounded-lg">
            <img
              src={aboutAtelier}
              alt="Inside the LUXORA atelier"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Our mission</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight">
            To make clothing that honours the hands that made it and the people who wear it.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-muted">
            Every decision we make — from the cotton we source to the packaging we use — is guided
            by a simple question: does this deserve to exist?
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">What we stand for</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Our Values</h2>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map((v) => (
            <div key={v.title} className="rounded-lg border border-border bg-surface p-8">
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground/80">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img src={lookbook} alt="" className="h-[400px] w-full object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-10">
            <div className="grid grid-cols-2 gap-8 text-background sm:grid-cols-4">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="font-display text-4xl tracking-tight">{stat.value}</p>
                  <p className="mt-2 text-[12px] uppercase tracking-[0.15em] text-background/70">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted">The people</p>
          <h2 className="mt-2 font-display text-3xl tracking-tight">Made by a small team</h2>
          <p className="mx-auto mt-3 max-w-md text-[14px] text-muted">
            We're a tight-knit group of designers, makers and craftspeople who care deeply about
            what we produce.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { name: "Ishaan Kapoor", role: "Founder & Creative Director" },
            { name: "Leena Arora", role: "Head of Design" },
            { name: "Marco Bianchi", role: "Atelier Lead, Italy" },
          ].map((person) => (
            <div
              key={person.name}
              className="rounded-lg border border-border bg-surface p-8 text-center"
            >
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-stone font-display text-xl text-muted">
                {person.name.charAt(0)}
              </div>
              <p className="mt-4 text-[15px] font-medium text-foreground">{person.name}</p>
              <p className="mt-1 text-[13px] text-muted">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
