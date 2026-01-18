// Stable Unsplash images mapped by course ID
const courseImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  2: "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
  3: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
  4: "https://images.unsplash.com/photo-1531482615713-2afd69097998",
  5: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
  6: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
};

// Always return the same image for the same course
export const getCourseImage = (courseId: number) => {
  return `${courseImages[courseId] || courseImages[1]}?auto=format&fit=crop&w=800&q=80`;
};
