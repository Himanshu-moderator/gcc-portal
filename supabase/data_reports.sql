-- Reports from the "Report a data issue" form. Run once in the Supabase SQL editor.
-- Anyone can submit a report; nobody can read them from the app (open them in the dashboard).

create table if not exists public.data_reports (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  link text not null,
  category text not null,
  comment text not null,
  email text,
  screenshot_path text,
  constraint data_reports_comment_len check (char_length(comment) between 10 and 2000)
);

alter table public.data_reports enable row level security;

drop policy if exists "anyone can report" on public.data_reports;
create policy "anyone can report" on public.data_reports
  for insert to anon, authenticated with check (true);

-- Private bucket for screenshots; people can upload but not list or read.
insert into storage.buckets (id, name, public)
values ('report-screenshots', 'report-screenshots', false)
on conflict (id) do nothing;

drop policy if exists "anyone can upload a report screenshot" on storage.objects;
create policy "anyone can upload a report screenshot" on storage.objects
  for insert to anon, authenticated with check (bucket_id = 'report-screenshots');
