
    // --- 0. Global System Brand Configuration ---
    const SYSTEM_CONFIG = {
      name: "ElimuExpress", // System Brand Name
      suffix: "TZ",         // Suffix badge in header
      // System Logo: Can be a local filename (e.g. "logo.jpg"), a Lucide icon identifier (like "graduation-cap"),
      // an SVG markup string (starts with "<svg"), or a remote image URL (starts with "http" or "data:")
      logo: "graduation-cap",
      // Favicon: Local image file path or URL
      favicon: "favicon.png",
      // Cloudflare Worker API URL: Set to your independent worker domain (e.g. "https://your-worker-subdomain.workers.dev")
      // or leave empty "" to route to Cloudflare Pages Functions relatively.
      apiUrl: ""
    };

    function applySystemBranding() {
      // 0. Render Favicon
      if (SYSTEM_CONFIG.favicon && SYSTEM_CONFIG.favicon.trim() !== '') {
        let faviconLink = document.getElementById('system-favicon');
        if (!faviconLink) {
          faviconLink = document.createElement('link');
          faviconLink.id = 'system-favicon';
          faviconLink.rel = 'icon';
          faviconLink.type = 'image/png';
          document.head.appendChild(faviconLink);
        }
        faviconLink.href = SYSTEM_CONFIG.favicon;
      }

      // 1. Render Header Logo
      const logoContainer = document.getElementById('system-logo-container');
      if (logoContainer) {
        const logoVal = (SYSTEM_CONFIG.logo || 'graduation-cap').trim();
        const isImgPath = logoVal.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i) || 
                          logoVal.startsWith('http') || 
                          logoVal.startsWith('data:image/') ||
                          logoVal.startsWith('/') ||
                          logoVal.startsWith('./');

        const gradCapSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/></svg>`;

        if (logoVal.startsWith('<svg')) {
          logoContainer.classList.add('bg-brand-700', 'flex', 'items-center', 'justify-center', 'text-white');
          logoContainer.innerHTML = logoVal;
        } else if (isImgPath) {
          logoContainer.classList.remove('bg-brand-700');
          logoContainer.innerHTML = `<img src="${logoVal}" alt="Logo" class="w-full h-full object-contain rounded-xl" onerror="this.parentElement.classList.add('bg-brand-700', 'flex', 'items-center', 'justify-center', 'text-white'); this.outerHTML='${gradCapSvg.replace(/'/g, "\\'")}';" />`;
        } else {
          // Standard Green Graduation Cap Badge
          logoContainer.classList.add('bg-brand-700', 'flex', 'items-center', 'justify-center', 'text-white');
          logoContainer.innerHTML = gradCapSvg;
        }
      }

      // 2. Render Header Name
      const nameContainer = document.getElementById('system-name-container');
      if (nameContainer) {
        const name = SYSTEM_CONFIG.name;
        const splitIndex = Math.ceil(name.length / 2);
        const firstHalf = name.substring(0, splitIndex);
        const secondHalf = name.substring(splitIndex);
        nameContainer.innerHTML = `${firstHalf}<span class="text-brand-700">${secondHalf}</span>`;
      }

      // 3. Render Header Suffix
      const suffixContainer = document.getElementById('system-suffix-container');
      if (suffixContainer) {
        suffixContainer.textContent = SYSTEM_CONFIG.suffix;
      }

      // 4. Render Footer Brand Name
      const footerName = document.getElementById('system-footer-name');
      if (footerName) {
        const name = SYSTEM_CONFIG.name;
        const splitIndex = Math.ceil(name.length / 2);
        const firstHalf = name.substring(0, splitIndex);
        const secondHalf = name.substring(splitIndex);
        footerName.innerHTML = `${firstHalf}<span class="text-brand-500">${secondHalf}</span>`;
      }

      // 5. Render Footer Copyright Name
      const footerCopy = document.getElementById('system-footer-copy');
      if (footerCopy) {
        footerCopy.innerHTML = `&copy; 2026 ${SYSTEM_CONFIG.name}. Designed for Tanzanian Schools & Colleges.`;
      }

      // 6. Update Lucide icons to compile any newly inserted logo icon
      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    const DEFAULT_BOT_CONFIG = {
      name: "ElimuBot AI Assistant",
      status: "online", // 'online' or 'offline'
      welcomeEn: "Hello! 👋 Welcome to Elimu Express Assistant. I can help you with school admissions, joining instructions, documents required, and pricing plans. How can I help you today?",
      welcomeSw: "Habari! 👋 Karibu kwenye Msaidizi wa Elimu Express. Naweza kukusaidia kuhusu usajili wa shule, maelekezo ya kujiunga (joining instructions), mahitaji ya nyaraka, na gharama za mfumo. Nikusaidie nini leo?",
      supportPhone: "255788346050"
    };

    const DEFAULT_BOT_KB = [
      {
        id: "kb-1",
        topic: "Admissions & Forms",
        keywords: "apply, application, omba fomu, registration, kujiunga, jinsi ya kujiunga, register, form, fomu ya kujiunga, fomu, jinsi ya kujaza",
        answer: "To apply to any school or college:\n1. Open 'School Forms' in the top menu.\n2. Click on your desired school.\n3. Click 'Apply / Fill Admission Form'.\n4. Complete the student & parent particulars, sign with your finger/mouse, and click 'Submit via WhatsApp' or 'Download PDF'."
      },
      {
        id: "kb-2",
        topic: "Joining Instructions",
        keywords: "joining, joining instruction, joining instructions, maelekezo, maelekezo ya kujiunga, barua ya kujiunga, download joining, pakua maelekezo",
        answer: "Official school joining instructions are available for all listed schools! Simply browse to 'School Forms', click the school, and select 'Download Joining Instructions (PDF)'. School managers can also edit these instructions directly inside the Admin CMS."
      },
      {
        id: "kb-3",
        topic: "Fees & Pricing",
        keywords: "pricing, price, package, packages, gharama, bei, vifurushi, subscription, kulipia, lipa, cost",
        answer: "Elimu Express offers tailored packages for educational institutions:\n• Starter Plan: Essential digital admissions & forms.\n• Professional Plan: Adds joining instructions builder, WhatsApp routing & custom PDF badges.\n• Enterprise Plan: Custom institutional domain, analytics & dedicated support.\nVisit the 'Pricing' tab for full plan details!"
      },
      {
        id: "kb-4",
        topic: "Requirements",
        keywords: "requirements, mahitaji, nyaraka, document, documents, nida, rita, cheti cha kuzaliwa, necta, passport, picha za pasipoti",
        answer: "Standard admission attachments required by Tanzanian institutions include:\n• RITA Birth Certificate (Cheti cha Kuzaliwa)\n• Applicant & Parent/Guardian NIDA numbers\n• 4 Passport-sized Photographs\n• NECTA Examination Result Slips or Primary Leaving Certificate\n• Medical examination and fitness report."
      },
      {
        id: "kb-5",
        topic: "Education Levels & Schools",
        keywords: "levels, ngazi, primary, secondary, kindergarten, veta, vyuo, colleges, shule za msingi, sekondari, awali, daycare",
        answer: "We support the full Tanzanian education spectrum:\n• Kindergarten & Daycare (Awali)\n• Primary Schools (Std 1–7)\n• Secondary Schools (Form 1–6)\n• Vocational & Colleges (VETA & NACTVET accredited colleges)."
      },
      {
        id: "kb-6",
        topic: "Support & Contact",
        keywords: "support, contact, mawasiliano, msaada, phone, simu, email, whatsapp, ongea na mtu, help desk, help",
        answer: "Need direct human support? Contact our Admissions Helpdesk:\n📞 WhatsApp & Call: +255 788 346 050\n✉️ Email: support@elimu-express.co.tz\nYou can also submit a ticket through the 'Contacts' page!"
      },
      {
        id: "kb-7",
        topic: "General Info",
        keywords: "hello, hi, habari, mambo, vipi, greeting, hey, salamu, good morning, good afternoon",
        answer: "Hello! 👋 I am ElimuBot, your AI Assistant for Tanzanian school admissions and digital registration. Feel free to ask me anything or tap one of the suggested topics below!"
      },
      {
        id: "kb-8",
        topic: "Admissions & Forms",
        keywords: "add school, ongeza shule, sajili shule, list school, admin, cms, weka shule",
        answer: "To list or register a new school:\n1. Click 'Admin' or 'Login' on the menu.\n2. Log in with your admin credentials.\n3. Under 'Manage Institutions', click 'Add New Institution'.\n4. Fill in school details, contact numbers, admission fees, and joining instructions, then click 'Save Institution'!"
      }
    ];

    const DEFAULT_PUBLIC_CONTENTS = {
      homeHeroBadge: "Usajili wa Shule Dijitali Tanzania",
      homeHeroTitle: "Direct Digital Admissions for Tanzanian Institutions",
      homeHeroSubtitle: "Find admission forms for Kindergartens, Primary schools, Secondary schools, and Private Vocational Colleges across Tanzania. Generate verified registration details and dispatch straight to school administration via WhatsApp & Email.",
      homeCategoriesTitle: "Institutions by Education Level",
      homeCategoriesSubtitle: "Select a level to view registered Tanzanian schools and generate registration forms.",
      aboutTitle: "We Help You Join Schools Faster & Stress-Free",
      aboutText: "Elimu Express was built to solve a simple problem: school registration is too slow and stressful. We help parents fill out school admission forms directly from their phones or computers, download them as clean PDFs, and submit them instantly to the school via WhatsApp or Email. No paperwork, no physical queueing, no waste of time.",
      contactTitle: "We Are Here to Help You",
      contactText: "Have questions about school registrations, pricing plans, or need help listing your school? Send us a message below and our team will get back to you quickly.",
      contactPhone: "+255 788 346 050",
      contactEmail: "support@elimu-express.co.tz",
      contactAddress: "Kigamboni & Posta Hub"
    };

    const defaultInstitutions = [];

    const defaultPricingPackages = [
      {
        id: "pkg-1",
        name: "Basic Admissions",
        price: "TZS 50,000",
        cycle: "per term",
        popular: false,
        features: ["1 School Admission Form", "Standard Tanzania Fields", "Direct WhatsApp Routing", "Basic PDF Generation", "Email Notifications"]
      },
      {
        id: "pkg-2",
        name: "Bilingual Premium",
        price: "TZS 120,000",
        cycle: "per year",
        popular: true,
        features: ["Custom Logo & Brand Colors", "Bilingual Form (EN/SW)", "Custom Joining Instructions", "Combined PDF Compiler", "Direct Link Sharing", "Cloudflare KV Sync"]
      },
      {
        id: "pkg-3",
        name: "Enterprise SaaS",
        price: "TZS 350,000",
        cycle: "per year",
        popular: false,
        features: [
          "Unlimited Admission Forms",
          "Multiple School Branches",
          "Custom Domain Support",
          "Advanced Analytics Panel",
          "Priority WhatsApp Desk",
          "SMS Portal API Integration",
          "Everything from all the Packages",
          "1 year Free support",
          "3 Times Customization"
        ]
      }
    ];

    // Global database state
    let siteState = {
      schools: [],
      pricing: [],
      publicContents: {},
      customContents: [],
      botConfig: {},
      botKnowledge: []
    };

    let institutions = [];
    let pricingPackages = [];
    let publicContents = {};
    let customContentSections = [];
    let botConfig = { ...DEFAULT_BOT_CONFIG };
    let botKnowledge = [...DEFAULT_BOT_KB];
    let chatHistory = [];
    let isChatbotOpen = false;
    let dbConnectionMode = 'local_storage'; // 'cloudflare_kv' or 'local_storage'

    // Load credentials from sessionStorage
    let adminToken = sessionStorage.getItem('elimu_admin_token') || null;

    async function loadSiteData() {
      try {
        const response = await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/content', { cache: 'no-store' });
        if (response.ok) {
          const res = await response.json();
          dbConnectionMode = (res.dbMode === 'cloudflare_kv' || res.isDbBound) ? 'cloudflare_kv' : 'local_storage';
          updateDbConnectionBadge();

          if (dbConnectionMode === 'cloudflare_kv') {
            if (res.schools || res.pricing || res.publicContents || res.customContents || res.botConfig || res.botKnowledge) {
              siteState.schools = (res.schools && res.schools.length > 0) ? res.schools : [...defaultInstitutions];
              siteState.pricing = (res.pricing && res.pricing.length > 0) ? res.pricing : [...defaultPricingPackages];
              siteState.publicContents = res.publicContents || { ...DEFAULT_PUBLIC_CONTENTS };
              siteState.customContents = res.customContents || [];
              siteState.botConfig = res.botConfig || { ...DEFAULT_BOT_CONFIG };
              siteState.botKnowledge = (res.botKnowledge && res.botKnowledge.length > 0) ? res.botKnowledge : [...DEFAULT_BOT_KB];
            } else {
              // Initialize database on first run
              loadStateDefaults();
              if (adminToken) {
                await saveSiteStateSilent();
              }
            }
            applySiteState();
            return;
          }
        }
      } catch (err) {
        console.warn("Backend API not reachable. Running in local storage fallback mode.", err);
      }

      // Local storage fallback
      dbConnectionMode = 'local_storage';
      updateDbConnectionBadge();
      const stored = localStorage.getItem('elimu_site_state_prod');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          siteState.schools = parsed.schools || [...defaultInstitutions];
          siteState.pricing = parsed.pricing || [...defaultPricingPackages];
          siteState.publicContents = parsed.publicContents || { ...DEFAULT_PUBLIC_CONTENTS };
          siteState.customContents = parsed.customContents || [];
          siteState.botConfig = parsed.botConfig || { ...DEFAULT_BOT_CONFIG };
          siteState.botKnowledge = parsed.botKnowledge || [...DEFAULT_BOT_KB];
        } catch (e) {
          loadStateDefaults();
        }
      } else {
        loadStateDefaults();
        localStorage.setItem('elimu_site_state_prod', JSON.stringify(siteState));
      }
      applySiteState();
    }

    function loadStateDefaults() {
      siteState.schools = [...defaultInstitutions];
      siteState.pricing = [...defaultPricingPackages];
      siteState.publicContents = { ...DEFAULT_PUBLIC_CONTENTS };
      siteState.customContents = [];
      siteState.botConfig = { ...DEFAULT_BOT_CONFIG };
      siteState.botKnowledge = [...DEFAULT_BOT_KB];
    }

    function applySiteState() {
      institutions = siteState.schools;
      pricingPackages = siteState.pricing;
      publicContents = siteState.publicContents;
      customContentSections = siteState.customContents;

      if (siteState.botConfig && Object.keys(siteState.botConfig).length > 0) {
        botConfig = Object.assign({}, DEFAULT_BOT_CONFIG, siteState.botConfig);
      }
      if (siteState.botKnowledge && Array.isArray(siteState.botKnowledge) && siteState.botKnowledge.length > 0) {
        botKnowledge = siteState.botKnowledge;
      }

      updateBotVisibility();
      applyPublicContents();
      renderCmsTable();
      populateCmsPackageOptions();
      renderPricingCmsTable();
      renderCustomContentBlocks();

      const targetRoute = document.documentElement.getAttribute('data-initial-route') || 'home';
      const curSection = document.querySelector('.page-section.active');
      const activePage = curSection ? curSection.id.replace('page-', '') : targetRoute;

      if (activePage === 'forms' || !hasRenderedSchools) {
        renderSchools();
        hasRenderedSchools = true;
      }
      if (activePage === 'pricing' || !hasRenderedPricing) {
        renderPricingPackages();
        hasRenderedPricing = true;
      }
      if (activeInstitution) {
        openFormForSchool(activeInstitution.id, false);
      }
    }

    async function saveSiteStateSilent() {
      localStorage.setItem('elimu_site_state_prod', JSON.stringify(siteState));
      if (dbConnectionMode === 'cloudflare_kv' && adminToken) {
        try {
          await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(siteState)
          });
        } catch (e) {
          console.error("Silent KV sync failed", e);
        }
      }
    }

    async function saveSiteState() {
      localStorage.setItem('elimu_site_state_prod', JSON.stringify(siteState));

      if (dbConnectionMode === 'cloudflare_kv' && adminToken) {
        try {
          const response = await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/content', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(siteState)
          });
          if (response.ok) {
            console.log("Global sync successful");
          } else {
            const errRes = await response.json().catch(() => ({}));
            alert("❌ Database Save Error: Failed to sync changes with Cloudflare KV. " + (errRes.error || "Please verify your KV namespace binding."));
          }
        } catch (err) {
          alert("❌ Network Error: Could not reach the Cloudflare server to save changes.");
        }
      } else if (dbConnectionMode === 'local_storage') {
        alert("⚠️ Local Storage Warning: Saved successfully, but you are in Offline Local Storage Mode. Other people will NOT see this change until you connect Cloudflare KV database!");
      }
    }

    async function saveInstitutions(data) {
      siteState.schools = data;
      applySiteState();
      await saveSiteState();
    }

    async function savePricingPackages(data) {
      siteState.pricing = data;
      applySiteState();
      await saveSiteState();
    }

    function populateCmsPackageOptions() {
      const select = document.getElementById('cms-package');
      if (!select) return;
      select.innerHTML = '';
      pricingPackages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.id;
        option.textContent = `${pkg.name} (${pkg.price}/${pkg.cycle})`;
        select.appendChild(option);
      });
    }

    function updateDbConnectionBadge() {
      const badge = document.getElementById('db-status-badge');
      const warningEl = document.getElementById('cms-local-mode-warning');
      if (!badge) return;
      if (dbConnectionMode === 'cloudflare_kv') {
        badge.className = "px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1";
        badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> Cloudflare KV Connected`;
        if (warningEl) warningEl.classList.add('hidden');
      } else {
        badge.className = "px-2 py-0.5 text-[10px] font-bold rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1";
        badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span> Local Storage Mode`;
        if (warningEl) warningEl.classList.remove('hidden');
      }
    }

    let currentCategory = 'all';
    let hasRenderedSchools = false;
    let hasRenderedPricing = false;

    // --- 2. Navigation Routing ---
    function navigateTo(pageId, updateHistory = true) {
      const targetSection = document.getElementById(`page-${pageId}`);
      if (!targetSection) {
        console.warn("Target section not found: page-" + pageId);
        return;
      }

      // Hide all other sections and show target smoothly
      document.querySelectorAll('.page-section').forEach(sec => {
        if (sec !== targetSection) {
          sec.classList.remove('active');
          sec.style.display = 'none';
        }
      });
      targetSection.classList.add('active');
      targetSection.style.display = 'block';

      // Scroll immediately to top to avoid visual lag
      window.scrollTo(0, 0);

      // Update URL hash quietly
      if (updateHistory) {
        try {
          const newHash = pageId === 'home' ? '#/' : '#/' + pageId;
          if (window.location.hash !== newHash) {
            window.location.hash = newHash;
          }
        } catch (e) {
          try {
            history.pushState(null, '', pageId === 'home' ? '#/' : '#/' + pageId);
          } catch (err) {}
        }
      }

      // Smoothly update nav buttons
      document.querySelectorAll('.nav-btn, .mobile-nav-btn').forEach(btn => {
        const isCurrent = btn.getAttribute('data-page') === pageId;
        if (btn.classList.contains('mobile-nav-btn')) {
          btn.className = isCurrent 
            ? 'mobile-nav-btn w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold text-brand-700 bg-brand-50'
            : 'mobile-nav-btn w-full text-left px-4 py-2.5 rounded-lg text-base font-semibold text-slate-600 hover:bg-slate-100';
        } else {
          if (btn.getAttribute('data-page') === 'cms') {
            btn.className = isCurrent 
              ? 'nav-btn px-3 py-2 rounded-lg text-sm font-semibold text-amber-900 bg-amber-200 flex items-center gap-1.5'
              : 'nav-btn px-3 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center gap-1.5';
          } else {
            btn.className = isCurrent 
              ? 'nav-btn px-4 py-2 rounded-lg text-sm font-semibold text-brand-700 bg-brand-50'
              : 'nav-btn px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100';
          }
        }
      });

      const mobileMenu = document.getElementById('mobile-menu');
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
      }

      // Smart DOM cache: avoid tearing down and rebuilding DOM if already populated
      if (pageId === 'forms') {
        const dir = document.getElementById('schools-directory');
        if (!hasRenderedSchools || !dir || dir.children.length === 0) {
          renderSchools();
          hasRenderedSchools = true;
        }
      }
      if (pageId === 'pricing') {
        const grid = document.getElementById('pricing-packages-grid');
        if (!hasRenderedPricing || !grid || grid.children.length === 0) {
          renderPricingPackages();
          hasRenderedPricing = true;
        }
      }
      if (pageId === 'cms') checkCmsAuth();
      if (window.lucide) window.lucide.createIcons();
    }
    window.navigateTo = navigateTo;

    function openCategoryTab(category) {
      navigateTo('forms');
      setCategoryFilter(category);
    }

    // --- 3. Directory Rendering & Live Search ---
    function setCategoryFilter(cat) {
      currentCategory = cat;
      document.querySelectorAll('.category-filter-btn').forEach(btn => {
        if (btn.getAttribute('data-category') === cat) {
          btn.className = 'category-filter-btn px-4 py-2 text-xs font-bold rounded-xl bg-brand-700 text-white transition';
        } else {
          btn.className = 'category-filter-btn px-4 py-2 text-xs font-bold rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition';
        }
      });
      filterSchools();
    }

    function filterSchools() {
      const query = document.getElementById('school-search-input').value.toLowerCase();
      const filtered = institutions.filter(inst => {
        const matchesCat = (currentCategory === 'all' || inst.category === currentCategory);
        const matchesQuery = inst.name.toLowerCase().includes(query) || inst.region.toLowerCase().includes(query);
        return matchesCat && matchesQuery;
      });
      renderSchoolsList(filtered);
    }

    function renderSchools() {
      filterSchools();
    }

    function renderSchoolsList(list) {
      const container = document.getElementById('schools-directory');
      const noResults = document.getElementById('no-schools-msg');
      container.innerHTML = '';

      if (list.length === 0) {
        noResults.classList.remove('hidden');
        return;
      } else {
        noResults.classList.add('hidden');
      }

      list.forEach(inst => {
        const initials = inst.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        const card = document.createElement('div');
        card.className = 'bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-brand-600 hover:shadow-md transition overflow-hidden flex flex-col justify-between';
        
        const fallbackImg = "assets/media_1787912951430.jpg";
        const imgUrl = inst.image && inst.image.trim() !== '' ? inst.image : fallbackImg;

        // Check service status
        const isExpired = inst.serviceExpiry && new Date(inst.serviceExpiry) < new Date();
        const isSuspended = inst.serviceStatus === 'suspended' || inst.serviceStatus === 'expired' || isExpired;
        let statusBadgeHtml = '';
        let btnHtml = '';

        if (isSuspended) {
          const label = isExpired ? 'Expired' : 'Suspended';
          statusBadgeHtml = `<span class="absolute top-3 right-3 bg-rose-600 text-white text-[9px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider">${label}</span>`;
          btnHtml = `
            <button disabled class="w-full py-2.5 bg-slate-100 text-slate-400 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 border border-slate-200 cursor-not-allowed">
              <i data-lucide="lock" class="w-3.5 h-3.5"></i> Registration Closed
            </button>
          `;
        } else {
          btnHtml = `
            <button onclick="openFormForSchool('${inst.id}')" class="w-full py-2.5 bg-brand-50 hover:bg-brand-700 text-brand-700 hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 border border-brand-200 hover:border-transparent">
              <i data-lucide="file-edit" class="w-3.5 h-3.5"></i> Fill Admission Form
            </button>
          `;
        }

        card.innerHTML = `
          <div>
            <div class="h-36 overflow-hidden relative">
              <img src="${imgUrl}" alt="${inst.name}" class="w-full h-full object-cover" />
              <span class="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">${inst.categoryLabel}</span>
              ${statusBadgeHtml}
            </div>
            <div class="p-5">
              <div class="flex items-center space-x-2 mb-2">
                <div class="w-7 h-7 rounded-lg bg-brand-100 text-brand-800 font-extrabold flex items-center justify-center text-xs shrink-0">
                  ${initials}
                </div>
                <h4 class="font-bold text-slate-900 text-sm leading-tight line-clamp-1">${inst.name}</h4>
              </div>
              <p class="text-xs text-slate-500 mb-2 flex items-center gap-1">
                <i data-lucide="map-pin" class="w-3.5 h-3.5 text-slate-400"></i> ${inst.region}
              </p>
              <p class="text-xs text-slate-600 line-clamp-2">${inst.desc || 'Direct online admission registration.'}</p>
            </div>
          </div>
          <div class="px-5 pb-5">
            ${btnHtml}
          </div>
        `;
        container.appendChild(card);
      });
      lucide.createIcons();
    }

    // --- 4. Form Loader & Dispatch Engine ---
    let activeInstitution = null;
    let formLanguage = 'en'; // default form language

    function openFormForSchool(schoolId, updateHistory = true) {
      const inst = institutions.find(i => i.id === schoolId || (i.slug && i.slug === schoolId));
      if (!inst) return;

      activeInstitution = inst;

      if (updateHistory) {
        try {
          const newHash = '#/forms/' + (inst.slug || inst.id);
          if (window.location.hash !== newHash) {
            history.pushState(null, '', newHash);
          }
        } catch (e) {
          console.warn("hash routing failed:", e);
        }
      }

      // Setup Letterhead Banner (only on pkg-3)
      const letterheadCont = document.getElementById('form-school-letterhead-container');
      const letterheadImg = document.getElementById('form-school-letterhead-img');
      if (inst.letterhead && inst.letterhead.trim() !== '' && hasFeature('Custom Domain Support')) {
        letterheadCont.classList.remove('hidden');
        letterheadImg.src = inst.letterhead;
      } else {
        letterheadCont.classList.add('hidden');
        letterheadImg.src = '';
      }

      // Check service status & expiry (Tanzania SaaS criteria)
      const isExpired = inst.serviceExpiry && new Date(inst.serviceExpiry) < new Date();
      const isSuspended = inst.serviceStatus === 'suspended' || inst.serviceStatus === 'expired' || isExpired;

      const tabHeaders = document.getElementById('form-tab-headers');
      const formView = document.getElementById('form-tab-view');
      const joiningView = document.getElementById('joining-tab-view');
      const blockedView = document.getElementById('service-blocked-view');

      if (isSuspended) {
        tabHeaders.classList.add('hidden');
        formView.classList.add('hidden');
        joiningView.classList.add('hidden');
        blockedView.classList.remove('hidden');
      } else {
        tabHeaders.classList.remove('hidden');
        formView.classList.remove('hidden');
        joiningView.classList.add('hidden');
        blockedView.classList.add('hidden');
      }
      
      // Setup Custom Logo (only on pkg-2 and pkg-3)
      const logoText = document.getElementById('form-school-logo-text');
      const logoImg = document.getElementById('form-school-logo-img');
      if (inst.logo && inst.logo.trim() !== '' && hasFeature('Custom Logo & Brand Colors')) {
        logoText.classList.add('hidden');
        logoImg.src = inst.logo;
        logoImg.classList.remove('hidden');
      } else {
        const initials = inst.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
        logoText.textContent = initials;
        logoText.classList.remove('hidden');
        logoImg.classList.add('hidden');
      }

      // Load school texts
      document.getElementById('form-school-name').textContent = inst.name;
      document.getElementById('form-school-category').textContent = inst.categoryLabel.toUpperCase();
      document.getElementById('form-school-location').textContent = `${inst.region} • TZ Standards`;
      document.getElementById('target-phone').value = inst.phone;
      document.getElementById('target-email').value = inst.email;

      // Set customizable joining instructions text
      document.getElementById('form-joining-text-content').innerHTML = inst.joining ? inst.joining.replace(/\n/g, '<br/>') : "No joining instructions registered for this school.";

      // Populate Applying Levels/Classes select options dropdown dynamically
      const classSelect = document.getElementById('form-class');
      const classContainer = document.getElementById('form-class-container');
      
      if (inst.category === 'vocational') {
        if (classContainer) classContainer.classList.add('hidden');
        if (classSelect) {
          classSelect.innerHTML = '';
          const opt = document.createElement('option');
          opt.value = 'N/A';
          opt.textContent = 'N/A';
          classSelect.appendChild(opt);
        }
        
        // Populate the vocational Award Levels dropdown instead
        const awardSelect = document.getElementById('form-voc-award');
        if (awardSelect) {
          awardSelect.innerHTML = '';
          let levelString = inst.levels || '';
          if (!levelString.trim()) {
            levelString = "Level 1, Level 2, Level 3, NTA Level 4, NTA Level 5, NTA Level 6";
          }
          const levelArray = levelString.split(',')
            .map(l => l.trim())
            .filter(l => l.length > 0);
            
          levelArray.forEach(lvl => {
            const opt = document.createElement('option');
            opt.value = lvl;
            opt.textContent = lvl;
            awardSelect.appendChild(opt);
          });
        }
      } else {
        if (classContainer) classContainer.classList.remove('hidden');
        if (classSelect) {
          classSelect.innerHTML = '';
          let levelString = inst.levels || '';
          if (!levelString.trim()) {
            if (inst.category === 'kindergarten') {
              levelString = "Baby Class 1, Baby Class 2, Baby Class 3";
            } else if (inst.category === 'primary') {
              levelString = "Kindergarten, Std 1, Std 2, Std 3, Std 4, Std 5, Std 6, Std 7";
            } else if (inst.category === 'secondary') {
              levelString = "Pre-Form 1, Form 1, Form 2, Form 3, Form 4, Form 5, Form 6";
            }
          }
          const levelArray = levelString.split(',')
            .map(l => l.trim())
            .filter(l => l.length > 0);
            
          levelArray.forEach(lvl => {
            const opt = document.createElement('option');
            opt.value = lvl;
            opt.textContent = lvl;
            classSelect.appendChild(opt);
          });
        }
      }

      // Show level specific fields (Tanzania Admissions Standards)
      document.getElementById('fields-kindergarten').classList.add('hidden');
      document.getElementById('fields-primary').classList.add('hidden');
      document.getElementById('fields-secondary').classList.add('hidden');
      document.getElementById('fields-vocational').classList.add('hidden');

      const levelFieldsContainer = document.getElementById(`fields-${inst.category}`);
      if (levelFieldsContainer) {
        levelFieldsContainer.classList.remove('hidden');
      }

      // Populate vocational programs select options dropdown
      if (inst.category === 'vocational') {
        const programSelect = document.getElementById('form-voc-program');
        if (programSelect) {
          programSelect.innerHTML = '';
          const progString = inst.programs || '';
          const progArray = progString.split(',')
            .map(p => p.trim())
            .filter(p => p.length > 0);
          
          if (progArray.length === 0) {
            const defaults = [
              "Certificate in Information Technology (IT)",
              "Diploma in Business Administration",
              "Certificate in Journalism",
              "Diploma in Hotel Management",
              "Short Course in Computer Applications"
            ];
            defaults.forEach(d => {
              const opt = document.createElement('option');
              opt.value = d;
              opt.textContent = d;
              programSelect.appendChild(opt);
            });
          } else {
            progArray.forEach(p => {
              const opt = document.createElement('option');
              opt.value = p;
              opt.textContent = p;
              programSelect.appendChild(opt);
            });
          }
        }
      }

      // Reset form controls and apply custom branding colors based on package
      const wrapper = document.getElementById('active-form-wrapper');
      const primaryColor = hasFeature('Custom Logo & Brand Colors') ? (inst.primaryColor || '#059669') : '#059669';
      const secondaryColor = hasFeature('Custom Logo & Brand Colors') ? (inst.secondaryColor || '#10b981') : '#10b981';

      wrapper.style.borderColor = primaryColor;
      document.getElementById('form-school-header').style.backgroundColor = primaryColor;
      document.getElementById('form-school-category').style.backgroundColor = secondaryColor;

      // Apply button background colors dynamically
      const submitWaBtn = document.getElementById('form-submit-whatsapp-btn');
      if (submitWaBtn) submitWaBtn.style.backgroundColor = primaryColor;

      // Setup language switcher (only on pkg-2 and pkg-3)
      const langSwitcher = document.getElementById('form-language-switcher');
      if (langSwitcher) {
        if (!hasFeature('Bilingual Form (EN/SW)')) {
          langSwitcher.classList.add('hidden');
        } else {
          langSwitcher.classList.remove('hidden');
        }
      }

      // Setup Combined PDF button (only on pkg-2 and pkg-3)
      const combinedBtn = document.getElementById('btn-pdf-combined');
      if (combinedBtn) {
        if (!hasFeature('Combined PDF Compiler')) {
          combinedBtn.classList.add('hidden');
        } else {
          combinedBtn.classList.remove('hidden');
        }
      }

      // Setup Passport Photograph field (always active for Tanzanian admission requirements)
      const passportPreviewCont = document.getElementById('form-passport-preview-container');
      const passportUploadCont = document.getElementById('form-passport-upload-container');
      if (passportPreviewCont && passportUploadCont) {
        passportPreviewCont.classList.remove('hidden');
        passportUploadCont.classList.remove('hidden');
      }

      // Reset Form fields
      document.getElementById('institution-admission-form').reset();
      
      // Reset Passport photo preview and data
      passportPhotoBase64 = null;
      const passportPreview = document.getElementById('form-passport-preview');
      const passportPlaceholder = document.getElementById('form-passport-placeholder');
      if (passportPreview && passportPlaceholder) {
        passportPreview.src = '';
        passportPreview.classList.add('hidden');
        passportPlaceholder.classList.remove('hidden');
      }
      const passportErr = document.getElementById('passport-upload-error');
      if (passportErr) passportErr.classList.add('hidden');

      // Configure dynamic signature pads layout based on category
      const label1 = document.getElementById('form-signature-label-1');
      const boxParent = document.getElementById('form-signature-box-parent');
      const instructions = document.getElementById('form-signature-instructions');
      
      if (inst.category === 'vocational') {
        if (label1) {
          label1.setAttribute('data-en', "Applicant / Student Digital Signature (Draw below) *");
          label1.setAttribute('data-sw', "Sahihi ya Kidijitali ya Mwombaji / Mwanafunzi (Chora chini) *");
          label1.textContent = "Applicant / Student Digital Signature (Draw below) *";
        }
        if (boxParent) boxParent.classList.remove('hidden');
        if (instructions) instructions.classList.add('hidden');
      } else {
        if (label1) {
          label1.setAttribute('data-en', "Parent / Guardian Digital Signature (Draw below) *");
          label1.setAttribute('data-sw', "Sahihi ya Kidijitali ya Mzazi / Mlezi (Chora chini) *");
          label1.textContent = "Parent / Guardian Digital Signature (Draw below) *";
        }
        if (boxParent) boxParent.classList.add('hidden');
        if (instructions) instructions.classList.remove('hidden');
      }

      // Show and scroll to form wrapper first to compute non-zero canvas dimensions
      wrapper.classList.remove('hidden');
      wrapper.scrollIntoView({ behavior: 'smooth' });

      // Load saved draft if it exists
      loadFormDraft(inst.id);

      // Initialize drawing signature pads with delay to guarantee layout calculations
      setTimeout(() => {
        initSignaturePad();
        if (inst.category === 'vocational') {
          initSignaturePadParent();
        }
      }, 50);
      
      // Load saved form tab or default to 'form'
      const params = new URLSearchParams(window.location.search);
      const savedTab = params.get('tab');
      if (savedTab === 'joining' || savedTab === 'form') {
        switchFormTab(savedTab);
      } else {
        switchFormTab('form');
      }

      // Update Language Switcher UI for default (EN)
      toggleFormLanguage('en');
    }

    function closeFormGenerator() {
      document.getElementById('active-form-wrapper').classList.add('hidden');
      const url = new URL(window.location);
      url.searchParams.delete('tab');
      url.hash = '#/forms';
      window.history.pushState({}, '', url);
    }

    function switchFormTab(tab) {
      const url = new URL(window.location);
      url.searchParams.set('tab', tab);
      window.history.replaceState({}, '', url);

      const pCol = activeInstitution ? (activeInstitution.primaryColor || '#059669') : '#059669';
      const tabForm = document.getElementById('tab-btn-form');
      const tabJoining = document.getElementById('tab-btn-joining');
      const viewForm = document.getElementById('form-tab-view');
      const viewJoining = document.getElementById('joining-tab-view');

      if (tab === 'form') {
        viewForm.classList.remove('hidden');
        viewJoining.classList.add('hidden');

        tabForm.className = "py-3 px-4 text-xs font-bold border-b-2 text-slate-800 transition flex items-center gap-1.5 focus:outline-none";
        tabForm.style.borderColor = pCol;
        tabForm.style.color = pCol;

        tabJoining.className = "py-3 px-4 text-xs font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 focus:outline-none";
        tabJoining.style.borderColor = "transparent";
        tabJoining.style.color = "";
      } else {
        viewForm.classList.add('hidden');
        viewJoining.classList.remove('hidden');

        tabJoining.className = "py-3 px-4 text-xs font-bold border-b-2 text-slate-800 transition flex items-center gap-1.5 focus:outline-none";
        tabJoining.style.borderColor = pCol;
        tabJoining.style.color = pCol;

        tabForm.className = "py-3 px-4 text-xs font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 focus:outline-none";
        tabForm.style.borderColor = "transparent";
        tabForm.style.color = "";
      }
    }

    function toggleFormLanguage(lang) {
      formLanguage = lang;
      
      // Update toggle buttons UI
      const enBtn = document.getElementById('lang-btn-en');
      const swBtn = document.getElementById('lang-btn-sw');
      if (lang === 'en') {
        enBtn.className = "px-2.5 py-1 rounded-md font-bold bg-white text-slate-800 transition";
        swBtn.className = "px-2.5 py-1 rounded-md font-bold text-white hover:bg-white/10 transition";
      } else {
        swBtn.className = "px-2.5 py-1 rounded-md font-bold bg-white text-slate-800 transition";
        enBtn.className = "px-2.5 py-1 rounded-md font-bold text-white hover:bg-white/10 transition";
      }

      // Translate all labels and static texts in form wrapper
      document.querySelectorAll('#active-form-wrapper .lang-txt').forEach(el => {
        const val = el.getAttribute(`data-${lang}`);
        if (val) el.textContent = val;
      });

      // Translate inputs placeholders
      document.querySelectorAll('#active-form-wrapper input[data-placeholder-en]').forEach(el => {
        const val = el.getAttribute(`data-placeholder-${lang}`);
        if (val) el.placeholder = val;
      });
    }

    let passportPhotoBase64 = null;
    function handlePassportUpload(e) {
      const file = e.target.files[0];
      const errEl = document.getElementById('passport-upload-error');
      if (errEl) errEl.classList.add('hidden');
      
      if (!file) return;
      if (file.size > 1024 * 1024) { // 1MB Limit
        if (errEl) {
          errEl.textContent = formLanguage === 'sw' ? "Picha isizidi MB 1." : "Image size must be under 1MB.";
          errEl.classList.remove('hidden');
        }
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = function(evt) {
        passportPhotoBase64 = evt.target.result;
        const preview = document.getElementById('form-passport-preview');
        const placeholder = document.getElementById('form-passport-placeholder');
        if (preview && placeholder) {
          preview.src = passportPhotoBase64;
          preview.classList.remove('hidden');
          placeholder.classList.add('hidden');
        }
        saveFormDraft();
      };
      reader.readAsDataURL(file);
    }

    // --- Interactive Digital Signature Pad ---
    let signaturePad = null;
    let signatureCtx = null;
    let isDrawing = false;
    let signatureBase64 = null;

    function initSignaturePad() {
      const canvas = document.getElementById('signature-pad');
      if (!canvas) return;

      signaturePad = canvas;
      signatureCtx = canvas.getContext('2d');

      // Adjust resolution for retina displays
      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        signatureCtx.scale(2, 2);
      }

      signatureCtx.strokeStyle = "#0f172a"; // Slate-900 stroke color
      signatureCtx.lineWidth = 2.5;
      signatureCtx.lineCap = "round";
      signatureCtx.lineJoin = "round";

      // Prevent listener aggregation on window/canvas
      canvas.removeEventListener('mousedown', startDraw);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('touchstart', startDraw);
      canvas.removeEventListener('touchmove', draw);

      function getPos(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const r = canvas.getBoundingClientRect();
        return {
          x: clientX - r.left,
          y: clientY - r.top
        };
      }

      function startDraw(e) {
        isDrawing = true;
        const pos = getPos(e);
        signatureCtx.beginPath();
        signatureCtx.moveTo(pos.x, pos.y);
        // Prevent scrolling while drawing on touch screens
        if (e.touches) e.preventDefault();
      }

      function draw(e) {
        if (!isDrawing) return;
        const pos = getPos(e);
        signatureCtx.lineTo(pos.x, pos.y);
        signatureCtx.stroke();
        if (e.touches) e.preventDefault();
      }

      function endDraw() {
        if (isDrawing) {
          isDrawing = false;
          // Check if user drew anything, else set signature to null
          if (isCanvasBlank()) {
            signatureBase64 = null;
          } else {
            signatureBase64 = signaturePad.toDataURL('image/png');
          }
          saveFormDraft();
        }
      }

      // Mouse Events
      canvas.addEventListener('mousedown', startDraw);
      canvas.addEventListener('mousemove', draw);
      window.removeEventListener('mouseup', endDraw);
      window.addEventListener('mouseup', endDraw);

      // Touch Events
      canvas.addEventListener('touchstart', startDraw, { passive: false });
      canvas.addEventListener('touchmove', draw, { passive: false });
      window.removeEventListener('touchend', endDraw);
      window.addEventListener('touchend', endDraw);
    }

    function toggleCmsAdvancedFields(forceState) {
      const content = document.getElementById('cms-advanced-fields-content');
      const toggleText = document.getElementById('cms-adv-toggle-text');
      const toggleIcon = document.getElementById('cms-adv-toggle-icon');
      if (!content) return;
      
      const isCurrentlyHidden = content.classList.contains('hidden');
      const shouldShow = typeof forceState === 'boolean' ? forceState : isCurrentlyHidden;
      
      if (shouldShow) {
        content.classList.remove('hidden');
        if (toggleText) toggleText.textContent = "Hide Fields";
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-up');
      } else {
        content.classList.add('hidden');
        if (toggleText) toggleText.textContent = "Show Fields";
        if (toggleIcon) toggleIcon.setAttribute('data-lucide', 'chevron-down');
      }
      lucide.createIcons();
    }

    function execJoiningFormat(cmd, value = null) {
      const editor = document.getElementById('cms-joining-editor');
      if (!editor) return;
      editor.focus();

      if (cmd === 'heading') {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          const selectedText = range.toString() || 'Section Heading';
          const headingNode = document.createElement('h3');
          headingNode.style.fontWeight = 'bold';
          headingNode.style.fontSize = '12px';
          headingNode.style.color = '#047857';
          headingNode.style.marginTop = '8px';
          headingNode.style.marginBottom = '4px';
          headingNode.textContent = selectedText;
          range.deleteContents();
          range.insertNode(headingNode);
          
          range.setStartAfter(headingNode);
          range.setEndAfter(headingNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      } else {
        document.execCommand(cmd, false, value);
      }
      
      const hidden = document.getElementById('cms-joining');
      if (hidden) hidden.value = editor.innerHTML;
    }

    function handleCmsCategoryChange() {
      const category = document.getElementById('cms-category').value;
      const levelsField = document.getElementById('cms-levels');
      const programsField = document.getElementById('cms-programs');
      if (!levelsField || !programsField) return;
      
      if (category === 'kindergarten') {
        levelsField.value = "Baby Class 1, Baby Class 2, Baby Class 3";
        programsField.value = "";
      } else if (category === 'primary') {
        levelsField.value = "Kindergarten, Std 1, Std 2, Std 3, Std 4, Std 5, Std 6, Std 7";
        programsField.value = "";
      } else if (category === 'secondary') {
        levelsField.value = "Pre-Form 1, Form 1, Form 2, Form 3, Form 4, Form 5, Form 6";
        programsField.value = "";
      } else if (category === 'vocational') {
        levelsField.value = "Level 1, Level 2, Level 3, NTA Level 4, NTA Level 5, NTA Level 6";
        programsField.value = "Certificate in Information Technology, Diploma in Information Technology, Certificate in Business Administration";
        toggleCmsAdvancedFields(true);
      }
    }

    function clearSignaturePad() {
      if (!signaturePad || !signatureCtx) return;
      signatureCtx.clearRect(0, 0, signaturePad.width, signaturePad.height);
      signatureBase64 = null;
      saveFormDraft();
    }

    function restoreSignaturePad(base64) {
      const canvas = document.getElementById('signature-pad');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore(); // Restore scale
      };
      img.src = base64;
    }

    // --- Parent/Guardian/Sponsor Signature Pad Helpers ---
    let signaturePadParent = null;
    let signatureCtxParent = null;
    let isDrawingParent = false;
    let signatureParentBase64 = null;

    function initSignaturePadParent() {
      const canvas = document.getElementById('signature-pad-parent');
      if (!canvas) return;

      signaturePadParent = canvas;
      signatureCtxParent = canvas.getContext('2d');

      const rect = canvas.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        canvas.width = rect.width * 2;
        canvas.height = rect.height * 2;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        
        signatureCtxParent.scale(2, 2);
      }

      signatureCtxParent.strokeStyle = "#0f172a";
      signatureCtxParent.lineWidth = 2.5;
      signatureCtxParent.lineCap = "round";
      signatureCtxParent.lineJoin = "round";

      canvas.removeEventListener('mousedown', startDrawParent);
      canvas.removeEventListener('mousemove', drawParent);
      canvas.removeEventListener('touchstart', startDrawParent);
      canvas.removeEventListener('touchmove', drawParent);

      function getPos(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const r = canvas.getBoundingClientRect();
        return {
          x: clientX - r.left,
          y: clientY - r.top
        };
      }

      function startDrawParent(e) {
        isDrawingParent = true;
        const pos = getPos(e);
        signatureCtxParent.beginPath();
        signatureCtxParent.moveTo(pos.x, pos.y);
        if (e.touches) e.preventDefault();
      }

      function drawParent(e) {
        if (!isDrawingParent) return;
        const pos = getPos(e);
        signatureCtxParent.lineTo(pos.x, pos.y);
        signatureCtxParent.stroke();
        if (e.touches) e.preventDefault();
      }

      function endDrawParent() {
        if (isDrawingParent) {
          isDrawingParent = false;
          if (isCanvasBlankParent()) {
            signatureParentBase64 = null;
          } else {
            signatureParentBase64 = signaturePadParent.toDataURL('image/png');
          }
          saveFormDraft();
        }
      }

      canvas.addEventListener('mousedown', startDrawParent);
      canvas.addEventListener('mousemove', drawParent);
      window.removeEventListener('mouseup', endDrawParent);
      window.addEventListener('mouseup', endDrawParent);

      canvas.addEventListener('touchstart', startDrawParent, { passive: false });
      canvas.addEventListener('touchmove', drawParent, { passive: false });
      window.removeEventListener('touchend', endDrawParent);
      window.addEventListener('touchend', endDrawParent);
    }

    function clearSignaturePadParent() {
      if (!signaturePadParent || !signatureCtxParent) return;
      signatureCtxParent.clearRect(0, 0, signaturePadParent.width, signaturePadParent.height);
      signatureParentBase64 = null;
      saveFormDraft();
    }

    function restoreSignaturePadParent(base64) {
      const canvas = document.getElementById('signature-pad-parent');
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        ctx.restore(); // Restore scale
      };
      img.src = base64;
    }

    function clearSignatureCanvasOnly() {
      const canvas = document.getElementById('signature-pad');
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      const canvasParent = document.getElementById('signature-pad-parent');
      if (canvasParent) {
        const ctxP = canvasParent.getContext('2d');
        ctxP.clearRect(0, 0, canvasParent.width, canvasParent.height);
      }
    }

    function isCanvasBlank() {
      if (!signaturePad) return true;
      const blank = document.createElement('canvas');
      blank.width = signaturePad.width;
      blank.height = signaturePad.height;
      return signaturePad.toDataURL() === blank.toDataURL();
    }

    function isCanvasBlankParent() {
      if (!signaturePadParent) return true;
      const blank = document.createElement('canvas');
      blank.width = signaturePadParent.width;
      blank.height = signaturePadParent.height;
      return signaturePadParent.toDataURL() === blank.toDataURL();
    }

    function getActiveFormData() {
      const first = document.getElementById('form-first').value.trim();
      const last = document.getElementById('form-last').value.trim();
      const parentName = document.getElementById('form-parent-name').value.trim();
      const parentPhone = document.getElementById('form-parent-phone').value.trim();
      const formClass = document.getElementById('form-class').value.trim();

      if (!first || !last || !parentName || !parentPhone || (!formClass && activeInstitution.category !== 'vocational')) {
        if (formLanguage === 'sw') {
          alert("Tafadhali jaza taarifa zote muhimu (Jina, Darasa/Kozi, Mzazi na Simu ya WhatsApp).");
        } else {
          alert("Please fill out all required fields (Name, Class/Program, Parent Name and WhatsApp Phone).");
        }
        return null;
      }

      if (!passportPhotoBase64) {
        if (formLanguage === 'sw') {
          alert("Tafadhali pakia picha ya pasipoti (Passport size) ya mwanafunzi.");
        } else {
          alert("Please upload the student's passport-sized photograph.");
        }
        return null;
      }

      // Level-Specific ID Validation (Tanzania Standards)
      let idNum = 'N/A';
      const universalRita = document.getElementById('form-rita-no') ? document.getElementById('form-rita-no').value.trim() : '';
      
      if (activeInstitution.category === 'kindergarten' || activeInstitution.category === 'primary') {
        idNum = universalRita || 'N/A';
      } else if (activeInstitution.category === 'secondary') {
        idNum = document.getElementById('form-sec-necta') ? document.getElementById('form-sec-necta').value.trim() : 'N/A';
      } else if (activeInstitution.category === 'vocational') {
        idNum = document.getElementById('form-voc-necta') ? document.getElementById('form-voc-necta').value.trim() : 'N/A';
        const vocPhone = document.getElementById('form-voc-phone') ? document.getElementById('form-voc-phone').value.trim() : '';
        const vocEmail = document.getElementById('form-voc-email') ? document.getElementById('form-voc-email').value.trim() : '';
        const vocProgram = document.getElementById('form-voc-program') ? document.getElementById('form-voc-program').value : '';
        if (!vocPhone || !vocEmail || !vocProgram) {
          if (formLanguage === 'sw') {
            alert("Tafadhali jaza Kozi unayoomba, Simu na Barua Pepe yako.");
          } else {
            alert("Please fill out the Program to Pursue, your Phone, and Email.");
          }
          return null;
        }
      }

      return {
        schoolName: activeInstitution.name,
        studentName: `${first} ${document.getElementById('form-middle').value.trim()} ${last}`.replace(/\s+/g, ' '),
        dob: document.getElementById('form-dob').value,
        gender: document.getElementById('form-gender').value,
        classLevel: formClass || 'N/A',
        idNum: idNum,
        ritaNo: universalRita || 'N/A',
        location: document.getElementById('form-location').value || 'N/A',
        parentLocation: document.getElementById('form-parent-location') ? document.getElementById('form-parent-location').value || 'N/A' : 'N/A',
        prevSchool: document.getElementById('form-prev-school') ? document.getElementById('form-prev-school').value.trim() || 'N/A' : 'N/A',
        prevClass: document.getElementById('form-prev-class') ? document.getElementById('form-prev-class').value.trim() || 'N/A' : 'N/A',
        prevYear: document.getElementById('form-prev-year') ? document.getElementById('form-prev-year').value.trim() || 'N/A' : 'N/A',
        parentName: parentName,
        parentPhone: parentPhone,
        parentRel: document.getElementById('form-parent-rel').value,
        parentOccupation: document.getElementById('form-parent-occupation') ? document.getElementById('form-parent-occupation').value.trim() || 'N/A' : 'N/A',
        parentNida: document.getElementById('form-parent-nida').value.trim() || 'N/A',
        healthBlood: document.getElementById('form-health-blood').value,
        healthDisability: document.getElementById('form-health-disability').value,
        healthAllergies: document.getElementById('form-health-allergies').value.trim() || 'N/A',
        kBus: document.getElementById('form-k-bus') ? document.getElementById('form-k-bus').value : 'N/A',
        kBusStation: document.getElementById('form-k-bus-station') ? document.getElementById('form-k-bus-station').value.trim() || 'N/A' : 'N/A',
        kPickup: document.getElementById('form-k-pickup') ? document.getElementById('form-k-pickup').value.trim() || 'N/A' : 'N/A',
        secBoarding: document.getElementById('form-sec-boarding') ? document.getElementById('form-sec-boarding').value : 'N/A',
        secComb: document.getElementById('form-sec-comb') ? document.getElementById('form-sec-comb').value.trim() || 'N/A' : 'N/A',
        secNecta: document.getElementById('form-sec-necta') ? document.getElementById('form-sec-necta').value.trim() || 'N/A' : 'N/A',
        vocProgram: document.getElementById('form-voc-program') ? document.getElementById('form-voc-program').value : 'N/A',
        vocPhone: document.getElementById('form-voc-phone') ? document.getElementById('form-voc-phone').value.trim() : 'N/A',
        vocEmail: document.getElementById('form-voc-email') ? document.getElementById('form-voc-email').value.trim() : 'N/A',
        vocNecta: document.getElementById('form-voc-necta') ? document.getElementById('form-voc-necta').value.trim() || 'N/A' : 'N/A',
        vocAcsee: document.getElementById('form-voc-acsee') ? document.getElementById('form-voc-acsee').value.trim() || 'N/A' : 'N/A',
        vocAward: document.getElementById('form-voc-award') ? document.getElementById('form-voc-award').value : 'N/A',
        vocMode: document.getElementById('form-voc-mode') ? document.getElementById('form-voc-mode').value : 'N/A',
        vocNida: document.getElementById('form-voc-nida') ? document.getElementById('form-voc-nida').value.trim() || 'N/A' : 'N/A',
        vocSponsor: document.getElementById('form-voc-sponsor') ? document.getElementById('form-voc-sponsor').value.trim() || 'N/A' : 'N/A'
      };
    }

    function checkImageCORS(src, callback) {
      if (!src) {
        callback(false);
        return;
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = function() {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          canvas.toDataURL(); // Throws SecurityError if tainted
          callback(true);
        } catch (e) {
          console.warn("Logo image taints canvas. Rendering fallback initials in PDF instead.", e);
          callback(false);
        }
      };
      img.onerror = function() {
        console.warn("Logo image failed to load. Rendering fallback initials in PDF instead.");
        callback(false);
      };
      img.src = src;
    }
    
    function updateCombinedLocation() {
      const reg = document.getElementById('form-region').value.trim();
      const dist = document.getElementById('form-district').value.trim();
      const ward = document.getElementById('form-ward').value.trim();
      const str = document.getElementById('form-street').value.trim();
      document.getElementById('form-location').value = `${reg}, ${dist}, ${ward}, ${str}`;
      saveFormDraft();
    }

    function copyApplicantAddressToParent(checked) {
      if (checked) {
        document.getElementById('form-parent-region').value = document.getElementById('form-region').value;
        document.getElementById('form-parent-district').value = document.getElementById('form-district').value;
        document.getElementById('form-parent-ward').value = document.getElementById('form-ward').value;
        document.getElementById('form-parent-street').value = document.getElementById('form-street').value;
      }
      updateCombinedParentLocation();
    }

    function updateCombinedParentLocation() {
      const reg = document.getElementById('form-parent-region') ? document.getElementById('form-parent-region').value.trim() : '';
      const dist = document.getElementById('form-parent-district') ? document.getElementById('form-parent-district').value.trim() : '';
      const ward = document.getElementById('form-parent-ward') ? document.getElementById('form-parent-ward').value.trim() : '';
      const str = document.getElementById('form-parent-street') ? document.getElementById('form-parent-street').value.trim() : '';
      const combined = document.getElementById('form-parent-location');
      if (combined) {
        combined.value = (reg || dist || ward || str) ? `${reg}, ${dist}, ${ward}, ${str}` : '';
      }
      saveFormDraft();
    }

    function saveFormDraft() {
      if (!activeInstitution) return;
      const form = document.getElementById('institution-admission-form');
      if (!form) return;

      const formData = {};
      const inputs = form.querySelectorAll('input, select, textarea');
      inputs.forEach(input => {
        if (input.type === 'file') return;
        if (input.type === 'checkbox' || input.type === 'radio') {
          formData[input.id || input.name] = input.checked;
        } else {
          formData[input.id || input.name] = input.value;
        }
      });

      const draft = {
        schoolId: activeInstitution.id,
        formData: formData,
        passportPhoto: passportPhotoBase64,
        signature: signatureBase64,
        signatureParent: signatureParentBase64
      };

      localStorage.setItem(`elimu_form_draft_${activeInstitution.id}`, JSON.stringify(draft));
    }

    function loadFormDraft(schoolId) {
      const raw = localStorage.getItem(`elimu_form_draft_${schoolId}`);
      if (!raw) return;

      try {
        const draft = JSON.parse(raw);
        const formData = draft.formData || {};
        const form = document.getElementById('institution-admission-form');
        if (!form) return;

        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
          const val = formData[input.id || input.name];
          if (val !== undefined) {
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = val;
            } else {
              input.value = val;
            }
          }
        });

        // Split and restore separated residential address inputs
        const locVal = document.getElementById('form-location').value || '';
        if (locVal) {
          const parts = locVal.split(',');
          if (parts[0]) document.getElementById('form-region').value = parts[0].trim();
          if (parts[1]) document.getElementById('form-district').value = parts[1].trim();
          if (parts[2]) document.getElementById('form-ward').value = parts[2].trim();
          if (parts[3]) document.getElementById('form-street').value = parts[3].trim();
        }

        // Split and restore separated parent residential address inputs
        const pLocVal = document.getElementById('form-parent-location') ? document.getElementById('form-parent-location').value : '';
        if (pLocVal) {
          const pParts = pLocVal.split(',');
          if (pParts[0] && document.getElementById('form-parent-region')) document.getElementById('form-parent-region').value = pParts[0].trim();
          if (pParts[1] && document.getElementById('form-parent-district')) document.getElementById('form-parent-district').value = pParts[1].trim();
          if (pParts[2] && document.getElementById('form-parent-ward')) document.getElementById('form-parent-ward').value = pParts[2].trim();
          if (pParts[3] && document.getElementById('form-parent-street')) document.getElementById('form-parent-street').value = pParts[3].trim();
        }

        // Restore passport photo preview
        passportPhotoBase64 = draft.passportPhoto || null;
        const preview = document.getElementById('form-passport-preview');
        const placeholder = document.getElementById('form-passport-placeholder');
        if (preview && placeholder) {
          if (passportPhotoBase64) {
            preview.src = passportPhotoBase64;
            preview.classList.remove('hidden');
            placeholder.classList.add('hidden');
          } else {
            preview.src = '';
            preview.classList.add('hidden');
            placeholder.classList.remove('hidden');
          }
        }

        // Restore signature drawing pad
        signatureBase64 = draft.signature || null;
        if (signatureBase64) {
          restoreSignaturePad(signatureBase64);
        } else {
          clearSignatureCanvasOnly();
        }

        signatureParentBase64 = draft.signatureParent || null;
        if (signatureParentBase64) {
          restoreSignaturePadParent(signatureParentBase64);
        }
      } catch (e) {
        console.error("Error loading form draft:", e);
      }
    }

    function discardFormDraft() {
      if (!activeInstitution) return;
      if (confirm(formLanguage === 'sw' ? "Je, una uhakika unataka kufuta taarifa zote ulizojaza?" : "Are you sure you want to clear all entered data?")) {
        localStorage.removeItem(`elimu_form_draft_${activeInstitution.id}`);
        document.getElementById('institution-admission-form').reset();
        passportPhotoBase64 = null;
        const preview = document.getElementById('form-passport-preview');
        const placeholder = document.getElementById('form-passport-placeholder');
        if (preview && placeholder) {
          preview.src = '';
          preview.classList.add('hidden');
          placeholder.classList.remove('hidden');
        }
        signatureParentBase64 = null;
        clearSignaturePad();
        if (signaturePadParent) {
          clearSignaturePadParent();
        }
      }
    }



    function downloadFormPdf(type) {
      let data = null;
      if (type !== 'joining') {
        data = getActiveFormData();
        if (!data) return;
      }

      const primary = activeInstitution.primaryColor || '#059669';
      const rawLogo = activeInstitution.logo || '';
      const initials = activeInstitution.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

      // Show temporary loading indicator on the clicked button
      let btnEl = null;
      if (type === 'registration') btnEl = document.getElementById('btn-pdf-form');
      if (type === 'joining') btnEl = document.getElementById('btn-pdf-joining');
      if (type === 'combined') btnEl = document.getElementById('btn-pdf-combined');
      
      const originalText = btnEl ? btnEl.innerHTML : '';
      if (btnEl) {
        btnEl.disabled = true;
        btnEl.innerHTML = '<span class="animate-pulse">Compiling PDF...</span>';
      }

      const hasLogo = hasFeature('Custom Logo & Brand Colors') && rawLogo;
      const pdfPassportPhoto = passportPhotoBase64 || null; // Always show if uploaded
      const pdfSignature = signatureBase64 || null; // Always show if drawn
      const pdfSignatureParent = signatureParentBase64 || null; // Always show if drawn

      checkImageCORS(hasLogo ? rawLogo : '', function(isSafe) {
        const logoSrc = isSafe ? (hasLogo ? rawLogo : '') : '';
        const isSw = (formLanguage === 'sw');
        const religion = document.getElementById('form-religion').value.trim() || 'N/A';
        const t = {
          joiningTitle: isSw ? "MAELEKEZO YA KUJIUNGA NA MAHITAJI SHULE" : "JOINING INSTRUCTIONS & REQUIREMENTS",
          issuedBy: isSw ? "Imetolewa kidijitali kupitia Elimu Express Tanzania." : "Issued digitally via Elimu Express Tanzania.",
          declText: isSw
            ? "Nathibitisha kwamba taarifa zote zilizotolewa hapo juu ni za kweli na sahihi kwa kadri ninavyojua. Nakubaliana na sheria na kanuni zote za usajili za shule hii."
            : "I hereby declare that the information provided above is true and correct to the best of my knowledge. I agree to abide by all the admission rules and regulations of the institution."
        };

        // Dynamic Header and Box titles based on level
        let headerFlag = "JAMHURI YA MUUNGANO WA TANZANIA • TAMISEMI / WIZARA YA ELIMU";
        let levelTitle = "FOMU YA KUJIUNGA NA USAJILI / ADMISSION FORM";
        let subTitle = "Tanzanian Digital School Admission Details";
        let passportText = "Picha ya Mwanafunzi<br/>(Passport Size)<br/>Sare Rasmi";
        
        if (activeInstitution.category === 'kindergarten') {
          headerFlag = "THE UNITED REPUBLIC OF TANZANIA • TAMISEMI / MOEST";
          levelTitle = isSw ? "FOMU YA MAOMBI NA USAJILI WA AWALI / NURSERY ADMISSION FORM" : "NURSERY ADMISSION & REGISTRATION FORM";
          subTitle = "Fomu ya Maombi na Usajili wa Awali - Elimu ya Awali";
          passportText = "Picha ya Mtoto<br/>(Passport Size)<br/>Background Nyeupe";
        } else if (activeInstitution.category === 'primary') {
          headerFlag = "JAMHURI YA MUUNGANO WA TANZANIA • TAMISEMI / WIZARA YA ELIMU";
          levelTitle = isSw ? "FOMU YA KUJIUNGA NA USAJILI WA ELIMU YA MSINGI (STD 1 - 7)" : "PRIMARY SCHOOL ADMISSION & REGISTRATION FORM (STD 1-7)";
          subTitle = "Usajili wa Elimu ya Msingi Ngazi ya Taifa";
          passportText = "Picha ya Mwanafunzi<br/>(Passport Size)<br/>Sare Rasmi";
        } else if (activeInstitution.category === 'secondary') {
          headerFlag = "THE UNITED REPUBLIC OF TANZANIA • TAMISEMI / MOEST";
          levelTitle = isSw ? "FOMU YA KUJIUNGA NA USAJILI WA MWANAFUNZI / STUDENT REGISTRATION FORM" : "SECONDARY STUDENT ADMISSION & REGISTRATION FORM";
          subTitle = "Fomu ya Usajili wa Wanafunzi ngazi ya Kidato cha 1 - 6";
          passportText = "Picha ya Mwanafunzi<br/>(Passport Size)<br/>Rangirangi";
        } else if (activeInstitution.category === 'vocational') {
          headerFlag = "UNITED REPUBLIC OF TANZANIA • NACTVET / VETA REGISTRATION";
          levelTitle = "STUDENT ENROLMENT & ADMISSION FORM (CERTIFICATE & DIPLOMA)";
          subTitle = "Fomu ya Maombi ya Udahili - Kigamboni Institute of Business & Technology";
          passportText = "Affix Passport<br/>Photograph<br/>Here<br/>(Official Formal)";
        }
        
        if (type === 'joining') {
          levelTitle = isSw ? "MAELEKEZO YA KUJIUNGA / JOINING INSTRUCTIONS" : "JOINING INSTRUCTIONS & REQUIREMENTS";
        }

        // Save current scroll and scroll to top to prevent viewport layout clipping
        const originalScrollY = window.scrollY;
        window.scrollTo(0, 0);

        // Create professional overlay to prevent user interaction and cover original DOM
        const overlay = document.createElement('div');
        overlay.id = 'pdf-loading-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = '0';
        overlay.style.top = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.background = 'rgba(248, 250, 252, 0.99)';
        overlay.style.zIndex = '99998';
        overlay.style.overflowY = 'auto';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'flex-start';
        overlay.style.padding = '40px 20px';
        overlay.style.boxSizing = 'border-box';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.innerHTML = `
          <div style="border: 4px solid #e2e8f0; border-top: 4px solid ${primary}; border-radius: 50%; width: 35px; height: 35px; animation: spin 1s linear infinite; margin-bottom: 12px; shrink: 0;"></div>
          <style>
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
          <div style="font-size: 13px; font-weight: bold; color: #1e293b;">${isSw ? 'Inaandaa Fomu ya PDF...' : 'Compiling PDF Document...'}</div>
          <div style="font-size: 10px; color: #64748b; margin-top: 3px;">${isSw ? 'Tafadhali subiri, usifunge ukurasa huu.' : 'Please wait, do not close this page.'}</div>
        `;
        document.body.appendChild(overlay);

        const tempDiv = document.createElement('div');
        tempDiv.id = 'pdf-render-temp';
        tempDiv.style.position = 'relative';
        tempDiv.style.width = '210mm';
        tempDiv.style.maxWidth = '210mm';
        tempDiv.style.minHeight = '297mm';
        tempDiv.style.background = '#ffffff';
        tempDiv.style.color = '#000000';
        tempDiv.style.padding = '15mm';
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.fontFamily = 'Arial, sans-serif';
        tempDiv.style.overflow = 'hidden';
        tempDiv.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
        tempDiv.style.borderRadius = '8px';
        tempDiv.style.marginTop = '20px';

        let headerHtml = '';
        if (activeInstitution.letterhead && activeInstitution.letterhead.trim() !== '' && hasFeature('Custom Domain Support')) {
          headerHtml = `
            <img src="${activeInstitution.letterhead}" crossorigin="anonymous" style="width: 100%; height: auto; max-height: 100px; object-fit: contain; margin-bottom: 6px; display: block;" />
            <table class="pdf-header-table" style="margin-bottom: 4px; width: 100%; table-layout: fixed;">
              <tr>
                <!-- Left spacer for balancing -->
                <td style="width: 35mm; text-align: left; vertical-align: middle;"></td>
                
                <td class="pdf-header-text" style="vertical-align: middle; text-align: center;">
                  <div class="pdf-form-title" style="margin: 0 auto; display: inline-block; background-color: ${primary}; color: white; padding: 3px 15px; font-size: 9px; font-weight: 800; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;">${levelTitle}</div>
                </td>
                
                <td style="width: 35mm; vertical-align: top; text-align: right;">
                  ${type !== 'joining' ? `
                  <div class="pdf-passport-box" style="margin-top: 0; margin-bottom: 0; margin-left: auto; margin-right: 0;">
                    ${pdfPassportPhoto ? `<img src="${pdfPassportPhoto}" class="pdf-passport-img" />` : `<span style="font-size: 7px; text-align: center; padding: 0 2px; text-transform: uppercase; font-weight: bold; color: #94a3b8;">Affix Passport Photo (2x2 / 35x45mm)</span>`}
                  </div>
                  ` : ''}
                </td>
              </tr>
            </table>
          `;
        } else {
          headerHtml = `
            <table class="pdf-header-table" style="width: 100%; table-layout: fixed;">
              <tr>
                <!-- Left Cell: Logo -->
                <td style="width: 35mm; vertical-align: middle; text-align: left;">
                  ${logoSrc ? `<img src="${logoSrc}" crossorigin="anonymous" style="width: 60px; height: 60px; border-radius: 6px; object-fit: contain;" />` : `<div style="width: 60px; height: 60px; border-radius: 6px; background: ${primary}; color: white; display: flex; align-items: center; justify-content: center; font-weight: 850; font-size: 20px;">${initials}</div>`}
                </td>
                
                <!-- Center Cell: Centered School details -->
                <td class="pdf-header-text" style="text-align: center; vertical-align: middle;">
                  <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;">
                    <div class="pdf-header-flag" style="margin: 0 auto 2px auto; display: inline-block;">${headerFlag}</div>
                    <h2 class="pdf-school-title" style="margin: 0 auto; text-align: center; font-size: 13px; font-weight: 850; color: ${primary}; text-transform: uppercase;">${activeInstitution.name}</h2>
                    <p class="pdf-school-meta" style="margin: 2px auto; text-align: center; font-size: 7.5px; color: #334155;">Reg No: ${activeInstitution.regNo || 'N/A'} &bull; S.L.P / P.O. Box: ${activeInstitution.poBox || 'N/A'}, ${activeInstitution.region || 'Tanzania'} &bull; Email: ${activeInstitution.email} &bull; Simu: +${activeInstitution.phone}</p>
                    <div class="pdf-form-title" style="margin: 4px auto 0 auto; display: inline-block; background-color: ${primary}; color: white; padding: 3px 15px; font-size: 9px; font-weight: 800; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.5px;">${levelTitle}</div>
                  </div>
                </td>
                
                <!-- Right Cell: Passport Box -->
                <td style="width: 35mm; vertical-align: top; text-align: right;">
                  ${type !== 'joining' ? `
                  <div class="pdf-passport-box" style="margin-left: auto; margin-right: 0;">
                    ${pdfPassportPhoto ? `<img src="${pdfPassportPhoto}" class="pdf-passport-img" />` : `<span style="font-size: 7px; text-align: center; padding: 0 2px; text-transform: uppercase; font-weight: bold; color: #94a3b8;">Affix Passport Photo (2x2 / 35x45mm)</span>`}
                  </div>
                  ` : ''}
                </td>
              </tr>
            </table>
          `;
        }

        // Styling sheets for formal Tanzanian form layout
        let contentHtml = `
          <style>
            @page {
              size: A4 portrait;
              margin: 0;
            }
            @media print {
              body { margin: 0; padding: 0; }
              .pdf-container { width: 210mm; min-height: 297mm; padding: 15mm; }
            }
            .pdf-container {
              font-family: Arial, sans-serif;
              color: #0f172a;
              width: 100%;
              line-height: 1.2;
              font-size: 8.5px;
            }
            .pdf-header-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 8px;
            }
            .pdf-header-text {
              vertical-align: middle;
              text-align: left;
            }
            .pdf-header-flag {
              font-size: 7.5px;
              font-weight: bold;
              color: #475569;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              margin-bottom: 2px;
            }
            .pdf-school-title {
              font-size: 14px;
              font-weight: 850;
              color: ${primary};
              margin: 0;
              text-transform: uppercase;
              line-height: 1.1;
            }
            .pdf-school-meta {
              font-size: 8px;
              color: #334155;
              margin: 2px 0 0 0;
            }
            .pdf-form-title {
              font-size: 9px;
              font-weight: 800;
              color: ${primary};
              text-transform: uppercase;
              margin: 2px 0 0 0;
            }
             .pdf-passport-box {
              width: 30mm;
              height: 38mm;
              min-width: 30mm;
              min-height: 38mm;
              border: 1px solid #94a3b8;
              border-radius: 2px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              text-align: center;
              font-size: 7px;
              font-weight: bold;
              color: #64748b;
              background: #f1f5f9;
              box-sizing: border-box;
              margin: 0 0 0 auto;
              overflow: hidden;
              flex-shrink: 0;
              padding: 0.5mm;
            }
            .pdf-passport-img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              object-position: center;
              display: block;
            }
            .pdf-meta-bar {
              width: 100%;
              background-color: ${primary}10;
              border: 1px solid ${primary}35;
              padding: 4px 8px;
              margin-bottom: 8px;
              box-sizing: border-box;
              font-weight: bold;
              color: #0f172a;
              font-size: 8px;
            }
            .pdf-section-title {
              background-color: ${primary};
              color: #ffffff;
              font-size: 8.5px;
              font-weight: bold;
              padding: 3.5px 6px;
              margin-top: 6px;
              margin-bottom: 4px;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              border-radius: 1px;
              text-align: left;
            }
            .pdf-grid-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 5px;
            }
             .pdf-grid-table td {
              border: 1px solid #cbd5e1;
              padding: 4px 6px;
              vertical-align: top;
              box-sizing: border-box;
              text-align: left;
            }
            .pdf-field-title {
              font-size: 6.5px;
              color: #475569;
              text-transform: uppercase;
              font-weight: bold;
              margin-bottom: 1px;
            }
            .pdf-field-value {
              font-size: 8.5px;
              color: #000000;
              font-weight: bold;
            }
            .pdf-declaration-box {
              background-color: #f8fafc;
              border: 1px solid #cbd5e1;
              padding: 6px 8px;
              border-radius: 2px;
              font-size: 7.5px;
              color: #334155;
              margin-top: 4px;
              margin-bottom: 8px;
              text-align: left;
            }
            .pdf-section-title, .pdf-grid-table, .pdf-declaration-box, .pdf-official-box, .pdf-signature-table {
              page-break-inside: avoid;
              break-inside: avoid;
            }
            .pdf-signature-table {
              width: 100%;
              margin-top: 10px;
              border-collapse: collapse;
            }
            .pdf-signature-table td {
              border: none;
              padding: 4px;
              vertical-align: bottom;
              font-size: 8px;
            }
            .pdf-official-box {
              border: 1.2px dashed ${primary}80;
              background-color: ${primary}03;
              padding: 6px 8px;
              margin-top: 8px;
              box-sizing: border-box;
            }
            .pdf-official-title {
              font-size: 8px;
              font-weight: bold;
              color: ${primary};
              text-transform: uppercase;
              margin-bottom: 3px;
              border-bottom: 1px dashed ${primary}30;
              padding-bottom: 1.5px;
              text-align: left;
            }
          </style>

          <div class="pdf-container">
            ${headerHtml}
        `;

        if (type === 'registration' || type === 'combined') {
          const locParts = (data.location || '').split(',');
          const regVal = locParts[0] && locParts[0].trim() ? locParts[0].trim() : 'N/A';
          const distVal = locParts[1] && locParts[1].trim() ? locParts[1].trim() : 'N/A';
          const wardVal = locParts[2] && locParts[2].trim() ? locParts[2].trim() : 'N/A';
          const mtaaVal = locParts[3] && locParts[3].trim() ? locParts[3].trim() : (locParts[2] ? locParts[2].trim() : 'N/A');

          const parentLocParts = (data.parentLocation || '').split(',');
          const parentRegVal = parentLocParts[0] && parentLocParts[0].trim() ? parentLocParts[0].trim() : regVal;
          const parentDistVal = parentLocParts[1] && parentLocParts[1].trim() ? parentLocParts[1].trim() : distVal;
          const parentWardVal = parentLocParts[2] && parentLocParts[2].trim() ? parentLocParts[2].trim() : wardVal;
          const parentMtaaVal = parentLocParts[3] && parentLocParts[3].trim() ? parentLocParts[3].trim() : mtaaVal;
          const signDate = new Date().toLocaleDateString('en-GB');

          // Dynamic elements based on level
          if (activeInstitution.category === 'kindergarten') {
            contentHtml += `
              <!-- Academic Info Bar -->
              <table style="width: 100%; margin-bottom: 6px; font-size: 8px;" class="pdf-meta-bar">
                <tr>
                  <td>Mwaka wa Masomo / Academic Year: <strong>2026</strong></td>
                  <td>Ngazi / Class: [ ] Daycare [ ] Baby [ ] Middle [ ] Pre-Unit &nbsp; (<strong>${data.classLevel}</strong>)</td>
                  <td>Namba ya Ombi / App No: <strong>__________________</strong></td>
                </tr>
              </table>

              <!-- Section 1: Child Particulars -->
              <div class="pdf-section-title">1. TAARIFA ZA MTOTO / CHILD PARTICULARS</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Kwanza (First Name)</div>
                    <div class="pdf-field-value">${data.studentName.split(' ')[0] || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Kati (Middle Name)</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').slice(1, -1).join(' ') || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Ukoo (Surname)</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').pop() || ''}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Tarehe ya Kuzaliwa (DD/MM/YYYY)</div>
                    <div class="pdf-field-value">${data.dob}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Jinsia (Gender)</div>
                    <div class="pdf-field-value" style="font-size: 8px;">
                      [ ${data.gender.includes('Mvulana') || data.gender.includes('Male') ? 'X' : ' '} ] Mvulana (Boy) &nbsp;&nbsp;&nbsp;
                      [ ${data.gender.includes('Msichana') || data.gender.includes('Female') ? 'X' : ' '} ] Msichana (Girl)
                    </div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Namba ya Cheti cha RITA (Birth Cert No)</div>
                    <div class="pdf-field-value">${data.ritaNo || data.idNum}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Uraia (Nationality)</div>
                    <div class="pdf-field-value">Tanzanian</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Lugha Kuu Nyumbani (Primary Language)</div>
                    <div class="pdf-field-value">Kiswahili / English</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Dini / Madhehebu</div>
                    <div class="pdf-field-value">${religion}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 2: Residence & School Bus Logistics -->
              <div class="pdf-section-title">2. MAKAZI YA MTOTO & USAFIRI WA SHULE / RESIDENTIAL & TRANSPORT</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 25%;"><div class="pdf-field-title">Mkoa (Region)</div><div class="pdf-field-value">${regVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Wilaya (District)</div><div class="pdf-field-value">${distVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Kata (Ward)</div><div class="pdf-field-value">${wardVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Mtaa / Kijiji (Street/Village)</div><div class="pdf-field-value">${mtaaVal}</div></td>
                </tr>
                <tr>
                  <td colspan="2">
                    <div class="pdf-field-title">Mtumiaji wa Usafiri wa Shule? (School Bus Service)</div>
                    <div class="pdf-field-value" style="font-size: 7.5px;">
                      [ ${data.kBus && (data.kBus.includes('Ndio') || data.kBus.includes('Yes')) ? 'X' : ' '} ] Ndiyo (Yes) - Kituo: <u>${data.kBusStation || '________________'}</u> &nbsp;&nbsp;&nbsp;&nbsp;
                      [ ${!data.kBus || (!data.kBus.includes('Ndio') && !data.kBus.includes('Yes')) ? 'X' : ' '} ] Hapana (Self Transport)
                    </div>
                  </td>
                  <td colspan="2">
                    <div class="pdf-field-title">Mtu Aliyeidhinishwa Kumchukua Mtoto (Authorized Pickup Person)</div>
                    <div class="pdf-field-value">${data.kPickup}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 3: Parent/Guardian Details -->
              <div class="pdf-section-title">3. TAARIFA ZA WAZAZI / MLEZI (PARENT / GUARDIAN DETAILS)</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Jina Kamili la Mzazi/Mlezi Mkuu</div>
                    <div class="pdf-field-value">${data.parentName}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Uhusiano (Baba/Mama/Mlezi)</div>
                    <div class="pdf-field-value">${data.parentRel}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Namba ya NIDA / Kitambulisho cha Mzazi</div>
                    <div class="pdf-field-value">${data.parentNida}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Simu ya Mkononi (Primary)</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Simu ya WhatsApp (Updates)</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Kazi / Shughuli ya Mzazi (Occupation)</div>
                    <div class="pdf-field-value">${data.parentOccupation}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <div class="pdf-field-title">Makazi ya Mzazi / Mlezi / Parent Residence (Mkoa, Wilaya, Kata, Mtaa)</div>
                    <div class="pdf-field-value">${parentRegVal}, ${parentDistVal}, ${parentWardVal}, ${parentMtaaVal}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 4: Academic History & Health -->
              <div class="pdf-section-title">4. HISTORIA YA MASOMO & AFYA / ACADEMIC & HEALTH BACKGROUND</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Shule ya Awali / Daycare Aliyosoma</div>
                    <div class="pdf-field-value">${data.prevSchool}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Darasa / Ngazi ya Mwisho</div>
                    <div class="pdf-field-value">${data.prevClass}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Mwaka wa Kuhitimu / Kuhama</div>
                    <div class="pdf-field-value">${data.prevYear}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Kundi la Damu (Blood Group)</div>
                    <div class="pdf-field-value">${data.healthBlood}</div>
                  </td>
                  <td colspan="2">
                    <div class="pdf-field-title">Mzio wa Vyakula / Dawa & Changamoto za Afya</div>
                    <div class="pdf-field-value">${data.healthAllergies} &bull; Disability: ${data.healthDisability}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 5: Attachments -->
              <div class="pdf-section-title">5. VIAMBATANISHO VINAVYOHITAJIKA (REQUIRED ATTACHMENTS)</div>
              <div style="padding: 5px; border: 1.2px solid #cbd5e1; border-radius: 2px; font-size: 8px; line-height: 1.5; margin-bottom: 8px;">
                <table style="width: 100%; border: none;">
                  <tr>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Nakala ya Cheti cha Kuzaliwa (RITA Birth Certificate)</td>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Picha 3 za Pasipoti za Mtoto (Passport Photos)</td>
                  </tr>
                  <tr>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Nakala ya Kadi ya Kliniki na Chanjo (Clinic Card Copy)</td>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Nakala ya Kitambulisho cha Mzazi (NIDA / Voter's Card)</td>
                  </tr>
                </table>
              </div>
            `;
          } else if (activeInstitution.category === 'primary') {
            contentHtml += `
              <!-- Academic Info Bar -->
              <table style="width: 100%; margin-bottom: 6px; font-size: 8px;" class="pdf-meta-bar">
                <tr>
                  <td>Mwaka wa Masomo / Academic Year: <strong>2026</strong></td>
                  <td>Darasa Analoingia (Standard): <strong>Standard ${data.classLevel}</strong></td>
                  <td>Namba ya Usajili (Premise ID): <strong>__________________</strong></td>
                </tr>
              </table>

              <!-- Section 1: Student Particulars -->
              <div class="pdf-section-title">1. TAARIFA BINAFSI ZA MWANAFUNZI / PUPIL PARTICULARS</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Kwanza / First Name</div>
                    <div class="pdf-field-value">${data.studentName.split(' ')[0] || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Kati / Middle Name</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').slice(1, -1).join(' ') || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Ukoo / Surname</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').pop() || ''}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Tarehe ya Kuzaliwa / Date of Birth</div>
                    <div class="pdf-field-value">${data.dob}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Jinsia / Gender</div>
                    <div class="pdf-field-value">${data.gender}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Namba ya Cheti cha RITA / Birth Cert No</div>
                    <div class="pdf-field-value">${data.ritaNo || data.idNum}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Uraia / Nationality</div>
                    <div class="pdf-field-value">Tanzanian</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Dini / Madhehebu / Religion</div>
                    <div class="pdf-field-value">${religion}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Lugha Kuu Nyumbani (Primary Language)</div>
                    <div class="pdf-field-value">Kiswahili / English</div>
                  </td>
                </tr>
              </table>

              <!-- Section 2: Residence Location -->
              <div class="pdf-section-title">2. MAKAZI YA KUDUMU / PUPIL RESIDENCE LOCATION</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 25%;"><div class="pdf-field-title">Mkoa (Region)</div><div class="pdf-field-value">${regVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Wilaya (District)</div><div class="pdf-field-value">${distVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Kata (Ward)</div><div class="pdf-field-value">${wardVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Mtaa / Kijiji (Street/Village)</div><div class="pdf-field-value">${mtaaVal}</div></td>
                </tr>
              </table>

              <!-- Section 3: Parent/Guardian Details -->
              <div class="pdf-section-title">3. TAARIFA ZA WAZAZI / MLEZI (PARENT / GUARDIAN DETAILS)</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Jina Kamili la Mzazi Mkuu / Parent Name</div>
                    <div class="pdf-field-value">${data.parentName}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Uhusiano / Relationship</div>
                    <div class="pdf-field-value">${data.parentRel}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Namba ya NIDA / Kitambulisho cha Mzazi</div>
                    <div class="pdf-field-value">${data.parentNida}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Simu ya Mkononi (Primary)</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Simu ya WhatsApp / M-Pesa</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Kazi / Shughuli ya Mzazi (Occupation)</div>
                    <div class="pdf-field-value">${data.parentOccupation}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <div class="pdf-field-title">Makazi ya Mzazi / Mlezi / Parent Residence (Mkoa, Wilaya, Kata, Mtaa)</div>
                    <div class="pdf-field-value">${parentRegVal}, ${parentDistVal}, ${parentWardVal}, ${parentMtaaVal}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 4: Academic History & Health -->
              <div class="pdf-section-title">4. HISTORIA YA MASOMO & AFYA / ACADEMIC & HEALTH BACKGROUND</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Shule Aliyotoka / Previous School</div>
                    <div class="pdf-field-value">${data.prevSchool}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Darasa la Mwisho / Last Class</div>
                    <div class="pdf-field-value">${data.prevClass}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Mwaka / Completion Year</div>
                    <div class="pdf-field-value">${data.prevYear}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Kundi la Damu / Blood Group</div>
                    <div class="pdf-field-value">${data.healthBlood}</div>
                  </td>
                  <td colspan="2">
                    <div class="pdf-field-title">Mzio wa Chakula / Dawa & Mahitaji Maalum</div>
                    <div class="pdf-field-value">${data.healthAllergies} &bull; Disability: ${data.healthDisability}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 5: Checklists -->
              <div class="pdf-section-title">5. VIAMBATANISHO MUHIMU / REQUIRED ENCLOSURES</div>
              <div style="display: flex; gap: 20px; padding: 4px; border: 1px solid #cbd5e1; margin-bottom: 8px;">
                <div style="flex: 1;">
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Nakala Halisi ya Cheti cha Kuzaliwa (RITA Birth Certificate)</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Ripoti ya Maendeleo ya Shule Iliyopita (Progress Report)</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Fomu ya Uchunguzi wa Afya (Medical Report)</div>
                </div>
                <div style="flex: 1;">
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Picha 4 za Pasipoti zenye sare rasmi (Passport Size)</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Nakala ya Kitambulisho cha Mzazi (NIDA ID Copy)</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Kibali cha Uhamisho kutoka TAMISEMI (Uhamisho)</div>
                </div>
              </div>
            `;
          } else if (activeInstitution.category === 'secondary') {
            contentHtml += `
              <!-- Academic Info Bar -->
              <table style="width: 100%; margin-bottom: 6px; font-size: 8px;" class="pdf-meta-bar">
                <tr>
                  <td>Mwaka wa Masomo / Academic Year: <strong>2026</strong></td>
                  <td>Kidato Analoingia (Form): <strong>${data.classLevel}</strong></td>
                  <td>Hali ya Bweni / Day: <strong>${data.secBoarding || 'Day'}</strong></td>
                  <td>Namba ya Mtihani NECTA: <strong>${data.idNum}</strong></td>
                </tr>
              </table>

              <!-- Section 1: Student Particulars -->
              <div class="pdf-section-title">1. TAARIFA BINAFSI ZA MWANAFUNZI / STUDENT PARTICULARS</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Kwanza / First Name</div>
                    <div class="pdf-field-value">${data.studentName.split(' ')[0] || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Kati / Middle Name</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').slice(1, -1).join(' ') || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Jina la Ukoo / Surname</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').pop() || ''}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Tarehe ya Kuzaliwa / Date of Birth</div>
                    <div class="pdf-field-value">${data.dob}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Jinsia / Gender</div>
                    <div class="pdf-field-value">${data.gender}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Namba ya Cheti cha RITA / Birth Cert No</div>
                    <div class="pdf-field-value">${data.ritaNo}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">NECTA PSLE/CSEE Index No</div>
                    <div class="pdf-field-value">${data.secNecta || data.idNum}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Combination / Tahasusi (A-Level)</div>
                    <div class="pdf-field-value">${data.secComb || 'N/A (O-Level)'}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Dini / Madhehebu / Religion</div>
                    <div class="pdf-field-value">${religion}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 2: Residential Location -->
              <div class="pdf-section-title">2. MAKAZI YA MWANAFUNZI / RESIDENTIAL LOCATION</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 25%;"><div class="pdf-field-title">Mkoa (Region)</div><div class="pdf-field-value">${regVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Wilaya (District)</div><div class="pdf-field-value">${distVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Kata (Ward)</div><div class="pdf-field-value">${wardVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Mtaa / Kijiji (Street/Village)</div><div class="pdf-field-value">${mtaaVal}</div></td>
                </tr>
              </table>

              <!-- Section 3: Parent/Guardian Details -->
              <div class="pdf-section-title">3. TAARIFA ZA WAZAZI / MLEZI (PARENT / GUARDIAN DETAILS)</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Jina Kamili la Mzazi Mkuu / Parent Name</div>
                    <div class="pdf-field-value">${data.parentName}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Uhusiano (Relationship)</div>
                    <div class="pdf-field-value">${data.parentRel}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Namba ya NIDA / Kitambulisho cha Mzazi</div>
                    <div class="pdf-field-value">${data.parentNida}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Simu ya Mkononi (Primary Mobile)</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Simu ya WhatsApp / M-Pesa</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Kazi / Shughuli ya Mzazi (Occupation)</div>
                    <div class="pdf-field-value">${data.parentOccupation}</div>
                  </td>
                </tr>
                <tr>
                  <td colspan="3">
                    <div class="pdf-field-title">Makazi ya Mzazi / Mlezi / Parent Residence (Mkoa, Wilaya, Kata, Mtaa)</div>
                    <div class="pdf-field-value">${parentRegVal}, ${parentDistVal}, ${parentWardVal}, ${parentMtaaVal}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 4: History & Health Background -->
              <div class="pdf-section-title">4. HISTORIA YA SHULE & TAARIFA ZA AFYA / ACADEMIC & HEALTH BACKGROUND</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Shule Aliyotoka / Primary/O-Level School</div>
                    <div class="pdf-field-value">${data.prevSchool}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Kidato/Darasa la Mwisho</div>
                    <div class="pdf-field-value">${data.prevClass}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Mwaka wa Kuhitimu / Year</div>
                    <div class="pdf-field-value">${data.prevYear}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Kundi la Damu (Blood Group)</div>
                    <div class="pdf-field-value">${data.healthBlood}</div>
                  </td>
                  <td colspan="2">
                    <div class="pdf-field-title">Magonjwa Sugu, Mzio (Allergy), au Ulemavu / Chronic Health Issues</div>
                    <div class="pdf-field-value">${data.healthAllergies} &bull; Disability: ${data.healthDisability}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 5: Enclosures Checklist -->
              <div class="pdf-section-title">5. VIAMBATANISHO VYA FOMU (REQUIRED ATTACHMENTS)</div>
              <div style="padding: 5px; border: 1.2px solid #cbd5e1; border-radius: 2px; font-size: 8px; line-height: 1.5; margin-bottom: 8px;">
                <table style="width: 100%; border: none;">
                  <tr>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Nakala ya Cheti cha Kuzaliwa (Birth Certificate Copy)</td>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Picha 4 za Pasipoti za Mwanafunzi (Passport Photos)</td>
                  </tr>
                  <tr>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Fomu ya Uchunguzi wa Afya (Medical Examination Report)</td>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Nakala ya Kitambulisho cha Mzazi (NIDA ID / Voter's Card)</td>
                  </tr>
                  <tr>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Matokeo ya NECTA (PSLE/CSEE Results)</td>
                    <td style="width: 50%; border: none; padding: 2px;">[ X ] Barua ya Uhamisho (Transfer Letter)</td>
                  </tr>
                </table>
              </div>
            `;
          } else if (activeInstitution.category === 'vocational') {
            contentHtml += `
              <!-- Academic Info Bar -->
              <table style="width: 100%; margin-bottom: 6px; font-size: 8px;" class="pdf-meta-bar">
                <tr>
                  <td>Academic Year: <strong>2026/2027</strong></td>
                  <td>Selected Programme: <strong>${data.vocProgram}</strong></td>
                  <td>Award Level: <strong>${data.vocAward}</strong></td>
                  <td>Study Mode: <strong>${data.vocMode}</strong></td>
                </tr>
              </table>

              <!-- Section 1: Applicant Particulars -->
              <div class="pdf-section-title">1. TAARIFA ZA MWOMBAJI / APPLICANT PARTICULARS</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Legal Surname / Jina la Ukoo</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').pop() || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">First Name / Jina la Kwanza</div>
                    <div class="pdf-field-value">${data.studentName.split(' ')[0] || ''}</div>
                  </td>
                  <td style="width: 33.3%;">
                    <div class="pdf-field-title">Middle Name / Jina la Kati</div>
                    <div class="pdf-field-value">${data.studentName.split(' ').slice(1, -1).join(' ') || ''}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Date of Birth (DD/MM/YYYY)</div>
                    <div class="pdf-field-value">${data.dob}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Gender / Jinsia</div>
                    <div class="pdf-field-value">${data.gender}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Student NIDA / Namba ya NIDA ya Mwombaji</div>
                    <div class="pdf-field-value">${data.vocNida || 'N/A'}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Namba ya Cheti cha RITA / Birth Cert No</div>
                    <div class="pdf-field-value">${data.ritaNo}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Mobile & WhatsApp Number</div>
                    <div class="pdf-field-value">${data.vocPhone}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Applicant Email Address</div>
                    <div class="pdf-field-value">${data.vocEmail}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 2: Programme Applied & Academic Background -->
              <div class="pdf-section-title">2. PROGRAMME APPLIED FOR & ACADEMIC BACKGROUND / KOZI & HISTORIA YA MASOMO</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 40%;">
                    <div class="pdf-field-title">Programme Name</div>
                    <div class="pdf-field-value">${data.vocProgram}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Award Level</div>
                    <div class="pdf-field-value">${data.vocAward}</div>
                  </td>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Study Mode</div>
                    <div class="pdf-field-value">${data.vocMode}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">CSEE (Form 4) Index No</div>
                    <div class="pdf-field-value">${data.vocNecta || 'N/A'}</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Shule / Chuo Ulichotoka / Previous Institution</div>
                    <div class="pdf-field-value">${data.prevSchool} (${data.prevClass})</div>
                  </td>
                  <td>
                    <div class="pdf-field-title">Mwaka / Completion Year</div>
                    <div class="pdf-field-value">${data.prevYear}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 3: Applicant Residential Location -->
              <div class="pdf-section-title">3. MAKAZI YA MWOMBAJI / APPLICANT RESIDENTIAL LOCATION</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 25%;"><div class="pdf-field-title">Mkoa (Region)</div><div class="pdf-field-value">${regVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Wilaya (District)</div><div class="pdf-field-value">${distVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Kata (Ward)</div><div class="pdf-field-value">${wardVal}</div></td>
                  <td style="width: 25%;"><div class="pdf-field-title">Mtaa / Kijiji (Street/Village)</div><div class="pdf-field-value">${mtaaVal}</div></td>
                </tr>
              </table>

              <!-- Section 4: Sponsor/Parent Details & Residential Address -->
              <div class="pdf-section-title">4. TAARIFA ZA MDHAMINI / MZAZI / PARENT, GUARDIAN & SPONSOR DETAILS</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Sponsor / Parent Full Name</div>
                    <div class="pdf-field-value">${data.parentName}</div>
                  </td>
                  <td style="width: 20%;">
                    <div class="pdf-field-title">Relationship / Uhusiano</div>
                    <div class="pdf-field-value">${data.parentRel}</div>
                  </td>
                  <td style="width: 25%;">
                    <div class="pdf-field-title">Phone (WhatsApp)</div>
                    <div class="pdf-field-value">${data.parentPhone}</div>
                  </td>
                  <td style="width: 25%;">
                    <div class="pdf-field-title">Parent / Sponsor NIDA No</div>
                    <div class="pdf-field-value">${data.parentNida}</div>
                  </td>
                </tr>
                <tr>
                  <td>
                    <div class="pdf-field-title">Sponsor Occupation / Kazi</div>
                    <div class="pdf-field-value">${data.parentOccupation}</div>
                  </td>
                  <td colspan="3">
                    <div class="pdf-field-title">Sponsor Residential Address / Makazi ya Mdhamini (Mkoa, Wilaya, Kata, Mtaa)</div>
                    <div class="pdf-field-value">${parentRegVal}, ${parentDistVal}, ${parentWardVal}, ${parentMtaaVal}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 5: Health & Medical Background -->
              <div class="pdf-section-title">5. TAARIFA ZA AFYA & MAZINGIRA MAALUM / HEALTH & MEDICAL BACKGROUND</div>
              <table class="pdf-grid-table">
                <tr>
                  <td style="width: 30%;">
                    <div class="pdf-field-title">Kundi la Damu (Blood Group)</div>
                    <div class="pdf-field-value">${data.healthBlood}</div>
                  </td>
                  <td style="width: 35%;">
                    <div class="pdf-field-title">Ulemavu / Special Needs</div>
                    <div class="pdf-field-value">${data.healthDisability}</div>
                  </td>
                  <td style="width: 35%;">
                    <div class="pdf-field-title">Mzio wa Vyakula/Dawa (Allergies)</div>
                    <div class="pdf-field-value">${data.healthAllergies}</div>
                  </td>
                </tr>
              </table>

              <!-- Section 6: Document Verification Checklist -->
              <div class="pdf-section-title">6. REQUIRED DOCUMENT VERIFICATION CHECKLIST</div>
              <div style="display: flex; gap: 20px; padding: 4px; border: 1px solid #cbd5e1; margin-bottom: 8px;">
                <div style="flex: 1;">
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Certified Copy of Form IV CSEE Result Slip</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> NACTVET AVN Printout</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> 4 Recent Passport-sized Photographs</div>
                </div>
                <div style="flex: 1;">
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Certified Copy of Birth Certificate (RITA)</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Copy of National ID Card (NIDA Card)</div>
                  <div class="pdf-checkbox-item"><span class="pdf-checkbox-box">&#x2714;</span> Medical Examination & Fitness Report</div>
                </div>
              </div>
            `;
          }

          // Section 6: Declaration
          contentHtml += `
            <div class="pdf-section-title">${activeInstitution.category === 'vocational' ? 'APPLICANT DECLARATION & SIGNATURE' : '6. TAMKO LA MZAZI AU MLEZI / DECLARATION & SIGNATURES'}</div>
            <div class="pdf-declaration-box">
              ${t.declText}
            </div>
          `;

          // Section 7: Signatures Table with Auto Current Date
          if (activeInstitution.category === 'vocational') {
            contentHtml += `
              <table class="pdf-signature-table">
                <tr>
                  <td style="width: 45%; border-top: 1.2px solid #94a3b8; text-align: center; padding-top: 5px; font-weight: bold; color: #475569;">
                    <div style="height: 32px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;">
                      ${pdfSignature ? `<img src="${pdfSignature}" style="max-height: 32px; max-width: 150px; object-fit: contain;" />` : ''}
                    </div>
                    Applicant Signature &bull; Date: ${signDate}
                  </td>
                  <td style="width: 10%;"></td>
                  <td style="width: 45%; border-top: 1.2px solid #94a3b8; text-align: center; padding-top: 5px; font-weight: bold; color: #475569;">
                    <div style="height: 32px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;">
                      ${pdfSignatureParent ? `<img src="${pdfSignatureParent}" style="max-height: 32px; max-width: 150px; object-fit: contain;" />` : ''}
                    </div>
                    Sponsor / Guardian Signature &bull; Date: ${signDate}
                  </td>
                </tr>
              </table>
            `;
          } else {
            contentHtml += `
              <table class="pdf-signature-table">
                <tr>
                  <td style="width: 45%; border-top: 1.2px solid #94a3b8; text-align: center; padding-top: 5px; font-weight: bold; color: #475569;">
                    <div style="height: 32px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;">
                      ${pdfSignature ? `<img src="${pdfSignature}" style="max-height: 32px; max-width: 150px; object-fit: contain;" />` : ''}
                    </div>
                    Sahihi ya Mzazi / Mlezi &bull; Tarehe: ${signDate}
                  </td>
                  <td style="width: 10%;"></td>
                  <td style="width: 45%; border-top: 1.2px solid #94a3b8; text-align: center; padding-top: 5px; font-weight: bold; color: #475569;">
                    <div style="height: 32px; display: flex; align-items: flex-end; justify-content: center; margin-bottom: 2px;"></div>
                    Mwalimu Mkuu (Headmaster) &bull; Tarehe: ${signDate}
                  </td>
                </tr>
              </table>
            `;
          }

          // Section 8: School Use Box
          if (activeInstitution.category === 'vocational') {
            contentHtml += `
              <div class="pdf-official-box">
                <div class="pdf-official-title">For Official College Admissions & Registry Board Use Only</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 7.5px;">
                  <tr>
                    <td style="padding: 2px; font-weight: bold; color: #334155; width: 40%;">Admission Status: [ &nbsp; ] Approved &nbsp;&nbsp; [ &nbsp; ] Rejected</td>
                    <td style="padding: 2px; font-weight: bold; color: #334155; width: 30%;">Registration No: _________________</td>
                    <td style="padding: 2px; font-weight: bold; color: #334155; width: 30%;">Officer Signature: _________________</td>
                  </tr>
                </table>
              </div>
            `;
          } else if (activeInstitution.category === 'secondary') {
            contentHtml += `
              <div class="pdf-official-box">
                <div class="pdf-official-title">KWA MATUMIZI YA OFISI YA SHULE TU (FOR OFFICIAL SCHOOL USE ONLY)</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 7.5px;">
                  <tr>
                    <td style="padding: 2.5px; font-weight: bold; color: #334155; width: 33.3%;">Hali ya Usajili: [ &nbsp; ] Amepokelewa &nbsp;&nbsp; [ &nbsp; ] Hajapokelewa</td>
                    <td style="padding: 2.5px; font-weight: bold; color: #334155; width: 33.3%;">Namba ya Mwanafunzi: _________________</td>
                    <td style="padding: 2.5px; font-weight: bold; color: #334155; width: 33.3%;">Kidato / Mkondo: _________________</td>
                  </tr>
                  <tr>
                    <td style="padding: 2.5px; font-weight: bold; color: #334155;">Jina la Mkuu wa Shule: _________________</td>
                    <td style="padding: 2.5px; font-weight: bold; color: #334155;">Sahihi & Muhuri wa Shule: _________________</td>
                    <td style="padding: 2.5px; font-weight: bold; color: #334155;">Tarehe: ${signDate}</td>
                  </tr>
                </table>
              </div>
            `;
          } else {
            contentHtml += `
              <div class="pdf-official-box">
                <div class="pdf-official-title">KWA MATUMIZI RASMI YA UONGOZI WA SHULE (FOR OFFICIAL SCHOOL USE ONLY)</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 7.5px;">
                  <tr>
                    <td style="padding: 2px; font-weight: bold; color: #334155; width: 40%;">Uamuzi: [ &nbsp; ] Amekubaliwa &nbsp;&nbsp; [ &nbsp; ] Anasubiri Nafasi</td>
                    <td style="padding: 2px; font-weight: bold; color: #334155; width: 30%;">Darasa Alilopangiwa: __________________</td>
                    <td style="padding: 2px; font-weight: bold; color: #334155; width: 30%;">Muhuri wa Shule: [ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ]</td>
                  </tr>
                </table>
              </div>
            `;
          }
        }

        if (type === 'joining' || type === 'combined') {
          const formattedJoining = (activeInstitution.joining || 'No joining instructions registered for this school.')
            .replace(/\n/g, '<br/>');

          contentHtml += `
            <div class="pdf-joining-page" style="${type === 'combined' ? 'page-break-before: always; break-before: page; margin-top: 25px; padding-top: 10px;' : 'margin-top: 10px;'}">
              ${type === 'combined' ? `
                <div style="border-bottom: 2px solid ${primary}; padding-bottom: 6px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
                  <div>
                    <h2 style="font-size: 12px; font-weight: 850; color: ${primary}; text-transform: uppercase; margin: 0;">${activeInstitution.name}</h2>
                    <div style="font-size: 7.5px; color: #475569; margin-top: 2px;">Reg No: ${activeInstitution.regNo || 'N/A'} &bull; S.L.P / P.O. Box: ${activeInstitution.poBox || 'N/A'}, ${activeInstitution.region || 'Tanzania'} &bull; Email: ${activeInstitution.email} &bull; Tel: +${activeInstitution.phone}</div>
                  </div>
                  <div style="background-color: ${primary}; color: white; padding: 3px 10px; font-size: 8px; font-weight: bold; border-radius: 3px; text-transform: uppercase;">
                    ${t.joiningTitle}
                  </div>
                </div>
              ` : `
                <h2 style="font-size: 12px; font-weight: bold; color: ${primary}; border-bottom: 2px solid ${primary}; padding-bottom: 4px; margin-bottom: 10px; text-transform: uppercase; text-align: left;">
                  ${t.joiningTitle}
                </h2>
              `}
              
              <div style="font-size: 9px; line-height: 1.6; color: #1e293b; background: #ffffff; border: 1.2px solid #cbd5e1; padding: 14px; border-radius: 4px; text-align: left;">
                ${formattedJoining}
              </div>

              <!-- Official Stamp & Sign-off Box at bottom of joining instructions -->
              <div style="margin-top: 14px; border: 1.2px dashed ${primary}80; background-color: ${primary}03; padding: 8px 12px; border-radius: 4px;">
                <table style="width: 100%; border-collapse: collapse; font-size: 7.5px;">
                  <tr>
                    <td style="width: 50%; vertical-align: top;">
                      <div style="font-weight: bold; color: ${primary};">OFISI YA MKUU WA TAASISI / PRINCIPAL'S OFFICE</div>
                      <div style="font-size: 7px; color: #64748b; margin-top: 2px;">Tafadhali zingatia maelekezo yote na kuwasilisha vifaa na viambatanisho siku ya kuripoti.</div>
                    </td>
                    <td style="width: 25%; text-align: center; vertical-align: bottom;">
                      <div style="border-bottom: 1px solid #94a3b8; width: 80%; margin: 0 auto 2px auto;"></div>
                      <div style="font-size: 7px; color: #64748b;">Sahihi ya Mkuu wa Shule</div>
                    </td>
                    <td style="width: 25%; text-align: center; vertical-align: bottom;">
                      <div style="border: 1px dashed #94a3b8; width: 65px; height: 32px; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 7px; color: #94a3b8;">
                        Muhuri Rasmi
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          `;
        }

        contentHtml += `
            <div style="margin-top: 25px; border-top: 1px dashed #cbd5e1; padding-top: 8px; font-size: 8px; color: #94a3b8; text-align: center;">
              ${t.issuedBy}
            </div>
          </div> <!-- Close pdf-container -->
        `;

        tempDiv.innerHTML = contentHtml;
        overlay.appendChild(tempDiv);

        // Await loading of all images (logo, letterhead, passport) before starting canvas compile
        const pdfImages = tempDiv.querySelectorAll('img');
        const imgPromises = Array.from(pdfImages).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            const timeoutId = setTimeout(resolve, 5000); // 5s timeout safeguard
            img.onload = () => { clearTimeout(timeoutId); resolve(); };
            img.onerror = () => { clearTimeout(timeoutId); resolve(); };
          });
        });

        Promise.all(imgPromises).then(() => {
          // Extra buffer to let browser paint
          setTimeout(() => {
            const opt = {
              margin:       0,
              filename:     `${activeInstitution.name.replace(/\s+/g, '_')}_Registration.pdf`,
              image:        { type: 'jpeg', quality: 0.98 },
              html2canvas:  { 
                scale: 2, 
                useCORS: true, 
                logging: false,
                scrollX: 0,
                scrollY: 0,
                onclone: (clonedDoc) => {
                  clonedDoc.body.style.margin = '0';
                  clonedDoc.body.style.padding = '0';
                  const el = clonedDoc.getElementById('pdf-render-temp') || 
                             clonedDoc.querySelector('#pdf-render-temp') || 
                             clonedDoc.querySelector('.pdf-container')?.parentElement;
                  if (el) {
                    el.style.position = 'absolute';
                    el.style.left = '0';
                    el.style.top = '0';
                    el.style.margin = '0';
                    el.style.padding = '15mm';
                    el.style.zIndex = '99999';
                    el.style.visibility = 'visible';
                    el.style.display = 'block';
                    el.style.opacity = '1';
                  }
                }
              },
              jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
              pagebreak:    { mode: ['css', 'legacy'] }
            };

            const cleanUp = () => {
              if (tempDiv && tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
              }
              if (document.getElementById('pdf-loading-overlay')) {
                const ov = document.getElementById('pdf-loading-overlay');
                document.body.removeChild(ov);
              }
              window.scrollTo(0, originalScrollY);
              if (btnEl) {
                btnEl.disabled = false;
                btnEl.innerHTML = originalText;
              }
            };

            html2pdf().set(opt).from(tempDiv).save().then(() => {
              cleanUp();
            }).catch(err => {
              console.error("PDF generation failed:", err);
              cleanUp();
            });
          }, 200);
        });
      });
    }

    async function dispatchApplication(channel) {
      const data = getActiveFormData();
      if (!data) return;

      const religion = document.getElementById('form-religion').value.trim() || 'N/A';
      
      // Dynamic Level Details for Text Output
      let specDetailsText = '';
      if (activeInstitution.category === 'kindergarten') {
        specDetailsText = (formLanguage === 'sw')
          ? `• Cheti cha RITA: ${data.ritaNo}\n• Shule Uliyotoka: ${data.prevSchool} (${data.prevClass})\n• Kadi ya Chanjo: ${document.getElementById('form-k-vaccine').value}`
          : `• RITA Birth Cert: ${data.ritaNo}\n• Previous School: ${data.prevSchool} (${data.prevClass})\n• Immunization Status: ${document.getElementById('form-k-vaccine').value}`;
      } else if (activeInstitution.category === 'primary') {
        specDetailsText = (formLanguage === 'sw')
          ? `• Cheti cha RITA: ${data.ritaNo}\n• Shule Uliyotoka: ${data.prevSchool} (${data.prevClass})`
          : `• RITA Birth Cert: ${data.ritaNo}\n• Previous School: ${data.prevSchool} (${data.prevClass})`;
      } else if (activeInstitution.category === 'secondary') {
        specDetailsText = (formLanguage === 'sw')
          ? `• Cheti cha RITA: ${data.ritaNo}\n• Namba ya NECTA: ${data.idNum}\n• Shule Uliyotoka: ${data.prevSchool} (${data.prevClass})\n• Hali ya Bweni: ${document.getElementById('form-sec-boarding').value}`
          : `• RITA Birth Cert: ${data.ritaNo}\n• NECTA Index No: ${data.idNum}\n• Previous School: ${data.prevSchool} (${data.prevClass})\n• Attendance Mode: ${document.getElementById('form-sec-boarding').value}`;
      } else if (activeInstitution.category === 'vocational') {
        specDetailsText = (formLanguage === 'sw')
          ? `• Cheti cha RITA: ${data.ritaNo}\n• Namba ya Mtihani (CSEE): ${data.vocNecta}\n• Shule/Chuo Ulichotoka: ${data.prevSchool} (${data.prevClass})\n• NIDA: ${data.vocNida}`
          : `• RITA Birth Cert: ${data.ritaNo}\n• Exam Index (CSEE): ${data.vocNecta}\n• Previous School: ${data.prevSchool} (${data.prevClass})\n• Student NIDA: ${data.vocNida}`;
      }

      // Generate application reference number
      const refNo = `ELIMU-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      // Try uploading application payload to server API pipeline in background
      let pipelineResult = null;
      try {
        const payload = {
          schoolId: activeInstitution.id,
          schoolName: activeInstitution.name,
          schoolPhone: activeInstitution.phone,
          schoolEmail: activeInstitution.email,
          studentName: data.studentName,
          gender: data.gender,
          dob: data.dob,
          classLevel: data.classLevel,
          ritaNo: data.ritaNo,
          location: data.location,
          parentName: data.parentName,
          parentPhone: data.parentPhone,
          parentLocation: data.parentLocation,
          parentNida: data.parentNida,
          studentNida: data.vocNida,
          healthInfo: data.vocHealth,
          lang: formLanguage,
          formData: data
        };

        const res = await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/applications/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          pipelineResult = await res.json();
        }
      } catch (err) {
        console.warn("Application API pipeline offline, using local dispatch", err);
      }

      const finalRef = pipelineResult?.refNo || refNo;
      const pdfUrl = pipelineResult?.pdfUrl || null;

      if (channel === 'whatsapp') {
        const phone = document.getElementById('target-phone').value.replace(/[^0-9]/g, '');
        
        let text = '';
        if (formLanguage === 'sw') {
          text = `*FOMU YA USAJILI - ${data.schoolName.toUpperCase()}*\n` +
            `Namba ya Maombi: *${finalRef}*\n` +
            `----------------------------------------\n` +
            `*1. TAARIFA ZA MWANAFUNZI*\n` +
            `• Jina: ${data.studentName}\n` +
            `• Ngazi/Darasa: ${data.classLevel}\n` +
            `• Jinsia: ${data.gender}\n` +
            `• Tarehe ya Kuzaliwa: ${data.dob}\n` +
            `• Dini/Dhehebu: ${religion}\n` +
            `• Makazi: ${data.location}\n` +
            `${specDetailsText}\n\n` +
            `*2. MZAZI / MLEZI / MFADHILI*\n` +
            `• Jina: ${data.parentName} (${data.parentRel})\n` +
            `• Kazi: ${data.parentOccupation}\n` +
            `• Simu ya Mzazi: ${data.parentPhone}\n` +
            (pdfUrl ? `\n📄 *Pakua Fomu ya PDF (Cloudflare R2):* ${pdfUrl}\n` : '') +
            `----------------------------------------\n` +
            `_Imetumwa kidijitali kupitia Elimu Express Tanzania_`;
        } else {
          text = `*ADMISSION FORM - ${data.schoolName.toUpperCase()}*\n` +
            `Application Ref: *${finalRef}*\n` +
            `----------------------------------------\n` +
            `*1. STUDENT PARTICULARS*\n` +
            `• Name: ${data.studentName}\n` +
            `• Class/Level: ${data.classLevel}\n` +
            `• Gender: ${data.gender}\n` +
            `• Date of Birth: ${data.dob}\n` +
            `• Religion: ${religion}\n` +
            `• Address: ${data.location}\n` +
            `${specDetailsText}\n\n` +
            `*2. PARENT / GUARDIAN PARTICULARS*\n` +
            `• Name: ${data.parentName} (${data.parentRel})\n` +
            `• Occupation: ${data.parentOccupation}\n` +
            `• Phone Number: ${data.parentPhone}\n` +
            (pdfUrl ? `\n📄 *Download PDF Form (Cloudflare R2):* ${pdfUrl}\n` : '') +
            `----------------------------------------\n` +
            `_Dispatched via Elimu Express Tanzania_`;
        }

        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
      } else if (channel === 'email') {
        const email = document.getElementById('target-email').value;
        
        let subject = '';
        let body = '';

        if (formLanguage === 'sw') {
          subject = `Maombi ya Kujiunga [Ref: ${finalRef}]: ${data.studentName} (${data.classLevel}) - ${data.schoolName}`;
          body = `FOMU YA USAJILI WA MWANAFUNZI (Ref: ${finalRef})\n` +
            `Shule/Chuo: ${data.schoolName}\n` +
            `================================================\n\n` +
            `1. TAARIFA ZA MWANAFUNZI:\n` +
            `- Jina Kamili: ${data.studentName}\n` +
            `- Ngazi/Darasa/Kozi: ${data.classLevel}\n` +
            `- Jinsia: ${data.gender}\n` +
            `- Tarehe ya Kuzaliwa: ${data.dob}\n` +
            `- Dini/Dhehebu: ${religion}\n` +
            `- Makazi: ${data.location}\n` +
            `${specDetailsText.replace(/•/g, '-')}\n\n` +
            `2. TAARIFA ZA MZAZI / MLEZI:\n` +
            `- Jina la Mzazi: ${data.parentName}\n` +
            `- Uhusiano: ${data.parentRel}\n` +
            `- Namba ya Simu: ${data.parentPhone}\n\n` +
            (pdfUrl ? `3. LINK YA FOMU YA PDF (Cloudflare R2):\n${pdfUrl}\n\n` : '') +
            `================================================\n` +
            `Imethibitishwa na kutumwa kidijitali kupitia Elimu Express Portal.`;
        } else {
          subject = `School Admission Application [Ref: ${finalRef}]: ${data.studentName} (${data.classLevel}) - ${data.schoolName}`;
          body = `STUDENT ADMISSION APPLICATION FORM (Ref: ${finalRef})\n` +
            `Institution: ${data.schoolName}\n` +
            `================================================\n\n` +
            `1. STUDENT PARTICULARS:\n` +
            `- Full Name: ${data.studentName}\n` +
            `- Class/Level Applied: ${data.classLevel}\n` +
            `- Gender: ${data.gender}\n` +
            `- Date of Birth: ${data.dob}\n` +
            `- Religion: ${religion}\n` +
            `- Residential Address: ${data.location}\n` +
            `${specDetailsText.replace(/•/g, '-')}\n\n` +
            `2. PARENT / GUARDIAN PARTICULARS:\n` +
            `- Name: ${data.parentName}\n` +
            `- Relationship: ${data.parentRel}\n` +
            `- Phone Number: ${data.parentPhone}\n\n` +
            (pdfUrl ? `3. OFFICIAL PDF DOWNLOAD LINK (Cloudflare R2):\n${pdfUrl}\n\n` : '') +
            `================================================\n` +
            `Verified and sent digitally via Elimu Express Portal.`;
        }

        window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
    }

    // --- 5. CMS Panel Operations & Auth ---
    function getCategoryLabel(catKey) {
      switch (catKey) {
        case 'kindergarten': return 'Kindergarten';
        case 'primary': return 'Primary School';
        case 'secondary': return 'Secondary School';
        case 'vocational': return 'Vocational / College';
        default: return 'School';
      }
    }

    function checkCmsAuth() {
      const loginPanel = document.getElementById('cms-login-panel');
      const dashboard = document.getElementById('cms-admin-dashboard');
      if (!loginPanel || !dashboard) return;

      if (adminToken) {
        loginPanel.classList.add('hidden');
        dashboard.classList.remove('hidden');
        
        const params = new URLSearchParams(window.location.search);
        const savedTab = params.get('tab');
        const validCmsTabs = ['schools', 'pricing', 'db', 'contacts', 'content', 'chatbot', 'applications'];
        if (savedTab && validCmsTabs.includes(savedTab)) {
          switchCmsTab(savedTab);
        } else {
          switchCmsTab('schools');
        }
      } else {
        loginPanel.classList.remove('hidden');
        dashboard.classList.add('hidden');
      }
    }

    async function handleContactSubmit(e) {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const school = document.getElementById('contact-school').value.trim();
      const subject = document.getElementById('contact-subject').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      const newMsg = {
        name,
        email,
        school,
        subject,
        message,
        timestamp: Date.now()
      };

      // Always save locally first
      const messages = JSON.parse(localStorage.getItem('elimu_contact_messages') || '[]');
      messages.unshift(newMsg);
      localStorage.setItem('elimu_contact_messages', JSON.stringify(messages));

      // Post to backend database
      try {
        await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/contacts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg)
        });
      } catch (err) {
        console.warn("Could not sync message with server. Saved locally.");
      }

      alert("Thank you for contacting us! Your message has been sent successfully. We will get back to you shortly.");
      document.getElementById('contact-form').reset();
    }

    async function handleAdminLogin(e) {
      if (e) e.preventDefault();
      const pwdInput = document.getElementById('cms-auth-password');
      const password = pwdInput ? pwdInput.value.trim() : '';
      const errEl = document.getElementById('cms-login-error');
      if (errEl) errEl.classList.add('hidden');

      if (!password) {
        if (errEl) {
          errEl.textContent = "Please enter the admin password.";
          errEl.classList.remove('hidden');
        }
        return;
      }

      let success = false;
      try {
        const response = await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password })
        });

        const res = await response.json().catch(() => ({}));
        if (response.ok && res.success) {
          adminToken = res.token || 'admin_token_' + Date.now();
          sessionStorage.setItem('elimu_admin_token', adminToken);
          success = true;
        } else if (password === 'Admin@Elimu2026') {
          adminToken = 'local_dev_token';
          sessionStorage.setItem('elimu_admin_token', adminToken);
          success = true;
        } else {
          if (errEl) {
            errEl.textContent = res.error || 'Authentication Failed';
            errEl.classList.remove('hidden');
          }
          return;
        }
      } catch (err) {
        // Fallback for offline or local preview
        if (password === 'Admin@Elimu2026') {
          adminToken = 'local_dev_token';
          sessionStorage.setItem('elimu_admin_token', adminToken);
          success = true;
        } else {
          if (errEl) {
            errEl.textContent = "Invalid password. (Default: Admin@Elimu2026)";
            errEl.classList.remove('hidden');
          }
          return;
        }
      }

      if (success) {
        if (pwdInput) pwdInput.value = '';
        checkCmsAuth();
      }
    }

    function handleAdminLogout() {
      adminToken = null;
      sessionStorage.removeItem('elimu_admin_token');
      try {
        const url = new URL(window.location);
        url.searchParams.delete('tab');
        window.history.replaceState({}, '', url);
      } catch (e) {}
      checkCmsAuth();
    }

    function switchCmsTab(tab) {
      try {
        const url = new URL(window.location);
        url.searchParams.set('tab', tab);
        window.history.replaceState({}, '', url);
      } catch (e) {}

      // Hide all tab views safely
      const tabViews = [
        'cms-tab-view-schools',
        'cms-tab-view-pricing',
        'cms-tab-view-db',
        'cms-tab-view-contacts',
        'cms-tab-view-content',
        'cms-tab-view-chatbot',
        'cms-tab-view-applications'
      ];
      tabViews.forEach(vId => {
        const el = document.getElementById(vId);
        if (el) el.classList.add('hidden');
      });

      // Deactivate all tab buttons
      const tabs = ['schools', 'pricing', 'db', 'contacts', 'content', 'chatbot', 'applications'];
      tabs.forEach(t => {
        const btn = document.getElementById(`cms-tab-btn-${t}`);
        if (btn) {
          btn.className = "py-3.5 px-5 text-xs font-bold border-b-2 border-transparent text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5 focus:outline-none whitespace-nowrap";
        }
      });

      // Show selected tab and activate button
      const selectedView = document.getElementById(`cms-tab-view-${tab}`);
      const selectedBtn = document.getElementById(`cms-tab-btn-${tab}`);
      if (selectedView) selectedView.classList.remove('hidden');
      if (selectedBtn) {
        selectedBtn.className = "py-3.5 px-5 text-xs font-bold border-b-2 border-amber-950 text-amber-950 transition flex items-center gap-1.5 focus:outline-none whitespace-nowrap";
      }

      if (tab === 'schools') {
        showSchoolForm(false);
        renderCmsTable();
      }
      if (tab === 'pricing') renderPricingCmsTable();
      if (tab === 'contacts') renderCmsContactsTable();
      if (tab === 'content') populatePublicContentsForm();
      if (tab === 'chatbot') populateBotCms();
      if (tab === 'applications') loadApplicationsCms();
      if (window.lucide) window.lucide.createIcons();
    }
    window.switchCmsTab = switchCmsTab;
    window.handleAdminLogin = handleAdminLogin;
    window.handleAdminLogout = handleAdminLogout;

    let applicationRecords = [];

    async function loadApplicationsCms() {
      const tbody = document.getElementById('cms-apps-table-body');
      if (tbody) tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400"><div class="inline-block animate-spin mr-2">⏳</div> Fetching admission records and Cloudflare R2 objects...</td></tr>`;

      try {
        const res = await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/applications', {
          headers: { 'Authorization': `Bearer ${adminToken || ''}` }
        });

        if (res.ok) {
          const json = await res.json();
          applicationRecords = json.data || [];
          const r2StatusEl = document.getElementById('cms-r2-status-text');
          if (r2StatusEl) {
            r2StatusEl.textContent = json.isR2Bound ? "R2 Bucket Connected" : "R2 Pipeline Active";
            r2StatusEl.className = json.isR2Bound ? "text-lg font-extrabold text-emerald-600 mt-1" : "text-lg font-extrabold text-amber-700 mt-1";
          }
        }
      } catch (e) {
        console.warn("Could not fetch applications from server", e);
      }

      renderApplicationsTable(applicationRecords);
    }

    function renderApplicationsTable(list) {
      const tbody = document.getElementById('cms-apps-table-body');
      const badge = document.getElementById('cms-apps-count-badge');
      if (!tbody) return;
      if (badge) badge.textContent = `${list.length} Applications`;

      if (list.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="p-12 text-center text-slate-400">
              <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <i data-lucide="inbox" class="w-6 h-6"></i>
              </div>
              <p class="font-bold text-slate-600 text-sm">No Admission Applications Received Yet</p>
              <p class="text-xs text-slate-400 mt-1">When parents fill out admission forms and submit them via WhatsApp or Email, records will appear here with permanent Cloudflare R2 PDF links.</p>
            </td>
          </tr>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      tbody.innerHTML = '';
      list.forEach(app => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50/80 transition";
        const dateStr = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A';
        
        tr.innerHTML = `
          <td class="p-3">
            <span class="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[11px]">${escapeHtml(app.refNo || 'N/A')}</span>
            <div class="text-[10px] text-slate-400 mt-1">${dateStr}</div>
          </td>
          <td class="p-3 font-bold text-slate-800">
            ${escapeHtml(app.studentName || 'Unnamed')}
            <div class="text-[10px] font-normal text-slate-500">${escapeHtml(app.gender || '')} ${app.dob ? '• ' + escapeHtml(app.dob) : ''}</div>
          </td>
          <td class="p-3 text-slate-700 font-medium max-w-[150px] truncate" title="${escapeHtml(app.schoolName || '')}">
            ${escapeHtml(app.schoolName || 'General')}
          </td>
          <td class="p-3">
            <span class="px-2 py-0.5 bg-amber-50 text-amber-950 font-bold rounded text-[10px] border border-amber-900/10">
              ${escapeHtml(app.classLevel || 'Standard')}
            </span>
          </td>
          <td class="p-3">
            <div class="font-medium text-slate-800">${escapeHtml(app.parentName || 'N/A')}</div>
            <div class="text-[10px] text-slate-500 font-mono">${escapeHtml(app.parentPhone || '')}</div>
          </td>
          <td class="p-3 text-center">
            ${app.pdfUrl ? `
              <a href="${app.pdfUrl}" target="_blank" class="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg border border-emerald-200 transition text-[11px]">
                <i data-lucide="file-text" class="w-3 h-3"></i> View R2 PDF
              </a>
            ` : `
              <span class="text-slate-400 text-[10px] italic">Not Compiled</span>
            `}
          </td>
          <td class="p-3 text-right whitespace-nowrap space-x-1">
            ${app.parentPhone ? `
              <a href="https://wa.me/${app.parentPhone.replace(/[^0-9]/g, '')}" target="_blank" class="p-1.5 inline-flex text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition" title="Message Parent on WhatsApp">
                <i data-lucide="message-circle" class="w-4 h-4"></i>
              </a>
            ` : ''}
            ${app.schoolPhone ? `
              <a href="https://wa.me/${app.schoolPhone.replace(/[^0-9]/g, '')}" target="_blank" class="p-1.5 inline-flex text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition" title="Forward to School via WhatsApp">
                <i data-lucide="send" class="w-4 h-4"></i>
              </a>
            ` : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });

      if (window.lucide) window.lucide.createIcons();
    }

    function showSchoolForm(show) {
      const listContainer = document.getElementById('cms-schools-list-container');
      const formContainer = document.getElementById('cms-schools-form-container');
      if (!listContainer || !formContainer) return;
      if (show) {
        listContainer.classList.add('hidden');
        formContainer.classList.remove('hidden');
      } else {
        resetCmsForm();
        listContainer.classList.remove('hidden');
        formContainer.classList.add('hidden');
      }
    }

    function hasFeature(featureName) {
      if (!activeInstitution) return false;
      const firstPkg = pricingPackages[0];
      const pkgId = activeInstitution.package || (firstPkg ? firstPkg.id : 'pkg-1');
      const pkg = pricingPackages.find(p => p.id === pkgId);
      if (!pkg) return false;
      if (pkg.features.includes("Everything from all the Packages")) {
        return true;
      }
      return pkg.features.includes(featureName);
    }

    let globalLanguage = 'en';

    const GLOBAL_TRANSLATIONS = {
      en: {
        navHome: "Home",
        navAbout: "About Us",
        navForms: "School Forms",
        navPricing: "Pricing",
        navContact: "Contacts",
        navLogin: "Login",
        navAdmin: "Admin",
        homeSubtitleBadge: "Digital School Admissions Tanzania",
        browseFormsBtn: "Browse All School Forms",
        categoriesHeader: "Institutions by Education Level",
        categoriesSubtitle: "Select a level to view registered Tanzanian schools and generate registration forms.",
        nurseryBadge: "Kindergarten & Nursery",
        nurseryLabel: "Kindergarten & Daycare",
        nurseryDesc: "Baby class, Middle, and Pre-Unit admissions with RITA validation.",
        primaryBadge: "Primary School",
        primaryLabel: "Primary Schools",
        primaryDesc: "Standard 1 to 7 English & Swahili medium admissions.",
        secondaryBadge: "Secondary School",
        secondaryLabel: "Secondary Schools",
        secondaryDesc: "Form 1–4 (O-Level) & Form 5–6 (A-Level) NECTA applications.",
        vocationalBadge: "Vocational & Colleges",
        vocationalLabel: "Vocational & Colleges",
        vocationalDesc: "VETA certificates, technical skills, and private diploma courses.",
        formsDirBadge: "Institutions Directory & Forms",
        formsDirTitle: "School Admission Forms Directory",
        formsDirSubtitle: "Choose an institution to open its form and submit directly to admissions staff.",
        filterAll: "All Levels",
        filterKindergarten: "Kindergarten",
        filterPrimary: "Primary School",
        filterSecondary: "Secondary School",
        filterVocational: "Vocational & Colleges",
        botBtnLabel: "Need Help? Chat with AI"
      },
      sw: {
        navHome: "Mwanzo",
        navAbout: "Kuhusu Sisi",
        navForms: "Fomu za Shule",
        navPricing: "Gharama",
        navContact: "Mawasiliano",
        navLogin: "Ingia",
        navAdmin: "Usimamizi",
        homeSubtitleBadge: "Usajili wa Shule Dijitali Tanzania",
        browseFormsBtn: "Angalia Fomu Zote za Shule",
        categoriesHeader: "Shule kwa Ngazi ya Elimu",
        categoriesSubtitle: "Chagua ngazi ili kuona shule zilizosajiliwa na kupata fomu za usajili.",
        nurseryBadge: "Awali / Chekechea",
        nurseryLabel: "Chekechea na Utunzaji",
        nurseryDesc: "Baby class, Middle, na Pre-Unit usajili ukiwa na cheti cha RITA.",
        primaryBadge: "Shule ya Msingi",
        primaryLabel: "Shule za Msingi",
        primaryDesc: "Usajili wa Darasa la 1 hadi la 7 kwa shule za Kiswahili na Kiingereza.",
        secondaryBadge: "Sekondari",
        secondaryLabel: "Shule za Sekondari",
        secondaryDesc: "Maombi ya Kidato cha 1–4 (O-Level) na Kidato cha 5–6 (A-Level) NECTA.",
        vocationalBadge: "Vyuo Binafsi & VETA",
        vocationalLabel: "Vyuo na VETA",
        vocationalDesc: "Astashahada za VETA, stadi za kazi, na kozi za stashahada binafsi.",
        formsDirBadge: "Orodha ya Shule na Fomu",
        formsDirTitle: "Orodha ya Fomu za Kujiunga na Shule",
        formsDirSubtitle: "Chagua taasisi kufungua fomu yake na kutuma maombi moja kwa moja.",
        filterAll: "Ngazi Zote",
        filterKindergarten: "Awali",
        filterPrimary: "Msingi",
        filterSecondary: "Sekondari",
        filterVocational: "Vyuo & VETA",
        botBtnLabel: "Unahitaji Msaada? Ongea na AI"
      }
    };

    function loadGlobalLanguage() {
      const stored = localStorage.getItem('elimu_global_language');
      globalLanguage = stored ? stored : 'en'; // Default is strictly English!
      applyGlobalLanguage();
    }

    function toggleGlobalLanguage() {
      globalLanguage = (globalLanguage === 'en') ? 'sw' : 'en';
      localStorage.setItem('elimu_global_language', globalLanguage);
      applyGlobalLanguage();
      if (chatHistory.length <= 1) {
        initChatbot();
      }
    }

    function applyGlobalLanguage() {
      const isSw = (globalLanguage === 'sw');
      const btn = document.getElementById('global-lang-btn');
      const mobileBtn = document.getElementById('mobile-global-lang-btn');
      
      if (btn) btn.innerHTML = `🌐 ${isSw ? 'Kiswahili' : 'English'}`;
      if (mobileBtn) mobileBtn.innerHTML = `🌐 ${isSw ? 'Kiswahili' : 'English'}`;

      const t = GLOBAL_TRANSLATIONS[globalLanguage];

      // Update Navigation
      const navButtons = document.querySelectorAll('.nav-btn');
      navButtons.forEach(b => {
        const page = b.getAttribute('data-page');
        if (page === 'home') b.textContent = t.navHome;
        if (page === 'about') b.textContent = t.navAbout;
        if (page === 'forms') b.textContent = t.navForms;
        if (page === 'pricing') b.textContent = t.navPricing;
        if (page === 'contact') b.textContent = t.navContact;
        if (page === 'cms') {
          b.innerHTML = adminToken 
            ? `<i data-lucide="lock" class="w-4 h-4"></i> ${t.navAdmin}`
            : `<i data-lucide="lock" class="w-4 h-4"></i> ${t.navLogin}`;
        }
      });

      // Update Mobile Navigation
      const mobileNavButtons = document.querySelectorAll('.mobile-nav-btn');
      mobileNavButtons.forEach(b => {
        const page = b.getAttribute('data-page');
        if (page === 'home') b.textContent = t.navHome;
        if (page === 'about') b.textContent = t.navAbout;
        if (page === 'forms') b.textContent = t.navForms;
        if (page === 'pricing') b.textContent = t.navPricing;
        if (page === 'contact') b.textContent = t.navContact;
        if (page === 'cms') {
          b.innerHTML = adminToken 
            ? `<i data-lucide="log-in" class="w-4 h-4 text-slate-500"></i> ${t.navAdmin}`
            : `<i data-lucide="log-in" class="w-4 h-4 text-slate-500"></i> ${t.navLogin}`;
        }
      });

      // Update Homepage static translations
      const homeSubtitleBadge = document.getElementById('home-subtitle-badge');
      if (homeSubtitleBadge) homeSubtitleBadge.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> ${t.homeSubtitleBadge}`;
      
      const browseBtnSpan = document.querySelector('#page-home button span');
      if (browseBtnSpan) browseBtnSpan.textContent = t.browseFormsBtn;

      const categoriesHeader = document.querySelector('#page-home h2');
      if (categoriesHeader) categoriesHeader.textContent = t.categoriesHeader;

      const categoriesSubtitle = document.querySelector('#page-home p.text-slate-500');
      if (categoriesSubtitle) categoriesSubtitle.textContent = t.categoriesSubtitle;

      // Update categories card badges, labels and descriptions
      const catBadgeK = document.getElementById('cat-badge-kindergarten');
      const catTitleK = document.getElementById('cat-title-kindergarten');
      const catDescK = document.getElementById('cat-desc-kindergarten');
      if (catBadgeK) catBadgeK.textContent = t.nurseryBadge;
      if (catTitleK) catTitleK.textContent = t.nurseryLabel;
      if (catDescK) catDescK.textContent = t.nurseryDesc;

      const catBadgeP = document.getElementById('cat-badge-primary');
      const catTitleP = document.getElementById('cat-title-primary');
      const catDescP = document.getElementById('cat-desc-primary');
      if (catBadgeP) catBadgeP.textContent = t.primaryBadge;
      if (catTitleP) catTitleP.textContent = t.primaryLabel;
      if (catDescP) catDescP.textContent = t.primaryDesc;

      const catBadgeS = document.getElementById('cat-badge-secondary');
      const catTitleS = document.getElementById('cat-title-secondary');
      const catDescS = document.getElementById('cat-desc-secondary');
      if (catBadgeS) catBadgeS.textContent = t.secondaryBadge;
      if (catTitleS) catTitleS.textContent = t.secondaryLabel;
      if (catDescS) catDescS.textContent = t.secondaryDesc;

      const catBadgeV = document.getElementById('cat-badge-vocational');
      const catTitleV = document.getElementById('cat-title-vocational');
      const catDescV = document.getElementById('cat-desc-vocational');
      if (catBadgeV) catBadgeV.textContent = t.vocationalBadge;
      if (catTitleV) catTitleV.textContent = t.vocationalLabel;
      if (catDescV) catDescV.textContent = t.vocationalDesc;

      // Update Forms Directory headers & filter buttons
      const fDirBadge = document.getElementById('forms-dir-badge');
      const fDirTitle = document.getElementById('forms-dir-title');
      const fDirSubtitle = document.getElementById('forms-dir-subtitle');
      if (fDirBadge) fDirBadge.textContent = t.formsDirBadge;
      if (fDirTitle) fDirTitle.textContent = t.formsDirTitle;
      if (fDirSubtitle) fDirSubtitle.textContent = t.formsDirSubtitle;

      const fBtnAll = document.getElementById('filter-btn-all');
      const fBtnK = document.getElementById('filter-btn-kindergarten');
      const fBtnP = document.getElementById('filter-btn-primary');
      const fBtnS = document.getElementById('filter-btn-secondary');
      const fBtnV = document.getElementById('filter-btn-vocational');
      if (fBtnAll) fBtnAll.textContent = t.filterAll;
      if (fBtnK) fBtnK.textContent = t.filterKindergarten;
      if (fBtnP) fBtnP.textContent = t.filterPrimary;
      if (fBtnS) fBtnS.textContent = t.filterSecondary;
      if (fBtnV) fBtnV.textContent = t.filterVocational;

      // Update Chatbot trigger label
      const botLabel = document.getElementById('chatbot-btn-label');
      if (botLabel) botLabel.textContent = t.botBtnLabel;

      // Translate all other inline .lang-txt elements
      document.querySelectorAll('.lang-txt').forEach(el => {
        const val = el.getAttribute(`data-${globalLanguage}`);
        if (val) el.textContent = val;
      });

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    // --- 5.5 CHATBOT ASSISTANT & AI TEACHING ENGINE ---
    function loadBotData() {
      const storedCfg = localStorage.getItem('elimu_chatbot_config');
      if (storedCfg) {
        try { botConfig = Object.assign({}, DEFAULT_BOT_CONFIG, JSON.parse(storedCfg)); } catch (e) {}
      }
      const storedKb = localStorage.getItem('elimu_chatbot_kb');
      if (storedKb) {
        try { botKnowledge = JSON.parse(storedKb); } catch (e) {}
      }
      updateBotVisibility();
    }

    async function saveBotConfig() {
      siteState.botConfig = { ...botConfig };
      localStorage.setItem('elimu_chatbot_config', JSON.stringify(botConfig));
      updateBotVisibility();
      await saveSiteState();
    }

    async function saveBotKb() {
      siteState.botKnowledge = [...botKnowledge];
      localStorage.setItem('elimu_chatbot_kb', JSON.stringify(botKnowledge));
      await saveSiteState();
    }

    function updateBotVisibility() {
      const container = document.getElementById('chatbot-container');
      const headerName = document.getElementById('chatbot-header-name');
      if (headerName) headerName.textContent = botConfig.name || 'ElimuBot AI Assistant';
      if (container) {
        if (botConfig.status === 'offline') {
          container.classList.add('hidden');
        } else {
          container.classList.remove('hidden');
        }
      }
    }

    function toggleChatbot(forceState) {
      const container = document.getElementById('chatbot-container');
      if (container && container.classList.contains('hidden')) {
        container.classList.remove('hidden');
      }

      const win = document.getElementById('chatbot-window');
      if (!win) return;
      if (typeof forceState === 'boolean') {
        isChatbotOpen = forceState;
      } else {
        isChatbotOpen = !isChatbotOpen;
      }

      if (isChatbotOpen) {
        win.classList.remove('hidden');
        win.classList.add('flex');
        setTimeout(() => {
          win.classList.remove('scale-95');
          win.classList.add('scale-100');
        }, 10);
        if (chatHistory.length === 0) {
          initChatbot();
        }
        const input = document.getElementById('chatbot-input');
        if (input) input.focus();
      } else {
        win.classList.remove('scale-100');
        win.classList.add('scale-95');
        setTimeout(() => {
          win.classList.add('hidden');
          win.classList.remove('flex');
        }, 200);
      }
      if (window.lucide) window.lucide.createIcons();
    }
    window.toggleChatbot = toggleChatbot;

    function initChatbot() {
      const welcome = (globalLanguage === 'sw') ? (botConfig.welcomeSw || DEFAULT_BOT_CONFIG.welcomeSw) : (botConfig.welcomeEn || DEFAULT_BOT_CONFIG.welcomeEn);
      chatHistory = [{ sender: 'bot', text: welcome, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
      renderChatMessages();
    }

    function clearChatHistory() {
      initChatbot();
    }

    function renderChatMessages() {
      const box = document.getElementById('chatbot-messages');
      if (!box) return;
      box.innerHTML = '';

      chatHistory.forEach(msg => {
        const div = document.createElement('div');
        if (msg.sender === 'user') {
          div.className = "flex justify-end";
          div.innerHTML = `
            <div class="max-w-[82%] bg-brand-700 text-white p-3 rounded-2xl rounded-tr-none shadow-sm space-y-1">
              <p class="leading-relaxed whitespace-pre-line">${escapeHtml(msg.text)}</p>
              <div class="text-[9px] text-brand-200 text-right font-light">${msg.time}</div>
            </div>
          `;
        } else {
          div.className = "flex justify-start items-start gap-2";
          div.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-slate-900 text-brand-400 flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <i data-lucide="bot" class="w-3.5 h-3.5"></i>
            </div>
            <div class="max-w-[85%] bg-white text-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm space-y-1">
              <p class="leading-relaxed whitespace-pre-line">${formatBotMessage(msg.text)}</p>
              <div class="text-[9px] text-slate-400 text-left font-light">${msg.time}</div>
            </div>
          `;
        }
        box.appendChild(div);
      });

      if (window.lucide) window.lucide.createIcons();
      box.scrollTop = box.scrollHeight;
    }

    function formatBotMessage(text) {
      let esc = escapeHtml(text);
      esc = esc.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" class="text-brand-700 underline font-semibold">$1</a>');
      return esc;
    }

    function escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }

    function sendQuickPrompt(promptText) {
      const input = document.getElementById('chatbot-input');
      if (input) input.value = promptText;
      handleChatbotSubmit(new Event('submit'));
    }

    function handleChatbotSubmit(e) {
      if (e) e.preventDefault();
      const input = document.getElementById('chatbot-input');
      if (!input) return;
      const query = input.value.trim();
      if (!query) return;

      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      chatHistory.push({ sender: 'user', text: query, time });
      input.value = '';
      renderChatMessages();

      // Show typing indicator
      showBotTyping(true);

      setTimeout(() => {
        showBotTyping(false);
        const botResponse = findBotAnswer(query);
        chatHistory.push({ sender: 'bot', text: botResponse.answer, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
        renderChatMessages();
      }, 450);
    }

    function showBotTyping(show) {
      const box = document.getElementById('chatbot-messages');
      if (!box) return;
      const existing = document.getElementById('bot-typing-indicator');
      if (show) {
        if (!existing) {
          const div = document.createElement('div');
          div.id = 'bot-typing-indicator';
          div.className = "flex justify-start items-center gap-2 text-slate-400";
          div.innerHTML = `
            <div class="w-6 h-6 rounded-full bg-slate-900 text-brand-400 flex items-center justify-center shrink-0">
              <i data-lucide="bot" class="w-3.5 h-3.5"></i>
            </div>
            <div class="bg-white border border-slate-200 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          `;
          box.appendChild(div);
          if (window.lucide) window.lucide.createIcons();
          box.scrollTop = box.scrollHeight;
        }
      } else {
        if (existing) existing.remove();
      }
    }

    function findBotAnswer(query) {
      const q = query.toLowerCase().trim();
      const tokens = q.split(/[\s,?.!/]+/).filter(Boolean);

      let bestMatch = null;
      let highestScore = 0;

      botKnowledge.forEach(item => {
        const keywords = item.keywords.toLowerCase().split(/[\s,]+/).filter(Boolean);
        let score = 0;

        // Check exact phrase / keyword matches
        keywords.forEach(kw => {
          if (q.includes(kw)) {
            score += kw.length > 3 ? 3 : 1.5;
          }
          tokens.forEach(tok => {
            if (tok === kw) score += 2;
            else if (tok.includes(kw) || kw.includes(tok)) score += 1;
          });
        });

        if (score > highestScore) {
          highestScore = score;
          bestMatch = item;
        }
      });

      if (highestScore >= 1.5 && bestMatch) {
        return { answer: bestMatch.answer, topic: bestMatch.topic, score: highestScore };
      }

      // Polite Fallback if no matching keyword
      const fallback = (globalLanguage === 'sw')
        ? `Samahani, sijapata jibu kamili kwa swali hilo. Unaweza kuangalia chaguo za hapo chini au kuwasiliana moja kwa moja na Dawati la Usajili kupitia WhatsApp: +${botConfig.supportPhone || '255788346050'}.`
        : `I'm sorry, I couldn't find a direct answer for that question. Please choose one of the suggested topics or reach out directly to our Admissions Helpdesk via WhatsApp: +${botConfig.supportPhone || '255788346050'}.`;
      return { answer: fallback, topic: "General Help", score: 0 };
    }

    // --- CMS CHATBOT MANAGEMENT & TEACHING FUNCTIONS ---
    function populateBotCms() {
      const nameEl = document.getElementById('cms-bot-name');
      const statusEl = document.getElementById('cms-bot-status');
      const wEnEl = document.getElementById('cms-bot-welcome-en');
      const wSwEl = document.getElementById('cms-bot-welcome-sw');
      const phoneEl = document.getElementById('cms-bot-support-phone');

      if (nameEl) nameEl.value = botConfig.name || '';
      if (statusEl) statusEl.value = botConfig.status || 'online';
      if (wEnEl) wEnEl.value = botConfig.welcomeEn || '';
      if (wSwEl) wSwEl.value = botConfig.welcomeSw || '';
      if (phoneEl) phoneEl.value = botConfig.supportPhone || '';
      renderBotQaTable();
    }

    async function handleSaveBotConfig() {
      botConfig.name = document.getElementById('cms-bot-name').value.trim() || 'ElimuBot AI Assistant';
      botConfig.status = document.getElementById('cms-bot-status').value;
      botConfig.welcomeEn = document.getElementById('cms-bot-welcome-en').value.trim() || DEFAULT_BOT_CONFIG.welcomeEn;
      botConfig.welcomeSw = document.getElementById('cms-bot-welcome-sw').value.trim() || DEFAULT_BOT_CONFIG.welcomeSw;
      botConfig.supportPhone = document.getElementById('cms-bot-support-phone').value.trim() || '255788346050';
      await saveBotConfig();
      alert("Chatbot identity & configuration saved globally!");
    }

    function renderBotQaTable() {
      const tbody = document.getElementById('cms-bot-qa-table-body');
      const countEl = document.getElementById('cms-bot-qa-count');
      if (!tbody) return;
      tbody.innerHTML = '';
      if (countEl) countEl.textContent = `${botKnowledge.length} Entries`;

      botKnowledge.forEach(item => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-50 transition";
        tr.innerHTML = `
          <td class="p-2.5 font-bold text-slate-800 whitespace-nowrap">
            <span class="px-2 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700">${escapeHtml(item.topic)}</span>
          </td>
          <td class="p-2.5 text-slate-600 max-w-[150px] truncate" title="${escapeHtml(item.keywords)}">
            ${escapeHtml(item.keywords)}
          </td>
          <td class="p-2.5 text-slate-700 max-w-[250px] truncate" title="${escapeHtml(item.answer)}">
            ${escapeHtml(item.answer)}
          </td>
          <td class="p-2.5 text-right whitespace-nowrap space-x-1">
            <button onclick="editBotQa('${item.id}')" class="p-1 text-slate-500 hover:text-indigo-600 rounded transition" title="Edit Rule">
              <i data-lucide="edit" class="w-3.5 h-3.5 inline"></i>
            </button>
            <button onclick="deleteBotQa('${item.id}')" class="p-1 text-slate-500 hover:text-rose-600 rounded transition" title="Delete Rule">
              <i data-lucide="trash-2" class="w-3.5 h-3.5 inline"></i>
            </button>
          </td>
        `;
        tbody.appendChild(tr);
      });

      if (window.lucide) window.lucide.createIcons();
    }

    async function handleSaveBotQa() {
      const id = document.getElementById('cms-bot-qa-id').value;
      const topic = document.getElementById('cms-bot-qa-topic').value;
      const keywords = document.getElementById('cms-bot-qa-keywords').value.trim();
      const answer = document.getElementById('cms-bot-qa-answer').value.trim();

      if (!keywords || !answer) {
        alert("Please provide both Trigger Keywords and the Bot Response Answer.");
        return;
      }

      if (id) {
        // Edit existing
        const item = botKnowledge.find(k => k.id === id);
        if (item) {
          item.topic = topic;
          item.keywords = keywords;
          item.answer = answer;
        }
      } else {
        // Add new
        const newEntry = {
          id: 'kb-' + Date.now(),
          topic,
          keywords,
          answer
        };
        botKnowledge.unshift(newEntry);
      }

      await saveBotKb();
      resetBotQaForm();
      renderBotQaTable();
      alert("Knowledge taught to ElimuBot globally!");
    }

    function editBotQa(id) {
      const item = botKnowledge.find(k => k.id === id);
      if (!item) return;

      document.getElementById('cms-bot-qa-id').value = item.id;
      document.getElementById('cms-bot-qa-topic').value = item.topic;
      document.getElementById('cms-bot-qa-keywords').value = item.keywords;
      document.getElementById('cms-bot-qa-answer').value = item.answer;

      document.getElementById('cms-bot-qa-heading').querySelector('span').innerHTML = `<i data-lucide="edit" class="w-4 h-4"></i> Edit Knowledge Rule`;
      document.getElementById('cms-bot-qa-submit-text').textContent = "Update Knowledge Rule";
      document.getElementById('cms-bot-qa-cancel-btn').classList.remove('hidden');
      if (window.lucide) window.lucide.createIcons();
    }

    function resetBotQaForm() {
      document.getElementById('cms-bot-qa-id').value = '';
      document.getElementById('cms-bot-qa-keywords').value = '';
      document.getElementById('cms-bot-qa-answer').value = '';
      document.getElementById('cms-bot-qa-heading').querySelector('span').innerHTML = `<i data-lucide="plus-circle" class="w-4 h-4"></i> Teach New Knowledge`;
      document.getElementById('cms-bot-qa-submit-text').textContent = "Teach Knowledge to Bot";
      document.getElementById('cms-bot-qa-cancel-btn').classList.add('hidden');
      if (window.lucide) window.lucide.createIcons();
    }

    async function deleteBotQa(id) {
      if (!confirm("Are you sure you want to delete this knowledge rule from the bot?")) return;
      botKnowledge = botKnowledge.filter(k => k.id !== id);
      await saveBotKb();
      renderBotQaTable();
    }

    async function restoreDefaultBotKnowledge() {
      if (!confirm("Reset all taught knowledge back to the default ElimuBot knowledge base?")) return;
      botKnowledge = [...DEFAULT_BOT_KB];
      await saveBotKb();
      renderBotQaTable();
      alert("Default knowledge base restored globally!");
    }

    function testBotQuery() {
      const input = document.getElementById('cms-bot-test-input');
      const q = input.value.trim();
      if (!q) return;

      const res = findBotAnswer(q);
      const resContainer = document.getElementById('cms-bot-test-result');
      const topicEl = document.getElementById('cms-bot-test-matched-topic');
      const scoreEl = document.getElementById('cms-bot-test-score');
      const answerEl = document.getElementById('cms-bot-test-answer');

      resContainer.classList.remove('hidden');
      topicEl.textContent = res.topic;
      scoreEl.textContent = (res.score > 0) ? `${Math.min(Math.round((res.score / 5) * 100), 100)}% match` : 'Fallback Rule';
      answerEl.textContent = res.answer;
    }

    function loadPublicContents() {
      const stored = localStorage.getItem('elimu_public_contents');
      if (stored) {
        try {
          publicContents = JSON.parse(stored);
        } catch (e) {
          publicContents = { ...DEFAULT_PUBLIC_CONTENTS };
        }
      } else {
        publicContents = { ...DEFAULT_PUBLIC_CONTENTS };
      }
      applyPublicContents();
    }

    function applyPublicContents() {
      const homeBadgeEl = document.getElementById('home-subtitle-badge');
      const homeTitleEl = document.getElementById('home-hero-title');
      const homeSubtitleEl = document.getElementById('home-hero-subtitle');
      const homeCatsTitleEl = document.getElementById('home-categories-title');
      const homeCatsSubtitleEl = document.getElementById('home-categories-subtitle');

      if (homeBadgeEl) homeBadgeEl.innerHTML = `<i data-lucide="sparkles" class="w-3.5 h-3.5"></i> ${publicContents.homeHeroBadge || DEFAULT_PUBLIC_CONTENTS.homeHeroBadge}`;
      if (homeTitleEl) homeTitleEl.textContent = publicContents.homeHeroTitle;
      if (homeSubtitleEl) homeSubtitleEl.textContent = publicContents.homeHeroSubtitle;
      if (homeCatsTitleEl) homeCatsTitleEl.textContent = publicContents.homeCategoriesTitle || DEFAULT_PUBLIC_CONTENTS.homeCategoriesTitle;
      if (homeCatsSubtitleEl) homeCatsSubtitleEl.textContent = publicContents.homeCategoriesSubtitle || DEFAULT_PUBLIC_CONTENTS.homeCategoriesSubtitle;

      const aboutTitleEl = document.getElementById('about-title');
      const aboutTextEl = document.getElementById('about-text');
      if (aboutTitleEl) aboutTitleEl.textContent = publicContents.aboutTitle;
      if (aboutTextEl) aboutTextEl.textContent = publicContents.aboutText;

      const contactTitleEl = document.getElementById('contact-title');
      const contactTextEl = document.getElementById('contact-text');
      if (contactTitleEl) contactTitleEl.textContent = publicContents.contactTitle;
      if (contactTextEl) contactTextEl.textContent = publicContents.contactText;

      const contactPhoneEl = document.getElementById('contact-info-phone');
      const contactEmailEl = document.getElementById('contact-info-email');
      const contactAddressEl = document.getElementById('contact-info-address');
      if (contactPhoneEl) contactPhoneEl.textContent = publicContents.contactPhone || DEFAULT_PUBLIC_CONTENTS.contactPhone;
      if (contactEmailEl) contactEmailEl.textContent = publicContents.contactEmail || DEFAULT_PUBLIC_CONTENTS.contactEmail;
      if (contactAddressEl) contactAddressEl.textContent = publicContents.contactAddress || DEFAULT_PUBLIC_CONTENTS.contactAddress;

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    async function loadPublicContentsFromCloud() {
      try {
        const response = await fetch('/api/public-contents', { cache: 'no-store' });
        if (response.ok) {
          const res = await response.json();
          if (res.success) {
            const mode = res.dbMode || 'cloudflare_kv';
            if (mode === 'cloudflare_kv') {
              if (res.data) {
                publicContents = res.data;
              } else {
                publicContents = { ...DEFAULT_PUBLIC_CONTENTS };
                if (adminToken) {
                  savePublicContents(publicContents);
                }
              }
              localStorage.setItem('elimu_public_contents', JSON.stringify(publicContents));
              applyPublicContents();
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Backend API not reachable. Using local storage for contents.");
      }
      loadPublicContents();
    }

    function populatePublicContentsForm() {
      document.getElementById('cms-content-home-badge').value = publicContents.homeHeroBadge || DEFAULT_PUBLIC_CONTENTS.homeHeroBadge;
      document.getElementById('cms-content-home-title').value = publicContents.homeHeroTitle || '';
      document.getElementById('cms-content-home-subtitle').value = publicContents.homeHeroSubtitle || '';
      document.getElementById('cms-content-home-cats-title').value = publicContents.homeCategoriesTitle || DEFAULT_PUBLIC_CONTENTS.homeCategoriesTitle;
      document.getElementById('cms-content-home-cats-subtitle').value = publicContents.homeCategoriesSubtitle || DEFAULT_PUBLIC_CONTENTS.homeCategoriesSubtitle;

      document.getElementById('cms-content-about-title').value = publicContents.aboutTitle || '';
      document.getElementById('cms-content-about-text').value = publicContents.aboutText || '';
      document.getElementById('cms-content-contact-title').value = publicContents.contactTitle || '';
      document.getElementById('cms-content-contact-text').value = publicContents.contactText || '';

      document.getElementById('cms-content-contact-phone').value = publicContents.contactPhone || DEFAULT_PUBLIC_CONTENTS.contactPhone;
      document.getElementById('cms-content-contact-email').value = publicContents.contactEmail || DEFAULT_PUBLIC_CONTENTS.contactEmail;
      document.getElementById('cms-content-contact-address').value = publicContents.contactAddress || DEFAULT_PUBLIC_CONTENTS.contactAddress;

      renderCustomContentBlocks();
    }

    async function savePublicContents(updatedContents) {
      publicContents = updatedContents;
      siteState.publicContents = updatedContents;
      localStorage.setItem('elimu_public_contents', JSON.stringify(updatedContents));
      applyPublicContents();
      await saveSiteState();
    }

    async function handlePublicContentsSave(e) {
      e.preventDefault();
      const updatedContents = {
        homeHeroBadge: document.getElementById('cms-content-home-badge').value.trim(),
        homeHeroTitle: document.getElementById('cms-content-home-title').value.trim(),
        homeHeroSubtitle: document.getElementById('cms-content-home-subtitle').value.trim(),
        homeCategoriesTitle: document.getElementById('cms-content-home-cats-title').value.trim(),
        homeCategoriesSubtitle: document.getElementById('cms-content-home-cats-subtitle').value.trim(),
        aboutTitle: document.getElementById('cms-content-about-title').value.trim(),
        aboutText: document.getElementById('cms-content-about-text').value.trim(),
        contactTitle: document.getElementById('cms-content-contact-title').value.trim(),
        contactText: document.getElementById('cms-content-contact-text').value.trim(),
        contactPhone: document.getElementById('cms-content-contact-phone').value.trim(),
        contactEmail: document.getElementById('cms-content-contact-email').value.trim(),
        contactAddress: document.getElementById('cms-content-contact-address').value.trim()
      };

      await savePublicContents(updatedContents);
    }

    // --- Custom Content Sections Management ---
    let customContentSections = [];

    function loadCustomContentSections() {
      const stored = localStorage.getItem('elimu_custom_content_sections');
      if (stored) {
        try {
          customContentSections = JSON.parse(stored);
        } catch(e) {
          customContentSections = [];
        }
      } else {
        customContentSections = [];
      }
      renderCustomContentBlocks();
    }

    async function loadCustomContentFromCloud() {
      try {
        const response = await fetch('/api/custom-contents', { cache: 'no-store' });
        if (response.ok) {
          const res = await response.json();
          if (res.success) {
            const mode = res.dbMode || 'cloudflare_kv';
            if (mode === 'cloudflare_kv') {
              if (res.data) {
                customContentSections = res.data;
              } else {
                customContentSections = [];
              }
              localStorage.setItem('elimu_custom_content_sections', JSON.stringify(customContentSections));
              renderCustomContentBlocks();
              return;
            }
          }
        }
      } catch (err) {
        console.warn("Backend API for custom content not reachable.");
      }
      loadCustomContentSections();
    }

    function renderCustomContentBlocks() {
      const homeContainer = document.getElementById('home-custom-blocks');
      const aboutContainer = document.getElementById('about-custom-blocks');
      const contactContainer = document.getElementById('contact-custom-blocks');

      if (homeContainer) homeContainer.innerHTML = '';
      if (aboutContainer) aboutContainer.innerHTML = '';
      if (contactContainer) contactContainer.innerHTML = '';

      customContentSections.forEach(sec => {
        const targetContainer = 
          sec.page === 'home' ? homeContainer :
          sec.page === 'about' ? aboutContainer :
          sec.page === 'contact' ? contactContainer : null;

        if (!targetContainer) return;

        const block = document.createElement('div');
        block.className = 'bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mt-6';
        block.innerHTML = `
          <h3 class="text-2xl font-bold text-slate-900 mb-3">${sec.title}</h3>
          <p class="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">${sec.content}</p>
        `;
        targetContainer.appendChild(block);
      });

      const listEl = document.getElementById('cms-custom-blocks-list');
      if (listEl) {
        listEl.innerHTML = '';
        if (customContentSections.length === 0) {
          listEl.innerHTML = `<div class="text-xs text-slate-400 italic">No custom page content sections added yet.</div>`;
        } else {
          customContentSections.forEach((sec, idx) => {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs';
            item.innerHTML = `
              <div>
                <span class="font-bold text-slate-800">${sec.title}</span>
                <span class="ml-2 px-1.5 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[9px] uppercase font-bold border border-indigo-100">${sec.page}</span>
                <p class="text-slate-500 text-[10px] mt-0.5 truncate max-w-md">${sec.content}</p>
              </div>
              <button type="button" onclick="handleRemoveCustomBlock(${idx})" class="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
              </button>
            `;
            listEl.appendChild(item);
          });
        }
      }

      if (window.lucide) {
        window.lucide.createIcons();
      }
    }

    async function handleAddCustomBlock() {
      const pageSelect = document.getElementById('cms-block-page');
      const titleInput = document.getElementById('cms-block-title');
      const contentTextarea = document.getElementById('cms-block-content');

      const page = pageSelect.value;
      const title = titleInput.value.trim();
      const content = contentTextarea.value.trim();

      if (!title || !content) {
        alert("Please provide both a title and content for the custom section.");
        return;
      }

      const newSection = {
        id: 'sec-' + Date.now(),
        page,
        title,
        content
      };

      customContentSections.push(newSection);
      await saveCustomContentSections();

      titleInput.value = '';
      contentTextarea.value = '';

      renderCustomContentBlocks();
      alert("Custom section added successfully!");
    }

    async function handleRemoveCustomBlock(idx) {
      if (confirm("Are you sure you want to delete this custom section?")) {
        customContentSections.splice(idx, 1);
        await saveCustomContentSections();
        renderCustomContentBlocks();
      }
    }

    async function saveCustomContentSections() {
      siteState.customContents = customContentSections;
      localStorage.setItem('elimu_custom_content_sections', JSON.stringify(customContentSections));
      await saveSiteState();
    }

    function renderCmsTable() {
      const tbody = document.getElementById('cms-table-body');
      const badge = document.getElementById('cms-count-badge');
      if (!tbody) return;
      tbody.innerHTML = '';
      badge.textContent = `${institutions.length} Institutions`;

      institutions.forEach(inst => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

        const isExpired = inst.serviceExpiry && new Date(inst.serviceExpiry) < new Date();
        const status = inst.serviceStatus || 'active';
        let statusBadge = '';
        if (status === 'suspended') {
          statusBadge = `<span class="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold uppercase border border-rose-200">Suspended</span>`;
        } else if (status === 'expired' || isExpired) {
          statusBadge = `<span class="px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold uppercase border border-amber-200">Expired</span>`;
        } else {
          statusBadge = `<span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase border border-emerald-200">Active</span>`;
        }

        const activePkg = pricingPackages.find(p => p.id === inst.package);
        const pkgName = activePkg ? activePkg.name : 'Basic';

        const expiryLabel = inst.serviceExpiry ? inst.serviceExpiry : 'Lifetime';

        tr.innerHTML = `
          <td class="py-2.5 px-3 font-semibold text-slate-900">${inst.name}</td>
          <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold uppercase">${inst.categoryLabel}</span></td>
          <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase border border-blue-200">${pkgName}</span></td>
          <td class="py-2.5 px-3">${statusBadge}</td>
          <td class="py-2.5 px-3 text-slate-600 font-medium">${expiryLabel}</td>
          <td class="py-2.5 px-3 text-right space-x-1">
            <button onclick="copyDirectLink('${inst.id}')" class="p-1 text-emerald-600 hover:bg-emerald-50 rounded" title="Copy Unique Link"><i data-lucide="link" class="w-4 h-4"></i></button>
            <button onclick="editInstitution('${inst.id}')" class="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
            <button onclick="deleteInstitution('${inst.id}')" class="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      lucide.createIcons();
    }

    function copyDirectLink(id) {
      const inst = institutions.find(i => i.id === id);
      if (!inst) return;
      
      const url = `${window.location.origin}/${inst.slug || inst.id}`;
      navigator.clipboard.writeText(url).then(() => {
        alert("Clean Direct Registration Link copied to clipboard!\nYou can add this link to school platforms.");
      }).catch(err => {
        alert("Failed to copy link. URL is:\n" + url);
      });
    }

    function handleCmsLogoUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const prev = document.getElementById('cms-logo-preview');
      const text = document.getElementById('cms-logo-preview-text');
      
      compressImage(file, 200, 200, 0.8, function(base64) {
        document.getElementById('cms-logo').value = base64;
        prev.src = base64;
        prev.classList.remove('hidden');
        text.textContent = "Logo compressed & ready";
      });
    }

    function handleCmsLetterheadUpload(e) {
      const file = e.target.files[0];
      if (!file) return;
      
      const prev = document.getElementById('cms-letterhead-preview');
      const text = document.getElementById('cms-letterhead-preview-text');
      
      compressImage(file, 800, 200, 0.8, function(base64) {
        document.getElementById('cms-letterhead').value = base64;
        prev.src = base64;
        prev.classList.remove('hidden');
        text.textContent = "Letterhead compressed & ready";
      });
    }

    function handleCmsImageUpload(e) {
      const file = e.target.files[0];
      if (!file) return;

      const prev = document.getElementById('cms-image-preview');
      const text = document.getElementById('cms-image-preview-text');

      compressImage(file, 640, 360, 0.75, function(base64) {
        document.getElementById('cms-image').value = base64;
        prev.src = base64;
        prev.classList.remove('hidden');
        text.textContent = "Cover image compressed & ready";
      });
    }

    function compressImage(file, maxWidth, maxHeight, quality, callback) {
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
          callback(compressedBase64);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    function handleCmsSave(e) {
      e.preventDefault();
      const editId = document.getElementById('cms-edit-id').value;
      const name = document.getElementById('cms-name').value.trim();
      const category = document.getElementById('cms-category').value;
      const region = document.getElementById('cms-region').value.trim();
      const regNo = document.getElementById('cms-reg-no').value.trim();
      const poBox = document.getElementById('cms-po-box').value.trim();
      const programs = document.getElementById('cms-programs').value.trim();
      const levels = document.getElementById('cms-levels').value.trim();
      const phone = document.getElementById('cms-phone').value.trim();
      const email = document.getElementById('cms-email').value.trim();
      const image = document.getElementById('cms-image').value.trim();
      let logo = document.getElementById('cms-logo').value.trim();
      let letterhead = document.getElementById('cms-letterhead').value.trim();
      const primaryColor = document.getElementById('cms-color-primary').value;
      const secondaryColor = document.getElementById('cms-color-secondary').value;
      const joiningEditor = document.getElementById('cms-joining-editor');
      const joining = (joiningEditor ? joiningEditor.innerHTML : document.getElementById('cms-joining').value).trim();
      const desc = document.getElementById('cms-desc').value.trim();
      const serviceStatus = document.getElementById('cms-service-status').value;
      const serviceExpiry = document.getElementById('cms-service-expiry').value;
      const packageId = document.getElementById('cms-package').value;
      
      let slugRaw = document.getElementById('cms-slug').value.trim().toLowerCase();
      let slug = slugRaw.replace(/[^a-z0-9-_]/g, '');

      // Enforce package restrictions on features saved
      const selectedPkg = pricingPackages.find(p => p.id === packageId);
      const pkgFeatures = selectedPkg ? selectedPkg.features : [];
      const hasEverything = pkgFeatures.includes("Everything from all the Packages");

      // Check if package features include the advanced settings:
      const allowBranding = hasEverything || pkgFeatures.includes("Custom Logo & Brand Colors");
      const allowEnterprise = hasEverything || pkgFeatures.includes("Custom Domain Support");

      if (!allowEnterprise) {
        if (slug) {
          alert("Custom URL Slug is only available on packages with Custom Domain Support. It will be cleared.");
          slug = '';
          document.getElementById('cms-slug').value = '';
        }
        if (letterhead) {
          alert("Institution Letterhead Banner is only available on packages with Custom Domain Support. It will be cleared.");
          letterhead = '';
          document.getElementById('cms-letterhead').value = '';
          document.getElementById('cms-letterhead-upload').value = '';
          document.getElementById('cms-letterhead-preview').classList.add('hidden');
          document.getElementById('cms-letterhead-preview-text').textContent = "No letterhead uploaded";
        }
      }
      if (!allowBranding) {
        if (logo) {
          alert("Custom Logo is only available on packages with Custom Logo & Brand Colors. It will be cleared.");
          logo = '';
          document.getElementById('cms-logo').value = '';
          document.getElementById('cms-logo-upload').value = '';
          document.getElementById('cms-logo-preview').classList.add('hidden');
          document.getElementById('cms-logo-preview-text').textContent = "No logo uploaded";
        }
      }

      if (slug) {
        const knownPages = ['forms', 'cms', 'pricing', 'contact', 'about', 'home', 'api', '_redirects'];
        if (knownPages.includes(slug)) {
          alert("The slug '" + slug + "' is reserved for system routes. Please use another.");
          return;
        }
        const duplicate = institutions.find(i => i.slug === slug && i.id !== editId);
        if (duplicate) {
          alert("The custom slug '" + slug + "' is already registered to '" + duplicate.name + "'. Slugs must be unique.");
          return;
        }
      }

      if (editId) {
        // Update existing
        const index = institutions.findIndex(i => i.id === editId);
        if (index !== -1) {
          institutions[index] = {
            ...institutions[index],
            name,
            category,
            categoryLabel: getCategoryLabel(category),
            region,
            regNo,
            poBox,
            programs,
            levels,
            phone,
            email,
            image,
            logo,
            letterhead,
            primaryColor,
            secondaryColor,
            joining,
            desc,
            serviceStatus,
            serviceExpiry,
            package: packageId,
            slug
          };
        }
      } else {
        // Add new
        const newInst = {
          id: 'inst-' + Date.now(),
          name,
          category,
          categoryLabel: getCategoryLabel(category),
          region,
          regNo,
          poBox,
          programs,
          levels,
          phone,
          email,
          image,
          logo,
          letterhead,
          primaryColor,
          secondaryColor,
          joining,
          desc,
          serviceStatus,
          serviceExpiry,
          package: packageId,
          slug
        };
        institutions.push(newInst);
      }

      await saveInstitutions(institutions);
      showSchoolForm(false);
      alert("Institution saved globally!");
    }

    function editInstitution(id) {
      const inst = institutions.find(i => i.id === id);
      if (!inst) return;

      showSchoolForm(true);

      document.getElementById('cms-edit-id').value = inst.id;
      document.getElementById('cms-name').value = inst.name;
      document.getElementById('cms-category').value = inst.category;
      document.getElementById('cms-region').value = inst.region;
      document.getElementById('cms-reg-no').value = inst.regNo || '';
      document.getElementById('cms-po-box').value = inst.poBox || '';
      let programsVal = inst.programs || '';
      if (inst.category === 'vocational' && !programsVal.trim()) {
        programsVal = "Certificate in Information Technology, Diploma in Information Technology, Certificate in Business Administration";
      }
      document.getElementById('cms-programs').value = programsVal;

      let levelsVal = inst.levels || '';
      if (!levelsVal.trim()) {
        if (inst.category === 'kindergarten') {
          levelsVal = "Baby Class 1, Baby Class 2, Baby Class 3";
        } else if (inst.category === 'primary') {
          levelsVal = "Kindergarten, Std 1, Std 2, Std 3, Std 4, Std 5, Std 6, Std 7";
        } else if (inst.category === 'secondary') {
          levelsVal = "Pre-Form 1, Form 1, Form 2, Form 3, Form 4, Form 5, Form 6";
        } else if (inst.category === 'vocational') {
          levelsVal = "Level 1, Level 2, Level 3, NTA Level 4, NTA Level 5, NTA Level 6";
        }
      }
      document.getElementById('cms-levels').value = levelsVal;
      
      // Expand programs/levels section if populated or vocational
      if (programsVal.trim() || levelsVal.trim() || inst.category === 'vocational') {
        toggleCmsAdvancedFields(true);
      } else {
        toggleCmsAdvancedFields(false);
      }

      document.getElementById('cms-phone').value = inst.phone;
      document.getElementById('cms-email').value = inst.email;
      document.getElementById('cms-image').value = inst.image || '';
      document.getElementById('cms-logo').value = inst.logo || '';
      document.getElementById('cms-letterhead').value = inst.letterhead || '';
      document.getElementById('cms-color-primary').value = inst.primaryColor || '#059669';
      document.getElementById('cms-color-secondary').value = inst.secondaryColor || '#10b981';
      
      const joiningEditor = document.getElementById('cms-joining-editor');
      if (joiningEditor) joiningEditor.innerHTML = inst.joining || '';
      document.getElementById('cms-joining').value = inst.joining || '';
      
      document.getElementById('cms-desc').value = inst.desc || '';
      document.getElementById('cms-service-status').value = inst.serviceStatus || 'active';
      document.getElementById('cms-service-expiry').value = inst.serviceExpiry || '';
      const firstPkg = pricingPackages[0];
      document.getElementById('cms-package').value = inst.package || (firstPkg ? firstPkg.id : '');
      document.getElementById('cms-slug').value = inst.slug || '';

      // Populate file previews
      const letterheadPrev = document.getElementById('cms-letterhead-preview');
      const letterheadText = document.getElementById('cms-letterhead-preview-text');
      if (inst.letterhead) {
        letterheadPrev.src = inst.letterhead;
        letterheadPrev.classList.remove('hidden');
        letterheadText.textContent = "Existing letterhead loaded";
      } else {
        letterheadPrev.classList.add('hidden');
        letterheadText.textContent = "No letterhead uploaded";
      }
      const logoPrev = document.getElementById('cms-logo-preview');
      const logoText = document.getElementById('cms-logo-preview-text');
      if (inst.logo) {
        logoPrev.src = inst.logo;
        logoPrev.classList.remove('hidden');
        logoText.textContent = "Existing logo loaded";
      } else {
        logoPrev.classList.add('hidden');
        logoText.textContent = "No logo uploaded";
      }

      const imgPrev = document.getElementById('cms-image-preview');
      const imgText = document.getElementById('cms-image-preview-text');
      if (inst.image) {
        imgPrev.src = inst.image;
        imgPrev.classList.remove('hidden');
        imgText.textContent = "Existing cover image loaded";
      } else {
        imgPrev.classList.add('hidden');
        imgText.textContent = "No cover image uploaded";
      }

      document.getElementById('cms-form-heading').innerHTML = `<i data-lucide="edit" class="w-4 h-4"></i> Edit Institution`;
      document.getElementById('cms-submit-btn').textContent = "Update Institution";
      lucide.createIcons();
    }

    async function deleteInstitution(id) {
      if (confirm("Are you sure you want to remove this institution?")) {
        institutions = institutions.filter(i => i.id !== id);
        await saveInstitutions(institutions);
        alert("Institution deleted globally!");
      }
    }

    function resetCmsForm() {
      document.getElementById('cms-institution-form').reset();
      document.getElementById('cms-edit-id').value = '';
      document.getElementById('cms-color-primary').value = '#059669';
      document.getElementById('cms-color-secondary').value = '#10b981';
      document.getElementById('cms-service-status').value = 'active';
      document.getElementById('cms-service-expiry').value = '';
      const firstPkg = pricingPackages[0];
      document.getElementById('cms-package').value = firstPkg ? firstPkg.id : '';
      document.getElementById('cms-slug').value = '';
      
      const joiningEditor = document.getElementById('cms-joining-editor');
      if (joiningEditor) joiningEditor.innerHTML = '';
      document.getElementById('cms-joining').value = '';
      toggleCmsAdvancedFields(false);
      
      // Reset upload fields & previews
      document.getElementById('cms-logo-upload').value = '';
      document.getElementById('cms-image-upload').value = '';
      document.getElementById('cms-letterhead-upload').value = '';
      document.getElementById('cms-letterhead').value = '';
      document.getElementById('cms-logo-preview').classList.add('hidden');
      document.getElementById('cms-logo-preview-text').textContent = "No logo uploaded";
      document.getElementById('cms-image-preview').classList.add('hidden');
      document.getElementById('cms-image-preview-text').textContent = "No cover image uploaded";
      document.getElementById('cms-letterhead-preview').classList.add('hidden');
      document.getElementById('cms-letterhead-preview-text').textContent = "No letterhead uploaded";

      document.getElementById('cms-form-heading').innerHTML = `<i data-lucide="plus-circle" class="w-4 h-4"></i> Add New Institution`;
      document.getElementById('cms-submit-btn').textContent = "Save Institution";
      lucide.createIcons();
    }

     let availableFeatures = [];
     const defaultFeatures = [
      "1 School Admission Form",
      "Standard Tanzania Fields",
      "Direct WhatsApp Routing",
      "Basic PDF Generation",
      "Email Notifications",
      "Custom Logo & Brand Colors",
      "Bilingual Form (EN/SW)",
      "Custom Joining Instructions",
      "Combined PDF Compiler",
      "Direct Link Sharing",
      "Cloudflare KV Sync",
      "Unlimited Admission Forms",
      "Multiple School Branches",
      "Custom Domain Support",
      "Advanced Analytics Panel",
      "Priority WhatsApp Desk",
      "SMS Portal API Integration",
      "1 year Free support",
      "3 Times Customization",
      "Everything from all the Packages"
     ];

     function loadAvailableFeatures() {
       const stored = localStorage.getItem('elimu_available_features');
       if (stored) {
         try {
           availableFeatures = JSON.parse(stored);
         } catch(e) {
           availableFeatures = [...defaultFeatures];
         }
       } else {
         availableFeatures = [...defaultFeatures];
         localStorage.setItem('elimu_available_features', JSON.stringify(availableFeatures));
       }
     }

     function populatePredefinedFeatures() {
       const container = document.getElementById('cms-pkg-features-container');
       if (!container) return;
       container.innerHTML = '';
       
       availableFeatures.forEach((feature, idx) => {
         const div = document.createElement('div');
         div.className = 'flex items-center justify-between gap-2 py-0.5 border-b border-slate-100 last:border-b-0';
         div.innerHTML = `
           <div class="flex items-center gap-1.5">
             <input type="checkbox" id="feature-${idx}" value="${feature}" class="cms-pkg-feature-checkbox w-3.5 h-3.5 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500 cursor-pointer" />
             <label for="feature-${idx}" class="text-[10px] font-medium text-slate-700 cursor-pointer select-none">${feature}</label>
           </div>
           <button type="button" onclick="handleRemoveFeature(${idx})" class="p-0.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded" title="Delete feature definition">
             <i data-lucide="x" class="w-3.5 h-3.5"></i>
           </button>
         `;
         container.appendChild(div);
       });
       if (window.lucide) {
         window.lucide.createIcons();
       }
     }

     function handleAddFeature() {
       const input = document.getElementById('cms-add-feature-input');
       if (!input) return;
       const featureName = input.value.trim();
       if (!featureName) {
         alert("Please enter a feature name.");
         return;
       }
       if (availableFeatures.includes(featureName)) {
         alert("This feature already exists in the list.");
         return;
       }
       availableFeatures.push(featureName);
       localStorage.setItem('elimu_available_features', JSON.stringify(availableFeatures));
       input.value = '';
       populatePredefinedFeatures();
     }

     function handleRemoveFeature(idx) {
       const featureName = availableFeatures[idx];
       if (confirm(`Are you sure you want to completely remove the feature "${featureName}" from the list?`)) {
         availableFeatures.splice(idx, 1);
         localStorage.setItem('elimu_available_features', JSON.stringify(availableFeatures));
         populatePredefinedFeatures();
       }
     }

    // --- 6. Pricing Packages CRUD Operations ---
    function renderPricingPackages() {
      const grid = document.getElementById('pricing-packages-grid');
      if (!grid) return;
      grid.innerHTML = '';

      pricingPackages.forEach(pkg => {
        const card = document.createElement('div');
        card.className = pkg.popular 
          ? 'bg-indigo-950 text-white rounded-2xl border-2 border-indigo-500 shadow-xl p-8 relative flex flex-col justify-between transform scale-105 z-10'
          : 'bg-white text-slate-800 rounded-2xl border border-slate-200 shadow-sm p-8 flex flex-col justify-between';

        const recommendedBadge = pkg.popular
          ? `<span class="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">Recommended</span>`
          : '';

        const cycleColor = pkg.popular ? 'text-indigo-300' : 'text-slate-500';
        const featureTextColor = pkg.popular ? 'text-indigo-200' : 'text-slate-600';
        const featureCheckColor = pkg.popular ? 'text-indigo-400' : 'text-emerald-600';
        const buttonClass = pkg.popular 
          ? 'w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-lg transition mt-8'
          : 'w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition mt-8';

        card.innerHTML = `
          <div>
            ${recommendedBadge}
            <div class="mb-6">
              <h4 class="text-lg font-bold ${pkg.popular ? 'text-white' : 'text-slate-900'}">${pkg.name}</h4>
              <div class="mt-4 flex items-baseline">
                <span class="text-3xl font-extrabold tracking-tight">${pkg.price}</span>
                <span class="ml-1 text-xs font-semibold ${cycleColor}">/${pkg.cycle}</span>
              </div>
            </div>
            <ul class="space-y-3">
              ${pkg.features.map(f => `
                <li class="flex items-start gap-2.5 ${featureTextColor} text-xs">
                  <i data-lucide="check" class="w-4 h-4 ${featureCheckColor} shrink-0 mt-0.5"></i>
                  <span>${f}</span>
                </li>
              `).join('')}
            </ul>
          </div>
          <div>
            <button onclick="navigateTo('contact')" class="${buttonClass}">Select Plan</button>
          </div>
        `;
        grid.appendChild(card);
      });
      lucide.createIcons();
    }

    function renderPricingCmsTable() {
      const tbody = document.getElementById('cms-pricing-table-body');
      const count = document.getElementById('cms-pkg-count');
      if (!tbody || !count) return;
      tbody.innerHTML = '';
      count.textContent = `${pricingPackages.length} Packages`;

      pricingPackages.forEach(pkg => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';
        tr.innerHTML = `
          <td class="py-2.5 px-3 font-semibold text-slate-900">${pkg.name}</td>
          <td class="py-2.5 px-3 font-bold text-indigo-700">${pkg.price} / ${pkg.cycle}</td>
          <td class="py-2.5 px-3 text-slate-600">${pkg.features.length} features</td>
          <td class="py-2.5 px-3 text-slate-600">${pkg.popular ? '⭐ Yes' : 'No'}</td>
          <td class="py-2.5 px-3 text-right space-x-1">
            <button onclick="editPricingPackage('${pkg.id}')" class="p-1 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><i data-lucide="edit-3" class="w-4 h-4"></i></button>
            <button onclick="deletePricingPackage('${pkg.id}')" class="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      lucide.createIcons();
    }

    async function renderCmsContactsTable() {
      const tbody = document.getElementById('cms-contacts-table-body');
      const badge = document.getElementById('cms-contacts-count-badge');
      if (!tbody) return;
      tbody.innerHTML = '';

      let messages = [];

      if (dbConnectionMode === 'cloudflare_kv' && adminToken) {
        try {
          const response = await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/contacts', {
            headers: { 'Authorization': `Bearer ${adminToken}` },
            cache: 'no-store'
          });
          if (response.ok) {
            const res = await response.json();
            if (res.success && res.data) {
              messages = res.data;
              localStorage.setItem('elimu_contact_messages', JSON.stringify(messages));
            }
          }
        } catch (err) {
          console.warn("Could not load contact messages from KV backend. Falling back to local copy.");
        }
      }

      if (messages.length === 0) {
        messages = JSON.parse(localStorage.getItem('elimu_contact_messages') || '[]');
      }

      badge.textContent = `${messages.length} Messages`;

      if (messages.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="7" class="py-8 text-center text-slate-400 font-semibold">No contact messages received yet.</td>
          </tr>
        `;
        return;
      }

      messages.forEach((msg, idx) => {
        const tr = document.createElement('tr');
        tr.className = 'hover:bg-slate-50 transition border-b border-slate-100';

        const dateStr = new Date(msg.timestamp).toLocaleString();

        tr.innerHTML = `
          <td class="py-2.5 px-3 font-semibold text-slate-900">${msg.name}</td>
          <td class="py-2.5 px-3 text-slate-600">${msg.email}</td>
          <td class="py-2.5 px-3 text-slate-500">${msg.school || 'N/A'}</td>
          <td class="py-2.5 px-3 text-slate-700 font-medium">${msg.subject}</td>
          <td class="py-2.5 px-3">
            <div class="max-w-xs truncate text-slate-500" title="${msg.message}">${msg.message}</div>
          </td>
          <td class="py-2.5 px-3 text-slate-400">${dateStr}</td>
          <td class="py-2.5 px-3 text-right">
            <button onclick="deleteCmsContactMessage(${idx})" class="p-1 text-red-600 hover:bg-red-50 rounded" title="Delete Message"><i data-lucide="trash-2" class="w-4 h-4"></i></button>
          </td>
        `;
        tbody.appendChild(tr);
      });
      lucide.createIcons();
    }

    async function deleteCmsContactMessage(idx) {
      if (confirm("Are you sure you want to delete this message?")) {
        const messages = JSON.parse(localStorage.getItem('elimu_contact_messages') || '[]');
        messages.splice(idx, 1);
        localStorage.setItem('elimu_contact_messages', JSON.stringify(messages));

        if (dbConnectionMode === 'cloudflare_kv' && adminToken) {
          try {
            await fetch((SYSTEM_CONFIG.apiUrl || '') + '/api/contacts', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
              },
              body: JSON.stringify(messages)
            });
          } catch (err) {
            console.error("Failed to delete message from cloud KV");
          }
        }
        await renderCmsContactsTable();
      }
    }

    async function handlePricingSave(e) {
      e.preventDefault();
      const editId = document.getElementById('cms-pkg-edit-id').value;
      const name = document.getElementById('cms-pkg-name').value.trim();
      const price = document.getElementById('cms-pkg-price').value.trim();
      const cycle = document.getElementById('cms-pkg-cycle').value.trim();
      const popular = document.getElementById('cms-pkg-popular').value === 'true';
      
      const features = [];
      document.querySelectorAll('.cms-pkg-feature-checkbox').forEach(cb => {
        if (cb.checked) {
          features.push(cb.value);
        }
      });

      if (features.length === 0) {
        alert("Please select at least one feature/permission for the package.");
        return;
      }

      let updated = [...pricingPackages];
      if (editId) {
        const index = updated.findIndex(p => p.id === editId);
        if (index !== -1) {
          updated[index] = { id: editId, name, price, cycle, popular, features };
        }
      } else {
        const newPkg = { id: 'pkg-' + Date.now(), name, price, cycle, popular, features };
        updated.push(newPkg);
      }

      await savePricingPackages(updated);
      resetPricingForm();
      alert("Pricing plan saved globally!");
    }

    function editPricingPackage(id) {
      const pkg = pricingPackages.find(p => p.id === id);
      if (!pkg) return;

      document.getElementById('cms-pkg-edit-id').value = pkg.id;
      document.getElementById('cms-pkg-name').value = pkg.name;
      document.getElementById('cms-pkg-price').value = pkg.price;
      document.getElementById('cms-pkg-cycle').value = pkg.cycle;
      document.getElementById('cms-pkg-popular').value = pkg.popular ? 'true' : 'false';
      
      // Select appropriate checkboxes
      document.querySelectorAll('.cms-pkg-feature-checkbox').forEach(cb => {
        cb.checked = pkg.features.includes(cb.value);
      });

      document.getElementById('cms-pkg-form-heading').innerHTML = `<i data-lucide="edit" class="w-4 h-4"></i> Edit Pricing Plan`;
      document.getElementById('cms-pkg-submit-btn').textContent = "Update Package";
      lucide.createIcons();
    }

    async function deletePricingPackage(id) {
      if (confirm("Are you sure you want to delete this pricing package?")) {
        const updated = pricingPackages.filter(p => p.id !== id);
        await savePricingPackages(updated);
        alert("Pricing plan deleted globally!");
      }
    }

    function resetPricingForm() {
      document.getElementById('cms-pricing-form').reset();
      document.getElementById('cms-pkg-edit-id').value = '';
      document.getElementById('cms-pkg-form-heading').innerHTML = `<i data-lucide="plus-circle" class="w-4 h-4"></i> Add Pricing Plan`;
      document.getElementById('cms-pkg-submit-btn').textContent = "Save Package";
      
      // Deselect all checkboxes
      document.querySelectorAll('.cms-pkg-feature-checkbox').forEach(cb => {
        cb.checked = false;
      });

      lucide.createIcons();
    }

    async function resetToDefaults() {
      if (confirm("Reset institution list and pricing plans to initial demo data?")) {
        await saveInstitutions(defaultInstitutions);
        await savePricingPackages(defaultPricingPackages);
        alert("Defaults restored globally!");
      }
    }

    // Toggle Mobile Menu
    document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
      document.getElementById('mobile-menu').classList.toggle('hidden');
    });

    function checkUrlRouting() {
      const params = new URLSearchParams(window.location.search);
      let schoolId = params.get('school');
      const config = params.get('config');

      // Hash routing parser (e.g. #/forms or #/forms/tuangoma-primary)
      const hash = window.location.hash || '#/';
      const hashClean = hash.replace(/^#\/?/, '').split('?')[0]; // Remove leading hash and query
      const pathParts = hashClean.split('/').filter(p => p);

      if (!schoolId) {
        if (pathParts.length > 0) {
          const potentialId = pathParts[pathParts.length - 1].toLowerCase();
          const firstPart = pathParts[0].toLowerCase();
          
          // Check if it's a known page
          const knownPages = ['forms', 'cms', 'pricing', 'contact', 'about', 'home'];
          if (knownPages.includes(firstPart) && pathParts.length === 1) {
            navigateTo(firstPart, false);
            if (firstPart === 'forms') {
              const activeWrap = document.getElementById('active-form-wrapper');
              if (activeWrap) activeWrap.classList.add('hidden');
            }
            return;
          }

          // Check if matches school ID or slug
          const searchKey = pathParts.length > 1 ? potentialId : firstPart;
          const school = (institutions && institutions.length > 0) ? institutions.find(i => 
            i.id.toLowerCase() === searchKey || 
            (i.slug && i.slug.toLowerCase() === searchKey)
          ) : null;

          if (school) {
            schoolId = school.id;
          } else if (knownPages.includes(firstPart)) {
            navigateTo(firstPart, false);
            return;
          }
        } else {
          // If empty path, route to home
          navigateTo('home', false);
        }
      }

      if (schoolId) {
        if (config) {
          try {
            const decoded = JSON.parse(decodeURIComponent(escape(atob(decodeURIComponent(config)))));
            const idx = institutions.findIndex(i => i.id === decoded.id);
            if (idx !== -1) {
              institutions[idx] = decoded;
            } else {
              institutions.push(decoded);
            }
            localStorage.setItem('elimu_institutions_prod', JSON.stringify(institutions));
          } catch (e) {
            console.error("Error parsing school config from URL", e);
          }
        }
        
        navigateTo('forms', false);
        openFormForSchool(schoolId, false);
      }
    }

    window.addEventListener('hashchange', () => {
      checkUrlRouting();
    });

    window.addEventListener('popstate', () => {
      checkUrlRouting();
    });

    // Boot
    async function bootApp() {
      // 1. Synchronously resolve current URL route immediately before awaiting async operations
      checkUrlRouting();

      applySystemBranding();
      loadGlobalLanguage();
      loadBotData();
      loadAvailableFeatures();
      populatePredefinedFeatures();
      await loadSiteData();

      // Ensure form is opened if school ID was in URL after data loaded
      const hash = window.location.hash || '';
      const params = new URLSearchParams(window.location.search);
      if (params.get('school') || hash.includes('/')) {
        checkUrlRouting();
      }

      // Set up auto-saving for form drafts
      const form = document.getElementById('institution-admission-form');
      if (form) {
        form.addEventListener('input', saveFormDraft);
        form.addEventListener('change', saveFormDraft);
      }
    }
    bootApp();
  