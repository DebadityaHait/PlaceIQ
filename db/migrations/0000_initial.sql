create extension if not exists pgcrypto;

do $$ begin
  create type user_role as enum ('student', 'recruiter', 'officer');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verification_status as enum ('pending', 'verified', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type application_status as enum ('applied', 'shortlisted', 'rejected', 'selected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type job_status as enum ('draft', 'published', 'closed');
exception when duplicate_object then null; end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role user_role not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references users(id) on delete cascade,
  role user_role not null,
  full_name text not null,
  email text not null,
  dob date,
  course text,
  graduation_year int,
  skills text[] default '{}',
  resume_file_name text,
  resume_mime_type text,
  resume_size_bytes int,
  resume_data text,
  resume_text text,
  resume_parsed jsonb default '{}'::jsonb,
  verification_status verification_status default 'pending',
  is_job_eligible boolean default false,
  rejection_reason text,
  company_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  recruiter_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  description text not null,
  required_skills text[] not null default '{}',
  location text,
  job_type text,
  salary_range text,
  deadline date not null,
  status job_status default 'published',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  student_id uuid not null references profiles(id) on delete cascade,
  status application_status default 'applied',
  match_score int default 0,
  matched_skills text[] default '{}',
  missing_skills text[] default '{}',
  cover_note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint applications_job_student_unique unique(job_id, student_id)
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

create index if not exists idx_profiles_user_id on profiles(user_id);
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_verification_status on profiles(verification_status);
create index if not exists idx_jobs_recruiter_id on jobs(recruiter_id);
create index if not exists idx_jobs_status on jobs(status);
create index if not exists idx_applications_job_id on applications(job_id);
create index if not exists idx_applications_student_id on applications(student_id);
create index if not exists idx_notifications_user_id on notifications(user_id);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at before update on users for each row execute function set_updated_at();

drop trigger if exists profiles_set_updated_at on profiles;
create trigger profiles_set_updated_at before update on profiles for each row execute function set_updated_at();

drop trigger if exists jobs_set_updated_at on jobs;
create trigger jobs_set_updated_at before update on jobs for each row execute function set_updated_at();

drop trigger if exists applications_set_updated_at on applications;
create trigger applications_set_updated_at before update on applications for each row execute function set_updated_at();
