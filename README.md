# Money Compound

Next.js app deployed to GitHub Pages via GitHub Actions.

## Setup GitHub Pages

1. Push repo ขึ้น GitHub
2. ไปที่ **Settings → Pages**
3. เลือก **Source: GitHub Actions**
4. Push ไปที่ branch `main` → workflow จะ deploy อัตโนมัติ

## Development

```bash
npm install
npm run dev
```

## Config

แก้ `repoName` ใน `next.config.ts` ให้ตรงกับชื่อ GitHub repo:

```ts
const repoName = "money-compound"; // ← เปลี่ยนตรงนี้
```

## URL หลัง deploy

```
https://<username>.github.io/money-compound/
```
