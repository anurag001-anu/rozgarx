import React from 'react';
import { Shield, Eye, Lock, FileText, AlertCircle } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-gray-100 bg-gray-50/50">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Shield size={16} />
            Data Protection
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            RozgarX respects your privacy and is committed to handling your personal information responsibly. This Privacy Policy explains what information we may collect, how we use it, how it is protected, and the choices available to you when you use the RozgarX platform.
          </p>
          <div className="flex flex-col items-center justify-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider">
            <span>Effective Date: August 17, 2026</span>
            <span>Last Updated: August 17, 2026</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24 px-4">
        <div className="container-custom max-w-4xl mx-auto prose prose-lg prose-gray max-w-none">
          
          <h2 className="text-2xl font-bold text-black mt-10 mb-4 flex items-center gap-2">
            1. Information We Collect
          </h2>
          
          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">A. Account Information</h3>
          <p>Depending on the features you use, this may include:</p>
          <ul>
            <li>Name</li>
            <li>Email address</li>
            <li>Account credentials/authentication information</li>
            <li>User role, such as jobseeker or employer</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">B. Professional Information</h3>
          <p>Where voluntarily provided through profile/resume features, this may include:</p>
          <ul>
            <li>Resume/CV information</li>
            <li>Education</li>
            <li>Skills</li>
            <li>Work experience</li>
            <li>Professional profile information</li>
            <li>Portfolio or professional links</li>
          </ul>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">C. Job Activity</h3>
          <p>To provide features such as Saved Jobs, Job Alerts, search and recommendations, RozgarX may process information such as:</p>
          <ul>
            <li>Jobs saved by the user</li>
            <li>Job alert preferences</li>
            <li>Search/activity information</li>
            <li>External application click events</li>
            <li>Interaction with jobs and related platform features</li>
          </ul>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
            <p className="m-0 text-amber-900 text-sm font-medium">
              <strong>IMPORTANT:</strong> An external application click does NOT mean that an application was successfully submitted. RozgarX should never describe this data as proof of application submission, hiring, selection, or employment.
            </p>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mt-6 mb-3">D. Technical Information</h3>
          <p>The platform may process technical information necessary to operate, secure, and improve the service, such as:</p>
          <ul>
            <li>IP address</li>
            <li>Browser/device information</li>
            <li>Request and security logs</li>
            <li>Basic usage information</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            2. How We Use Information
          </h2>
          <p>RozgarX may use information to:</p>
          <ul>
            <li>Create and maintain user accounts.</li>
            <li>Provide job search and job discovery services.</li>
            <li>Provide Saved Jobs functionality.</li>
            <li>Deliver Job Alerts and service-related notifications requested by users.</li>
            <li>Provide personalized job recommendations based on available job activity and preferences.</li>
            <li>Track external application clicks for platform functionality, analytics, and recommendation purposes.</li>
            <li>Maintain platform security and prevent abuse.</li>
            <li>Diagnose technical problems and improve platform performance.</li>
            <li>Improve search, discovery, and user experience.</li>
            <li>Comply with applicable legal obligations.</li>
          </ul>
          <p className="font-medium text-gray-800 mt-4">
            RozgarX uses available job preferences and activity signals to improve job discovery and recommend potentially relevant job opportunities.
          </p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            3. External Job Websites and Applications
          </h2>
          <p><strong>RozgarX does not process or submit employment applications on behalf of users.</strong></p>
          <p>When you select an "Apply" or similar button, you may be redirected to an external employer, company, recruitment, or government website.</p>
          <p>The external website controls the application process and may collect information directly from you under its own privacy policy and terms.</p>
          <p>RozgarX does not control the privacy practices, security, availability, eligibility decisions, application processing, or hiring decisions of external websites.</p>
          <p>An external application click recorded by RozgarX does not confirm that an application was successfully submitted.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            4. Job Listings and Accuracy
          </h2>
          <p>RozgarX aggregates/displays job opportunities and related information for job discovery.</p>
          <p>Where applicable, information may originate from employers, organizations, government sources, or external websites.</p>
          <p>RozgarX does not guarantee that every listing is:</p>
          <ul>
            <li>accurate,</li>
            <li>complete,</li>
            <li>current,</li>
            <li>available,</li>
            <li>error-free,</li>
            <li>suitable for a particular candidate,</li>
            <li>open until the displayed deadline,</li>
            <li>or associated with a particular hiring outcome.</li>
          </ul>
          <p>Users should verify important details, eligibility requirements, deadlines, and application instructions on the relevant official source before applying.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            5. Government and Private Jobs
          </h2>
          <p>RozgarX provides separate Government and Private job discovery experiences.</p>
          <p>The platform does not represent itself as the hiring organization for Government jobs unless explicitly stated otherwise.</p>
          <p>For Government job applications, users should rely on the relevant official government/recruiting authority website.</p>
          <p>For Private job applications, users should verify the employer and application details through the relevant official source.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            6. Data Sharing
          </h2>
          <p>RozgarX does not sell users' personal information.</p>
          <p>Personal information should only be shared with third parties where necessary to provide a requested service, operate the platform, maintain security, comply with legal obligations, or otherwise as described in this Privacy Policy.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            7. Service Providers
          </h2>
          <p>Where applicable, RozgarX may use third-party service providers for infrastructure, hosting, email delivery, database services, security, analytics, or other technical operations.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            8. Data Security
          </h2>
          <p>RozgarX uses technical and organizational measures intended to protect personal information against unauthorized access, misuse, alteration, disclosure, or destruction.</p>
          <p>However, no internet-based service can guarantee absolute security.</p>
          <p>Users should also protect their account credentials and avoid sharing passwords or authentication information.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            9. Data Retention
          </h2>
          <p>RozgarX retains personal information only for as long as reasonably necessary for the purposes described in this Privacy Policy, to provide requested services, maintain security, resolve disputes, enforce terms, or comply with applicable legal obligations.</p>
          <p>Where information is no longer required and there is no legal or legitimate reason to retain it, it should be deleted or anonymized according to the platform's applicable retention practices.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            10. Your Choices and Rights
          </h2>
          <p>Depending on applicable law, users may have rights regarding their personal information, including the ability to:</p>
          <ul>
            <li>request access to personal information,</li>
            <li>request correction of inaccurate information,</li>
            <li>request deletion where applicable,</li>
            <li>withdraw consent where processing is based on consent,</li>
            <li>manage or unsubscribe from optional communications,</li>
            <li>raise privacy-related concerns.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            11. Job Alerts and Emails
          </h2>
          <p>Users may receive Job Alerts and service-related emails when they enable or request these features.</p>
          <p>Users can manage or unsubscribe from applicable email alerts using the available controls or unsubscribe mechanism.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            12. Children's Privacy
          </h2>
          <p>RozgarX is intended for people who are legally able to use employment/job-search services.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            13. Changes to This Privacy Policy
          </h2>
          <p>RozgarX may update this Privacy Policy from time to time to reflect changes to the platform, technology, services, or applicable legal requirements.</p>
          <p>The updated version will be published on this page with an updated effective date where appropriate.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            14. Contact
          </h2>
          <p>For privacy-related questions or requests:</p>
          <p><strong>Email:</strong> <a href="mailto:legal@rozgarx.com" className="text-brand hover:underline">legal@rozgarx.com</a></p>

        </div>
      </section>
    </div>
  );
}
