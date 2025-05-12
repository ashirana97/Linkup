import { UserProfile } from "../components/auth/user-profile";
import { ProtectedRoute } from "../components/auth/protected-route";
import { Layout } from "../components/layout/layout";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text">
            Your Profile
          </h1>
          <UserProfile />
        </div>
      </Layout>
    </ProtectedRoute>
  );
}