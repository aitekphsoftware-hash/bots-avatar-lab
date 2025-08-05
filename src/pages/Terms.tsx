import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import botsrherelogo from "@/assets/botsrhere-logo.png";

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <Link to="/auth">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign Up
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <img src={botsrherelogo} alt="BotsRHere" className="w-12 h-12" />
            </div>
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
            <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="prose prose-slate max-w-none dark:prose-invert">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
                <p>
                  Welcome to BotsRHere ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our AI avatar and video generation platform and services (the "Service") operated by BotsRHere.
                </p>
                <p>
                  By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, then you may not access the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
                <p>
                  BotsRHere provides AI-powered assistants for a more efficient workplace, empowering human connection with AI-driven automation. Our suite of cutting-edge products includes:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Custom AI Solutions tailored to your unique needs</li>
                  <li>Holographic avatars that bring ideas to life with interactive experiences</li>
                  <li>Educational avatars that transform learning into exciting adventures</li>
                  <li>Training avatars with multilingual teaching capabilities</li>
                  <li>Avatar chatbots that seamlessly access CRM and database information</li>
                  <li>Humanoid robots for daily task automation</li>
                  <li>Dynamic interactive avatars and virtual presenters</li>
                  <li>Advanced remote conferencing solutions</li>
                  <li>Video generation and translation services</li>
                </ul>
                <p>
                  Our solutions are designed to increase work efficiency, reduce costs, increase consumer engagement, and provide multimodal, cross-lingual, customizable, personalized, no-code experiences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. User Accounts and Registration</h2>
                <p>
                  To access certain features of the Service, you must register for an account. You agree to:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide accurate, current, and complete information during registration</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Maintain the security and confidentiality of your password</li>
                  <li>Accept all responsibility for all activities under your account</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. Acceptable Use Policy</h2>
                <p>You agree not to use the Service to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Generate content that is illegal, harmful, threatening, abusive, or defamatory</li>
                  <li>Create deepfakes or misleading content without proper disclosure</li>
                  <li>Violate any person's privacy, publicity, or other rights</li>
                  <li>Impersonate any person or entity without authorization</li>
                  <li>Generate content that promotes violence, hatred, or discrimination</li>
                  <li>Create sexually explicit or inappropriate content involving real individuals without consent</li>
                  <li>Reverse engineer or attempt to extract training data from our AI models</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Intellectual Property Rights</h2>
                <p>
                  The Service and its original content, features, and functionality are and will remain the exclusive property of BotsRHere and its licensors. Content you create using our Service belongs to you, subject to our license to provide the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. EU User Rights (GDPR Compliance)</h2>
                <p>
                  For users in the European Union, you have specific rights under the General Data Protection Regulation (GDPR):
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Right to Access:</strong> You can request information about your personal data we process</li>
                  <li><strong>Right to Rectification:</strong> You can request correction of inaccurate personal data</li>
                  <li><strong>Right to Erasure:</strong> You can request deletion of your personal data under certain circumstances</li>
                  <li><strong>Right to Data Portability:</strong> You can request transfer of your data to another service</li>
                  <li><strong>Right to Object:</strong> You can object to processing of your personal data for direct marketing</li>
                  <li><strong>Right to Restriction:</strong> You can request limitation of processing under certain conditions</li>
                </ul>
                <p>
                  To exercise these rights, please contact us at privacy@botsrhere.com. We will respond within 30 days as required by GDPR.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Payment and Billing</h2>
                <p>
                  Some features of the Service may require payment. You agree to pay all charges incurred by your account. All payments are non-refundable unless otherwise stated.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Privacy and Data Protection</h2>
                <p>
                  Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the Service, to understand our practices.
                </p>
                <p>
                  We implement appropriate technical and organizational measures to ensure data security in compliance with GDPR requirements for EU users.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by applicable law, in no event shall BotsRHere be liable for any indirect, punitive, incidental, special, consequential, or exemplary damages arising out of or in connection with your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Governing Law</h2>
                <p>
                  These Terms shall be interpreted and governed by the laws of the European Union and the country where BotsRHere is established, without regard to its conflict of law provisions.
                </p>
                <p>
                  For EU residents, any disputes shall be resolved in accordance with EU consumer protection laws and regulations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. We will provide notice of material changes by email or through the Service at least 30 days before they become effective.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email:</strong> legal@botsrhere.com</p>
                  <p><strong>EU Data Protection Officer:</strong> dpo@botsrhere.com</p>
                  <p><strong>Website:</strong> https://bots-r-here.com</p>
                  <p><strong>Contact:</strong> Use our contact form at https://bots-r-here.com/222-2/</p>
                  <p><strong>Demo Requests:</strong> https://bots-r-here.com/book-a-demo/</p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;