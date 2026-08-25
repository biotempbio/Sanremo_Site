import type { Metadata } from "next";
import "./globals.css";
import "./extras.css";
export const metadata:Metadata={metadataBase:new URL("https://sanremomachines.ru"),title:"Sanremo Россия — профессиональные кофемашины",description:"Официальный каталог Sanremo в России: подбор, РРЦ, наличие, дилеры, сервис и запчасти.",openGraph:{title:"Sanremo Россия",description:"Профессиональные кофемашины для вашего потока",images:["/og.png"],locale:"ru_RU",type:"website"},twitter:{card:"summary_large_image",title:"Sanremo Россия",description:"Профессиональные кофемашины для вашего потока",images:["/og.png"]}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ru"><body>{children}</body></html>}
