"use client";

import { useState } from "react";
import { contactForm } from "@/lib/content";
import { company } from "@/lib/config";
import { Container } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { MessageCircle, Phone, Send, CheckCircle2, AlertCircle } from "lucide-react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    // Egyptian phone validation check (01 followed by 9 digits)
    const phoneRegex = /^01[0125][0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setStatus("error");
      setErrorMessage("برجاء إدخال رقم موبايل مصري صحيح (مثال: 01000000000)");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || contactForm.errorMessage);
      }

      setStatus("success");
      setFormData({ name: "", phone: "", message: "" });
    } catch (err: unknown) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : contactForm.errorMessage);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-bg">
      <Container size="xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
            {contactForm.title}
          </h2>
          <p className="text-muted text-lg">
            {contactForm.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start max-w-5xl mx-auto">
          {/* Contact Form */}
          <Card padding="lg" className="bg-card border-border">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label={contactForm.fields.name.label}
                placeholder={contactForm.fields.name.placeholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />

              <Input
                label={contactForm.fields.phone.label}
                placeholder={contactForm.fields.phone.placeholder}
                type="tel"
                dir="ltr"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-white">
                  {contactForm.fields.message.label}
                </label>
                <textarea
                  rows={4}
                  placeholder={contactForm.fields.message.placeholder}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  className="bg-bg border border-border rounded-lg px-4 py-3 text-white placeholder:text-muted focus:border-accent focus:outline-none resize-none"
                />
              </div>

              {status === "success" && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{contactForm.successMessage}</span>
                </div>
              )}

              {status === "error" && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-red-500/10 text-red-400 text-sm">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage || contactForm.errorMessage}</span>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                disabled={status === "loading"}
                className="inline-flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{status === "loading" ? "جاري الإرسال..." : contactForm.submitButton}</span>
              </Button>
            </form>
          </Card>

          {/* Quick Contact & WhatsApp info */}
          <div className="space-y-6 lg:py-8">
            <h3 className="text-2xl font-bold mb-4">تواصل مباشر</h3>
            <p className="text-muted leading-relaxed mb-6">
              فريق خدمة العملاء جاهز للرد على استفساراتكم وتلقي طلبات الشراء والصيانة طوال أيام الأسبوع.
            </p>

            <div className="space-y-4">
              <Card padding="md" className="bg-card border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted">واتساب السريع</div>
                    <div className="font-bold text-white" dir="ltr">
                      {company.whatsappUrl.replace("https://wa.me/", "")}
                    </div>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <a href={company.whatsappUrl} target="_blank" rel="noopener noreferrer">
                    راسلنا
                  </a>
                </Button>
              </Card>

              <Card padding="md" className="bg-card border-border flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm text-muted">الخط الساخن</div>
                    <div className="font-bold text-white" dir="ltr">
                      01000000000
                    </div>
                  </div>
                </div>
                <Button variant="secondary" size="sm" asChild>
                  <a href="tel:01000000000">اتصل بنا</a>
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
