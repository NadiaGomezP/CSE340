--Insert new record to `account` table
INSERT INTO public.account (account_firstname,account_lastname,account_email,account_password) VALUES 
	('Tony','Stark','tony@starkent.com','Iam1ronM@n');

--Update account_type
UPDATE public.account SET account_type = 'Admin' WHERE account_id = 1;

--Delete record
DELETE FROM public.account where account_id = 1;
	
--Modify GM Hummer description
UPDATE public.inventory 
SET inv_description = REPLACE(inv_description,'the small interiors','a huge interior')
WHERE inv_id = 10;

-- Inner join for inventory and classification 'Sport'
SELECT inv_make, inv_model, classification_name FROM inventory i
INNER JOIN classification c ON i.classification_id = c.classification_id
WHERE classification_name = 'Sport';

-- Update `inv_image` and `inv_thumbnail`
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');