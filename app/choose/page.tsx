import type { Metadata } from "next";
import { Header, Footer } from "../components/Chrome";
import { Crumbs } from "../components/Bits";
import ChooserClient, { ChooserModel } from "./ChooserClient";
import { models, familyBySlug, skusOfModel, stockUnitsOfModel, VOLUME_BANDS } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Подбор кофемашины по формату бизнеса и потоку",
  description:
    "Подберите кофемашину Sanremo по формату заведения, потоку, меню, группам и бюджету. Сравните подходящие конфигурации, их цены и наличие.",
};

export default function ChoosePage() {
  const rows: ChooserModel[] = models.map((m) => {
    const f = familyBySlug(m.family)!;
    const sk = skusOfModel(m.slug);
    const widths = sk.map((s) => s.sizeNet?.w).filter((w): w is number => !!w);
    const powers = sk.map((s) => s.power).filter((p): p is number => !!p);
    return {
      slug: m.slug,
      name: m.name,
      family: m.family,
      familyName: f.name,
      tagline: f.tagline,
      architecture: f.architecture,
      scenarios: f.scenarios,
      groups: m.groupsAvailable,
      priceFrom: m.priceFrom,
      stockUnits: stockUnitsOfModel(m.slug),
      options: m.optionsAvailable,
      volumeBands: VOLUME_BANDS.filter((b) => b.models.includes(m.slug)).map((b) => b.id),
      minWidth: widths.length ? Math.min(...widths) : null,
      maxPower: powers.length ? Math.max(...powers) : null,
    };
  });

  return (
    <>
      <Header active="/choose" />
      <Crumbs items={[{ href: "/", label: "Главная" }, { label: "Подобрать" }]} />
      <main>
        <section className="wrap" style={{ paddingBottom: 30 }}>
          <div className="sec-head">
            <div>
              <p className="eyebrow">Подбор по задаче</p>
              <h1 style={{ fontSize: "clamp(32px,3.6vw,56px)" }}>
                Какая кофемашина нужна вашему заведению
              </h1>
            </div>
            <div>
              <p className="lead" style={{ marginBottom: 12 }}>
                Шесть вопросов о формате, меню и планах вашей кофейни — чтобы последовательно
                сузить выбор до подходящих моделей и получить обоснованные рекомендации.
              </p>
            </div>
          </div>
        </section>
        <section className="wrap section-tight">
          <ChooserClient models={rows} />
        </section>
        <section className="wrap section-tight"><div className="callout"><h2 style={{ fontSize: 28 }}>Разобраться перед подбором</h2><p>Что меняют группы, архитектура бойлеров и электропитание? Ответы собраны в гиде.</p><a href="/guide/kofemashina-dlya-kofejni/">Гид для кофейни →</a> · <a href="/guide/linejki-sanremo/">Сравнить линейки →</a></div></section>
      </main>
      <Footer />
    </>
  );
}
