
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmklpuntanomjrspmuun.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZta2xwdW50YW5vbWpyc3BtdXVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3Nzc4NTYsImV4cCI6MjA4MzM1Mzg1Nn0.dQKgRy2FRXO_AImO2t1ckmKYY9fz5fDTeOHEqwfQmCs';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const checkBucketExists = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName);
    return !error && !!data;
  } catch {
    return false;
  }
};

export const uploadRestorationImage = async (file: File, userId: string): Promise<string> => {
  const bucketName = 'restoration-images';
  const fileName = `${userId}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;

  try {
    const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return publicUrl;
  } catch (err) {
    console.warn("Using Base64 fallback for image.");
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
};
