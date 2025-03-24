export interface Program {
  programId: string;
    name: string;
    description: string;
    imageUrl: string;
    startDate: string;
    endDate: string;
    status: boolean;
    createdAt: string;
    updatedAt: string;
    time: string;
    frequency: string;
    targetAudience: string;
    location: string;
    organizerEmail: string;
    contactPhone: string;
    price: string;
    rating: number;
    ratingCount: number | null;
    categoryId: string;
    createdBy: string | null;
    updatedBy: string | null;
    instructors: {
      instructorId: string;
      instructorName: string;
      instructorImage: string | null;
      instructorTitle: string | null;
      instructorExperience: string;
      instructorDescription: string | null;
      programId: string;
      createdAt: string;
      createdBy: string | null;
      updatedAt: string | null;
      updatedBy: string | null;
    }[];
  }