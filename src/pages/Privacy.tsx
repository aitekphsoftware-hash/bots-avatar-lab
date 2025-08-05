import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import botsrherelogo from "@/assets/botsrhere-logo.png";

const Privacy = () => {
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
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
            <p className="text-muted-foreground">Effective Date: {new Date().toLocaleDateString()}</p>
          </CardHeader>
          
          <CardContent className="prose prose-slate max-w-none dark:prose-invert">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
                <p>
                  BotsRHere ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered assistants platform for more efficient workplace solutions, including holographic avatars, educational avatars, training avatars, avatar chatbots, humanoid robots, and advanced remote conferencing technologies.
                </p>
                <p>
                  This policy is designed to comply with the EU General Data Protection Regulation (GDPR) and other applicable privacy laws.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">2. Legal Basis for Processing (GDPR)</h2>
                <p>
                  Under GDPR, we process your personal data based on the following legal grounds:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Consent:</strong> When you voluntarily provide information and agree to processing</li>
                  <li><strong>Contract Performance:</strong> To provide our services as agreed</li>
                  <li><strong>Legitimate Interest:</strong> To improve our services and prevent fraud</li>
                  <li><strong>Legal Obligation:</strong> To comply with applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">3. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold mb-2">3.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Account Information:</strong> Name, email address, password</li>
                  <li><strong>Profile Data:</strong> Avatar images, preferences, and settings</li>
                  <li><strong>Content:</strong> Videos, images, and text you create or upload</li>
                  <li><strong>Communication:</strong> Messages you send to our support team</li>
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4">3.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Usage Data:</strong> How you interact with our platform</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, IP address</li>
                  <li><strong>Cookies:</strong> See our Cookie Policy section below</li>
                  <li><strong>Log Data:</strong> Server logs, error reports, and performance metrics</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">4. How We Use Your Information</h2>
                <p>We use your information to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide, maintain, and improve our AI-powered workplace solutions</li>
                  <li>Process your requests and transactions</li>
                  <li>Generate holographic avatars, educational avatars, and training avatars</li>
                  <li>Provide avatar chatbot services and humanoid robot solutions</li>
                  <li>Enable multilingual teaching and cross-lingual communication</li>
                  <li>Facilitate advanced remote conferencing and virtual presentations</li>
                  <li>Communicate with you about our services</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                  <li>Improve our AI models and automation capabilities (with your consent)</li>
                  <li>Enhance customer experience through 24/7 support and personalized interactions</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">5. Data Sharing and Disclosure</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Service Providers:</strong> Third-party companies that help operate our platform</li>
                  <li><strong>AI Processing Partners:</strong> Platforms like D-ID for avatar and video generation</li>
                  <li><strong>Legal Requirements:</strong> When required by law or legal process</li>
                  <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                </ul>
                <p>
                  <strong>We do not sell your personal data to third parties.</strong>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">6. International Data Transfers</h2>
                <p>
                  Your data may be transferred to and processed in countries outside the European Economic Area (EEA). When we transfer your data internationally, we ensure adequate protection through:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Adequacy decisions by the European Commission</li>
                  <li>Standard Contractual Clauses (SCCs)</li>
                  <li>Certification schemes and codes of conduct</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">7. Your Rights Under GDPR</h2>
                <p>As an EU resident, you have the following rights:</p>
                
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <h4 className="font-semibold">Right to Access</h4>
                  <p>Request information about your personal data we process.</p>
                  
                  <h4 className="font-semibold">Right to Rectification</h4>
                  <p>Correct inaccurate or incomplete personal data.</p>
                  
                  <h4 className="font-semibold">Right to Erasure ("Right to be Forgotten")</h4>
                  <p>Request deletion of your personal data under certain circumstances.</p>
                  
                  <h4 className="font-semibold">Right to Data Portability</h4>
                  <p>Receive your data in a structured, machine-readable format.</p>
                  
                  <h4 className="font-semibold">Right to Object</h4>
                  <p>Object to processing based on legitimate interests or direct marketing.</p>
                  
                  <h4 className="font-semibold">Right to Restrict Processing</h4>
                  <p>Limit how we process your data under certain conditions.</p>
                  
                  <h4 className="font-semibold">Right to Withdraw Consent</h4>
                  <p>Withdraw consent for processing at any time.</p>
                </div>

                <p className="mt-4">
                  To exercise these rights, contact us at <strong>privacy@botsrhere.com</strong>. We will respond within 30 days.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">8. Data Retention</h2>
                <p>
                  We retain your personal data only as long as necessary for the purposes outlined in this policy or as required by law:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Account Data:</strong> Until you delete your account plus 30 days</li>
                  <li><strong>Generated Content:</strong> As long as you maintain your account</li>
                  <li><strong>Usage Analytics:</strong> Up to 26 months</li>
                  <li><strong>Legal Requirements:</strong> As required by applicable law</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">9. Cookies and Tracking Technologies</h2>
                <p>
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Essential Cookies:</strong> Required for basic platform functionality</li>
                  <li><strong>Performance Cookies:</strong> Help us understand how you use our platform</li>
                  <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                </ul>
                <p>
                  You can manage cookie preferences through your browser settings. Note that disabling cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">10. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your data:
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Encryption in transit and at rest</li>
                  <li>Regular security assessments and audits</li>
                  <li>Access controls and authentication</li>
                  <li>Employee training and confidentiality agreements</li>
                  <li>Incident response procedures</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">11. Children's Privacy</h2>
                <p>
                  Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">12. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by email or through our platform at least 30 days before the changes take effect.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">13. Supervisory Authority</h2>
                <p>
                  EU residents have the right to lodge a complaint with your local Data Protection Authority if you believe we have not complied with GDPR requirements.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3">14. Contact Information</h2>
                <p>
                  For any privacy-related questions or to exercise your rights, please contact us:
                </p>
                <div className="bg-muted p-4 rounded-lg">
                  <p><strong>Email:</strong> privacy@botsrhere.com</p>
                  <p><strong>Data Protection Officer:</strong> dpo@botsrhere.com</p>
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

export default Privacy;