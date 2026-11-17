# Fosters Media Web Starter

A mobile-friendly first web-app foundation for iPhone and Android browsers.

## Included
- Admin email/password sign-in through Supabase Auth
- Influencer phone OTP sign-in flow through Supabase Auth
- Role lookup from `public.profiles`
- Separate starter views for Admin and Influencer

## Configure
1. Open `config.js`.
2. Replace the Project URL placeholder with your Supabase Project URL.
3. Replace the publishable-key placeholder with your Supabase publishable key.
4. Save.

Never place a Supabase `service_role` key, database password, or other secret in browser code.

## Database assumptions
The `public.profiles` table must contain `id` (matching the Auth user UUID), `full_name`, and `role`. The signed-in user must be allowed by RLS to read their own profile. Review RLS and test before real users.

## Important limitations
This is a starter, not a finished or production-ready app. Campaign/client management, influencer assignments, visit scheduling, rescheduling approvals, story uploads, payments, WhatsApp messages, and full security review are not implemented yet. No live public URL is created by this ZIP.

## Hosting
The files are static HTML/CSS/JavaScript and can be deployed to a static hosting service in a later step.
