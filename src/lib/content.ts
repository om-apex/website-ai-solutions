// DEFAULT_CONTENT for Om AI Solutions site
// All content keys use the 'ai_' prefix
// Format: ai_{page}_{section}_{descriptor}
// Lists use pipe-separated values: "Item 1|Item 2|Item 3"
// Stats use "value|label" format

export interface ContentEntry {
  value: string
  content_type: 'text' | 'phone' | 'email' | 'stat' | 'list'
  page: string
  section: string
}

export const DEFAULT_CONTENT: Record<string, ContentEntry> = {
  // ============================================================
  // GLOBAL (used across multiple pages)
  // ============================================================
  ai_global_contact_phone: {
    value: '',
    content_type: 'phone',
    page: 'global',
    section: 'contact',
  },
  ai_global_contact_email: {
    value: 'hello@omaisolutions.com',
    content_type: 'email',
    page: 'global',
    section: 'contact',
  },
  ai_global_contact_location: {
    value: 'Atlanta, Georgia',
    content_type: 'text',
    page: 'global',
    section: 'contact',
  },
  ai_global_company_name: {
    value: 'Om AI Solutions',
    content_type: 'text',
    page: 'global',
    section: 'brand',
  },
  ai_global_parent_company: {
    value: 'Om Apex Holdings LLC',
    content_type: 'text',
    page: 'global',
    section: 'brand',
  },
  ai_global_parent_url: {
    value: 'https://omapex.com',
    content_type: 'text',
    page: 'global',
    section: 'brand',
  },
  ai_global_copyright: {
    value: 'Om AI Solutions LLC. All rights reserved.',
    content_type: 'text',
    page: 'global',
    section: 'footer',
  },

  // ============================================================
  // HOME PAGE
  // ============================================================

  // Hero Section
  ai_home_hero_badge: {
    value: 'AI-Powered Supply Chain Software',
    content_type: 'text',
    page: 'home',
    section: 'hero',
  },
  ai_home_hero_title_prefix: {
    value: 'Intelligent Backbone for',
    content_type: 'text',
    page: 'home',
    section: 'hero',
  },
  ai_home_hero_title_highlight: {
    value: 'Your Business',
    content_type: 'text',
    page: 'home',
    section: 'hero',
  },
  ai_home_hero_description: {
    value: 'Om AI Solutions builds cutting-edge AI software for warehouse and supply chain operations. Combining 30+ years of industry expertise with advanced AI to transform how enterprises operate.',
    content_type: 'text',
    page: 'home',
    section: 'hero',
  },
  ai_home_hero_cta_primary: {
    value: 'Explore Products',
    content_type: 'text',
    page: 'home',
    section: 'hero',
  },
  ai_home_hero_cta_secondary: {
    value: 'Request Demo',
    content_type: 'text',
    page: 'home',
    section: 'hero',
  },

  // Products Section
  ai_home_products_title: {
    value: 'Our Products',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_products_description: {
    value: 'AI-powered solutions designed to optimize every aspect of your warehouse and supply chain operations.',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },

  // Product 1: AI Quorum
  ai_home_product1_name: {
    value: 'AI Quorum',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product1_description: {
    value: 'Multi-model AI consensus platform that delivers verified, trustworthy answers by consulting multiple AI models.',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product1_status: {
    value: 'Coming Soon',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },

  // Product 2: Yard Shack
  ai_home_product2_name: {
    value: 'Yard Shack',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product2_description: {
    value: 'AI-powered yard management system that optimizes trailer movements, dock scheduling, and yard operations.',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product2_status: {
    value: 'In Development',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },

  // Product 3: Floor Assistant
  ai_home_product3_name: {
    value: 'Floor Assistant',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product3_description: {
    value: 'Intelligent warehouse floor operations optimizer that guides workers and improves efficiency in real-time.',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product3_status: {
    value: 'In Development',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },

  // Product 4: Voice & Vision Picking
  ai_home_product4_name: {
    value: 'Voice & Vision Picking',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product4_description: {
    value: 'Next-generation picking systems using voice commands and computer vision for hands-free, error-free operations.',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },
  ai_home_product4_status: {
    value: 'Planned',
    content_type: 'text',
    page: 'home',
    section: 'products',
  },

  // Features Section
  ai_home_features_title: {
    value: 'Why Om AI Solutions?',
    content_type: 'text',
    page: 'home',
    section: 'features',
  },
  ai_home_features_description: {
    value: 'We combine deep supply chain expertise with cutting-edge AI technology to deliver solutions that actually work in real-world warehouse environments.',
    content_type: 'text',
    page: 'home',
    section: 'features',
  },
  ai_home_features_list: {
    value: 'Multi-model AI for verified answers|Real-time warehouse optimization|Seamless WMS integration|30+ years of supply chain expertise|Built for Blue Yonder environments|Enterprise-grade security',
    content_type: 'list',
    page: 'home',
    section: 'features',
  },

  // Stats
  ai_home_stats_primary: {
    value: '30+|Years of Supply Chain Expertise',
    content_type: 'stat',
    page: 'home',
    section: 'features',
  },
  ai_home_stats_products: {
    value: '4|AI Products',
    content_type: 'stat',
    page: 'home',
    section: 'features',
  },
  ai_home_stats_location: {
    value: 'ATL|Based',
    content_type: 'stat',
    page: 'home',
    section: 'features',
  },

  // CTA Section
  ai_home_cta_title: {
    value: 'Ready to Transform Your Operations?',
    content_type: 'text',
    page: 'home',
    section: 'cta',
  },
  ai_home_cta_description: {
    value: "Let's discuss how AI can optimize your warehouse and supply chain. Schedule a demo or consultation today.",
    content_type: 'text',
    page: 'home',
    section: 'cta',
  },
  ai_home_cta_button: {
    value: 'Get in Touch',
    content_type: 'text',
    page: 'home',
    section: 'cta',
  },

  // ============================================================
  // ABOUT PAGE
  // ============================================================

  // Hero
  ai_about_hero_title: {
    value: 'About Om AI Solutions',
    content_type: 'text',
    page: 'about',
    section: 'hero',
  },
  ai_about_hero_description: {
    value: 'We combine 30+ years of supply chain expertise with cutting-edge AI to build software that transforms warehouse and logistics operations.',
    content_type: 'text',
    page: 'about',
    section: 'hero',
  },

  // Our Story
  ai_about_story_title: {
    value: 'Our Story',
    content_type: 'text',
    page: 'about',
    section: 'story',
  },
  ai_about_story_p1: {
    value: 'Om AI Solutions was born from a simple observation: the supply chain industry is ripe for AI transformation, but most solutions are built by technologists who don\'t understand the operational realities of warehouses.',
    content_type: 'text',
    page: 'about',
    section: 'story',
  },
  ai_about_story_p2: {
    value: 'With decades of hands-on experience implementing and optimizing warehouse management systems\u2014particularly Blue Yonder\u2014we know exactly where AI can make the biggest impact. We\'ve walked the warehouse floors, debugged the integrations, and felt the pain points firsthand.',
    content_type: 'text',
    page: 'about',
    section: 'story',
  },
  ai_about_story_p3: {
    value: 'Now we\'re building the AI solutions we always wished we had: practical, reliable, and designed for real-world warehouse environments.',
    content_type: 'text',
    page: 'about',
    section: 'story',
  },

  // About Stats
  ai_about_stat_years: {
    value: '30+|Years in Supply Chain',
    content_type: 'stat',
    page: 'about',
    section: 'story',
  },
  ai_about_stat_products: {
    value: '4|AI Products',
    content_type: 'stat',
    page: 'about',
    section: 'story',
  },
  ai_about_stat_expertise: {
    value: 'BY|Blue Yonder Expert',
    content_type: 'stat',
    page: 'about',
    section: 'story',
  },
  ai_about_stat_location: {
    value: 'ATL|Based',
    content_type: 'stat',
    page: 'about',
    section: 'story',
  },

  // Mission, Vision, Approach
  ai_about_mission_title: {
    value: 'Our Mission',
    content_type: 'text',
    page: 'about',
    section: 'values',
  },
  ai_about_mission_description: {
    value: 'To make AI practical and accessible for warehouse operations, helping companies optimize their supply chains with intelligent automation.',
    content_type: 'text',
    page: 'about',
    section: 'values',
  },
  ai_about_vision_title: {
    value: 'Our Vision',
    content_type: 'text',
    page: 'about',
    section: 'values',
  },
  ai_about_vision_description: {
    value: 'A world where every warehouse operates at peak efficiency, powered by AI that truly understands logistics operations.',
    content_type: 'text',
    page: 'about',
    section: 'values',
  },
  ai_about_approach_title: {
    value: 'Our Approach',
    content_type: 'text',
    page: 'about',
    section: 'values',
  },
  ai_about_approach_description: {
    value: 'We build AI that works in the real world\u2014not demos. Every feature is designed by people who have spent decades on warehouse floors.',
    content_type: 'text',
    page: 'about',
    section: 'values',
  },

  // Leadership
  ai_about_leadership_title: {
    value: 'Leadership',
    content_type: 'text',
    page: 'about',
    section: 'leadership',
  },
  ai_about_leader_initials: {
    value: 'NT',
    content_type: 'text',
    page: 'about',
    section: 'leadership',
  },
  ai_about_leader_name: {
    value: 'Nishad Tambe',
    content_type: 'text',
    page: 'about',
    section: 'leadership',
  },
  ai_about_leader_role: {
    value: 'Founder & CEO',
    content_type: 'text',
    page: 'about',
    section: 'leadership',
  },
  ai_about_leader_bio: {
    value: '30+ years of supply chain leadership with deep expertise in warehouse management systems, particularly Blue Yonder. Former implementation consultant who has worked with Fortune 500 companies to optimize their distribution operations. Now applying that experience to build AI solutions that solve real problems warehouse teams face every day.',
    content_type: 'text',
    page: 'about',
    section: 'leadership',
  },

  // Parent company note (about page)
  ai_about_parent_note: {
    value: 'Om AI Solutions is a subsidiary of',
    content_type: 'text',
    page: 'about',
    section: 'parent',
  },

  // ============================================================
  // CONTACT PAGE
  // ============================================================

  // Hero
  ai_contact_hero_title: {
    value: 'Get in Touch',
    content_type: 'text',
    page: 'contact',
    section: 'hero',
  },
  ai_contact_hero_description: {
    value: "Ready to transform your warehouse operations with AI? Let's discuss how we can help optimize your supply chain.",
    content_type: 'text',
    page: 'contact',
    section: 'hero',
  },

  // Contact Options
  ai_contact_option1_title: {
    value: 'Request a Demo',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },
  ai_contact_option1_description: {
    value: 'See our AI products in action with a personalized demonstration.',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },
  ai_contact_option1_action: {
    value: 'Schedule Demo',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },

  ai_contact_option2_title: {
    value: 'General Inquiries',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },
  ai_contact_option2_description: {
    value: "Have questions about our products or company? We'd love to hear from you.",
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },
  ai_contact_option2_action: {
    value: 'Send Message',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },

  ai_contact_option3_title: {
    value: 'Partnership',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },
  ai_contact_option3_description: {
    value: "Interested in partnering or integrating with our solutions? Let's talk.",
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },
  ai_contact_option3_action: {
    value: 'Get in Touch',
    content_type: 'text',
    page: 'contact',
    section: 'options',
  },

  // Direct Contact Section
  ai_contact_direct_title: {
    value: 'Direct Contact',
    content_type: 'text',
    page: 'contact',
    section: 'direct',
  },
  ai_contact_direct_email_label: {
    value: 'Email',
    content_type: 'text',
    page: 'contact',
    section: 'direct',
  },
  ai_contact_direct_location_label: {
    value: 'Location',
    content_type: 'text',
    page: 'contact',
    section: 'direct',
  },

  // Parent company note (contact page)
  ai_contact_parent_note: {
    value: 'Om AI Solutions is a subsidiary of',
    content_type: 'text',
    page: 'contact',
    section: 'parent',
  },

  // ============================================================
  // FOOTER
  // ============================================================
  ai_footer_tagline: {
    value: 'Intelligent backbone for your business. AI-powered software for warehouse and supply chain operations.',
    content_type: 'text',
    page: 'global',
    section: 'footer',
  },
  ai_footer_products_title: {
    value: 'Products',
    content_type: 'text',
    page: 'global',
    section: 'footer',
  },
  ai_footer_products_list: {
    value: 'AI Quorum|Yard Shack|Floor Assistant|Voice & Vision Picking',
    content_type: 'list',
    page: 'global',
    section: 'footer',
  },
  ai_footer_company_title: {
    value: 'Company',
    content_type: 'text',
    page: 'global',
    section: 'footer',
  },
  ai_footer_contact_title: {
    value: 'Contact',
    content_type: 'text',
    page: 'global',
    section: 'footer',
  },
  ai_footer_subsidiary_note: {
    value: 'A subsidiary of',
    content_type: 'text',
    page: 'global',
    section: 'footer',
  },
}
