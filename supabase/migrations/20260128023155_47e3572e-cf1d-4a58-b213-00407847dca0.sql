-- Create leads table for lead magnet functionality
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  message TEXT,
  source TEXT DEFAULT 'landing',
  zapier_notified BOOLEAN DEFAULT false,
  email_notified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert leads (public form)
CREATE POLICY "Anyone can insert leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only authenticated admins can view leads (we'll use service role for now)
CREATE POLICY "No direct public read access"
  ON public.leads
  FOR SELECT
  USING (false);

-- Create index for faster queries
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_email ON public.leads(email);

-- Add comment for documentation
COMMENT ON TABLE public.leads IS 'Captured leads from landing page forms';