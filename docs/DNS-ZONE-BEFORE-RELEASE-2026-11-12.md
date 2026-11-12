# DNS-зона sanremomachines.ru перед переключением сайта

Снято 12.11.2026 из панели REG.RU, аккаунт `sk@bioshop.ru`, карточка домена `76137341`, раздел «DNS-серверы и управление зоной». Это точка отката для веб-записей. На момент снимка проект Sanremo `10550779` виден в Tilda и привязан к `sanremomachines.ru`; ничего в Tilda не удалено.

DNS-серверы: `ns1.reg.ru`, `ns2.reg.ru`.

| Тип | Имя | Значение | Приоритет |
| --- | --- | --- | --- |
| A | @ | 176.57.65.159 | — |
| A | mx1 | 185.12.28.211 | — |
| A | staging | 178.209.127.53 | — |
| A | www | 176.57.65.159 | — |
| MX | @ | mx1.timeweb.ru. | 10 |
| MX | @ | mx2.timeweb.ru. | 20 |
| TXT | @ | `v=spf1 include:_spf.timeweb.ru ip4:62.113.37.127 -all` | — |
| TXT | _dmarc | `v=DMARC1; p=none; aspf=r; sp=none; rua=mailto:sales@sanremomachines.ru` | — |
| TXT | dkim._domainkey | `k=rsa;p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQEAy/YbYBtJ6n2pj4qTO+VR8kdYC7EJRdH2M3of0T2TW3tdbqkhvuVKjcuMKADrZDUyA5T2LgyePLLScfSh5ccsOToO269NGbJtpiSjqfc1Y4zG96rWJtiqozY1BjXPAxSObqOPVfY0v/BV1scfiusX+NfJtkpa9MRah9jXsK2QAF8X2ITaXyRhZ5HyotMcCtVL8tleflKeqOYS/1IZuZl2DJsbgcQSx7OkOhwF2byZ0lgoJmXvtsX+4z0NK+fhPb0Xep+hcwL6hhg+NYuIwi7jU9ozIa7ks344xuiI2oO8WIe8iR/DsV8YcQRCBKIQYdEvpTN50aBPlkwkmID8JbsUgwIDAQAB` | — |
| TXT | mail._domainkey | `v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1FyaCJw2yeY2au8emtNJsh0k67RsoD+F15pog5LyV5/U1DPCPepRz6/RryYqjqvJJWFvPOfZnTklfdQo2cG6h4+3vFq64IBms5Me6B+eurWS/6Wa3Se8n2kfjrlpZ3QJxSDlJgB+TVLOZDWuxsb5nJI49TBKDRD0qVIo+Sj90GD6iC4foVa2FE77EIhGYZ9mRULcDjvX4pDiocUSq2bzu74t3CupoO8s05T2B3CVIbLV5mZNknNfgTqD2YfRYkTdwoI9pQkxlR8Ya6KxFJtWqAPs6dK+EaRotc1aM37hTyBsX5cvFjxAmMq/+hsWOmv0nlG5i0G0yRj+DN8EF2GsYwIDAQAB` | — |

Для отката сайта вернуть **только** `A @` и `A www` к `176.57.65.159`, затем восстановить привязку домена в Tilda, если она была снята. Остальные DNS-записи не менять.
