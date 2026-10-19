create table if not exists gallery_images (
  id serial primary key,
  key text unique not null,        -- object key in the bucket, e.g. "img/<uuid>.jpg"
  alt text not null default '',
  label text not null default '',
  width int not null,
  height int not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
