import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service",
  description: "The terms and conditions governing your use of ShopSphere.",
};

const sections = [
  {
    heading: "1. Acceptance of terms",
    body: `By accessing or using ShopSphere ("we", "us", "our"), you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our site.`,
  },
  {
    heading: "2. Accounts",
    body: `You must provide accurate information when creating an account and are responsible for maintaining the confidentiality of your login credentials. You are responsible for all activity that occurs under your account. Notify us immediately of any unauthorized use.`,
  },
  {
    heading: "3. Orders and payment",
    body: `All orders are subject to acceptance and availability. Prices are listed in USD and may change without notice. Payment is processed securely through Stripe at the time of checkout. We reserve the right to refuse or cancel any order at our discretion, including in cases of suspected fraud or pricing errors.`,
  },
  {
    heading: "4. Shipping and delivery",
    body: `Estimated delivery times are provided for convenience and are not guaranteed. Risk of loss and title for items purchased pass to you upon delivery to the shipping carrier.`,
  },
  {
    heading: "5. Returns and refunds",
    body: `Eligible items may be returned in accordance with our return policy. Refunds will be issued to the original payment method once a returned item is received and inspected. Certain items may be marked as final sale.`,
  },
  {
    heading: "6. Product information",
    body: `We attempt to be as accurate as possible in describing products, including pricing, images, and availability. We do not warrant that product descriptions are error-free, and reserve the right to correct any errors.`,
  },
  {
    heading: "7. Reviews and user content",
    body: `By submitting a review or other content, you grant us a non-exclusive, royalty-free license to use, display, and reproduce that content in connection with our services. You agree not to post content that is false, defamatory, or infringes on the rights of others.`,
  },
  {
    heading: "8. Prohibited conduct",
    body: `You agree not to misuse the site, including attempting to gain unauthorized access to any part of it, interfering with its normal operation, or using it for any unlawful purpose.`,
  },
  {
    heading: "9. Limitation of liability",
    body: `To the fullest extent permitted by law, ShopSphere shall not be liable for any indirect, incidental, special, or consequential damages arising out of or related to your use of the site or products purchased through it.`,
  },
  {
    heading: "10. Changes to these terms",
    body: `We may update these Terms of Service from time to time. Continued use of the site after changes are posted constitutes acceptance of the revised terms.`,
  },
  {
    heading: "11. Contact",
    body: `Questions about these terms can be directed to support@shopsphere.com.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 animate-fade-in-up">
        <h1 className="text-2xl font-medium text-gray-900 mb-1">
          Terms of Service
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
