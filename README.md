# prodgate-demo

A small Express API that shows [Prodgate](https://github.com/prodgate-dev/prodgate) catching access control regressions before they ship.

## The app

Three route groups:

- `/auth`: public routes (login, register, forgot-password)
- `/users`: authenticated routes, guarded per route with `requireAuth`
- `/admin`: admin-only routes, guarded once at the mount with `requireAuth` and `requireAdmin`

Each scenario below is a branch with a change that looks harmless in review but quietly removes an access control guard. Prodgate flags it and fails CI.

## Scenario 1: a route loses its guard

The branch `demo/remove-route-middleware` drops `requireAuth` from `GET /users/profile`.

Before:
```ts
router.get('/profile', requireAuth, (req, res) => {
  res.json({ user: 'profile data' })
})
```

After:
```ts
router.get('/profile', (req, res) => {
  res.json({ user: 'profile data' })
})
```

Prodgate output:
```
Prodgate Access Control Report
──────────────────────────────────────────────────
Routes scanned: 12

[CRITICAL] Access control regression: GET /users/profile

  File:   src/routes/users.ts:7
  Before: requireAuth
  After:  (none)

  Impact: GET /users/profile no longer enforces any access control. This endpoint is now publicly accessible.

──────────────────────────────────────────────────
Authorization changes detected:

  CRITICAL
    GET /users/profile   requireAuth -> (none)

Verdict: FAIL
```

## Scenario 2: a router loses its guard

The branch `demo/remove-router-middleware` drops the guards from the `/admin` mount. The admin route file does not change, so the diff looks innocent on its own.

Before:
```ts
app.use('/admin', requireAuth, requireAdmin, adminRouter)
```

After:
```ts
app.use('/admin', adminRouter)
```

Prodgate output:
```
Prodgate Access Control Report
──────────────────────────────────────────────────
Routes scanned: 12

[CRITICAL] Access control regression: Router /admin lost auth middleware

  File:   src/app.ts
  Before: requireAuth -> requireAdmin
  After:  (none)

  Impact: Routes under /admin that relied on this mount guard are now reachable without authentication or authorization.

  Affected routes:
    GET /admin/users
    POST /admin/users
    DELETE /admin/users/:id
    GET /admin/audit-logs
    POST /admin/impersonate/:userId

──────────────────────────────────────────────────
Authorization changes detected:

  CRITICAL
    USE /admin (5 routes affected)

Verdict: FAIL
```

## Try it locally

```bash
npm install -g prodgate
```

Scenario 1:
```bash
git clone https://github.com/prodgate-dev/prodgate-demo before
git clone https://github.com/prodgate-dev/prodgate-demo after
cd after && git checkout demo/remove-route-middleware && cd ..
prodgate check --before ./before --after ./after
```

Scenario 2:
```bash
git clone https://github.com/prodgate-dev/prodgate-demo before
git clone https://github.com/prodgate-dev/prodgate-demo after
cd after && git checkout demo/remove-router-middleware && cd ..
prodgate check --before ./before --after ./after
```

## CI

Every pull request in this repo runs Prodgate through GitHub Actions. See `.github/workflows/prodgate.yml`.

## Links

- npm: https://www.npmjs.com/package/prodgate
- source: https://github.com/prodgate-dev/prodgate
