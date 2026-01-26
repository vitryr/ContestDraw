import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, CreditCard, History } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCreditsStore } from "../store/useCreditsStore";
import CreditBalance from "../components/CreditBalance";
import toast from "react-hot-toast";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user } = useAuthStore();
  const { history, fetchHistory } = useCreditsStore();
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "billing"
  >("profile");

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const handleProfileUpdate = async (data: ProfileForm) => {
    // API call to update profile
    toast.success("Profile updated successfully!");
  };

  const handlePasswordUpdate = async (data: PasswordForm) => {
    // API call to update password
    toast.success("Password updated successfully!");
    passwordForm.reset();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Account Settings
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "profile"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <User className="w-5 h-5" />
                  Profile
                </button>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "password"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Lock className="w-5 h-5" />
                  Password
                </button>
                <button
                  onClick={() => {
                    setActiveTab("billing");
                    fetchHistory();
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeTab === "billing"
                      ? "bg-primary-50 text-primary-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <CreditCard className="w-5 h-5" />
                  Billing
                </button>
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {activeTab === "profile" && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Profile Information
                  </h2>
                  <form
                    onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...profileForm.register("name")}
                        className="input-field"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...profileForm.register("email")}
                        className="input-field"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <button type="submit" className="btn-primary">
                      Update Profile
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "password" && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">
                    Change Password
                  </h2>
                  <form
                    onSubmit={passwordForm.handleSubmit(handlePasswordUpdate)}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <input
                        type="password"
                        {...passwordForm.register("currentPassword")}
                        className="input-field"
                      />
                      {passwordForm.formState.errors.currentPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            passwordForm.formState.errors.currentPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        {...passwordForm.register("newPassword")}
                        className="input-field"
                      />
                      {passwordForm.formState.errors.newPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {passwordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        {...passwordForm.register("confirmPassword")}
                        className="input-field"
                      />
                      {passwordForm.formState.errors.confirmPassword && (
                        <p className="mt-1 text-sm text-red-600">
                          {
                            passwordForm.formState.errors.confirmPassword
                              .message
                          }
                        </p>
                      )}
                    </div>

                    <button type="submit" className="btn-primary">
                      Update Password
                    </button>
                  </form>
                </div>
              )}

              {activeTab === "billing" && (
                <div className="space-y-6">
                  <CreditBalance />

                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                      <History className="w-5 h-5" />
                      Transaction History
                    </h2>

                    {history.length === 0 ? (
                      <p className="text-gray-600 text-center py-8">
                        No transactions yet
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {history.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                          >
                            <div>
                              <div className="font-medium text-gray-900">
                                {transaction.description}
                              </div>
                              <div className="text-sm text-gray-600">
                                {new Date(
                                  transaction.createdAt,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                            <div
                              className={`font-semibold ${
                                transaction.type === "purchase"
                                  ? "text-green-600"
                                  : transaction.type === "usage"
                                    ? "text-red-600"
                                    : "text-blue-600"
                              }`}
                            >
                              {transaction.type === "purchase" ? "+" : "-"}
                              {Math.abs(transaction.amount)} credits
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
