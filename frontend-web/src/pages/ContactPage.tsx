import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactForm = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true);
    try {
      // Send email via mailto or backend API
      // For now, we'll open a mailto link with the form data
      const mailtoLink = `mailto:contact@cleack.io?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
      )}`;

      window.location.href = mailtoLink;

      // Show success state
      setIsSubmitted(true);
      reset();
      toast.success("Opening your email client...");
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card text-center py-12"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t("contact.thankYou", "Thank you!")}
            </h2>
            <p className="text-gray-600 mb-6">
              {t("contact.emailOpened", "Your email client should open with your message. If it didn't, please send an email directly to contact@cleack.io")}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="btn-primary"
            >
              {t("contact.sendAnother", "Send Another Message")}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {t("contact.title", "Contact Us")}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t("contact.subtitle", "Have a question or need help? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("contact.emailUs", "Email Us")}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {t("contact.emailDescription", "For general inquiries and support")}
                    </p>
                    <a
                      href="mailto:contact@cleack.io"
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      contact@cleack.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {t("contact.support", "Support")}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {t("contact.supportDescription", "Technical support and help")}
                    </p>
                    <a
                      href="mailto:support@cleack.io"
                      className="text-green-600 hover:text-green-700 font-medium"
                    >
                      support@cleack.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {t("contact.responseTime", "Response Time")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("contact.responseTimeDescription", "We typically respond within 24 hours during business days. For urgent matters, please include 'URGENT' in your subject line.")}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="card">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {t("contact.sendMessage", "Send us a message")}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.name", "Your Name")} *
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="input-field"
                        placeholder={t("contact.namePlaceholder", "John Doe")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t("contact.email", "Email Address")} *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="input-field"
                        placeholder={t("contact.emailPlaceholder", "john@example.com")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.subject", "Subject")} *
                    </label>
                    <input
                      type="text"
                      {...register("subject")}
                      className="input-field"
                      placeholder={t("contact.subjectPlaceholder", "How can we help you?")}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("contact.message", "Message")} *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      className="input-field resize-none"
                      placeholder={t("contact.messagePlaceholder", "Tell us more about your question or issue...")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        {t("contact.sending", "Sending...")}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t("contact.send", "Send Message")}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
