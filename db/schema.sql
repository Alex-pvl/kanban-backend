create table users(
    id serial primary key,
    name varchar not null,
    login varchar unique not null,
    password text not null,
    token text not null
);

create table tasks(
    id serial primary key,
    title varchar not null,
    description text,
    status varchar not null,
    priority varchar not null,
    user_id integer references users(id)
);