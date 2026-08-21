# Google Sheets Schema

Create these tabs in the Liga Mahasiswa Malaysia Google Sheet.
Headers must match exactly (case-sensitive, underscores).

---

## Users
```
id, name, email, phone, password_hash, chapter_slug, role, status, member_id, avatar_url, created_at
```
- `role`: "user" | "committee" | "admin"
- `status`: "pending" | "approved" | "rejected"

## Chapters
```
slug, name, full_name, description, established, members_count, Instagram, Facebook, Twitter, WhatsApp, email, website, President_name, President_email
```

## Campaigns
```
slug, chapter_slug, title, description, evidence, status, likes, created_at
```

## Events
```
slug, chapter_slug, title, description, date, time, location, location_url, status, likes, created_at
```

## RSVPs
```
id, user_id, event_slug, status, created_at
```

## Statements
```
slug, chapter_slug, title, content, date, status, created_at
```

## Gallery
```
id, chapter_slug, image_url, caption, likes, created_at
```

## Products
```
slug, name, tag, price, chapter_slug, description, imageUrl, member_only, stock, status, created_at
```

## Orders
```
id, hitpay_id, amount, currency, payment_method, payment_status, items, buyer_email, buyer_name, created_at
```

## Zines
```
slug, title, author, chapter_slug, content, excerpt, likes, status, created_at
```

## Likes
```
id, user_id, target_type, target_slug, created_at
```

## PRK_Nominations
```
id, name, chapter_slug, position, platform, email, status, created_at
```

## Newsletter
```
id, email, name, chapter_slug, created_at
```

## Contact
```
id, name, email, subject, message, created_at
```

## News
```
outlet, title, url, image_url, fetched_at
```

## Constitution
```
id, section, title, content, order
```

## Committee
```
id, chapter, title, name, email, created_at
```
