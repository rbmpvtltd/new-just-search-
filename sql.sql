select(
select count(*) from public.salesmen s 
left join business_listings bl on
bl.salesman_id = s.id
where s.franchise_id = 1 and s.id = 3) +
(
select count(*) from public.salesmen s
left join hire_listing hl on hl.salesman_id = s.id
where s.franchise_id = 1 and s.id = 3 ) as total;
