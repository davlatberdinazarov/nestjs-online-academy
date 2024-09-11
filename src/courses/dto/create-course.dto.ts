export class CreateCourseDto {
    name: string;
    description: string;
    price: number;
    categoryId: number;  // This will link the course to a specific category
    isSelled: boolean;  // This field will be used to track if the course is sold or not. Default value is false.
    banner: string;
  }
  
  export class UpdateCourseDto {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;  // Optional for updating the category
    isSelled?: boolean;
    banner?: string;  // Optional for updating the banner image URL
  }
  