create table if not exists players (
  id uuid primary key,
  created_at timestamptz default now(),
  display_name text not null,
  device_id text,
  last_seen timestamptz default now()
);

create table if not exists saves (
  player_id uuid references players(id) on delete cascade,
  slot smallint default 0,
  data jsonb not null,
  updated_at timestamptz default now(),
  primary key (player_id, slot)
);

create table if not exists matches (
  id uuid primary key,
  player_id uuid references players(id) on delete cascade,
  result text,
  loot_value int default 0,
  duration_sec int default 0,
  created_at timestamptz default now()
);
