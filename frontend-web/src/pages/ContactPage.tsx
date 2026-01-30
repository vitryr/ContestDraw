import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MessageSquare, Send, CheckCircle, Sparkles } from "lucide-react";
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
      const mailtoLink = `mailto:contact@cleack.io?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(
        `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
      )}`;

      window.location.href = mailtoLink;
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
      <div className="min-h-screen bg-bg-primary py-12">
        <div className="container-custom max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-card border border-white/[0.06] rounded-2xl text-center py-12 px-8"
          >
            <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              {t("contact.thankYou", "Thank you!")}
            </h2>
            <p className="text-ink-secondary mb-6">
              {t("contact.emailOpened", "Your email client should open with your message. If it didn't, please send an email directly to contact@cleack.io")}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-3 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-medium rounded-xl hover:brightness-110 transition-all"
            >
              {t("contact.sendAnother", "Send Another Message")}
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary py-12">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 50, 0, -50, 0],
            y: [0, -30, 50, 30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent-secondary/10 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0, 50, 0],
            y: [0, 30, -50, -30, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-accent-primary/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container-custom max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-accent-secondary/10 border border-accent-secondary/30 text-accent-secondary mb-6">
              <Sparkles className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              {t("contact.title", "Contact Us")}
            </h1>
            <p className="text-xl text-ink-secondary max-w-2xl mx-auto">
              {t("contact.subtitle", "Have a question or need help? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-secondary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-accent-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {t("contact.emailUs", "Email Us")}
                    </h3>
                    <p className="text-ink-muted text-sm mb-2">
                      {t("contact.emailDescription", "For general inquiries and support")}
                    </p>
                    <a
                      href="mailto:contact@cleack.io"
                      className="text-accent-secondary hover:text-accent-tertiary font-medium"
                    >
                      contact@cleack.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">
                      {t("contact.support", "Support")}
                    </h3>
                    <p className="text-ink-muted text-sm mb-2">
                      {t("contact.supportDescription", "Technical support and help")}
                    </p>
                    <a
                      href="mailto:support@cleack.io"
                      className="text-success hover:brightness-110 font-medium"
                    >
                      support@cleack.io
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-accent-secondary/20 to-accent-primary/20 border border-accent-secondary/30 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-2">
                  {t("contact.responseTime", "Response Time")}
                </h3>
                <p className="text-ink-secondary text-sm">
                  {t("contact.responseTimeDescription", "We typically respond within 24 hours during business days. For urgent matters, please include 'URGENT' in your subject line.")}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-bg-card border border-white/[0.06] rounded-xl p-6">
                <h2 className="text-xl font-semibold text-white mb-6">
                  {t("contact.sendMessage", "Send us a message")}
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-secondary mb-2">
                        {t("contact.name", "Your Name")} *
                      </label>
                      <input
                        type="text"
                        {...register("name")}
                        className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-xl text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none transition-all"
                        placeholder={t("contact.namePlaceholder", "John Doe")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-error">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-ink-secondary mb-2">
                        {t("contact.email", "Email Address")} *
                      </label>
                      <input
                        type="email"
                        {...register("email")}
                        className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-xl text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none transition-all"
                        placeholder={t("contact.emailPlaceholder", "john@example.com")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-error">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-secondary mb-2">
                      {t("contact.subject", "Subject")} *
                    </label>
                    <input
                      type="text"
                      {...register("subject")}
                      className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-xl text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none transition-all"
                      placeholder={t("contact.subjectPlaceholder", "How can we help you?")}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-error">
                        {errors.subject.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-secondary mb-2">
                      {t("contact.message", "Message")} *
                    </label>
                    <textarea
                      {...register("message")}
                      rows={6}
                      className="w-full px-4 py-3 bg-bg-elevated border border-white/10 rounded-xl text-white placeholder-ink-muted focus:ring-2 focus:ring-accent-secondary focus:border-transparent outline-none transition-all resize-none"
                      placeholder={t("contact.messagePlaceholder", "Tell us more about your question or issue...")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-error">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-accent-secondary to-accent-primary text-white font-semibold rounded-xl hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
