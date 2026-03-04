import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
// import { Feedback } from "@/models/Feedback"; 
import {Review} from "@/models/Review"


export async function getAdminStats() {
  await connectDB();

  const [users, students, instructors, reviewCount] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "STUDENT" }),
    User.countDocuments({ role: "INSTRUCTOR" }),
    Review.countDocuments(),
  ]);

  return { users, students, instructors, reviewCount }
}
