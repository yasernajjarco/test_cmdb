	DROP TABLE 

`cmdb`.`client_hardware`, 
`cmdb`.`client_zlinux`,
`cmdb`.`client_systeme`,
`cmdb`.`hardware_relation`,
`cmdb`.`occurence_client`,
`cmdb`.`provider_platform`,
`cmdb`.`occurencesoft`,
`cmdb`.`instance`,
`cmdb`.`ci_application`,
`cmdb`.`zlinux`,
`cmdb`.`systeme`,
`cmdb`.`contact`,
`cmdb`.`client`,
`cmdb`.`lpar`,
`cmdb`.`hardware`,
`cmdb`.`audit`, 
`cmdb`.`auditaction`,
`cmdb`.`ci`,
`cmdb`.`provider`,
`cmdb`.`class_service`,
`cmdb`.`ci_type`,
`cmdb`.`env_type`,
`cmdb`.`ci_subtype`, 
`cmdb`.`status`,
`cmdb`.`platform`;


create table ci_type(
   ci_type_id int auto_increment,
   name varchar(300),
   primary key(ci_type_id)
);

create table platform(
   platform_id int auto_increment,
   name varchar(300) not null,
   prefixe varchar(300) not null,
   primary key(platform_id)
);

create table status(
   status_id int auto_increment,
   name varchar(300),
   primary key(status_id)
);

create table client(
   client_id int auto_increment,
   companyname varchar(300) unique,
   address varchar(300),
   isshared int,
   primary key(client_id)
);

create table provider(
   provider_id int auto_increment,
   name varchar(300) not null,
   address varchar(300),
   vendor_code varchar(300),
   vendor varchar(300),
   primary key(provider_id)
);

create table env_type(
   env_type_id int auto_increment,
   name varchar(300),
   primary key(env_type_id)
);

create table auditaction(
   auditaction_id int auto_increment,
   name varchar(300),
   primary key(auditaction_id)
);

create table class_service(
   class_service_id int auto_increment,
   name varchar(300),
   primary key(class_service_id)
);

create table contact(
   contact_id int auto_increment,
   lastname varchar(300),
   firstname varchar(300),
   telephone varchar(300),
   email varchar(300),
   client_id int not null,
   primary key(contact_id),
   foreign key(client_id) references client(client_id)
);

create table ci_subtype(
   ci_subtype_id int auto_increment,
   name varchar(300),
   primary key(ci_subtype_id)
);

create table ci(
   ci_id int auto_increment,
   logical_name varchar(300),
	our_name varchar(300),
   company varchar(300),
   nrb_managed_by varchar(300),
   description varchar(300),
   name varchar(200),
	env_type_id int ,
   ci_subtype_id int not null,
   ci_type_id int not null,
   class_service_id int ,
   platform_id int not null,
   status_id int not null,
   primary key(ci_id),
   foreign key(ci_subtype_id) references ci_subtype(ci_subtype_id),
   foreign key(ci_type_id) references ci_type(ci_type_id),
   foreign key(class_service_id) references class_service(class_service_id),
	foreign key(env_type_id) references env_type(env_type_id),

   foreign key(platform_id) references platform(platform_id),
   foreign key(status_id) references status(status_id)
);

create table hardware(
   hardware_id int auto_increment,
   serial_no varchar(300),
   ci_id int not null,
   primary key(hardware_id),
   foreign key(ci_id) references ci(ci_id)
);

create table ci_application(
   ci_application_id int auto_increment,
   itservice varchar(300),
   product_code varchar(300),
   version varchar(300),
   is_valid int,
   isoccurenciable int,
   end_of_support_date varchar(300),
   end_extended_support varchar(300),
   provider_id int not null,
   ci_id int not null,
   primary key(ci_application_id),
   foreign key(provider_id) references provider(provider_id),
   foreign key(ci_id) references ci(ci_id)
);

create table lpar(
   lpar_id int auto_increment,
   host_type varchar(300),
	hardware_id int,
   ci_id int not null,
   primary key(lpar_id),
   foreign key(ci_id) references ci(ci_id),
	foreign key(hardware_id) references hardware(hardware_id)

);

create table systeme(
   systeme_id int auto_increment,
   lpar_id int,
   ci_id int not null,
   primary key(systeme_id),
   foreign key(lpar_id) references lpar(lpar_id),
   foreign key(ci_id) references ci(ci_id)
);


create table instance(
   instance_id int auto_increment,
   name varchar(50),
   ci_id int not null,
   systeme_id int not null,
   ci_application_id int not null,
   primary key(instance_id),
   foreign key(ci_id) references ci(ci_id),
   foreign key(systeme_id) references systeme(systeme_id),
   foreign key(ci_application_id) references ci_application(ci_application_id)
);


create table audit(
   audit_id int auto_increment,
   role varchar(300),
   audittimestamp varchar(300),
   audituser varchar(300),
   auditdescription varchar(3000),
   ci_id int not null,
   auditaction_id int not null,
   primary key(audit_id),
   foreign key(ci_id) references ci(ci_id),
   foreign key(auditaction_id) references auditaction(auditaction_id)
);

create table zlinux(
   zlinux_id int auto_increment,
   domaine varchar(300),
   os_version varchar(300),
   cpu_type varchar(300),
   cpu_number varchar(300),
   physical_mem_total varchar(300),
   ci_id int not null,
   systeme_id int,
   primary key(zlinux_id),
   foreign key(ci_id) references ci(ci_id),
   foreign key(systeme_id) references systeme(systeme_id)
);

create table occurencesoft(
   occurencesoft_id int auto_increment,
   name varchar(300),
	ci_id int not null,
   our_name varchar(300),
   instance_id int,
   primary key(occurencesoft_id),
	foreign key(ci_id) references ci(ci_id),
   foreign key(instance_id) references instance(instance_id)
);


create table provider_platform(
   platform_id int,
   provider_id int,
   primary key(platform_id, provider_id),
   foreign key(platform_id) references platform(platform_id),
   foreign key(provider_id) references provider(provider_id)
);

create table client_zlinux(
   client_id int,
   zlinux_id int,
   primary key(client_id, zlinux_id),
   foreign key(client_id) references client(client_id),
   foreign key(zlinux_id) references zlinux(zlinux_id)
);

create table client_systeme(
   client_id int,
   systeme_id int,
   primary key(client_id, systeme_id),
   foreign key(client_id) references client(client_id),
   foreign key(systeme_id) references systeme(systeme_id)
);

create table client_hardware(
   hardware_id int,
   client_id int,
   primary key(hardware_id, client_id),
   foreign key(hardware_id) references hardware(hardware_id),
   foreign key(client_id) references client(client_id)
);


create table hardware_relation(
   hardware_id int,
   hardware_id_1 int,
   primary key(hardware_id, hardware_id_1),
   foreign key(hardware_id) references hardware(hardware_id),
   foreign key(hardware_id_1) references hardware(hardware_id)
);


create table occurence_client(
   client_id int,
   occurencesoft_id int,
   primary key(client_id, occurencesoft_id),
   foreign key(client_id) references client(client_id),
   foreign key(occurencesoft_id) references occurencesoft(occurencesoft_id)
);

