import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy",
  description:
    "How ShopSphere collects, uses, and protects your personal information.",
};

const sections = [
  {
    heading: "1. Information we collect",
    body: `When you create an account, place an order, or contact us, we may collect information such as your name, email address, shipping address, and order history. We also automatically collect certain technical information, such as your IP address and browser type, to help operate and secure the site.`,
  },
  {
    heading: "2. How we use your information",
    body: `We use your information to process orders, communicate with you about your account or purchases, improve our products and services, and comply with legal obligations. We do not sell your personal information to third parties.`,
  },
  {
    heading: "3. Payment information",
    body: `Payments are processed by Stripe. We do not store your full card number or other sensitive payment details on our servers — these are handled directly by Stripe in accordance with their own privacy and security practices.`,
  },
  {
    heading: "4. Cookies and similar technologies",
    body: `We use cookies and similar technologies to keep you signed in, remember your preferences (such as theme), and understand how our site is used. You can control cookies through your browser settings, though disabling them may affect site functionality.`,
  },
  {
    heading: "5. Data sharing",
    body: `We may share information with service providers who help us operate our business, such as payment processors and hosting providers, solely for the purpose of providing our services. We may also disclose information if required by law.`,
  },
  {
    heading: "6. Data retention",
    body: `We retain your information for as long as your account is active or as needed to provide you services, comply with legal obligations, resolve disputes, and enforce our agreements.`,
  },
  {
    heading: "7. Your rights",
    body: `You may access, update, or request deletion of your personal information at any time by contacting us or, where available, through your account settings. Depending on your location, you may have additional rights under applicable data protection laws.`,
  },
  {
    heading: "8. Children\u2019s privacy",
    body: `Our services are not directed to children under 13, and we do not knowingly collect personal information from children under 13.`,
  },
  {
    heading: "9. Changes to this policy",
    body: `We may update this Privacy Policy from time to time. We will post the updated version on this page with a revised "last updated" date.`,
  },
  {
    heading: "10. Contact us",
    body: `If you have questions about this Privacy Policy or how we handle your information, contact us at support@shopsphere.com.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in-up">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Privacy Policy
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Last updated: January 2026
        </p>

        <div className="flex flex-col gap-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="text-base font-medium text-gray-900 mb-2">
                {s.heading}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">{s.body}</p>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
