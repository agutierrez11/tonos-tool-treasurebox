-- Add explicit RESTRICTIVE policies for UPDATE and DELETE operations on leads table
-- These deny all access (defense in depth - RLS already denies by default when no policy matches)

CREATE POLICY "No public updates to leads" 
ON public.leads 
FOR UPDATE 
USING (false)
WITH CHECK (false);

CREATE POLICY "No public deletes from leads" 
ON public.leads 
FOR DELETE 
USING (false);