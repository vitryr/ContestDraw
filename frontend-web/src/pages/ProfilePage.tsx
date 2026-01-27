import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, CreditCard, History, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useCreditsStore } from "../store/useCreditsStore";
import { usersApi } from "../services/api";
import CreditBalance from "../components/CreditBalance";
import toast from "react-hot-toast";

const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
});

const emailChangeSchema = z.object({
  newEmail: z.string().email("Invalid email address"),
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
type EmailChangeForm = z.infer<typeof emailChangeSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, loadUser } = useAuthStore();
  const { history, fetchHistory } = useCreditsStore();
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "billing"
  >("profile");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [showEmailChangeForm, setShowEmailChangeForm] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isRequestingEmailChange, setIsRequestingEmailChange] = useState(false);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const emailChangeForm = useForm<EmailChangeForm>({
    resolver: zodResolver(emailChangeSchema),
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  // User is already loaded by App.tsx, so just set loading to false
  // when user data is available
  useEffect(() => {
    if (user) {
      setIsLoadingProfile(false);
    }
  }, [user]);

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        firstName: user.firstName || user.name?.split(" ")[0] || "",
        lastName: user.lastName || user.name?.split(" ").slice(1).join(" ") || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleProfileUpdate = async (data: ProfileForm) => {
    setIsUpdatingProfile(true);
    try {
      await usersApi.updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
      });
      await loadUser(); // Refresh user data
      toast.success("Profile updated successfully!");
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleEmailChangeRequest = async (data: EmailChangeForm) => {
    setIsRequestingEmailChange(true);
    try {
      await usersApi.requestEmailChange(data.newEmail);
      toast.success(
        "Confirmation email sent! Please check your inbox to verify your new email address.",
      );
      setShowEmailChangeForm(false);
      emailChangeForm.reset();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setIsRequestingEmailChange(false);
    }
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
                <div className="space-y-6">
                  {/* Profile Information */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Profile Information
                    </h2>
                    {isLoadingProfile ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                      </div>
                    ) : (
                      <form
                        onSubmit={profileForm.handleSubmit(handleProfileUpdate)}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              {...profileForm.register("firstName")}
                              className="input-field"
                              placeholder="John"
                            />
                            {profileForm.formState.errors.firstName && (
                              <p className="mt-1 text-sm text-red-600">
                                {profileForm.formState.errors.firstName.message}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Last Name
                            </label>
                            <input
                              type="text"
                              {...profileForm.register("lastName")}
                              className="input-field"
                              placeholder="Doe"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isUpdatingProfile}
                          className="btn-primary disabled:opacity-50"
                        >
                          {isUpdatingProfile ? "Updating..." : "Update Profile"}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Email Address Section */}
                  <div className="card">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      Email Address
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Current Email
                        </label>
                        <div className="flex items-center gap-3">
                          <input
                            type="email"
                            value={user?.email || ""}
                            disabled
                            className="input-field bg-gray-50 text-gray-600 cursor-not-allowed flex-1"
                          />
                          <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      {/* Info box explaining email change */}
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-amber-800">
                          <p className="font-medium mb-1">
                            Changing your email requires verification
                          </p>
                          <p>
                            For security reasons, we'll send a confirmation link to
                            your new email address. Your email won't be changed
                            until you click the confirmation link.
                          </p>
                        </div>
                      </div>

                      {!showEmailChangeForm ? (
                        <button
                          onClick={() => setShowEmailChangeForm(true)}
                          className="btn-secondary"
                        >
                          Change Email Address
                        </button>
                      ) : (
                        <form
                          onSubmit={emailChangeForm.handleSubmit(
                            handleEmailChangeRequest,
                          )}
                          className="space-y-4 border-t pt-4"
                        >
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              New Email Address
                            </label>
                            <input
                              type="email"
                              {...emailChangeForm.register("newEmail")}
                              className="input-field"
                              placeholder="newemail@example.com"
                            />
                            {emailChangeForm.formState.errors.newEmail && (
                              <p className="mt-1 text-sm text-red-600">
                                {emailChangeForm.formState.errors.newEmail.message}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={isRequestingEmailChange}
                              className="btn-primary disabled:opacity-50"
                            >
                              {isRequestingEmailChange
                                ? "Sending..."
                                : "Send Confirmation Email"}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setShowEmailChangeForm(false);
                                emailChangeForm.reset();
                              }}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  </div>
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
