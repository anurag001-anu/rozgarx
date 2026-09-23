import React from 'react';
import { FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-28 overflow-hidden border-b border-gray-100 bg-gray-50/50">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-brand/5 blur-3xl rounded-full pointer-events-none"></div>
        
        <div className="container-custom max-w-4xl mx-auto text-center relative z-10 px-4">
          <div className="inline-flex items-center gap-2 bg-brand/10 text-brand px-4 py-2 rounded-full text-sm font-bold mb-6">
            <FileText size={16} />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black tracking-tight mb-6 leading-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
            These Terms of Service govern your access to and use of RozgarX. By accessing or using the platform, you agree to comply with these Terms. If you do not agree with these Terms, please do not use the service.
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
          
          <h2 className="text-2xl font-bold text-black mt-10 mb-4">
            1. Nature of RozgarX
          </h2>
          <p>RozgarX is a job discovery and information platform that provides access to Government and Private employment opportunities and related career information.</p>
          <p>RozgarX is not an employer, recruitment agency, staffing agency, or internal applicant-tracking system for the jobs displayed on the platform unless explicitly stated otherwise.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            2. External Application Process
          </h2>
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 my-6 rounded-r-lg">
            <p className="m-0 text-amber-900 font-medium">
              <strong>RozgarX does NOT accept or process employment applications internally.</strong>
            </p>
          </div>
          <p>When a user selects an application link, the user may be redirected to an external official employer, company, recruitment, or government website.</p>
          <p>The external website is responsible for:</p>
          <ul>
            <li>accepting the application,</li>
            <li>collecting application information,</li>
            <li>determining eligibility,</li>
            <li>processing the application,</li>
            <li>contacting the applicant,</li>
            <li>conducting recruitment,</li>
            <li>making interview decisions,</li>
            <li>and making hiring/selection decisions.</li>
          </ul>
          <p>RozgarX does not guarantee any application outcome.</p>
          <p>An "Apply" click recorded by RozgarX does not mean an application was successfully submitted.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            3. Government Jobs
          </h2>
          <p>Government job information is provided for discovery and convenience.</p>
          <p>Users should always verify:</p>
          <ul>
            <li>official notification,</li>
            <li>eligibility,</li>
            <li>age requirements,</li>
            <li>qualification,</li>
            <li>application fee,</li>
            <li>deadline,</li>
            <li>vacancies,</li>
            <li>and application instructions</li>
          </ul>
          <p>through the relevant official government/recruiting authority source before applying.</p>
          <p>RozgarX does not claim to be the government authority responsible for recruitment unless explicitly stated.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            4. Private Jobs
          </h2>
          <p>Private job listings may be provided by employers or other authorized sources.</p>
          <p>Users should independently verify employer information, job details, compensation, eligibility, and application instructions before applying.</p>
          <p>RozgarX does not guarantee employment, interview selection, salary, or hiring outcomes.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            5. Job Information Accuracy
          </h2>
          <p>RozgarX attempts to provide useful and current job information but does not guarantee that every listing is accurate, complete, current, available, or error-free.</p>
          <p>Job availability and deadlines may change.</p>
          <p>Users should rely on the relevant official source before taking important action.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            6. User Accounts
          </h2>
          <p>Users must provide accurate information when creating an account and must keep account credentials confidential.</p>
          <p>Users are responsible for activity performed through their account, subject to applicable law.</p>
          <p>Users must not attempt to access another person's account or private information.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            7. Prohibited Activities
          </h2>
          <p>Users must not:</p>
          <ul>
            <li>Use RozgarX for unlawful purposes.</li>
            <li>Attempt to bypass authentication or security controls.</li>
            <li>Access another user's private information.</li>
            <li>Submit malicious code, malware, or harmful content.</li>
            <li>Abuse APIs or automated systems.</li>
            <li>Scrape or overload the platform in a way that harms service availability.</li>
            <li>Attempt to manipulate job listings, rankings, alerts, or recommendations.</li>
            <li>Impersonate another person, employer, organization, or government authority.</li>
            <li>Upload content that infringes intellectual property or other legal rights.</li>
            <li>Use the platform to distribute fraudulent or deceptive employment opportunities.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            8. Employer Responsibilities
          </h2>
          <p>Employers using RozgarX must provide accurate job and organization information and must not publish fraudulent, misleading, discriminatory, unlawful, or malicious job opportunities.</p>
          <p>Employers are responsible for the accuracy and legality of content they submit.</p>
          <p>RozgarX may remove or restrict listings that violate platform rules or applicable law.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            9. Candidate Privacy
          </h2>
          <p>RozgarX does not provide employers with an internal ATS view of candidate private behavioral data.</p>
          <p>Candidate job activity used for Saved Jobs, Alerts, recommendations, or platform analytics must not be described as a candidate's successful application or hiring status.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            10. Intellectual Property
          </h2>
          <p>The RozgarX website, branding, interface, software, original content, and platform components are protected by applicable intellectual-property laws.</p>
          <p>Users may not copy, reproduce, modify, distribute, reverse engineer, or commercially exploit protected RozgarX content or software without authorization, except where permitted by law.</p>
          <p>Third-party trademarks, company names, logos, and job information remain the property of their respective owners.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            11. Third-Party Websites
          </h2>
          <p>RozgarX may link to third-party websites.</p>
          <p>RozgarX does not control third-party websites and is not responsible for their:</p>
          <ul>
            <li>content,</li>
            <li>availability,</li>
            <li>privacy practices,</li>
            <li>security,</li>
            <li>terms,</li>
            <li>application processing,</li>
            <li>or hiring decisions.</li>
          </ul>
          <p>Users should review the relevant third party's policies before submitting personal information.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            12. Account Suspension or Termination
          </h2>
          <p>RozgarX may suspend, restrict, or terminate access where reasonably necessary due to:</p>
          <ul>
            <li>violation of these Terms,</li>
            <li>unlawful activity,</li>
            <li>fraud,</li>
            <li>abuse,</li>
            <li>security threats,</li>
            <li>misuse of the platform,</li>
            <li>or other serious operational risks.</li>
          </ul>
          <p>Where appropriate and legally required, users may be notified of the relevant action.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            13. Disclaimer
          </h2>
          <p>RozgarX provides the platform and job-discovery services on an "as available" basis.</p>
          <p>To the extent permitted by applicable law, RozgarX does not guarantee:</p>
          <ul>
            <li>employment,</li>
            <li>interview selection,</li>
            <li>hiring,</li>
            <li>salary,</li>
            <li>application success,</li>
            <li>job availability,</li>
            <li>uninterrupted service,</li>
            <li>or the accuracy of every third-party job listing.</li>
          </ul>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            14. Limitation of Liability
          </h2>
          <p>To the maximum extent permitted by applicable law, RozgarX shall not be responsible for losses arising solely from:</p>
          <ul>
            <li>third-party websites,</li>
            <li>third-party job information,</li>
            <li>employer decisions,</li>
            <li>government recruitment decisions,</li>
            <li>external application processing,</li>
            <li>or events outside RozgarX's reasonable control.</li>
          </ul>
          <p>Nothing in these Terms is intended to exclude rights or liabilities that cannot legally be excluded.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            15. Changes to Terms
          </h2>
          <p>RozgarX may update these Terms from time to time.</p>
          <p>The updated Terms will be published on this page with an updated effective date where appropriate.</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            16. Governing Law
          </h2>
          <p>[Jurisdiction to be determined by legal counsel]</p>

          <h2 className="text-2xl font-bold text-black mt-12 mb-4">
            17. Contact
          </h2>
          <p>For questions regarding these Terms:</p>
          <p><strong>Email:</strong> <a href="mailto:legal@rozgarx.com" className="text-brand hover:underline">legal@rozgarx.com</a></p>

        </div>
      </section>
    </div>
  );
}
