"use client";

import { useState } from "react";
import { SITE_EMAIL, SITE_MAILTO } from "@/lib/site-contact";

const NAV = [
  { href: "/products/", label: "Кофемашины" },
  { href: "/guide/", label: "Как выбрать" },
  { href: "/solutions/", label: "Решения" },
  { href: "/cases/", label: "Кейсы" },
  { href: "/service/", label: "Сервис" },
  { href: "/dealers/", label: "Где купить" },
  { href: "/about/", label: "О Sanremo" },
];

export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span className="topbar-message">Официальный дистрибьютор Sanremo в России — компания BIO</span>
          <span className="topbar-contact">
            <span>Москва, ул. Обручева, 23с1, БЦ «Геолог», 4 этаж</span>
            <a href="tel:+74953633801">8 (495) 363-38-01</a>
            <a className="topbar-dealer" href="/contacts/?type=dealer">Стать дилером →</a>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="wrap">
          <a className="brand" href="/" aria-label="Sanremo — на главную">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sanremo-official-black-v4.svg" alt="Sanremo Coffee Machines" />
          </a>
          <button className="burger" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="site-main-nav">
            {open ? "Закрыть" : "Меню"}
          </button>
          <nav id="site-main-nav" className={open ? "mainnav open" : "mainnav"} aria-label="Основное меню">
            {NAV.map((n) => (
              <a key={n.href} href={n.href} aria-current={active === n.href || active === n.href.slice(0, -1) || (n.href === "/guide/" && (active === "/compare" || active === "/compare/")) ? "page" : undefined} data-active={active === n.href || active === n.href.slice(0, -1) || (n.href === "/guide/" && (active === "/compare" || active === "/compare/"))}>
                {n.label}
              </a>
            ))}
            <a className="nav-search" href="/search/" aria-label="Поиск по сайту"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true"><circle cx="10.7" cy="10.7" r="6.7"/><path d="m16 16 5 5"/></svg><span>Поиск</span></a>
            <div className="mobile-nav-tail"><a href="tel:+74953633801">8 (495) 363-38-01</a><a href="/contacts/?type=dealer">Стать дилером →</a><a className="mobile-nav-cta" href="/choose/">Подобрать машину</a></div>
          </nav>
          <a className="header-cta" href="/choose/">Подобрать машину</a>
        </div>
      </header>
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="cols">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sanremo-official-white-v4.svg" alt="Sanremo Coffee Machines" style={{ width: 150 }} />
            <p className="small" style={{ color: "#b9b6b1", marginTop: 18, maxWidth: "30ch" }}>
              Профессиональные кофемашины Sanremo в России: официальная дистрибуция, склад в Москве,
              дилерская сеть, сервис и запчасти.
            </p>
          </div>
          <div>
            <h4>Каталог</h4>
            <nav>
              <a href="/products/">Все кофемашины</a><a href="/products/grinders/">Кофемолки</a><a href="/products/#discontinued-models">Архивные модели</a><a href="/choose/">Подобрать по задаче</a><a href="/guide/">Как выбрать</a><a href="/faq/">Частые вопросы</a><a href="/solutions/">Решения по формату</a><a href="/solutions/kofejnya/">Для кофейни</a><a href="/leasing/">Лизинг</a><a href="/compare/">Сравнения</a><a href="/prices/">Цены и наличие</a>
            </nav>
          </div>
          <div>
            <h4>Владение</h4>
            <nav>
              <a href="/dealers/">Где купить</a><a href="/service/">Сервис</a><a href="/parts/">Запчасти</a><a href="/documents/">Документы</a>
            </nav>
          </div>
          <div>
            <h4>Компания</h4>
            <nav>
              <a href="/about/">О Sanremo</a><a href="/about/world/">Sanremo в мире</a><a href="/bio/">BIO в России</a><a href="/cases/">Кейсы</a><a href="/news/">Новости</a><a href="/contacts/">Контакты</a><a href="/contacts/?type=dealer">Стать дилером</a><a href="/privacy/">Политика обработки данных</a>
            </nav>
          </div>
          <div>
            <h4>Sanremo в России</h4>
            <p className="small" style={{ color: "#e7e5e1" }}>
              <a href="https://holdingbio.ru/">Официальный дистрибьютор Sanremo в России — компания BIO</a>
            </p>
            <p className="small" style={{ color: "#b9b6b1" }}>
              117630, Москва, ул. Обручева, 23с1
              <br />
              БЦ «Геолог», 4 этаж
              <br />
              <a href="tel:+74953633801">8 (495) 363-38-01</a>
              <br />
              Москва
              <br />
              <a href={SITE_MAILTO}>{SITE_EMAIL}</a>
            </p>
          </div>
        </div>
        <div className="fine">Sanremo Coffee Machines S.r.l. · Официальная дистрибуция BIO в России · © 2026</div>
      </div>
    </footer>
  );
}
