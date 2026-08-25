"use client";

import { useState } from "react";

const NAV = [
  { href: "/products", label: "Кофемашины" },
  { href: "/choose", label: "Подобрать" },
  { href: "/solutions", label: "Решения" },
  { href: "/compare", label: "Сравнить" },
  { href: "/dealers", label: "Где купить" },
  { href: "/service", label: "Сервис и запчасти" },
  { href: "/cases", label: "Кейсы" },
  { href: "/about", label: "О компании" },
];

export function Header({ active }: { active?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="topbar">
        <div className="wrap">
          <span>Официальный дистрибьютор Sanremo в России — компания BIO</span>
          <span>
            <a href="tel:+78006004300">8 (800) 600-43-00</a>
            {" · "}
            <a href="/contacts">Контакты</a>
          </span>
        </div>
      </div>
      <header className="header">
        <div className="wrap">
          <a className="brand" href="/" aria-label="Sanremo — на главную">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/sanremo-official-black-v4.svg" alt="Sanremo Coffee Machines" />
          </a>
          <span className="hdr-trust">
            Профессиональные кофемашины
            <br />
            Официальная дистрибуция в РФ
          </span>
          <button className="burger" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "Закрыть" : "Меню"}
          </button>
          <nav className={open ? "mainnav open" : "mainnav"}>
            {NAV.map((n) => (
              <a key={n.href} href={n.href} data-active={active === n.href}>
                {n.label}
              </a>
            ))}
          </nav>
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
              Профессиональные кофемашины Sanremo в России: официальная дистрибуция, склад,
              дилерская сеть, сервис и запчасти.
            </p>
          </div>
          <div>
            <h4>Каталог</h4>
            <nav>
              <a href="/products">Все кофемашины</a>
              <a href="/choose">Подобрать по задаче</a>
              <a href="/solutions">Решения по формату</a>
              <a href="/compare">Сравнения</a>
              <a href="/prices">РРЦ и наличие</a>
            </nav>
          </div>
          <div>
            <h4>Владение</h4>
            <nav>
              <a href="/dealers">Где купить</a>
              <a href="/service">Сервис</a>
              <a href="/parts">Запчасти</a>
              <a href="/documents">Документы</a>
            </nav>
          </div>
          <div>
            <h4>Компания</h4>
            <nav>
              <a href="/about">О Sanremo</a>
              <a href="/bio">BIO в России</a>
              <a href="/cases">Кейсы</a>
              <a href="/news">Новости</a>
              <a href="/contacts">Контакты</a>
            </nav>
          </div>
          <div>
            <h4>Российский контур</h4>
            <p className="small" style={{ color: "#e7e5e1" }}>
              Компания BIO
              <br />
              Официальный дистрибьютор Sanremo в РФ
            </p>
            <p className="small" style={{ color: "#b9b6b1" }}>
              117630, Москва, ул. Обручева, 23с1
              <br />
              БЦ «Геолог», 4 этаж
              <br />
              <a href="tel:+78006004300">8 (800) 600-43-00</a>
              <br />
              Бесплатный звонок по России
              <br />
              <a href="mailto:info@sanremomachines.ru">info@sanremomachines.ru</a>
            </p>
          </div>
        </div>
        <div className="fine">Sanremo Coffee Machines S.r.l. · Официальная дистрибуция BIO в России · © 2026</div>
      </div>
    </footer>
  );
}
