// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";

// export default async function ProfilePage() {
//   const session = await getServerSession(authOptions);
//   const role = (session?.user as any)?.role ?? "USER";

//   return (
//     <Card>
//       <CardHeader>
//         <h1 className="text-xl font-semibold">Profile</h1>
//         <p className="text-sm text-neutral-600">You are logged in.</p>
//       </CardHeader>
//       <CardContent className="text-sm">
//         <div><b>Name:</b> {session?.user?.name}</div>
//         <div><b>Email:</b> {session?.user?.email}</div>
//         <div><b>Role:</b> {role}</div>
//       </CardContent>
//     </Card>
//   );
// }

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/sign-in");
  }
  
  const role = (session?.user as any)?.role ?? "USER";
  
  // Mock data - replace with actual data from your database
  const userStats = {
    memberSince: "January 2024",
    lastActive: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    completedActions: 12,
    pendingTasks: 3,
  };

  return (
    <div className="min-h-screen bg-ash-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-navy-900">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-ash-600 mt-2">Manage your profile and view your activity</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="border-ash-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-navy-800 to-navy-900 text-white rounded-t-lg">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full bg-gold-500 flex items-center justify-center">
                    <span className="text-2xl font-bold text-navy-900">
                      {session?.user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
                    <p className="text-gold-300 text-sm capitalize">{role.toLowerCase()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center space-x-3 text-ash-700">
                  <svg className="h-5 w-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">{session?.user?.email}</span>
                </div>
                
                <div className="flex items-center space-x-3 text-ash-700">
                  <svg className="h-5 w-5 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm capitalize">{role.toLowerCase()}</span>
                </div>

                <div className="pt-4 border-t border-ash-200">
                  <Link href="/profile/edit">
                    <button className="w-full bg-navy-700 text-white py-2 px-4 rounded-md hover:bg-navy-800 transition-colors duration-200 font-medium">
                      Edit Profile
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card className="border-ash-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-navy-700 text-sm font-medium mb-2">Member Since</div>
                  <div className="text-2xl font-bold text-navy-900">{userStats.memberSince}</div>
                </CardContent>
              </Card>
              
              <Card className="border-ash-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-navy-700 text-sm font-medium mb-2">Completed Actions</div>
                  <div className="text-2xl font-bold text-navy-900">{userStats.completedActions}</div>
                </CardContent>
              </Card>
              
              <Card className="border-ash-200 shadow-md hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="text-navy-700 text-sm font-medium mb-2">Pending Tasks</div>
                  <div className="text-2xl font-bold text-navy-900">{userStats.pendingTasks}</div>
                  <div className="mt-2">
                    <button className="text-sm text-gold-600 hover:text-gold-700 font-medium">
                      View Tasks →
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity Card */}
            <Card className="border-ash-200 shadow-lg">
              <CardHeader className="bg-ash-100 border-b border-ash-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-navy-900">Recent Activity</h2>
                  <span className="text-sm text-ash-600">Last active: {userStats.lastActive}</span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b border-ash-100 last:border-0">
                      <div className="flex items-center space-x-3">
                        <div className="h-2 w-2 rounded-full bg-gold-500"></div>
                        <span className="text-sm text-ash-700">Action {item} completed</span>
                      </div>
                      <span className="text-xs text-ash-500">2 hours ago</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Call to Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/apply" className="block">
                <button className="w-full bg-gold-500 text-navy-900 py-3 px-4 rounded-md hover:bg-gold-600 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg">
                  Apply Now
                </button>
              </Link>
              
              <Link href="/dashboard" className="block">
                <button className="w-full bg-ash-200 text-navy-800 py-3 px-4 rounded-md hover:bg-ash-300 transition-colors duration-200 font-semibold shadow-md hover:shadow-lg">
                  Go to Dashboard
                </button>
              </Link>
            </div>

            {/* Role-specific content */}
            {role === "ADMIN" && (
              <Card className="border-2 border-gold-500 bg-gold-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-navy-900">Admin Access</h3>
                      <p className="text-sm text-ash-700">You have administrator privileges</p>
                    </div>
                    <Link href="/admin">
                      <button className="bg-navy-800 text-white py-2 px-4 rounded-md hover:bg-navy-900 transition-colors duration-200 text-sm">
                        Admin Panel
                      </button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}