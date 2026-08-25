#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Сборка нормализованного каталога Sanremo для сайта.

Источники (см. ТЗ, Приложение B):
  sanremo-products.json                    — выгрузка BIO: SKU, РРЦ, остатки, характеристики, документы, запчасти
  Санремо_Сети и дилеры.xlsx               — дилеры и сети
  Мастер-каталог_проф_кофемашин_РФ_2026.xlsx — конкурентное окружение и прямые аналоги

Выход: data/catalog.json — единственный источник для страниц сайта.
Дилерские цены (dilerPrice*) НЕ попадают в публичный контур (ТЗ §12.2).
"""
import json, re, os, sys
from collections import OrderedDict, defaultdict

SRC = os.environ.get("SANREMO_SRC", "/mnt/user-data/uploads/SANREMO")
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "catalog.json")

# ─────────────────────────────────────────────────────────────── семейства ──
# Редакционный слой: позиционирование и сценарии взяты из ТЗ §3.3 и §9.
FAMILIES = [
    {
        "slug": "zoe", "name": "Zoe", "order": 10,
        "tagline": "Рациональная профессиональная база",
        "territory": "Предсказуемая машина для первой кофейни, пекарни или ресторана без переплаты за ненужные функции.",
        "architecture": "Теплообменник (HX)",
        "scenarios": ["Первая кофейня", "Пекарня и ресторан", "Ограниченный CAPEX"],
        "rivals": ["Nuova Simonelli Appia Life", "Rancilio Classe 5", "Fiamma Compass SE", "Wega Polaris"],
        "photo": "/photo/machine-red-lifestyle.webp",
    },
    {
        "slug": "d8", "name": "D8", "order": 20,
        "tagline": "Новый стандарт upper-mid и доступ к premium-функциям",
        "territory": "Больше контроля, модульности и вариантов исполнения в рациональном бюджете. Версия PRO добавляет температуру по группам и рабочие функции без ценового скачка к флагманам.",
        "architecture": "Гибридная группа, PID",
        "scenarios": ["Растущая кофейня", "Сеть", "Независимая specialty"],
        "rivals": ["Nuova Simonelli Appia Life XT", "Dalla Corte EVO2", "Rancilio Classe 9", "Fiamma Compass DB"],
        "photo": "/photo/d8-workzone.webp",
    },
    {
        "slug": "f18", "name": "F18", "order": 30,
        "tagline": "Современная потоковая рабочая машина",
        "territory": "Интенсивная эксплуатация, удобная рабочая зона и сильная паровая часть. SB — рациональный поток, мультибойлерная версия — независимость кофе и пара.",
        "architecture": "Single boiler или мультибойлер",
        "scenarios": ["Высокий поток", "Молочное меню", "Specialty с потоком"],
        "rivals": ["Nuova Simonelli Appia Life XT", "Victoria Arduino White Eagle T3", "La Marzocco Linea PB"],
        "photo": "/photo/machine-marble.webp",
    },
    {
        "slug": "cafe-racer", "name": "Café Racer", "order": 40,
        "tagline": "Технологичный дизайн-объект",
        "territory": "Кофемашина одновременно формирует вкус, workflow и визуальный образ кофейни.",
        "architecture": "Мультибойлер, PID",
        "scenarios": ["Флагманская дизайн-кофейня", "Specialty", "Высокий поток"],
        "rivals": ["La Marzocco Linea PB / GB5", "Victoria Arduino Eagle One", "Rocket RS1", "Diamant Pro"],
        "photo": "/photo/cafe-racer-green-detail.webp",
    },
    {
        "slug": "you", "name": "YOU", "order": 50,
        "tagline": "Компактный specialty",
        "territory": "Полноценный профессиональный контроль рецепта при дефиците места. Не бытовая машина.",
        "architecture": "Мультибойлер, профилирование",
        "scenarios": ["Компактный bar", "Фуд-корнер", "Лаборатория рецептов"],
        "rivals": ["Victoria Arduino Eagle One Prima", "Dalla Corte Mina"],
        "photo": "/photo/display-detail.webp",
    },
    {
        "slug": "opera", "name": "Opera", "order": 60,
        "tagline": "R&D и технологический флагман",
        "territory": "Инструмент профилирования и дифференциации меню для обжарщиков и flagship-точек.",
        "architecture": "Мультибойлер, помпа в группе",
        "scenarios": ["Обжарщик и лаборатория", "Флагманская точка", "Несколько сортов одновременно"],
        "rivals": ["Rocket RS1", "La Marzocco Strada / Leva", "Victoria Arduino Black Eagle", "Dalla Corte XT"],
        "photo": "/photo/studio-dark.webp",
    },
]

# ────────────────────────────────────────────────────── разбор наименования ──
COLOR_MAP = [
    (r"жемчужно-белая", "Жемчужно-белая", "#EDE9E3"),
    (r"бел(?:ая|ый)[- ]?дерево|white and wood|белая-дерево", "Белая с деревом", "#EFE7DC"),
    (r"черно-бел|чёрно-бел|black&white|black and white", "Чёрно-белая", "#F2F2F2"),
    (r"сталь-красн|стальная-красн", "Сталь и красный", "#B0413E"),
    (r"черно-красн|чёрно-красн", "Чёрно-красная", "#8E2B26"),
    (r"черно-коричнев|чёрно-коричнев", "Чёрно-коричневая", "#5A3B30"),
    (r"стальная-бел", "Сталь и белый", "#DCDCDC"),
    (r"стальная-голуб|стальная-голубая", "Сталь и голубой", "#9FB6C4"),
    (r"нержавеющая сталь|стальная", "Нержавеющая сталь", "#C4C6C8"),
    (r"total white", "Total White", "#FFFFFF"),
    (r"total black", "Total Black", "#111111"),
    (r"голуб", "Голубая", "#8FB3C7"),
    (r"розов", "Розовая", "#E2A5AE"),
    (r"коричнев", "Коричневая", "#6B4A3A"),
    (r"чёрн(?:ая|ый)? матов|черн(?:ая|ый)? матов", "Чёрная матовая", "#1A1A1A"),
    (r"бел(?:ая|ый)", "Белая", "#FFFFFF"),
    (r"чёрн(?:ая|ый)|черн(?:ая|ый)", "Чёрная", "#111111"),
]

OPTION_MAP = [
    (r"cold touch", "Cold Touch"),
    (r"autosteam|автостим", "AutoSteam"),
    (r"экономайзер", "Экономайзер"),
    (r"подсветк", "Подсветка"),
    (r"внешняя помпа", "Внешняя помпа"),
    (r"\bPDL\b", "PDL"),
]


def strip_prefix(name):
    return re.sub(r"^Кофемашина\s+Sanremo\s+", "", name).strip()


def detect_family(n):
    s = n.lower()
    if "cafe racer" in s or "café racer" in s:
        return "cafe-racer"
    if s.startswith("d8") or " d8" in s:
        return "d8"
    if re.search(r"\bf18\b", s):
        return "f18"
    if s.startswith("opera"):
        return "opera"
    if s.startswith("you"):
        return "you"
    if s.startswith("zoe"):
        return "zoe"
    return None


def detect_model(fam, n):
    """Возвращает (slug модели, название модели, версия)."""
    s = n.lower()
    if fam == "d8":
        return ("d8-pro", "D8 PRO", "PRO") if "pro" in s else ("d8", "D8", "Basic")
    if fam == "f18":
        return ("f18-sb", "F18 SB", "SB") if re.search(r"f18\s*sb", s) else ("f18-mb", "F18 MB", "Multiboiler (мультибойлер)")
    if fam == "zoe":
        if "competition" in s:
            return ("zoe-competition", "Zoe Competition", "Competition")
        if "compact" in s:
            return ("zoe-compact", "Zoe Compact", "Compact")
        if "sap" in s:
            return ("zoe-sap", "Zoe SAP", "SAP (полуавтомат)")
        return ("zoe-sed", "Zoe SED", "SED (автомат)")
    if fam == "cafe-racer":
        return ("cafe-racer", "Café Racer", None)
    if fam == "opera":
        return ("opera", "Opera", None)
    if fam == "you":
        return ("you", "YOU", None)
    return (fam, fam, None)


def detect_edition(fam, n):
    if fam != "cafe-racer":
        return None
    s = n.lower()
    for pat, label in [
        (r"custom renegade", "Custom Renegade"), (r"naked", "Naked"), (r"racing", "Racing"),
        (r"freedom", "Freedom"), (r"full white", "Full White"), (r"dolomiti", "Dolomiti"),
        (r"black&white|чёрно-бел|черно-бел", "Black & White"), (r"white and wood|белая-дерево", "White & Wood"),
    ]:
        if re.search(pat, s):
            return label
    return "Base"


def detect_color(n):
    s = n.lower()
    for pat, label, hexv in COLOR_MAP:
        if re.search(pat, s):
            return label, hexv
    return None, None


def detect_groups(x, n):
    props = {p["prop"]: p["value"] for p in x.get("secondaryProps", [])}
    if props.get("Кол-во групп"):
        try:
            return int(str(props["Кол-во групп"]).strip())
        except ValueError:
            pass
    m = re.search(r"(\d)\s*(?:гр|GR|группы|группа|высокие|низкие)", n, re.I)
    return int(m.group(1)) if m else None


def detect_height(x, n):
    s = n.lower()
    props = {p["prop"]: p["value"] for p in x.get("secondaryProps", [])}
    seat = (props.get("Посадка группы") or "").strip().lower()
    if "перестраиваем" in seat:
        return "Регулируемая"
    if "высок" in s or "tall" in s or "высок" in seat:
        return "Высокая"
    if "низк" in s:
        return "Стандартная"
    return None


def detect_options(n):
    out = []
    for pat, label in OPTION_MAP:
        if re.search(pat, n, re.I):
            out.append(label)
    return out


def parse_size(s):
    if not s:
        return None
    parts = [p.strip() for p in re.split(r"[xх×]", s)]
    nums = []
    for p in parts:
        try:
            nums.append(int(float(p.replace(",", "."))))
        except ValueError:
            nums.append(None)
    if len(nums) != 3:
        return None
    return {"w": nums[0], "h": nums[1], "d": nums[2]}


def availability(x):
    """Публичный статус наличия (ТЗ §7.1). Точное количество — по флагу BIO."""
    free = max(int(x.get("inAccess") or 0), 0)
    stock = max(int(x.get("inStock") or 0), 0)
    if free >= 3:
        return "in_stock"
    if free >= 1:
        return "limited"
    if stock >= 1:
        return "reserved"
    return "on_order"


# ──────────────────────────────────────────────────────────────── основное ──
def main():
    raw = json.load(open(os.path.join(SRC, "sanremo-products.json"), encoding="utf-8"))
    by_code = {x["code"]: x for x in raw}

    machines = [x for x in raw if x["category"] == "Кофемашины традиционные"]
    grinders = [x for x in raw if x["category"] == "Кофемолки"]
    parts_raw = [x for x in raw if x["category"] not in ("Кофемашины традиционные", "Кофемолки")]

    skus, unmatched = [], []
    for x in machines:
        display = strip_prefix(x["name"])
        fam = detect_family(display)
        if not fam:
            unmatched.append((x["code"], display))
            continue
        mslug, mname, version = detect_model(fam, display)
        color, color_hex = detect_color(display)
        groups = detect_groups(x, display)
        props = {p["prop"]: p["value"] for p in x.get("secondaryProps", [])}
        docs = [
            {"name": f["name"], "ref": f["ref"], "type": f.get("type") or "Документ"}
            for f in (x.get("files") or [])
        ]
        skus.append(OrderedDict(
            code=x["code"],
            vendorCode=x.get("vendorCode") or None,
            family=fam,
            model=mslug,
            modelName=mname,
            version=version,
            edition=detect_edition(fam, display),
            title=display,
            groups=groups,
            groupHeight=detect_height(x, display),
            color=color,
            colorHex=color_hex,
            options=detect_options(display),
            rrp=int(round(float(x.get("priceRUB") or 0))),
            rrpIsRecommended=bool(x.get("recommendedPrice")),
            availability=availability(x),
            free=int(x.get("inAccess") or 0),
            markdown=bool(x.get("isMarkdown")),
            power=x.get("power_kW") or None,
            voltage=props.get("Напряжение, В"),
            boilerTotal=props.get("Общий объем бойлеров, л") or props.get("Объем бойлера, л"),
            seat=props.get("Посадка группы"),
            lighting=props.get("Подсветка"),
            economizer=props.get("Экономайзер"),
            control=props.get("Тип"),
            sizeNet=parse_size(x.get("sizeNet")),
            weightNet=x.get("weightNet") or None,
            image=x.get("img") or None,
            description=(x.get("description") or "").strip(),
            docs=docs,
            spareParts=x.get("spareParts") or [],
        ))

    if unmatched:
        print(f"   не публикуются (вне российской матрицы): {len(unmatched)} шт. — "
              + ", ".join(f"{c} {t}" for c, t in unmatched), file=sys.stderr)

    # ── модели: агрегируем SKU ────────────────────────────────────────────
    models = OrderedDict()
    for s in skus:
        m = models.setdefault(s["model"], OrderedDict(
            slug=s["model"], name=s["modelName"], family=s["family"], version=s["version"],
            skus=[], groupsAvailable=set(), colorsAvailable=OrderedDict(),
            editions=OrderedDict(), optionsAvailable=set(), docs=OrderedDict(),
        ))
        m["skus"].append(s["code"])
        if s["groups"]:
            m["groupsAvailable"].add(s["groups"])
        if s["color"]:
            m["colorsAvailable"].setdefault(s["color"], s["colorHex"])
        if s["edition"]:
            m["editions"].setdefault(s["edition"], 0)
            m["editions"][s["edition"]] += 1
        for o in s["options"]:
            m["optionsAvailable"].add(o)
        for d in s["docs"]:
            m["docs"].setdefault(d["ref"], d)

    for m in models.values():
        live = [s for s in skus if s["model"] == m["slug"] and not s["markdown"]]
        pool = live or [s for s in skus if s["model"] == m["slug"]]
        prices = [s["rrp"] for s in pool if s["rrp"]]
        m["priceFrom"] = min(prices) if prices else None
        m["priceTo"] = max(prices) if prices else None
        m["inStockCount"] = sum(1 for s in pool if s["availability"] in ("in_stock", "limited"))
        m["skuCount"] = len(pool)
        # самый длинный описательный текст модели — как базовое описание
        m["description"] = max((s["description"] for s in pool), key=len, default="")
        best = max(pool, key=lambda s: (s["availability"] == "in_stock", len(s["description"])), default=None)
        m["heroSku"] = best["code"] if best else None
        m["groupsAvailable"] = sorted(m["groupsAvailable"])
        m["optionsAvailable"] = sorted(m["optionsAvailable"])
        m["colorsAvailable"] = [{"name": k, "hex": v} for k, v in m["colorsAvailable"].items()]
        m["editions"] = [{"name": k, "count": v} for k, v in m["editions"].items()]
        m["docs"] = list(m["docs"].values())

    # ── запчасти ──────────────────────────────────────────────────────────
    machine_codes = {s["code"] for s in skus}
    parts = []
    for p in parts_raw:
        fits = [c for c in (p.get("sparePartOfProducts") or []) if c in machine_codes]
        node = p["category"].split(".")[-1] if "." in p["category"] else p["category"]
        parts.append(OrderedDict(
            code=p["code"],
            article=(p.get("vendorCode") or "").strip() or None,
            name=p["name"],
            node=node,
            category=p["category"],
            rrp=round(float(p.get("priceRUB") or 0), 2),
            stock=int(p.get("inAccess") or 0),
            availability=availability(p),
            image=p.get("img") or None,
            fits=fits,
            fitsCount=len(p.get("sparePartOfProducts") or []),
        ))

    # ── кофемолки ─────────────────────────────────────────────────────────
    grind = [OrderedDict(
        code=g["code"], name=strip_prefix(g["name"]),
        rrp=int(round(float(g.get("priceRUB") or 0))),
        availability=availability(g), image=g.get("img") or None,
        markdown=bool(g.get("isMarkdown")),
        description=(g.get("description") or "").strip(),
    ) for g in grinders]

    # ── дилеры и сети ─────────────────────────────────────────────────────
    dealers, chains = load_dealers()
    # ── конкурентное окружение ────────────────────────────────────────────
    analogs = load_analogs()

    data = OrderedDict(
        generatedFrom="sanremo-products.json (выгрузка BIO) · Санремо_Сети и дилеры.xlsx · Мастер-каталог_проф_кофемашин_РФ_2026.xlsx",
        families=FAMILIES,
        models=list(models.values()),
        skus=skus,
        grinders=grind,
        parts=parts,
        dealers=dealers,
        chains=chains,
        analogs=analogs,
    )
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print(f"OK  семейств={len(FAMILIES)} моделей={len(models)} SKU={len(skus)} "
          f"запчастей={len(parts)} кофемолок={len(grind)} дилеров={len(dealers)} аналогов={len(analogs)}")


def load_dealers():
    """Список дилеров + обогащение адресами и сайтами (файл BIO)."""
    import pandas as pd
    df = pd.read_excel(os.path.join(SRC, "Санремо_Сети и дилеры.xlsx"))
    col_d, col_c = df.columns[1], df.columns[3]

    # ── обогащение: адрес, сайт, примечание ──────────────────────────────
    enrich = {}
    for cand in (
        os.path.join(SRC, "компании_адреса_и_сайты_обновлено.xlsx"),
        os.path.join(os.path.dirname(__file__), "..", "data", "Дилеры_адреса_и_сайты.xlsx"),
    ):
        if not os.path.exists(cand):
            continue
        ex = pd.read_excel(cand)
        for _, r in ex.iterrows():
            name = str(r.get("Компания") or "").strip()
            if not name:
                continue
            enrich[norm_name(name)] = {
                "name": name,
                "city": none_if_nan(r.get("Город")),
                "address": none_if_nan(r.get("Адрес")),
                "site": none_if_nan(r.get("Сайт")),
                "status": none_if_nan(r.get("Статус")),
                "note": none_if_nan(r.get("Примечание")),
            }
        break

    dealers, used = [], set()
    for v in df[col_d].dropna().tolist()[1:]:
        raw = str(v).strip()
        name, city = split_city(raw)
        e = enrich.get(norm_name(name))
        if e:
            used.add(norm_name(name))
        dealers.append({
            "name": e["name"] if e else name,
            "city": (e["city"] if e and e["city"] else city),
            "address": e["address"] if e else None,
            "site": e["site"] if e else None,
            "note": e["note"] if e else None,
            "verified": bool(e),
            "raw": raw,
        })

    # партнёры, которых нет в исходном списке, но есть в файле контактов
    for key, e in enrich.items():
        if key in used:
            continue
        dealers.append({
            "name": e["name"], "city": e["city"], "address": e["address"],
            "site": e["site"], "note": e["note"], "verified": True, "raw": e["name"],
        })

    dealers.sort(key=lambda d: (not d["verified"], (d["city"] or "яяя"), d["name"]))
    chains = [str(v).strip() for v in df[col_c].dropna().tolist()[1:]]
    chains = list(OrderedDict.fromkeys(chains))
    print(f"   дилеров: {len(dealers)}, из них с адресом и сайтом: "
          f"{sum(1 for d in dealers if d['verified'])}", file=sys.stderr)
    return dealers, chains


def split_city(raw):
    """«ИП Айвазов Э.Г. г.Махачкала» → («ИП Айвазов Э.Г.», «Махачкала»).
    Берём последнее вхождение маркера «г.», чтобы не спутать его с инициалами."""
    m = None
    for mm in re.finditer(r"\s[гГ]\.\s*", raw):
        m = mm
    if not m:
        return raw.strip(), None
    city = raw[m.end():].split(",")[0].strip()
    name = raw[: m.start()].strip()
    return (name or raw.strip()), (city or None)


def norm_name(s):
    s = str(s).lower().replace("ё", "е")
    s = re.sub(r"[«»\"'.,]", "", s)
    s = re.sub(r"\b(ооо|ип|ао|зао|пао|ук)\b", "", s)
    return re.sub(r"\s+", " ", s).strip()


def none_if_nan(v):
    if v is None:
        return None
    s = str(v).strip()
    return None if s in ("", "nan", "NaT", "None") else s


def load_analogs():
    import pandas as pd
    path = os.path.join(SRC, "Мастер-каталог_проф_кофемашин_РФ_2026.xlsx")
    df = pd.read_excel(path, sheet_name="Аналоги Sanremo", header=1)
    df.columns = ["sanremo", "groups", "priceSanremo", "brand", "model", "matchType",
                  "segment", "boiler", "priceRival", "delta", "deltaPct", "note"]
    df = df[df["sanremo"].notna() & (df["sanremo"] != "Модель Sanremo")]
    out = []
    for _, r in df.iterrows():
        def num(v):
            try:
                return int(round(float(v)))
            except (TypeError, ValueError):
                return None
        out.append({
            "sanremo": str(r["sanremo"]).strip(),
            "groups": num(r["groups"]),
            "priceSanremo": num(r["priceSanremo"]),
            "brand": str(r["brand"]).strip(),
            "model": str(r["model"]).strip(),
            "matchType": str(r["matchType"]).strip(),
            "segment": str(r["segment"]).strip(),
            "boiler": str(r["boiler"]).strip(),
            "priceRival": num(r["priceRival"]),
            "note": None if str(r["note"]) == "nan" else str(r["note"]).strip(),
        })
    return out


if __name__ == "__main__":
    main()
