-- Users share one table, differentiated by role
create table profiles (
  id uuid references auth.users primary key,
  role text check (role in ('podcaster', 'advertiser', 'admin')) not null,
  display_name text not null,
  created_at timestamptz default now()
);

-- Podcaster-specific info
create table podcaster_profiles (
  id uuid references profiles(id) primary key,
  show_name text not null,
  rss_feed_url text,
  avg_downloads int,
  category text,
  ad_categories_blocked text[] default '{}',
  stripe_connect_account_id text
);

-- Voice clone linked to a podcaster
create table voice_profiles (
  id uuid primary key default gen_random_uuid(),
  podcaster_id uuid references podcaster_profiles(id) not null,
  elevenlabs_voice_id text not null,
  status text check (status in ('pending', 'active', 'revoked')) default 'pending',
  consent_signed_at timestamptz,
  sample_audio_urls text[],
  created_at timestamptz default now()
);

-- Advertiser-specific info
create table advertiser_profiles (
  id uuid references profiles(id) primary key,
  company_name text not null,
  stripe_customer_id text
);

-- Open ad slots posted by podcasters
create table ad_slots (
  id uuid primary key default gen_random_uuid(),
  podcaster_id uuid references podcaster_profiles(id) not null,
  episode_title text,
  air_date timestamptz not null,
  slot_length_seconds int not null,
  price_cents int not null,
  status text check (status in ('open', 'reserved', 'filled', 'expired')) default 'open',
  deadline timestamptz not null,
  created_at timestamptz default now()
);

-- An advertiser's submission against a slot
create table ad_submissions (
  id uuid primary key default gen_random_uuid(),
  slot_id uuid references ad_slots(id) not null,
  advertiser_id uuid references advertiser_profiles(id) not null,
  script_text text not null,
  generated_audio_url text,
  status text check (status in (
    'submitted', 'generating', 'pending_approval',
    'approved', 'rejected', 'delivered'
  )) default 'submitted',
  rejection_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Payment tracking
create table transactions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references ad_submissions(id) not null,
  amount_cents int not null,
  platform_fee_cents int not null,
  stripe_payment_intent_id text,
  status text check (status in ('held', 'released', 'refunded')) default 'held',
  created_at timestamptz default now()
);
