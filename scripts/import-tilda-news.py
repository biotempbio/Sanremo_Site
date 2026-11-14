"""One-time import of the ten public Tilda posts preserved during migration.

Run manually with network access. The build reads the checked-in JSON and images;
it never depends on Tilda remaining online.
"""

from __future__ import annotations

import json
import re
import subprocess
from pathlib import Path
import tempfile
import time

from lxml import html
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "news.json"
IMAGES = ROOT / "public" / "photo" / "news"
SOURCE = "https://sanremomachines.tilda.ws/tpost/"
ASSET_CACHE = {}
for manifest in (Path(tempfile.gettempdir()) / "browser-use" / "assets").glob("*/manifest.json"):
    for asset in json.loads(manifest.read_text()).get("assets", []):
        ASSET_CACHE[asset["url"]] = Path(asset["path"])
POSTS = [
    ("h16ppjnd31-no-drama-just-coffee", "zoe-2026"),
    ("fzpb79apg1-sanremo-tsentr-prityazheniya", "sanremo-pir-coffee-2025"),
    ("hngoulmxr1-poisk-sinergii-vkusov-na-dalnem-vostoke", "coffee-pairing-dalnii-vostok"),
    ("vz3l6i6rj1-rossiiskii-duet-raskrivaet-potentsial-ba", "d8-pro-julius-meinl-barista-skills"),
    ("9ejdiik9o1-360-sanremo-3", "360-sanremo-3"),
    ("3oa0z0r951-vstrechaite-novuyu-platformu-d8-na-vista", "d8-host-2023"),
    ("ou8np6rss1-360-sanremo-2", "360-sanremo-2"),
    ("2oe6krp6j1-vo-ves-opor", "vo-ves-opor"),
    ("akxi35jl41-komandnaya-rabota-kak-sposob-dostizheniy", "komandnaya-rabota"),
    ("g105rcvzb1-nash-novii-ambassador-martin-shabaya", "martin-shabaya"),
]

EDITORIAL_FIXES = {
    "ЗАЛОГ УСПХА": "ЗАЛОГ УСПЕХА",
    "ZOE COMPETITION": "Zoe Competition",
    "ZOE SED": "Zoe SED",
    "ZOE": "Zoe",
    "CafeRacer": "Café Racer",
    "F18SB": "F18 SB",
    "Cинергия": "Синергия",
    "САНРЕМО": "Sanremo",
    "SANREMO": "Sanremo",
}


def editorial_cleanup(value: str) -> str:
    for original, replacement in EDITORIAL_FIXES.items():
        value = value.replace(original, replacement)
    return value.replace(" - это ", " — это ").replace(" - ", " — ")


def download(url: str) -> bytes:
    if url in ASSET_CACHE and ASSET_CACHE[url].exists():
        return ASSET_CACHE[url].read_bytes()
    last_error = None
    for attempt in range(3):
        try:
            return subprocess.check_output(["curl", "--fail", "--silent", "--show-error", "--location", "--max-time", "30", url])
        except subprocess.CalledProcessError as error:
            last_error = error
            time.sleep(attempt + 1)
    raise last_error


def text_with_breaks(node) -> str:
    chunks = []

    def walk(el):
        if el.tag in {"p", "div", "section", "h2", "h3", "h4", "li", "blockquote"}:
            chunks.append("\n")
        if el.text:
            chunks.append(el.text)
        for child in el:
            if child.tag == "br":
                chunks.append("\n")
            else:
                walk(child)
            if child.tail:
                chunks.append(child.tail)
        if el.tag in {"p", "div", "section", "h2", "h3", "h4", "li", "blockquote"}:
            chunks.append("\n")

    walk(node)
    return "".join(chunks)


def main() -> None:
    IMAGES.mkdir(parents=True, exist_ok=True)
    records = []
    for old_slug, slug in POSTS:
        source_url = SOURCE + old_slug
        document = html.fromstring(download(source_url))
        heading = document.xpath("//h1")[0]
        title = editorial_cleanup(" ".join(heading.itertext()).strip())
        body = document.xpath('//*[@itemprop="articleBody"]')[0]
        raw = text_with_breaks(body)
        paragraphs = [re.sub(r"\s+", " ", part).strip() for part in raw.split("\n")]
        paragraphs = [editorial_cleanup(part) for part in paragraphs if part]
        date_wrap = document.xpath('//*[contains(@class,"t-feed__post-popup__date-parts-wrapper")]')[0]
        match = re.search(r"\d{4}-\d{2}-\d{2}", date_wrap.text_content())
        if not match:
            raise RuntimeError(f"Missing publication date: {source_url}")
        date = match.group(0)
        description = (document.xpath('//meta[@name="description"]/@content') or [""])[0]
        popup = document.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," t-feed__post-popup ")]')[0]
        image_urls = []
        for el in popup.xpath('.//*[@data-img-zoom-url or @data-original]'):
            url = el.get("data-img-zoom-url") or el.get("data-original")
            if url and url.startswith("https://static.tildacdn.com/") and url not in image_urls:
                image_urls.append(url)
        images = []
        for index, url in enumerate(image_urls, 1):
            original = IMAGES / f"{slug}-{index}.source"
            original.write_bytes(download(url))
            try:
                with Image.open(original) as image:
                    image = image.convert("RGB")
                    image.thumbnail((1500, 1500))
                    target = IMAGES / f"{slug}-{index}.webp"
                    image.save(target, "WEBP", quality=79, method=6)
                    images.append({"src": f"/photo/news/{target.name}", "width": image.width, "height": image.height, "alt": f"{title} — фото {index}"})
            finally:
                original.unlink(missing_ok=True)
        records.append({
            "slug": slug,
            "oldPath": f"/tpost/{old_slug}",
            "title": title,
            "description": description,
            "publishedAt": date,
            "paragraphs": paragraphs,
            "images": images,
            "sourceUrl": source_url,
        })
        print(f"{date} {slug}: {len(paragraphs)} paragraphs, {len(images)} images")
    records.sort(key=lambda row: (row["publishedAt"], row["slug"]), reverse=True)
    DATA.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
