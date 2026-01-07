
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmklpuntanomjrspmuun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta2xwdW50YW5vbWpyc3BtdXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Nzc4NTYsImV4cCI6MjA4MzM1Mzg1Nn0.dQKgRy2FRXO_AImO2t1ckmKYY9fz5fDTeOHEqwfQmCs';

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Checks if a specific storage bucket exists.
 */
export const checkBucketExists = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    if (error) return false;
    return !!data;
  } catch {
    return false;
  }
};

/**
 * Robust image uploader with fallback.
 */
export const uploadRestorationImage = async (file: File, userId: string): Promise<string> => {
  const bucketName = 'restoration-images';
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (error) {
      if (error.message.includes("Bucket not found")) {
        console.warn("Supabase bucket not found. Using local Base64 fallback for demo.");
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }
      throw error;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(fileName);
    
    return publicUrl;
  } catch (err) {
    console.error("Storage upload failed, using local fallback:", err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};

/**
 * DATABASE SETUP SQL:
 * 
 * -- 1. Profiles Table
 * create table profiles (
 *   id uuid references auth.users on delete cascade primary key,
 *   name text,
 *   email text,
 *   role text check (role in ('FISHERMAN', 'NGO', 'ADMIN', 'CORPORATE')),
 *   created_at timestamp with time zone default timezone('utc'::text, now())
 * );
 * 
 * -- 2. Submissions Table
 * create table submissions (
 *   id uuid default gen_random_uuid() primary key,
 *   user_id uuid references profiles(id),
 *   user_name text,
 *   timestamp timestamp with time zone default timezone('utc'::text, now()),
 *   image_url text,
 *   location jsonb,
 *   ecosystem_type text,
 *   status text,
 *   ai_score float,
 *   ai_analysis text,
 *   estimated_area float,
 *   estimated_carbon float,
 *   verifier_comments text,
 *   credit_id text
 * );
 * 
 * -- 3. Carbon Credits Table
 * create table carbon_credits (
 *   id text primary key,
 *   submission_id uuid references submissions(id),
 *   origin text,
 *   region text,
 *   owner_id text,
 *   owner_name text,
 *   tons float,
 *   status text,
 *   minted_at timestamp with time zone default timezone('utc'::text, now()),
 *   transaction_hash text
 * );
 */
