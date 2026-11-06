/**
 * Frequently asked questions. Edit this file to change the FAQ page; keep
 * answers factual and avoid promising positions, funding or services that have
 * not been confirmed.
 */

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
  /** Optional internal link rendered after the answer. */
  link?: {
    label: string;
    href:
      | "/research"
      | "/publications"
      | "/projects"
      | "/products"
      | "/people"
      | "/news"
      | "/events"
      | "/resources"
      | "/opportunities"
      | "/collaborate"
      | "/contact"
      | "/about"
      | "/privacy";
  };
};

export type FaqGroup = {
  title: string;
  entries: FaqEntry[];
};

export const faqGroups: FaqGroup[] = [
  {
    title: "About the lab",
    entries: [
      {
        id: "what-is-steadi",
        question: "What is STEADI Lab?",
        answer:
          "STEADI Lab is a research laboratory associated with The University of Scranton that explores the intersection of artificial intelligence, blockchain technology and intelligent systems. Our work focuses on trustworthy, transparent, secure and reliable computational solutions that connect academic research with practical applications.",
        link: { label: "About the lab", href: "/about" },
      },
      {
        id: "research-areas",
        question: "Which research areas does the lab work in?",
        answer:
          "Our research is organised into nine areas spanning AI and machine learning, trustworthy and explainable AI, agentic and multi-agent systems, blockchain and distributed ledgers, smart contract security, decentralised applications, AI governance, data provenance and decision support, and the integration of AI with blockchain.",
        link: { label: "Explore research areas", href: "/research" },
      },
      {
        id: "university-relationship",
        question: "How is the lab related to The University of Scranton?",
        answer:
          "The lab is based at The University of Scranton in Scranton, Pennsylvania, USA. This website is maintained by STEADI Lab. It is not an official University publication, and the University's own policies and processes apply to admissions, employment and formal agreements.",
      },
    ],
  },
  {
    title: "Publications and research",
    entries: [
      {
        id: "find-papers",
        question: "Where can I find the lab's publications?",
        answer:
          "The publications page lists our journal articles, conference and workshop papers, preprints, technical reports and posters. You can search by title, author or keyword, filter by year, type and research area, and copy a BibTeX or plain-text citation from each entry.",
        link: { label: "Browse publications", href: "/publications" },
      },
      {
        id: "pdf-access",
        question: "Can I download the papers?",
        answer:
          "Where we are allowed to share a PDF it is attached to the publication record. Otherwise the record links to the DOI or publisher page. If you cannot access a paper, contact us and we will help where the publisher's terms permit.",
      },
      {
        id: "code-and-data",
        question: "Is the code and data behind your research available?",
        answer:
          "We release code, datasets and tools in the open whenever we can. Look for repository and dataset links on publication and project pages, and browse the resources library for everything released so far.",
        link: { label: "Resources library", href: "/resources" },
      },
      {
        id: "cite",
        question: "How should I cite the lab's work?",
        answer:
          "Each publication page provides a BibTeX entry and a plain-text citation with a copy button. Please cite the published version where one exists and the preprint otherwise.",
      },
    ],
  },
  {
    title: "Joining and collaborating",
    entries: [
      {
        id: "students",
        question: "Can students join the lab?",
        answer:
          "Yes. University of Scranton students can propose or join research projects aligned with our research areas. Prospective graduate researchers are welcome to express interest; admissions and funding decisions are made by the University's programmes, not by the lab.",
        link: { label: "Opportunities", href: "/opportunities" },
      },
      {
        id: "funding",
        question: "Are positions funded?",
        answer:
          "We only advertise funded positions when funding has been confirmed, and each listed opening states its funding status explicitly. If an opening does not mention funding, assume none is attached.",
      },
      {
        id: "external-collaboration",
        question: "How can a company or another university collaborate with the lab?",
        answer:
          "Use the collaboration page to describe what you have in mind. We work on joint research, applied industry projects, research proposals, open-source efforts and academic partnerships. Formal agreements are handled through the University's offices.",
        link: { label: "Collaborate", href: "/collaborate" },
      },
      {
        id: "open-source",
        question: "How can I contribute to your open-source tools?",
        answer:
          "Our tools are developed in public repositories. Issues, pull requests, documentation improvements and reproducibility reports are all welcome. Each product page links to its repository and documentation.",
        link: { label: "Products & open source", href: "/products" },
      },
    ],
  },
  {
    title: "This website",
    entries: [
      {
        id: "contact",
        question: "How do I contact the lab?",
        answer:
          "The contact page has a form that delivers messages to the lab team. Where an authorised public email address exists it is shown there as well.",
        link: { label: "Contact", href: "/contact" },
      },
      {
        id: "privacy",
        question: "What data does the site collect?",
        answer:
          "Only what you type into the contact and collaboration forms, which is used solely to reply to you. The site sets no tracking cookies; your theme preference is stored locally in your browser. See the privacy notice for details.",
        link: { label: "Privacy notice", href: "/privacy" },
      },
      {
        id: "corrections",
        question: "I found an error on the site. How can I report it?",
        answer:
          "Please send corrections through the contact form, mentioning the page and the issue. Accuracy matters to us and we fix errors promptly.",
      },
    ],
  },
];
