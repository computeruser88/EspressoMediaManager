use mediamanager

INSERT INTO media(name,type,genre,rating,year,quantity,time_limit,cost,createdAt, updatedAt)
VALUES("Beauty and the Beast","Movie","Family, Fantasy, Musical","G",2017,7,5,0.0,NOW(), NOW());

INSERT INTO media(name,type,genre,rating,year,quantity,time_limit,cost,createdAt, updatedAt)
VALUES("Dead Pool 2","Movie","Action, Adventure", "R",2018,10,3,0.0,NOW(), NOW());

select * from media;