
-- Create storage bucket for pest detection images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pest-images',
  'pest-images',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- Create RLS policy for pest images storage
CREATE POLICY "Users can upload their own pest images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pest-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view pest images" ON storage.objects
FOR SELECT USING (bucket_id = 'pest-images');

CREATE POLICY "Users can update their own pest images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pest-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own pest images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pest-images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
