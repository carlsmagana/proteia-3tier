create schema config

create table config.users(
    IdUser int primary key identity(1,1),
    NameUser varchar(200),
    Email varchar(200),
    Password varchar(50)
)

insert into config.users values ('Juan Carlos Magaña Cruz', 'carlos@x-world.us', '@Bravenewworld2')
insert into config.users values ('Said Muñoz Montero', 'said@x-world.us', '@Bravenewworld2')
