No db rodar {
alter table actions alter column action_id drop default;
alter table last_state alter column last_state drop default;
alter table nodes alter column node_id drop default;
alter table radio_variables alter column radio_variable_id drop default;
alter table scheduling_historys alter column scheduling_history_id drop default;
alter table schedulings alter column scheduling_id drop default;
alter table state_variables alter column state_variable_id drop default;
alter table states alter column state_id drop default;
alter table users alter column user_id drop default;
ALTER TABLE farms RENAME COLUMN users TO workers;

}

1- prisma init
2- prisma db pull
3 - prisma generate
4 - mkdir -p prisma/migrations/0_init
5- px prisma migrate diff \
--from-empty \
--to-schema-datamodel prisma/schema.prisma \
--script > prisma/migrations/0_init/migration.sql

6 - prisma migrate resolve --applied 0_init
7 - Alterar schema.prisma
8 - prisma migrate dev --name=soil

Gerar migrations
yarn init_migrate:dev

rodar migration

yarn migrate:dev ou yarn migrate:prod a depender do ambiente que estiver rodando

Se der erro de permissão para criar shadow db ao gerar migration com prisma usar:
ALTER USER soil WITH SUPERUSER;
