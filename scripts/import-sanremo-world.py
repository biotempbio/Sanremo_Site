#!/usr/bin/env python3
"""Import approved public SanremoFamily posts; weekly mode adds #sanremo posts."""
import argparse
import io
import json
import re
from pathlib import Path
from urllib.parse import urlparse

import requests
from lxml import html
from PIL import Image, ImageOps, ImageStat

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data/world-posts.json"
SEED = ROOT / "data/world-seed.json"
PHOTO = ROOT / "public/photo/world"
BASE = "https://t.me/s/sanremofamily"
HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; SanremoWorldImporter/1.0)"}
SESSION = requests.Session()
MODEL_RE = re.compile(r"(?i)(sanremo|санремо|café racer|cafe racer|\bd8\b|\bzoe\b|\bopera\b|\byou\b|x.one)")
MEDIA_RE = re.compile(r"background-image:\s*url\(['\"]?([^)'\"]+)")
COUNTRIES = ["Германия", "Польша", "Индонезия", "Великобритания", "Австралия", "Южная Корея", "Эквадор", "Узбекистан", "Мексика", "Египет"]

def get_page(url):
    response = SESSION.get(url, headers=HEADERS, timeout=25)
    response.raise_for_status()
    return html.fromstring(response.content)

def post_node(root, post_id):
    matches = root.xpath(f'//div[@data-post="sanremofamily/{post_id}"]')
    return matches[0] if matches else None

def extract_text(node):
    nodes = node.xpath('.//div[contains(@class,"tgme_widget_message_text")]')
    if not nodes:
        return ""
    raw = html.tostring(nodes[0], encoding="unicode")
    raw = re.sub(r"<br\s*/?>", "\n", raw)
    raw = html.fromstring(raw).text_content()
    raw = re.split(r"(?i)Не грузятся фото|🗣\s*Магазин|Магазин\s+(?:MAX|MHW|ТГ)", raw)[0]
    return "\n".join(line.strip() for line in raw.splitlines() if line.strip()).strip()

def media_urls(node, css_class):
    values = node.xpath(f'.//*[contains(@class,"{css_class}")]/@style')
    return [match.group(1) for value in values if (match := MEDIA_RE.search(value))]

def save_image(url, post_id, number):
    parsed = urlparse(url)
    if parsed.scheme != "https" or not (parsed.hostname or "").endswith(".telesco.pe"):
        raise ValueError("image host is not Telegram CDN")
    response = SESSION.get(url, headers=HEADERS, timeout=30)
    response.raise_for_status()
    image = Image.open(io.BytesIO(response.content))
    image = ImageOps.exif_transpose(image).convert("RGB")
    if sum(ImageStat.Stat(image).stddev) < 5:
        raise ValueError("empty video poster")
    image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
    PHOTO.mkdir(parents=True, exist_ok=True)
    target = PHOTO / f"{post_id}-{number}.webp"
    image.save(target, "WEBP", quality=82, method=6)
    return f"/photo/world/{target.name}"

def make_post(post_id, meta):
    root = get_page(f"{BASE}/{post_id}")
    node = post_node(root, post_id)
    if node is None:
        raise ValueError(f"public post {post_id} not found")
    text = extract_text(node)
    if not text:
        raise ValueError(f"public post {post_id} has no text")
    date = node.xpath('.//time/@datetime')
    images = []
    for i, url in enumerate(media_urls(node, "tgme_widget_message_photo_wrap"), 1):
        try: images.append(save_image(url, post_id, i))
        except (requests.RequestException, OSError, ValueError) as error: print(f"media {post_id}-{i}: {type(error).__name__}")
    video = bool(node.xpath('.//*[contains(@class,"tgme_widget_message_video_player")]'))
    poster = None
    if video:
        posters = media_urls(node, "tgme_widget_message_video_thumb")
        if posters:
            try: poster = save_image(posters[0], post_id, "poster")
            except (requests.RequestException, OSError, ValueError) as error: print(f"poster {post_id}: {type(error).__name__}")
    country = meta.get("country")
    if country is None:
        hits = [name for name in COUNTRIES if name.casefold() in text.casefold()]
        country = hits[0] if len(hits) == 1 else None
    title = meta.get("title") or re.sub(r"[^\w\s.,:—–-]", "", text.split("\n")[0]).strip()[:70]
    return {"id":post_id,"slug":meta.get("slug") or f"sanremo-{post_id}","title":title[:70],"date":date[0][:10] if date else "", "text":text,"country":country,"city":meta.get("city"),"images":images,"poster":poster,"video":video,"source":f"https://t.me/sanremofamily/{post_id}"}

def recent_ids():
    out=[]; before=None
    for _ in range(4):
        root=get_page(BASE + (f"?before={before}" if before else ""))
        ids=[int(x) for x in root.xpath('//div/@data-post') if re.fullmatch(r"sanremofamily/\d+",x) for x in [x.split("/")[1]]]
        if not ids: break
        for post_id in ids:
            node=post_node(root,post_id)
            if node is None: continue
            text=extract_text(node)
            if re.search(r"(?i)#sanremo\b",text) and MODEL_RE.search(text): out.append(post_id)
        before=min(ids)
    return sorted(set(out))

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("mode",choices=["seed","weekly"])
    args=parser.parse_args()
    seed={item["id"]:item for item in json.loads(SEED.read_text())}
    existing=json.loads(DATA.read_text()) if DATA.exists() else []
    by_id={item["id"]:item for item in existing}
    # The first scheduled run must not publish older posts outside the approved seed.
    latest_approved = max(by_id, default=0)
    ids=list(seed) if args.mode=="seed" else [post_id for post_id in recent_ids() if post_id > latest_approved]
    for post_id in ids:
        if post_id in by_id: continue
        try:
            by_id[post_id]=make_post(post_id,seed.get(post_id,{}))
            print(f"imported {post_id}")
        except (requests.RequestException, ValueError) as error:
            print(f"skipped {post_id}: {type(error).__name__}: {error}")
    posts=sorted(by_id.values(),key=lambda post:(post["date"],post["id"]),reverse=True)
    DATA.write_text(json.dumps(posts,ensure_ascii=False,indent=2)+"\n")
    print(f"total {len(posts)}, new {len(posts)-len(existing)}")

if __name__=="__main__":main()
