insert into patient_details(id,first_name,last_name, dob, gender, date_registered)
values(10001, 'Hassan','Kesi', '1987-12-15','Male', current_date());

insert into patient_details(id,first_name,last_name, dob, gender, date_registered)
values(10002, 'Maulid','Tajiri', '1990-03-25','Male', current_date());

insert into patient_details(id,first_name,last_name, dob, gender, date_registered)
values(10003, 'Jane','Moleli', '2001-02-13','Female', current_date());

insert into patient_visits(id,patient_id, visit_date, height, weight, bmi, general_health, on_drugs, weight_loose, comments)
values(20001,10001, current_date(), 175,65, 24, 'good', 'yes', 'yes', 'You have to see a doctor' );

insert into patient_visits(id,patient_id, visit_date, height, weight, bmi, general_health, on_drugs, weight_loose, comments)
values(20004,10001, current_date(), 175,65, 24, 'good', 'yes', 'yes', 'Have good one' );

insert into patient_visits(id,patient_id, visit_date, height, weight, bmi,  general_health, on_drugs, weight_loose, comments)
values(20002,10002, current_date(), 185,75, 24, 'good', 'yes', 'yes', 'No need to see a doctor' );

insert into patient_visits(id,patient_id, visit_date, height, weight, bmi, general_health, on_drugs, weight_loose, comments)
values(20003,10003, current_date(), 165,55, 24, 'poor', 'no', 'yes', 'go home' );