import { Header, Footer } from "./components/Chrome";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="wrap section" style={{ minHeight: "48vh" }}>
        <p className="eyebrow">Ошибка 404</p>
        <h1 style={{ maxWidth: "18ch" }}>Такой страницы на сайте нет</h1>
        <p className="lead" style={{ marginTop: 18 }}>
          Возможно, модель снята с поставок или адрес изменился. Снятые позиции сохраняют архивную
          сервисную страницу либо ведут на преемника с пояснением — на главную мы не перенаправляем.
        </p>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 24 }}>
          <a className="btn btn-solid" href="/products">Каталог кофемашин</a>
          <a className="btn" href="/choose">Подобрать модель</a>
          <a className="btn" href="/parts">Каталог запчастей</a>
          <a className="btn" href="/dealers">Найти дилера</a>
        </div>
      </main>
      <Footer />
    </>
  );
}
