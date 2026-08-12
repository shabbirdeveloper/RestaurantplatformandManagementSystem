import { useEffect, useMemo, useRef, useState } from 'react';
import { m as motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, BriefcaseBusiness, CheckCircle2, Mail, MapPin, Users } from 'lucide-react';
import { branches, contactInfo, imageUrls } from '../data/content';
import { listPublishedCareerRoles } from '../lib/supabase';
import { defaultCareerRoles } from './careersSeed';
import './careers.css';

const reveal = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

function roleEmail(role) {
  return role.contact_email || contactInfo.email;
}

function applyHref(role) {
  const subject = encodeURIComponent(`Application for ${role.title} — Naseeb Chapati`);
  return `mailto:${roleEmail(role)}?subject=${subject}`;
}

function RoleImage({ role, eager = false }) {
  const [source, setSource] = useState(role.image || '');
  if (!source) return <div className="career-role-image career-role-image-empty"><BriefcaseBusiness size={34} /><span>Add role image in Admin</span></div>;
  return <div className="career-role-image"><img src={source} alt={role.image_alt || `${role.title} position at Naseeb Chapati`} loading={eager ? 'eager' : 'lazy'} onError={() => setSource('')} /></div>;
}

function CareerSkeleton() {
  return <div className="career-role-grid" aria-label="Loading career openings">{[0, 1, 2].map((item) => <div className="career-role-card is-loading" key={item}><span /><div><i /><i /><i /></div></div>)}</div>;
}

export default function CareersPage() {
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState('loading');
  const openingsRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    let active = true;
    void listPublishedCareerRoles().then(({ data, error }) => {
      if (!active) return;
      setRoles(error ? defaultCareerRoles : (data || []));
      setStatus(error ? 'preview' : 'ready');
    });
    return () => { active = false; };
  }, []);

  const heroImage = useMemo(() => roles.find((role) => role.featured && role.image)?.image || roles.find((role) => role.image)?.image || imageUrls.kitchen, [roles]);
  const firstBranch = branches[0]?.name || 'Naseeb Chapati branches';
  const scrollToOpenings = () => openingsRef.current?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });

  return <motion.main className="careers-page" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .35 }}>
    <section className="careers-hero">
      <div className="container careers-hero-grid">
        <motion.div className="careers-hero-copy" initial={reduceMotion ? false : 'hidden'} animate="show" variants={{ show: { transition: { staggerChildren: .09 } } }}>
          <motion.h1 variants={reveal} transition={{ duration: .55, ease: [0.22, 1, 0.36, 1] }}>Build your future with <span>Naseeb Chapati.</span></motion.h1>
          <motion.p variants={reveal} transition={{ duration: .5 }}>Join a restaurant team shaped by warm hospitality, teamwork, and pride in serving authentic Pakistani food.</motion.p>
          <motion.button variants={reveal} type="button" onClick={scrollToOpenings}>View openings <ArrowDown size={17} /></motion.button>
        </motion.div>
        <motion.figure className="careers-hero-media" initial={reduceMotion ? false : { opacity: 0, scale: .97, x: 24 }} animate={{ opacity: 1, scale: 1, x: 0 }} transition={{ type: 'spring', stiffness: 90, damping: 20, delay: .12 }}>
          <img src={heroImage} alt="Naseeb Chapati restaurant team at work" />
          <figcaption><Users size={18} /><span><strong>Grow together</strong>Hospitality starts with people.</span></figcaption>
        </motion.figure>
      </div>
    </section>

    <section className="careers-openings section" ref={openingsRef}>
      <div className="container">
        <motion.header className="careers-section-heading" initial={reduceMotion ? false : 'hidden'} whileInView="show" viewport={{ once: false, amount: .5 }} variants={reveal} transition={{ duration: .5 }}>
          <div><h2>We’re hiring</h2><p>Explore current opportunities and find the role that fits your strengths.</p></div>
          <span><BriefcaseBusiness size={17} />Current openings</span>
        </motion.header>
        {status === 'loading' && <CareerSkeleton />}
        {status !== 'loading' && roles.length > 0 && <motion.div className="career-role-grid" initial="hidden" whileInView="show" viewport={{ once: false, amount: .15 }} variants={{ show: { transition: { staggerChildren: .09 } } }}>
          {roles.map((role, index) => <motion.article className="career-role-card" key={role.id} variants={reveal} transition={{ duration: .5, ease: [0.22, 1, 0.36, 1] }}>
            <RoleImage role={role} eager={index === 0} />
            <div className="career-role-content">
              <div className="career-role-title"><h3>{role.title}</h3>{role.featured && <span>Priority role</span>}</div>
              <p>{role.short_description}</p>
              <div className="career-role-meta">
                <span><MapPin size={15} />{role.location || firstBranch}</span>
                <span><BriefcaseBusiness size={15} />{role.employment_type || 'Employment type available on enquiry'}</span>
              </div>
              {(role.requirements || []).length > 0 && <ul>{role.requirements.slice(0, 3).map((item) => <li key={item}><CheckCircle2 size={14} />{item}</li>)}</ul>}
              <a href={applyHref(role)}>Apply now <ArrowUpRight size={16} /></a>
            </div>
          </motion.article>)}
        </motion.div>}
        {status !== 'loading' && roles.length === 0 && <div className="careers-empty"><BriefcaseBusiness size={30} /><h3>New opportunities are being prepared.</h3><p>Published vacancies from the Careers dashboard will appear here automatically.</p></div>}
      </div>
    </section>

    <section className="careers-cta">
      <div className="container careers-cta-inner">
        <div><h2>Come grow with us.</h2><p>If you care about good food, thoughtful service, and working as one team, we would like to hear from you.</p></div>
        <a href={`mailto:${contactInfo.email}?subject=${encodeURIComponent('Careers at Naseeb Chapati')}`}>Contact our team <Mail size={17} /></a>
      </div>
    </section>
  </motion.main>;
}
