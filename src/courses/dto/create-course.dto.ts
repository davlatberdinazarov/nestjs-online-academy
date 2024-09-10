export class CreateCourseDto {
    name: string;
    description: string;
    price: number;
    categoryId: number;  // This will link the course to a specific category
  }
  
  export class UpdateCourseDto {
    name?: string;
    description?: string;
    price?: number;
    categoryId?: number;  // Optional for updating the category
  }
  