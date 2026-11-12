# sanremomachines.ru: зона до переноса почты

Снимок панели REG.RU от 12.11.2026, до изменения почтовых записей. Управление зоной: `ns1.reg.ru`, `ns2.reg.ru`. Домен действителен до 15.11.2026; автопродление выключено. Этот файл — текстовый экспорт всех записей, показанных в панели.

| Тип | Имя | Значение | Приоритет |
| --- | --- | --- | --- |
| A | @ | 176.57.65.159 | — |
| A | mx1 | 185.12.28.211 | — |
| A | staging | 178.209.127.53 | — |
| A | www | 176.57.65.159 | — |
| MX | @ | mx1.sanremomachines.ru. | 10 |
| TXT | @ | `v=spf1 ip4:185.12.28.211 a mx -all` | — |
| TXT | _dmarc | `v=DMARC1; p=none; aspf=r; sp=none` | — |
| TXT | mail._domainkey | `v=DKIM1; h=sha256; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1FyaCJw2yeY2au8emtNJsh0k67RsoD+F15pog5LyV5/U1DPCPepRz6/RryYqjqvJJWFvPOfZnTklfdQo2cG6h4+3vFq64IBms5Me6B+eurWS/6Wa3Se8n2kfjrlpZ3QJxSDlJgB+TVLOZDWuxsb5nJI49TBKDRD0qVIo+Sj90GD6iC4foVa2FE77EIhGYZ9mRULcDjvX4pDiocUSq2bzu74t3CupoO8s05T2B3CVIbLV5mZNknNfgTqD2YfRYkTdwoI9pQkxlR8Ya6KxFJtWqAPs6dK+EaRotc1aM37hTyBsX5cvFjxAmMq/+hsWOmv0nlG5i0G0yRj+DN8EF2GsYwIDAQAB` | — |

TTL положительных ответов: `1d` (86400 секунд). Minimum для отрицательных ответов: `3h` (10800 секунд). SOA Refresh: 14400, Retry: 3600, Expire: 604800 секунд.

При миграции почты записи `A @`, `A www`, `A staging` должны остаться без изменений. Старую `A mx1` можно оставить до проверки новой почты; она не направляет почту без старой MX-записи.
