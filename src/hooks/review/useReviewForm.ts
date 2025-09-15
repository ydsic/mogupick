import { useState } from 'react';

export interface ReviewForm {
  rating: number;
  content: string;
  images: File[];
}

export function useReviewForm() {
  const [form, setForm] = useState<ReviewForm>({
    rating: 0,
    content: '',
    images: [],
  });

  const setRating = (rating: number) => setForm((prev) => ({ ...prev, rating }));
  const setContent = (content: string) => setForm((prev) => ({ ...prev, content }));
  const addImage = (file: File) => setForm((prev) => ({ ...prev, images: [...prev.images, file] }));
  const removeImage = (index: number) =>
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

  return { form, setRating, setContent, addImage, removeImage };
}
