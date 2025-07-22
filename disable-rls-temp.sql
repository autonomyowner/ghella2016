-- Temporary script to disable RLS for testing
-- WARNING: Only use this for testing, not in production!

-- Disable RLS temporarily
ALTER TABLE public.land_listings DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_reviews DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.land_favorites DISABLE ROW LEVEL SECURITY;

-- Test query
SELECT COUNT(*) as total_listings FROM public.land_listings WHERE is_available = true;

-- Re-enable RLS after testing
-- ALTER TABLE public.land_listings ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.land_reviews ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.land_favorites ENABLE ROW LEVEL SECURITY; 
