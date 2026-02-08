import React, { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Home.css";

import Logo from "../assets/Logo.jpg";
import party from "../assets/1.jpg";
import wedding from "../assets/2.jpg";
import casual from "../assets/3.jpg";
import formal from "../assets/4.jpg";
import festive from "../assets/5.jpg";
import vest from "../assets/6.jpg";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.8 }
  },
};

const slideFromLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  },
};

const slideFromRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" }
  },
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const rotateIn = {
  hidden: { opacity: 0, rotate: -10, scale: 0.9 },
  visible: { 
    opacity: 1, 
    rotate: 0,
    scale: 1,
    transition: { duration: 0.7, ease: "easeOut" }
  },
};

// Hero Carousel Component
function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    { 
      image: party, 
      title: "Party Wear",
      subtitle: "Look stunning at every celebration"
    },
    { 
      image: wedding, 
      title: "Wedding Collection",
      subtitle: "Make your special day unforgettable"
    },
    { 
      image: festive, 
      title: "Festive Styles",
      subtitle: "Celebrate in style and comfort"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="hero-carousel">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          className="hero-slide"
          style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1 }}
        >
          <div className="overlay" />
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Rent Designer Wear <br />
              <span>{slides[currentSlide].title}</span>
            </motion.h1>
            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {slides[currentSlide].subtitle}
            </motion.p>

            <motion.div 
              className="hero-search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <input placeholder="Enter location" aria-label="Location" />
              <input placeholder="Select Occasion" aria-label="Occasion" />
              <button>Explore</button>
            </motion.div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
      
      <button 
        className="carousel-nav prev"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        aria-label="Previous slide"
      >
        ‹
      </button>
      <button 
        className="carousel-nav next"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        aria-label="Next slide"
      >
        ›
      </button>
    </div>
  );
}


export default function RentiqueLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Refs for scroll animations
  const featuresRef = useRef(null);
  const categoriesRef = useRef(null);
  const boutiquesRef = useRef(null);
  const howItWorksRef = useRef(null);
  const testimonialsRef = useRef(null);
  const statsRef = useRef(null);
  
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" });
  const boutiquesInView = useInView(boutiquesRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });

  const categories = [
    { name: "Party Wear", image: party },
    { name: "Wedding", image: wedding },
    { name: "Jackets", image: casual },
    { name: "Casual", image: formal },
    { name: "Ethnic Wear", image: festive },
    { name: "Accessories", image: vest },
    { name: "Party Wear", image: party },
    { name: "Wedding", image: wedding },
  ];

  const features = [
    { 
      title: "1000+ Happy Customers", 
      desc: "Trusted by people across the city",
      icon: "👥"
    },
    { 
      title: "Free Pickup & Return", 
      desc: "Convenient doorstep service",
      icon: "🚚"
    },
    { 
      title: "Dry Cleaned & Hygienic", 
      desc: "Professional care for every item",
      icon: "✨"
    },
    { 
      title: "Rated 4.8 / 5", 
      desc: "Excellent customer satisfaction",
      icon: "⭐"
    }
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Browse & Select",
      desc: "Explore our collection and choose your perfect outfit",
      icon: "🔍"
    },
    {
      step: "02",
      title: "Book Online",
      desc: "Reserve your item with just a few clicks",
      icon: "📱"
    },
    {
      step: "03",
      title: "Try & Enjoy",
      desc: "Wear it to your event and make memories",
      icon: "👗"
    },
    {
      step: "04",
      title: "Return Easy",
      desc: "Free pickup from your doorstep",
      icon: "📦"
    }
  ];

  // Animated counter for stats
  const [counters, setCounters] = useState({ customers: 0, items: 0, cities: 0 });

  useEffect(() => {
    if (statsInView) {
      const targets = { customers: 1000, items: 5000, cities: 3 };
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCounters({
          customers: Math.floor(targets.customers * progress),
          items: Math.floor(targets.items * progress),
          cities: Math.floor(targets.cities * progress)
        });

        if (step >= steps) {
          setCounters(targets);
          clearInterval(timer);
        }
      }, interval);

      return () => clearInterval(timer);
    }
  }, [statsInView]);

  return (
    <div className="app">
      {/* Navbar */}
      <motion.nav 
        className="navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
  <motion.div 
    className="logo"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className="logo-wrapper">
      <img src={Logo} alt="Logo" className="logo-img" />
      <div className="logo">RENTIQUE</div>
    </div>
  </motion.div>

  <button 
    className="mobile-menu-btn"
    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    aria-label="Toggle menu"
  >
    <span className={mobileMenuOpen ? "open" : ""}></span>
    <span className={mobileMenuOpen ? "open" : ""}></span>
    <span className={mobileMenuOpen ? "open" : ""}></span>
  </button>

  <motion.ul 
    className={`nav-links ${mobileMenuOpen ? "active" : ""}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.3 }}
  >
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a href="#home">Home</a>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a href="#Explore">Explore</a>
    </motion.li>
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a href="#boutique">Boutique</a>
    </motion.li>  
    <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <a href="#about">About Us</a>
    </motion.li>
  </motion.ul>

  {/* Search Input + Login Button Wrapper */}
  <div className="nav-right">
    <motion.input 
      className="nav-search" 
      placeholder="Search for rental clothes..." 
      aria-label="Search"
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: 250 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    />
    <motion.a 
      href="/login"  // Replace with your login route
      className="login-btn"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Login
    </motion.a>
  </div>
</div>

      </motion.nav>

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Features */}
      <section className="features" ref={featuresRef}>
        <motion.div 
          className="features-grid"
          variants={staggerContainer}
          initial="hidden"
          animate={featuresInView ? "visible" : "hidden"}
        >
          {features.map((item, i) => (
            <motion.div 
              key={i} 
              className="feature-card"
              variants={rotateIn}
              whileHover={{ 
                y: -12, 
                scale: 1.05,
                boxShadow: "0 12px 40px rgba(212, 175, 55, 0.3)",
                transition: { duration: 0.3 } 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="feature-icon"
                animate={{ 
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1.1, 1]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                {item.icon}
              </motion.div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="section categories-section" ref={categoriesRef}>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={categoriesInView ? "visible" : "hidden"}
        >
          Popular Categories
        </motion.h2>
        
        <motion.div 
          className="categories-carousel"
          initial={{ opacity: 0 }}
          animate={categoriesInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <motion.div 
            className="categories-track"
            animate={{ x: [0, -1600] }}
            transition={{ 
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[...categories, ...categories].map((cat, i) => (
              <motion.div 
                key={i} 
                className="category-card"
                style={{ backgroundImage: `url(${cat.image})` }}
                whileHover={{ 
                  scale: 1.1,
                  zIndex: 10,
                  transition: { duration: 0.3 }
                }}
              >
                <div className="category-overlay"></div>
                <span>{cat.name}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="how-it-works" ref={howItWorksRef}>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
        >
          How It Works
        </motion.h2>
        
        <motion.div 
          className="steps-container"
          variants={staggerContainer}
          initial="hidden"
          animate={howItWorksInView ? "visible" : "hidden"}
        >
          {howItWorks.map((step, i) => (
            <motion.div 
              key={i} 
              className="step-card"
              variants={i % 2 === 0 ? slideFromLeft : slideFromRight}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
            >
              <motion.div 
                className="step-number"
                whileHover={{ 
                  rotate: 360,
                  scale: 1.2,
                  transition: { duration: 0.6 }
                }}
              >
                {step.step}
              </motion.div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Boutiques */}
      <section className="section" ref={boutiquesRef}>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={boutiquesInView ? "visible" : "hidden"}
        >
          Boutiques Near You
        </motion.h2>
        
        <motion.div 
          className="boutiques-grid"
          variants={staggerContainer}
          initial="hidden"
          animate={boutiquesInView ? "visible" : "hidden"}
        >
          {[1, 2, 3, 4, 5, 6].map((b, i) => (
            <motion.div 
              key={b} 
              className="boutique-card"
              variants={fadeUp}
              whileHover={{ 
                y: -12,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div 
                className="boutique-img"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="boutique-info">
                <h4>Elite Boutique {b}</h4>
                <p className="boutique-distance">📍 {(2.5 * b).toFixed(1)} km away</p>
                <div className="boutique-rating">⭐ 4.{8 - (i % 3)} (120 reviews)</div>
                <motion.button 
                  className="view-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Collection
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      

      {/* CTA */}
      <motion.section 
        className="cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          READY TO RENT YOUR PERFECT OUTFIT?
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Browse thousands of designer pieces available near you
        </motion.p>
        <motion.button 
          className="cta-btn"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ 
            scale: 1.1,
            boxShadow: "0 12px 40px rgba(212, 175, 55, 0.6)"
          }}
          whileTap={{ scale: 0.95 }}
        >
          Start Exploring
        </motion.button>
      </motion.section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h4>About Rentique</h4>
            <ul>
              <li><a href="#faq">FAQs</a></li>
              <li><a href="#returns">Returns / Exchanges</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </motion.div>
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
            </ul>
          </motion.div>
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4>Sign up & Save</h4>
            <p>Get exclusive deals and updates</p>
            <div className="email-signup">
              <input placeholder="Enter your email" />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </motion.div>
          <motion.div 
            className="footer-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="footer-contact">
              <h4>Customer Service</h4>
              <p>📧 support@rentique.com</p>
              <p>💬 WhatsApp: +92 300 1234567</p>
            </div>
          </motion.div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Rentique. All rights reserved.</p>
          <div className="social-links">
            <motion.a 
              href="#facebook" 
              aria-label="Facebook"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              FB
            </motion.a>
            <motion.a 
              href="#instagram" 
              aria-label="Instagram"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              IG
            </motion.a>
            <motion.a 
              href="#twitter" 
              aria-label="Twitter"
              whileHover={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 0.4 }}
            >
              TW
            </motion.a>
          </div>
        </div>
      </footer>
    </div>
  );
}