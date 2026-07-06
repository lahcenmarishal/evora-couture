-- Delete typo user (cascade will remove identities/profile/user_roles via FK)
DELETE FROM public.user_roles WHERE user_id = '7657fe80-e307-4d7f-8b90-b2525e5d7fe0';
DELETE FROM public.profiles WHERE user_id = '7657fe80-e307-4d7f-8b90-b2525e5d7fe0';
DELETE FROM auth.identities WHERE user_id = '7657fe80-e307-4d7f-8b90-b2525e5d7fe0';
DELETE FROM auth.users WHERE id = '7657fe80-e307-4d7f-8b90-b2525e5d7fe0';

-- Create new admin user with correct email and password 'evora6983'
DO $$
DECLARE
  new_uid uuid := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
    created_at, updated_at, confirmation_token, email_change,
    email_change_token_new, recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', new_uid, 'authenticated', 'authenticated',
    'admin@evoracouture.com', crypt('evora6983', gen_salt('bf')),
    now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb,
    now(), now(), '', '', '', ''
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id,
    last_sign_in_at, created_at, updated_at
  ) VALUES (
    gen_random_uuid(), new_uid,
    jsonb_build_object('sub', new_uid::text, 'email', 'admin@evoracouture.com', 'email_verified', true),
    'email', new_uid::text, now(), now(), now()
  );

  INSERT INTO public.user_roles (user_id, role) VALUES (new_uid, 'admin');
END $$;