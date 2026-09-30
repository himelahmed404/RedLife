# RedLife — Blood Donation Network for Bangladesh

RedLife connects people who need blood with donors nearby. Anyone can post an urgent
blood request, search for donors by blood group, district and upazila, and commit to a
request with one click. Volunteers and admins keep the request board moving, and
supporters can fund the network through Stripe.

- **Live site:** https://YOUR-CLIENT.vercel.app
- **API server:** https://YOUR-SERVER.vercel.app ([server repo](https://github.com/himelahmed404/RedLife-Server))

### Test accounts

| Role | Email | Password |
|---|---|---|
| Admin | `ADMIN_EMAIL` | `ADMIN_PASSWORD` |

New sign-ups are **donors**. An admin can promote users to volunteer or admin from
*Dashboard → All users*, or a user can be made admin by editing `role` in the database.

## Key features

- **Accounts:** email/password registration with avatar upload (ImgBB), blood group,
  district and upazila (all 64 districts / 490+ upazilas). Every new user is an active donor.
- **Role-based dashboard** with a sidebar layout, fully responsive:
  - **Donor:** welcome card, 3 most recent requests, *My donation requests* with status
    filter and pagination, create / edit / delete requests, *My donations*, profile.
  - **Volunteer:** everything a donor has, plus *All blood donation requests*, where
    they can update a request's status.
  - **Admin:** full control. Stat cards (donors, funding, requests), a daily / weekly /
    monthly requests chart, *All users* with block / unblock and make volunteer / admin,
    and full management of every request.
- **Donation workflow:** `pending → inprogress → done | canceled`. A donor confirms from
  the request details page; Done / Cancel appear only while a request is in progress.
- **Public pages:** home (hero, how it works, donor groups, contact), the pending request
  board with pagination, and donor search with a **PDF download** of the results.
- **Profile:** a read-only form with an Edit button. Name, avatar, phone, blood group and
  location can be updated; the email address never changes.
- **Blocked users** can log in but cannot create requests or donate.
- **Funding:** Stripe Checkout (test mode), with a table of every contribution.
- **Security:** Better Auth sessions and short-lived **JWTs** on every private API call,
  verified by the server. Private routes survive a page reload without a login bounce.

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · Better Auth · MongoDB ·
Express API ([server repo](https://github.com/himelahmed404/RedLife-Server)) · Stripe · ImgBB

### npm packages

| Package | Used for |
|---|---|
| `next`, `react`, `react-dom` | App framework |
| `better-auth`, `@better-auth/mongo-adapter`, `mongodb` | Authentication, sessions and JWT issuing (jwt plugin) |
| `@heroui/react`, `@heroui/styles`, `@heroui/navbar` | UI primitives |
| `tailwindcss`, `@tailwindcss/postcss` | Styling |
| `framer-motion`, `motion` | Animations |
| `recharts` | Dashboard charts |
| `jspdf`, `jspdf-autotable` | PDF export of donor search results |
| `react-hot-toast` | Notifications |
| `react-icons` | Icons (including the X logo) |
| `eslint`, `eslint-config-next` | Linting |

## Routes

| Route | Access |
|---|---|
| `/`, `/donation-requests`, `/search`, `/login`, `/register` | Public |
| `/donation-requests/:id`, `/funding` | Logged in |
| `/dashboard`, `/dashboard/profile`, `/dashboard/my-donation-requests`, `/dashboard/create-donation-request`, `/dashboard/my-donations` | Any role |
| `/dashboard/all-blood-donation-request` | Admin, volunteer |
| `/dashboard/all-users` | Admin |

## Run locally

```bash
git clone https://github.com/himelahmed404/RedLife.git
cd RedLife
npm install
cp .env.example .env   # then fill in the values
npm run dev            # http://localhost:3000
```

The [API server](https://github.com/himelahmed404/RedLife-Server) must be running too
(`npm run dev`, port 5000).

### Environment variables

| Name | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Long random string used to sign sessions |
| `BETTER_AUTH_URL` | This app's URL (`http://localhost:3000` locally, the Vercel URL in production) |
| `MONGO_URI` | MongoDB Atlas connection string (same database as the server) |
| `NEXT_PUBLIC_IMGBB_API_KEY` | ImgBB key for avatar uploads |
| `NEXT_PUBLIC_SERVER_URL` | Express API URL |

Secrets live only in `.env`, which is git-ignored. `.env.example` lists the names.

## Deploying (Vercel)

1. Import the repo in Vercel (framework preset: Next.js).
2. Add the five environment variables above. `BETTER_AUTH_URL` must be the exact
   production URL, with no trailing slash.
3. Deploy, then set the server's `CLIENT_URL` to this URL.
