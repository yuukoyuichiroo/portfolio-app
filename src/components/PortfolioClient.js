"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaEnvelope, FaGithub, FaLinkedin, FaBars, FaTimes, FaInstagram } from "react-icons/fa";
import Typewriter from "typewriter-effect";
import LoadingScreen from "./LoadingScreen";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const formatDate = (dateStr) => {
  if (!dateStr || dateStr === 'Present') return dateStr;
  
  const parts = dateStr.split(' - ');
  
  const format = (d) => {
    if (!d || d === 'Present') return d;
    const [year, month] = d.split('-');
    if (!month) return d;
    
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  if (parts.length === 2) {
    return `${format(parts[0])} — ${format(parts[1])}`;
  }
  
  return format(dateStr);
};

export default function PortfolioClient({ home, about, experience, projects, contact }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#experience', label: 'Experience' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact' },
  ];

  return (
    <>
      <LoadingScreen />

      {/* Navigation Bar */}
      <nav className="nav-bar glass-panel">
        {/* Logo / Brand */}
        <a href="#home" className="nav-logo">AJH</a>

        {/* Desktop Links */}
        <ul className="nav-links nav-links-desktop">
          {navLinks.map(link => (
            <li key={link.href}><a href={link.href}>{link.label}</a></li>
          ))}
        </ul>

        {/* Hamburger Button (mobile only) */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="nav-mobile-overlay glass-panel"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <ul className="nav-mobile-links">
              {navLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <main>
        {/* Home Section */}
        <section id="home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <motion.div
            className="container"
            style={{ textAlign: 'center' }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} style={{ color: 'var(--accent-color)', marginBottom: '1rem', fontWeight: 600 }}>{home.greeting}</motion.h2>
            <motion.h1 variants={fadeUp} style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1rem' }}>
              <Typewriter
                options={{
                  strings: [home.name],
                  autoStart: true,
                  loop: true,
                  delay: 75,
                  deleteSpeed: 50,
                }}
              />
            </motion.h1>
            <motion.h3 variants={fadeUp} className="section-title" style={{ fontSize: '2rem' }}>{home.role}</motion.h3>
            <motion.p variants={fadeUp} style={{ maxWidth: '600px', margin: '0 auto 2rem', color: 'var(--text-secondary)', fontSize: '1.2rem', lineHeight: 1.6 }}>{home.bio}</motion.p>
            <motion.div variants={fadeUp} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="#projects" className="lightning-button">⚡ View My Work</a>
              <a
                href={about?.cv || '#'}
                download={!!about?.cv}
                className="cv-download-button"
                title={!about?.cv ? 'Set your CV link in the Admin Panel' : 'Download CV'}
              >
                <FaDownload /> Download My CV
              </a>
            </motion.div>
          </motion.div>
        </section>

        {/* About Section */}
        <section id="about" className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h2 className="section-title">{about.title}</h2>
            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <p style={{ lineHeight: 1.8, marginBottom: '1.5rem' }}>{about.content}</p>
                {about.cv && (
                  <a href={about.cv} download className="glass-button" style={{ marginTop: '1rem' }}>
                    <FaDownload /> Download CV
                  </a>
                )}
              </div>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Skills</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {about.skills.map((skill, index) => (
                    <span key={index} style={{
                      background: 'rgba(99, 102, 241, 0.15)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="section-title">Experience</motion.h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {experience && experience.items && experience.items.map((item, index) => (
                <motion.div key={index} variants={fadeUp} className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.5rem', margin: 0 }}>{item.role}</h3>
                    <span style={{ color: 'var(--accent-color)', fontWeight: 600 }}>{formatDate(item.duration)}</span>
                  </div>
                  <h4 style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', margin: 0 }}>{item.company}</h4>
                  <p style={{ lineHeight: 1.6 }}>{item.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '0.5rem' }}>
                    {item.tags && item.tags.map((tag, i) => (
                      <span key={i} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', borderRadius: '12px' }}>{tag}</span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeUp} className="section-title">My Projects</motion.h2>
            <div className="grid-3">
              {projects.map((project, index) => (
                <motion.div key={index} variants={fadeUp} className="glass-panel" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '2rem', flex: 1 }}>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{project.title}</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{project.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.5rem' }}>
                      {project.tags && project.tags.map((tag, i) => (
                        <span key={i} style={{ fontSize: '0.8rem', padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>{tag}</span>
                      ))}
                    </div>
                  </div>
                  {project.link && (
                    <div style={{ padding: '0 2rem 2rem' }}>
                      <a href={project.link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>View Project &rarr;</a>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <h2 className="section-title">Contact & Location</h2>
            <div className="grid-2">
              <div className="glass-panel" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem' }}>Get In Touch</h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                  {contact.email && (
                    <a href={`mailto:${contact.email}`} className="glass-button" style={{ padding: '12px' }}><FaEnvelope size={24} /></a>
                  )}
                  {contact.github && (
                    <a href={contact.github} target="_blank" rel="noopener noreferrer" className="glass-button" style={{ padding: '12px' }}><FaGithub size={24} /></a>
                  )}
                  {contact.linkedin && (
                    <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className="glass-button" style={{ padding: '12px' }}><FaLinkedin size={24} /></a>
                  )}
                  {contact.instagram && (
                    <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="glass-button" style={{ padding: '12px' }}><FaInstagram size={24} /></a>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)' }}>Based in {contact.location}</p>
              </div>

              {/* Map Section */}
              <div className="glass-panel" style={{ padding: '1rem', height: '400px' }}>
                <iframe
                  src={contact.map_url}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px', filter: 'invert(90%) hue-rotate(180deg)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </>
  );
}
