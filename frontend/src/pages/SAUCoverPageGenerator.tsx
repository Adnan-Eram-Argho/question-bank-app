import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Breadcrumb from '../components/Breadcrumb';
import RelatedPages from '../components/RelatedPages';
import ScrollReveal from '../components/ScrollReveal';
import { ArrowRightIcon } from '../components/icons';

// Types
interface FormData {
  title: string;
  courseCode: string;
  courseTitle: string;
  teacherName: string;
  teacherDesignation: string;
  teacherDepartment: string;
  name: string;
  regNo: string;
  level: string;
  semester: string;
  section: string;
  group: string;
  faculty: string;
}

const INITIAL_FORM: FormData = {
  title: '',
  courseCode: '',
  courseTitle: '',
  teacherName: '',
  teacherDesignation: '',
  teacherDepartment: '',
  name: '',
  regNo: '',
  level: '',
  semester: '',
  section: '',
  group: '',
  faculty: '',
};

const FACULTIES = [
  'Faculty of Agribusiness Management',
  'Faculty of Agriculture',
  'Faculty of Animal Science & Veterinary Medicine',
  'Faculty of Fisheries and Marine Science'
];

const FONT = 'Times New Roman';

const PAGE_URL = 'https://sau-eco-qstns.vercel.app/sau-assignment-cover-page';

const FAQS = [
  {
    q: 'SAU assignment cover page কীভাবে বানাব?',
    a: 'ফর্মে নিজের তথ্য লেখো, পাশে লাইভ প্রিভিউ দেখবে। তারপর DOCX ডাউনলোড করো অথবা PDF-এর জন্য Print করো।',
  },
  {
    q: 'ডাউনলোড কি ফ্রি?',
    a: 'হ্যাঁ, সম্পূর্ণ ফ্রি এবং লগইন লাগে না।',
  },
  {
    q: 'আমার তথ্য কি কোথাও জমা হয়?',
    a: 'না। সবকিছু তোমার ব্রাউজারেই হয়, কোনো সার্ভারে যায় না।',
  },
  {
    q: 'Word-এ এডিট করা যাবে?',
    a: 'হ্যাঁ, DOCX ফাইল Microsoft Word বা Google Docs-এ খুলে যেকোনো কিছু বদলানো যায়।',
  },
  {
    q: 'Cover page কি A4 সাইজে Times New Roman ফন্টে হবে?',
    a: 'হ্যাঁ। DOCX ফাইলটি A4 (210×297mm) পেজ সাইজে তৈরি হয় এবং পুরো কভার পেজে Times New Roman ফন্ট ব্যবহার করা হয়, যা SAU-র প্রচলিত ফরম্যাট।',
  },
];

const JSON_LD_WEB_APP = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SAU Assignment Cover Page Generator',
  url: PAGE_URL,
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'BDT' },
};

const JSON_LD_FAQ = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((x) => ({
    '@type': 'Question',
    name: x.q,
    acceptedAnswer: { '@type': 'Answer', text: x.a },
  })),
};

const inputCls =
  'w-full border border-border-subtle rounded-md p-2.5 text-sm bg-surface-card text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-colors';

const halfInputCls =
  'border border-border-subtle rounded-md p-2.5 text-sm bg-surface-card text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 transition-colors';

export default function SAUCoverPageGenerator() {
  const [f, setF] = useState<FormData>(INITIAL_FORM);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const before = () => {
      const src = document.getElementById('cover-preview');
      if (!src || document.getElementById('print-cover')) return;
      const clone = src.cloneNode(true) as HTMLElement;
      clone.id = 'print-cover';
      document.body.appendChild(clone);
    };
    const after = () => document.getElementById('print-cover')?.remove();
    window.addEventListener('beforeprint', before);
    window.addEventListener('afterprint', after);
    return () => {
      window.removeEventListener('beforeprint', before);
      window.removeEventListener('afterprint', after);
    };
  }, []);

  const set =
    (k: keyof FormData) =>
      (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
        setF((prev) => ({ ...prev, [k]: e.target.value }));

  const title = f.title.trim();
  const courseTitle = f.courseTitle.trim();
  const semester = f.semester === '1' ? 'I' : f.semester === '2' ? 'II' : f.semester;
  const levelSem = [f.level ? `Level: ${f.level}` : '', semester ? `Semester: ${semester}` : ''].filter(Boolean).join('  ');
  const secGroup = [f.section ? `Section: ${f.section}` : '', f.group ? `Group: ${f.group}` : ''].filter(Boolean).join('  ');
  const u = (n: number) => `calc(${n} * var(--u))`;

  const downloadDocx = async () => {
    setIsDownloading(true);
    try {
      const [
        {
          Document,
          Packer,
          Paragraph,
          TextRun,
          ImageRun,
          AlignmentType,
          LineRuleType,
          Table,
          TableRow,
          TableCell,
          WidthType,
          BorderStyle,
        },
        { saveAs },
      ] = await Promise.all([import('docx'), import('file-saver')]);

      const res = await fetch('/sau-logo.png');
      const logo = await res.arrayBuffer();

      const center = (text: string, size: number, opts: { bold?: boolean; after?: number } = {}) =>
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: opts.after ?? 200, line: 276, lineRule: LineRuleType.AUTO },
          children: [new TextRun({ text, font: FONT, size, bold: opts.bold })],
        });

      const left = (text: string, opts: { size?: number; italics?: boolean } = {}) =>
        new Paragraph({
          spacing: { after: 200, line: 276, lineRule: LineRuleType.AUTO },
          children: [new TextRun({ text, font: FONT, size: opts.size ?? 28, italics: opts.italics })],
        });

      const side = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
      const borders = { top: side, bottom: side, left: side, right: side };

      const cell = (children: ReturnType<typeof left>[], width: number) =>
        new TableCell({
          width: { size: width, type: WidthType.DXA },
          borders,
          margins: { top: 100, bottom: 250, left: 300, right: 140 },
          children,
        });

      const infoTable = new Table({
        indent: { size: -455, type: WidthType.DXA },
        width: { size: 9936, type: WidthType.DXA },
        columnWidths: [5140, 4796],
        rows: [
          new TableRow({
            children: [
              cell(
                [
                  left('Submitted to:', { size: 32 }),
                  left(f.teacherName),
                  left(f.teacherDesignation, { italics: true }),
                  left(f.teacherDepartment),
                  left('Sher-e-Bangla Agricultural University, Dhaka-1207'),
                ],
                5140
              ),
              cell(
                [
                  left('Submitted by:', { size: 32 }),
                  left(`Name: ${f.name}`),
                  left(`Registration No: ${f.regNo}`),
                  ...(levelSem ? [left(levelSem)] : []),
                  ...(secGroup ? [left(secGroup)] : []),
                  left(f.faculty),
                ],
                4796
              ),
            ],
          }),
        ],
      });

      const doc = new Document({
        sections: [
          {
            properties: { page: { size: { width: 11906, height: 16838 } } },
            children: [
              center('Sher-e-Bangla Agricultural University', 44, { bold: true }),
              center('Sher-e-Bangla Nagar, Dhaka-1207', 32),
              new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 450, line: 276, lineRule: LineRuleType.AUTO },
                children: [
                  new ImageRun({
                    type: 'png',
                    data: logo,
                    transformation: { width: 200, height: 216 },
                  }),
                ],
              }),
              center(title, 32, { bold: true }),
              center(`Course Code: ${f.courseCode}`, 32, { after: courseTitle ? 200 : 1176 }),
              ...(courseTitle ? [center(`Course Title: ${courseTitle}`, 32, { after: 1176 })] : []),
              infoTable,
            ],
          },
        ],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${f.courseCode || 'cover-page'}.docx`);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <SEO
        title="SAU Assignment Cover Page Generator (Free DOCX/PDF) | SAU Study Platform"
        description="SAU assignment cover page বানান ফ্রিতে। Sher-e-Bangla Agricultural University-র assignment, note book ও lab report cover page generator — DOCX ও PDF ডাউনলোড, লাইভ A4 প্রিভিউ।"
        keywords="SAU assignment cover page, SAU cover page, SAU note book cover page, SAU lab report cover page, Sher-e-Bangla Agricultural University cover page, assignment cover page generator, free cover page maker, সাউ অ্যাসাইনমেন্ট কভার পেজ, কভার পেজ বানানো, ফ্রি কভার পেজ"
        canonicalPath="/sau-assignment-cover-page"
      />

      <Helmet>
        <script type="application/ld+json">{JSON.stringify(JSON_LD_WEB_APP)}</script>
        <script type="application/ld+json">{JSON.stringify(JSON_LD_FAQ)}</script>
      </Helmet>

      <style>{`
        #cover-preview { container-type: inline-size; --u: 1cqw; }
        #cover-preview p, #print-cover p { margin: 0 0 calc(1.68 * var(--u)); line-height: 1.32; }
        #print-cover { display: none; --u: 2.1mm; }
        @media print {
          @page { size: A4; margin: 0; }
          html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
          body > *:not(#print-cover) { display: none !important; }
          #print-cover {
            display: block !important;
            position: static !important;
            width: 210mm !important;
            height: 296mm !important;
            max-width: none !important;
            aspect-ratio: auto !important;
            margin: 0 !important;
            box-shadow: none !important;
            overflow: hidden !important;
            background: #fff !important;
            color: #000 !important;
          }
          #print-cover [data-ph] { visibility: hidden !important; }
        }
      `}</style>

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Tools' },
          { label: 'Cover Page Generator' },
        ]}
      />

      <ScrollReveal direction="up">
        <div className="max-w-4xl mx-auto px-4 pt-2 pb-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl lg:text-4xl font-semibold text-text-primary dark:text-white mb-3"
          >
            SAU Assignment Cover Page Generator
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-base text-text-muted dark:text-text-muted max-w-2xl mx-auto"
          >
            তথ্য লেখো, লাইভ A4 প্রিভিউ দেখো — তারপর DOCX বা PDF ডাউনলোড করো।
          </motion.p>
        </div>
      </ScrollReveal>

      <ScrollReveal direction="up" delay={0.1}>
        <div className="max-w-6xl mx-auto px-4 pb-8">
          <div className="grid lg:grid-cols-2 gap-8 items-start">

            {/* Form panel */}
            <div className="space-y-3 rounded-lg border border-border-subtle bg-surface-card p-4 sm:p-6">
              <div>
                <label className="block text-xs font-semibold text-text-muted dark:text-text-muted uppercase tracking-wider mb-1">Title</label>
                <input id="title" className={inputCls} placeholder="যেমন A Note Book on Farm Mechanization" value={f.title} onChange={set('title')} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted dark:text-text-muted uppercase tracking-wider mb-1">Course Code</label>
                <input id="courseCode" className={inputCls} placeholder="যেমন AGEN 226" value={f.courseCode} onChange={set('courseCode')} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted dark:text-text-muted uppercase tracking-wider mb-1">Course Title (ঐচ্ছিক)</label>
                <input id="courseTitle" className={inputCls} placeholder="যেমন Farm Power and Machinery" value={f.courseTitle} onChange={set('courseTitle')} />
              </div>

              <p className="text-sm font-semibold text-gray-700 dark:text-text-muted pt-2 border-t border-gray-100 dark:border-border-subtle">
                শিক্ষকের তথ্য (Submitted to)
              </p>
              <input id="teacherName" className={inputCls} placeholder="শিক্ষকের নাম" value={f.teacherName} onChange={set('teacherName')} />
              <input id="teacherDesignation" className={inputCls} placeholder="পদবি (যেমন Lecturer)" value={f.teacherDesignation} onChange={set('teacherDesignation')} />
              <input id="teacherDepartment" className={inputCls} placeholder="Department (যেমন Dept. of Agricultural Engineering)" value={f.teacherDepartment} onChange={set('teacherDepartment')} />

              <p className="text-sm font-semibold text-gray-700 dark:text-text-muted pt-2 border-t border-gray-100 dark:border-border-subtle">
                তোমার তথ্য (Submitted by)
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input id="studentName" className={halfInputCls} placeholder="Name" value={f.name} onChange={set('name')} />
                <input id="regNo" className={halfInputCls} placeholder="Reg. No" value={f.regNo} onChange={set('regNo')} />
                <input id="level" className={halfInputCls} placeholder="Level (Level-2)" value={f.level} onChange={set('level')} />
                <input id="semester" className={halfInputCls} placeholder="Semester (Semester-I)" value={f.semester} onChange={set('semester')} />
                <input id="section" className={halfInputCls} placeholder="Section" value={f.section} onChange={set('section')} />
                <input id="group" className={halfInputCls} placeholder="Group" value={f.group} onChange={set('group')} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-muted dark:text-text-muted uppercase tracking-wider mb-1">Faculty</label>
                <select id="faculty" className={inputCls} value={f.faculty} onChange={set('faculty')}>
                  <option value="">Faculty বাছো</option>
                  {FACULTIES.map((x) => <option key={x}>{x}</option>)}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  id="downloadDocx"
                  onClick={downloadDocx}
                  disabled={isDownloading}
                  className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 bg-brand-primary hover:opacity-90 text-white font-semibold rounded-md transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2"
                >
                  {isDownloading ? (
                    <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>তৈরি হচ্ছে…</>
                  ) : (
                    <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>DOCX ডাউনলোড</>
                  )}
                </button>
                <button
                  id="downloadPdf"
                  onClick={() => window.print()}
                  className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 bg-brand-secondary hover:opacity-90 text-white font-semibold rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-secondary focus-visible:ring-offset-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                  PDF (Print)
                </button>
              </div>
              <p className="text-xs text-text-muted dark:text-text-muted text-center pt-1">
                সব তথ্য শুধু তোমার ব্রাউজারে — কোনো সার্ভারে পাঠানো হয় না।
              </p>
            </div>

            {/* Live preview — always white/black, printed as PDF */}
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold text-text-muted dark:text-text-muted uppercase tracking-wider mb-2 text-center">লাইভ প্রিভিউ (A4)</p>
              <div
                id="cover-preview"
                style={{
                  fontFamily: `${FONT}, serif`,
                  backgroundColor: '#ffffff',
                  color: '#000000',
                  width: '100%',
                  maxWidth: '420px',
                  aspectRatio: '210 / 297',
                  margin: '0 auto',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
                  overflow: 'hidden',
                }}
              >
                <div style={{ padding: `${u(12.1)} ${u(12.1)} 0`, textAlign: 'center' }}>
                  <p style={{ fontSize: u(3.7), fontWeight: 'bold' }}>Sher-e-Bangla Agricultural University</p>
                  <p style={{ fontSize: u(2.69) }}>Sher-e-Bangla Nagar, Dhaka-1207</p>
                  <img src="/sau-logo.png" alt="SAU logo" style={{ display: 'block', width: u(25.2), height: u(27.2), margin: `0 auto ${u(3.78)}` }} />
                  <p style={{ fontSize: u(2.69), fontWeight: 'bold' }}>
                    {title || <span data-ph style={{ color: '#999' }}>কভার পেজের শিরোনাম</span>}
                  </p>
                  <p style={{ fontSize: u(2.69), marginBottom: courseTitle ? undefined : u(9.88) }}>
                    {f.courseCode ? `Course Code: ${f.courseCode}` : <span data-ph style={{ color: '#999' }}>Course Code</span>}
                  </p>
                  {courseTitle && <p style={{ fontSize: u(2.69), marginBottom: u(9.88) }}>Course Title: {courseTitle}</p>}

                  <div style={{ display: 'flex', textAlign: 'left', width: u(83.5), marginLeft: u(-3.85), border: '1px solid #000' }}>
                    <div style={{ width: '51.7%', padding: `${u(0.84)} ${u(1.18)} ${u(2.1)} ${u(2.52)}` }}>
                      <p style={{ fontSize: u(2.69) }}>Submitted to:</p>
                      <p style={{ fontSize: u(2.35) }}>{f.teacherName || <span data-ph style={{ color: '#999' }}>শিক্ষকের নাম</span>}</p>
                      <p style={{ fontSize: u(2.35), fontStyle: 'italic' }}>{f.teacherDesignation || <span data-ph style={{ color: '#999' }}>পদবি</span>}</p>
                      <p style={{ fontSize: u(2.35) }}>{f.teacherDepartment || <span data-ph style={{ color: '#999' }}>Department</span>}</p>
                      <p style={{ fontSize: u(2.35) }}>Sher-e-Bangla Agricultural University, Dhaka-1207</p>
                    </div>
                    <div style={{ width: '48.3%', borderLeft: '1px solid #000', padding: `${u(0.84)} ${u(1.18)} ${u(2.1)} ${u(2.52)}` }}>
                      <p style={{ fontSize: u(2.69) }}>Submitted by:</p>
                      <p style={{ fontSize: u(2.35) }}>{f.name ? `Name: ${f.name}` : <span data-ph style={{ color: '#999' }}>Name</span>}</p>
                      <p style={{ fontSize: u(2.35) }}>{f.regNo ? `Registration No: ${f.regNo}` : <span data-ph style={{ color: '#999' }}>Registration No</span>}</p>
                      {levelSem && <p style={{ fontSize: u(2.35) }}>{levelSem}</p>}
                      {secGroup && <p style={{ fontSize: u(2.35) }}>{secGroup}</p>}
                      {f.faculty && <p style={{ fontSize: u(2.35) }}>{f.faculty}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* Description */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-surface-card rounded-lg border border-border-subtle dark:border-border-subtle p-8 ">
            <h2 className="text-2xl font-semibold text-text-primary dark:text-white mb-4">SAU Cover Page সম্পর্কে</h2>
            <div className="space-y-3 text-gray-700 dark:text-text-muted text-sm leading-relaxed">
              <p>
                Sher-e-Bangla Agricultural University (SAU)-এর assignment, note book বা lab report জমা
                দেওয়ার সময় একটি সুন্দর <strong>SAU assignment cover page</strong> দরকার হয়।
                এই ফ্রি টুলটি ব্যবহার করে মাত্র কয়েক সেকেন্ডে পেশাদার <strong>SAU cover page</strong> তৈরি করো।
              </p>
              <p>
                টুলটি A4 সাইজ এবং Times New Roman ফন্টে তৈরি — SAU-তে প্রচলিত ফরম্যাট।
                শিরোনামের ঘরে "A Note Book on ...", "An Assignment on ...", "A Lab Report on ..." — যা খুশি লিখতে পারবে, তাই যেকোনো ধরনের
                <strong> note book cover page</strong> বা <strong>lab report cover page</strong> বানানো যাবে।
                ফর্মে তথ্য লেখো, ডানদিকে লাইভ প্রিভিউ দেখবে।
              </p>
              <p>
                সব তথ্য ব্রাউজারেই প্রসেস হয়, কোনো সার্ভারে যায় না। DOCX ডাউনলোড করলে
                Microsoft Word বা Google Docs-এ এডিট করা যাবে; PDF দরকার হলে "PDF (Print)" বাটনে ক্লিক করো।
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Steps */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-semibold text-text-primary dark:text-white mb-6 text-center">কীভাবে ব্যবহার করবে</h2>
          <div className="grid gap-6 md:grid-cols-[1.15fr_1fr_0.85fr]">
            {[
              { step: '১', color: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-600 dark:text-green-400', title: 'তথ্য লেখো', desc: 'কোর্সের নাম, শিক্ষকের তথ্য এবং তোমার নাম, রেজিস্ট্রেশন নম্বর লেখো।' },
              { step: '২', color: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-600 dark:text-amber-400', title: 'প্রিভিউ দেখো', desc: 'ডানদিকে লাইভ A4 প্রিভিউতে দেখো কভার পেজটি কেমন দেখাচ্ছে।' },
              { step: '৩', color: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-600 dark:text-blue-400', title: 'ডাউনলোড করো', desc: 'DOCX (Word) বা PDF (Print) যেটা দরকার সেটা ডাউনলোড করো — ফ্রিতে।' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 ${item.color} rounded-full mb-4`}>
                  <span className={`text-xl font-semibold ${item.text}`}>{item.step}</span>
                </div>
                <h3 className="text-lg font-semibold text-text-primary dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted dark:text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center text-sm">
            <Link to="/?ai-tutor=open" className="text-green-600 dark:text-green-400 hover:underline inline-flex items-center gap-1">
              কভার পেজের ফরম্যাট নিয়ে প্রশ্ন আছে? AI-কে জিজ্ঞেস করো {<ArrowRightIcon className="ml-1 h-4 w-4" />}
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* FAQ */}
      <ScrollReveal direction="up" delay={0.1}>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h2 className="text-2xl font-semibold text-text-primary dark:text-white mb-6">সচরাচর জিজ্ঞাসা (FAQ)</h2>
          <div className="space-y-4">
            {FAQS.map((x) => (
              <div key={x.q} className="bg-surface-card rounded-md border border-border-subtle dark:border-border-subtle p-5">
                <h3 className="font-semibold text-text-primary dark:text-white mb-1">{x.q}</h3>
                <p className="text-sm text-text-muted dark:text-text-muted">{x.a}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <RelatedPages
        title="আরও দরকারি রিসোর্স"
        pages={[
          {
            title: 'Lecture Notes & Study Materials',
            description: 'সব ফ্যাকাল্টির lecture notes, textbook PDF ও study guides ডাউনলোড করো।',
            href: '/sau-notes',
            icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
          },
          {
            title: 'Ask AI Tutor',
            description: 'Assignment বা lab report লেখার সময় কোনো বিষয় বুঝতে না পারলে AI-কে জিজ্ঞেস করো।',
            href: '/?ai-tutor=open',
            icon: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
          },
          {
            title: 'Question Bank PDF',
            description: 'SAU-র সব বিষয়ের previous year question paper PDF ডাউনলোড করো।',
            href: '/sau-question-bank-pdf',
            icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
          },
        ]}
      />
    </>
  );
}
