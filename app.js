/**
 * VerdeLoop Resource Management & Recycling Co. - Core Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveCounters();
  initWasteSorter();
  initCalculator();
  initBookingWizard();
  initCharts();
  initModals();
  initFaqAccordion();
  initMobileMenu();
});

/* ==========================================================================
   1. LIVE METRICS & REAL-TIME DIVERSION TICKER
   ========================================================================== */
function initLiveCounters() {
  const tickerEl = document.getElementById('liveDivertedKg');
  if (tickerEl) {
    let currentKg = 482914380;
    setInterval(() => {
      currentKg += Math.floor(Math.random() * 5) + 3;
      tickerEl.innerText = (currentKg / 1000).toLocaleString('en-US', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
      }) + ' Tons';
    }, 2400);
  }
}

/* ==========================================================================
   2. INTELLIGENT "WHAT GOES WHERE?" WASTE SORTER DATABASE & FILTER
   ========================================================================== */
const wasteDatabase = [
  {
    name: "Corrugated Cardboard",
    category: "paper",
    bin: "Blue Recycling Bin",
    binColor: "bg-blue-600 text-white",
    status: "Recyclable",
    prep: "Flatten completely. Remove heavy packing tape and plastic bubble mailers.",
    destination: "Domestic Paper Mill -> 100% Recycled Linerboard Packaging",
    icon: "fa-box-open"
  },
  {
    name: "PET Water & Soda Bottles (#1)",
    category: "plastic",
    bin: "Blue Recycling Bin",
    binColor: "bg-blue-600 text-white",
    status: "Recyclable",
    prep: "Empty liquid, quick rinse. Keep plastic cap tightly screwed on.",
    destination: "Optical Flake Reprocessing -> Circular Food-Grade Resin",
    icon: "fa-bottle-water"
  },
  {
    name: "HDPE Milk Jugs & Detergent Jugs (#2)",
    category: "plastic",
    bin: "Blue Recycling Bin",
    binColor: "bg-blue-600 text-white",
    status: "Recyclable",
    prep: "Rinse out milky or soapy residue. Squeeze down to conserve bin space.",
    destination: "Pelletized for HDPE Drainage Piping & Eco-Lumber Decking",
    icon: "fa-pump-soap"
  },
  {
    name: "Aluminum Beverage Cans",
    category: "metal",
    bin: "Blue Recycling Bin",
    binColor: "bg-blue-600 text-white",
    status: "Infinitely Recyclable",
    prep: "Empty all dregs. Do not crush if your municipal MRF uses air-sorters.",
    destination: "Remelted and Back on Store Shelves in Under 60 Days",
    icon: "fa-shield-halved"
  },
  {
    name: "Steel & Tin Food Cans",
    category: "metal",
    bin: "Blue Recycling Bin",
    binColor: "bg-blue-600 text-white",
    status: "Recyclable",
    prep: "Rinse food scraps. Lid can be left inside or detached safely.",
    destination: "Magnetic Recovery -> Electric Arc Furnace Structural Steel",
    icon: "fa-can-food"
  },
  {
    name: "Clear & Colored Glass Jars / Bottles",
    category: "glass",
    bin: "Blue Bin / Dedicated Glass Station",
    binColor: "bg-teal-600 text-white",
    status: "Recyclable",
    prep: "Empty contents and rinse. Remove metal rings or lids for separate recovery.",
    destination: "Cullet Crushing -> Energy-Efficient Bottle Remanufacturing",
    icon: "fa-wine-bottle"
  },
  {
    name: "Raw Food Scraps & Veggie Peelings",
    category: "organic",
    bin: "Green Organics Bin",
    binColor: "bg-emerald-600 text-white",
    status: "Compostable",
    prep: "Remove plastic stickers, produce rubber bands, and wire twist-ties.",
    destination: "Aerobic Digestion Facility -> Nutrient-Rich Grade-A Soil Conditioner",
    icon: "fa-carrot"
  },
  {
    name: "Coffee Grounds & Unbleached Filters",
    category: "organic",
    bin: "Green Organics Bin",
    binColor: "bg-emerald-600 text-white",
    status: "Compostable",
    prep: "Paper filters decompose naturally. Ensure no plastic K-cups are mixed in.",
    destination: "Enriched Bio-Humus Compost for Regenerative Agriculture",
    icon: "fa-mug-hot"
  },
  {
    name: "Lawn Clippings & Shrub Prunings",
    category: "organic",
    bin: "Green Organics Bin",
    binColor: "bg-emerald-600 text-white",
    status: "Compostable",
    prep: "Keep free of plastic bags, stones, and synthetic mulch.",
    destination: "Municipal Composting & Biomass Renewable Energy Plant",
    icon: "fa-seedling"
  },
  {
    name: "Laptops, PC Towers & Tablets",
    category: "ewaste",
    bin: "Special E-Waste Collection / Depot Drop",
    binColor: "bg-purple-600 text-white",
    status: "Certified Recovery (R2v3)",
    prep: "Store indoors. VerdeLoop provides Department of Defense certified data erasure.",
    destination: "Precious Metals Recovery (Gold, Palladium, Copper) & Secure Circuit Shredding",
    icon: "fa-laptop"
  },
  {
    name: "Lithium-Ion & Power Tool Batteries",
    category: "ewaste",
    bin: "BATTERY DROP ONLY - NEVER CURBSIDE",
    binColor: "bg-red-600 text-white",
    status: "CRITICAL HAZARD IN TRUCKS",
    prep: "Cover terminals with clear electrical tape. Do NOT put in regular trash (causes truck fires!).",
    destination: "Specialized Hydrometallurgical Recycling (Cobalt & Lithium extraction)",
    icon: "fa-car-battery"
  },
  {
    name: "Smartphones & Mobile Chargers",
    category: "ewaste",
    bin: "E-Waste Tech Drop Bin",
    binColor: "bg-purple-600 text-white",
    status: "Certified Recovery",
    prep: "Perform factory reset if accessible. Remove external cases.",
    destination: "Clean closed-loop component harvesting & rare earth recovery",
    icon: "fa-mobile-screen"
  },
  {
    name: "Architectural Paint & Solvents",
    category: "hazardous",
    bin: "Household Hazardous Waste (HHW) Event",
    binColor: "bg-amber-600 text-white",
    status: "Regulated Hazmat",
    prep: "Keep in original labeled containers with lids securely fastened.",
    destination: "Remanufactured Recycled Latex Paint or High-Temperature Thermal Oxidation",
    icon: "fa-paint-roller"
  },
  {
    name: "Used Motor Oil & Vehicle Filters",
    category: "hazardous",
    bin: "Certified Oil Depot / VerdeLoop Hazmat Pickup",
    binColor: "bg-amber-600 text-white",
    status: "Regulated Hazmat",
    prep: "Store in clean polyethylene jug. Never mix with antifreeze, water, or solvents.",
    destination: "Re-refining into API-certified Group II lubricating base oil",
    icon: "fa-oil-can"
  },
  {
    name: "Expanded Polystyrene (Styrofoam Packaging)",
    category: "residual",
    bin: "Gray Residual Waste Bin",
    binColor: "bg-slate-600 text-white",
    status: "Non-Curbside Residual",
    prep: "Check for local densifier drop-offs; otherwise place in residual landfill cart.",
    destination: "Waste-to-Energy (WTE) Engineered Solid Refuse Fuel",
    icon: "fa-box"
  },
  {
    name: "Soiled Greasy Pizza Box Bottoms",
    category: "organic",
    bin: "Green Organics Bin (or Gray if wet wax)",
    binColor: "bg-emerald-600 text-white",
    status: "Compostable if unlined",
    prep: "Tear off the clean cardboard lid for the Blue Bin. Place cheese-soaked base in Organics.",
    destination: "Industrial Composting Thermophilic Microbe Digestion",
    icon: "fa-pizza-slice"
  },
  {
    name: "Fluorescent Tubes & CFL Bulbs",
    category: "hazardous",
    bin: "Universal Waste Hazmat Drop",
    binColor: "bg-amber-600 text-white",
    status: "Mercury Hazard",
    prep: "Do not break. Wrap gently to prevent vapor exposure.",
    destination: "Vacuum Mercury Distillation & Phosphor Powder Extraction",
    icon: "fa-lightbulb"
  },
  {
    name: "Concrete, Brick & Masonry Rubble",
    category: "cnd",
    bin: "Dedicated Construction Heavy Roll-Off",
    binColor: "bg-stone-700 text-white",
    status: "Aggregates Recovery",
    prep: "Keep free of asbestos, hazardous chemicals, and excessive wood/trash.",
    destination: "Crushed on-site into DOT-certified Road Base Aggregate & Sub-base",
    icon: "fa-trowel-bricks"
  }
];

function initWasteSorter() {
  const container = document.getElementById('wasteGrid');
  const searchInput = document.getElementById('wasteSearch');
  const categoryButtons = document.querySelectorAll('.sorter-cat-btn');

  if (!container) return;

  let currentCategory = 'all';
  let searchTerm = '';

  function renderItems() {
    const filtered = wasteDatabase.filter(item => {
      const matchesCategory = currentCategory === 'all' || item.category === currentCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.bin.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.prep.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-2xl border border-slate-200">
          <div class="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h4 class="text-lg font-bold text-slate-800">No matching waste items found</h4>
          <p class="text-sm text-slate-500 max-w-md mx-auto mt-1">Try searching for common household or industrial items like "Cardboard", "Oil", "Battery", or "Plastic".</p>
          <button id="resetSearchBtn" class="mt-4 px-4 py-2 bg-emerald-50 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-100 transition-colors">Clear Filter</button>
        </div>
      `;
      const resetBtn = document.getElementById('resetSearchBtn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchTerm = '';
          currentCategory = 'all';
          updateActiveButton();
          renderItems();
        });
      }
      return;
    }

    container.innerHTML = filtered.map(item => `
      <div class="eco-card p-5 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-start justify-between gap-3 mb-3">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg flex-shrink-0">
                <i class="fa-solid ${item.icon}"></i>
              </div>
              <div>
                <h4 class="font-bold text-slate-900 leading-tight">${item.name}</h4>
                <span class="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${item.binColor} mt-1">
                  ${item.bin}
                </span>
              </div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
              ${item.status}
            </span>
          </div>

          <div class="mt-4 space-y-2 text-xs">
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
              <span class="font-semibold text-slate-700 flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-sparkles text-emerald-600"></i> Proper Preparation:
              </span>
              <p class="text-slate-600 leading-relaxed">${item.prep}</p>
            </div>

            <div class="p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
              <span class="font-semibold text-emerald-800 flex items-center gap-1.5 mb-1">
                <i class="fa-solid fa-arrows-spin text-emerald-600"></i> Circular Outcome:
              </span>
              <p class="text-emerald-900 leading-relaxed">${item.destination}</p>
            </div>
          </div>
        </div>

        <div class="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="text-slate-400">VerdeLoop Standards</span>
          <button onclick="prefillBooking('${item.name}')" class="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1">
            Request Pickup <i class="fa-solid fa-arrow-right text-[10px]"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  function updateActiveButton() {
    categoryButtons.forEach(btn => {
      const cat = btn.getAttribute('data-cat');
      if (cat === currentCategory) {
        btn.classList.add('bg-emerald-600', 'text-white', 'shadow-md', 'shadow-emerald-600/20');
        btn.classList.remove('bg-white', 'text-slate-600', 'border-slate-200');
      } else {
        btn.classList.remove('bg-emerald-600', 'text-white', 'shadow-md', 'shadow-emerald-600/20');
        btn.classList.add('bg-white', 'text-slate-600', 'border-slate-200');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchTerm = e.target.value;
      renderItems();
    });
  }

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      currentCategory = btn.getAttribute('data-cat') || 'all';
      updateActiveButton();
      renderItems();
    });
  });

  renderItems();
}

/* ==========================================================================
   3. INTERACTIVE COMMERCIAL & ESG SAVINGS CALCULATOR
   ========================================================================== */
function initCalculator() {
  const propertyTypeSelect = document.getElementById('calcPropertyType');
  const volumeSlider = document.getElementById('calcVolume');
  const volumeDisplay = document.getElementById('calcVolumeDisplay');
  const targetDiversionSlider = document.getElementById('calcDiversion');
  const diversionDisplay = document.getElementById('calcDiversionDisplay');

  // Outputs
  const outSavings = document.getElementById('calcOutSavings');
  const outTonsDiverted = document.getElementById('calcOutTons');
  const outCo2 = document.getElementById('calcOutCo2');
  const outTrees = document.getElementById('calcOutTrees');

  if (!volumeSlider || !outSavings) return;

  function recalculate() {
    const tonsMonthly = parseFloat(volumeSlider.value) || 20;
    const targetDivPercent = parseFloat(targetDiversionSlider.value) || 75;
    const propertyMultiplier = parseFloat(propertyTypeSelect?.value || '1.0');

    if (volumeDisplay) volumeDisplay.innerText = `${tonsMonthly} Tons / month`;
    if (diversionDisplay) diversionDisplay.innerText = `${targetDivPercent}% Diversion`;

    // Calculation logic:
    // Standard Landfill tipping + hauling fee: $135/ton
    // VerdeLoop Circular processing: $62/ton net (due to valuable commodity rebates)
    // Tonnage diverted annually:
    const annualTons = tonsMonthly * 12;
    const divertedTonsAnnual = annualTons * (targetDivPercent / 100);
    
    // Financial savings:
    const costBaseline = annualTons * 135 * propertyMultiplier;
    const costVerdeLoop = ((annualTons - divertedTonsAnnual) * 135 + divertedTonsAnnual * 58) * propertyMultiplier;
    const netAnnualSavings = Math.max(0, costBaseline - costVerdeLoop);

    // Carbon savings: EPA WARM factor ~ 2.45 MT CO2e avoided per ton of mixed waste diverted to circular recycling
    const co2Avoided = divertedTonsAnnual * 2.45;
    // 1 mature tree absorbs ~ 0.022 MT CO2 per year -> 1 MT CO2 ~ 45 trees
    const treesEquivalent = Math.round(co2Avoided * 45);

    outSavings.innerText = '$' + Math.round(netAnnualSavings).toLocaleString('en-US');
    outTonsDiverted.innerText = Math.round(divertedTonsAnnual).toLocaleString('en-US') + ' Tons';
    outCo2.innerText = Math.round(co2Avoided).toLocaleString('en-US') + ' MT';
    outTrees.innerText = treesEquivalent.toLocaleString('en-US');
  }

  volumeSlider.addEventListener('input', recalculate);
  targetDiversionSlider.addEventListener('input', recalculate);
  if (propertyTypeSelect) propertyTypeSelect.addEventListener('change', recalculate);

  recalculate();

  const auditBtn = document.getElementById('lockAuditBtn');
  if (auditBtn) {
    auditBtn.addEventListener('click', () => {
      const bookingSec = document.getElementById('bookingSection');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
        showToast('Calculator parameters transferred to pickup booking system!', 'success');
      }
    });
  }
}

/* ==========================================================================
   4. STEP-BY-STEP PICKUP SCHEDULING ENGINE
   ========================================================================== */
function initBookingWizard() {
  const steps = [
    document.getElementById('bookingStep1'),
    document.getElementById('bookingStep2'),
    document.getElementById('bookingStep3'),
    document.getElementById('bookingStep4')
  ];
  const stepIndicators = document.querySelectorAll('.wizard-step-indicator');
  const btnNext = document.getElementById('wizardNextBtn');
  const btnPrev = document.getElementById('wizardPrevBtn');
  const form = document.getElementById('bookingForm');

  if (!btnNext || !form) return;

  let currentStep = 1;

  function showStep(stepNum) {
    steps.forEach((s, idx) => {
      if (s) {
        if (idx + 1 === stepNum) {
          s.classList.remove('hidden');
        } else {
          s.classList.add('hidden');
        }
      }
    });

    stepIndicators.forEach((ind, idx) => {
      if (idx + 1 <= stepNum) {
        ind.classList.add('border-emerald-600', 'text-emerald-700', 'font-bold');
        ind.classList.remove('border-slate-200', 'text-slate-400');
        const numCircle = ind.querySelector('.step-circle');
        if (numCircle) {
          numCircle.classList.add('bg-emerald-600', 'text-white');
          numCircle.classList.remove('bg-slate-100', 'text-slate-500');
        }
      } else {
        ind.classList.remove('border-emerald-600', 'text-emerald-700', 'font-bold');
        ind.classList.add('border-slate-200', 'text-slate-400');
        const numCircle = ind.querySelector('.step-circle');
        if (numCircle) {
          numCircle.classList.remove('bg-emerald-600', 'text-white');
          numCircle.classList.add('bg-slate-100', 'text-slate-500');
        }
      }
    });

    if (btnPrev) {
      if (stepNum === 1) {
        btnPrev.classList.add('invisible');
      } else {
        btnPrev.classList.remove('invisible');
      }
    }

    if (btnNext) {
      if (stepNum === 4) {
        btnNext.innerHTML = 'Confirm & Dispatch Booking <i class="fa-solid fa-check ml-2"></i>';
        btnNext.classList.add('bg-emerald-600', 'hover:bg-emerald-700');
      } else {
        btnNext.innerHTML = 'Continue to Next Step <i class="fa-solid fa-arrow-right ml-2"></i>';
        btnNext.classList.remove('bg-emerald-600');
      }
    }
  }

  btnNext.addEventListener('click', () => {
    if (currentStep < 4) {
      // Basic step validation
      if (currentStep === 1) {
        const selectedRadio = document.querySelector('input[name="wasteStreamType"]:checked');
        if (!selectedRadio) {
          showToast('Please select a waste stream category first', 'warning');
          return;
        }
      } else if (currentStep === 2) {
        const address = document.getElementById('bookAddress')?.value;
        const name = document.getElementById('bookName')?.value;
        const phone = document.getElementById('bookPhone')?.value;
        if (!address || !name || !phone) {
          showToast('Please provide your name, phone, and pickup location', 'warning');
          return;
        }
      } else if (currentStep === 3) {
        const date = document.getElementById('bookDate')?.value;
        if (!date) {
          showToast('Please select a collection date', 'warning');
          return;
        }
        // Update confirmation summary in Step 4
        updateConfirmationSummary();
      }
      currentStep++;
      showStep(currentStep);
    } else {
      // Step 4: Submission
      submitBooking();
    }
  });

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
      }
    });
  }

  function updateConfirmationSummary() {
    const stream = document.querySelector('input[name="wasteStreamType"]:checked')?.value || 'Commercial General';
    const address = document.getElementById('bookAddress')?.value || '100 Eco Blvd';
    const contact = document.getElementById('bookName')?.value || 'Customer';
    const phone = document.getElementById('bookPhone')?.value || '555-0199';
    const date = document.getElementById('bookDate')?.value || 'Next Available';
    const timeWindow = document.getElementById('bookTimeWindow')?.value || 'Morning (08:00 - 12:00)';
    const containerSize = document.getElementById('bookContainerSize')?.value || 'Standard';

    const sumStream = document.getElementById('sumStream');
    const sumLocation = document.getElementById('sumLocation');
    const sumContact = document.getElementById('sumContact');
    const sumSchedule = document.getElementById('sumSchedule');
    const sumSize = document.getElementById('sumSize');

    if (sumStream) sumStream.innerText = stream;
    if (sumLocation) sumLocation.innerText = address;
    if (sumContact) sumContact.innerText = `${contact} (${phone})`;
    if (sumSchedule) sumSchedule.innerText = `${date} • ${timeWindow}`;
    if (sumSize) sumSize.innerText = containerSize;
  }

  function submitBooking() {
    const randomRef = 'VL-' + Math.floor(100000 + Math.random() * 900000);
    const modalBackdrop = document.getElementById('bookingSuccessModal');
    const refCodeEl = document.getElementById('modalRefCode');

    if (refCodeEl) refCodeEl.innerText = randomRef;
    if (modalBackdrop) modalBackdrop.classList.add('active');

    // Reset wizard
    currentStep = 1;
    form.reset();
    showStep(1);
  }

  showStep(1);
}

window.prefillBooking = function(itemName) {
  const bookingSec = document.getElementById('bookingSection');
  if (bookingSec) {
    bookingSec.scrollIntoView({ behavior: 'smooth' });
    const notesField = document.getElementById('bookNotes');
    if (notesField) {
      notesField.value = `Pickup request for: ${itemName}. Please ensure proper containment equipment is provided.`;
    }
    showToast(`Added "${itemName}" to your pickup order notes!`, 'info');
  }
};

/* ==========================================================================
   5. ESG DIVERSION & COMPOSITION CHARTS (CHART.JS)
   ========================================================================== */
function initCharts() {
  const ctxComposition = document.getElementById('chartComposition');
  if (ctxComposition && typeof Chart !== 'undefined') {
    new Chart(ctxComposition, {
      type: 'doughnut',
      data: {
        labels: ['Cardboard & Paper', 'Clean Plastics', 'Organic Compost', 'Scrap Metals', 'Glass Cullet', 'Recovered E-Waste'],
        datasets: [{
          data: [35, 23, 22, 10, 6, 4],
          backgroundColor: [
            '#059669', // Emerald
            '#0d9488', // Teal
            '#84cc16', // Lime
            '#3b82f6', // Blue
            '#f59e0b', // Amber
            '#8b5cf6'  // Purple
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              font: {
                family: "'Plus Jakarta Sans', sans-serif",
                size: 11
              },
              color: '#475569'
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return ` ${context.label}: ${context.raw}% Total Diverted`;
              }
            }
          }
        },
        cutout: '72%'
      }
    });
  }

  const ctxTonnage = document.getElementById('chartTonnage');
  if (ctxTonnage && typeof Chart !== 'undefined') {
    new Chart(ctxTonnage, {
      type: 'bar',
      data: {
        labels: ['2023', '2024', '2025', '2026 (YTD Projected)'],
        datasets: [
          {
            label: 'Landfill Diverted Tonnage',
            data: [280000, 345000, 420000, 485000],
            backgroundColor: '#059669',
            borderRadius: 8
          },
          {
            label: 'Residual Landfill Volume (Reduced)',
            data: [95000, 72000, 48000, 24000],
            backgroundColor: '#cbd5e1',
            borderRadius: 8
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: "'Plus Jakarta Sans', sans-serif", size: 11 },
              color: '#475569'
            }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { family: "'Plus Jakarta Sans', sans-serif" } }
          },
          y: {
            grid: { color: '#f1f5f9' },
            ticks: {
              font: { family: "'Plus Jakarta Sans', sans-serif" },
              callback: function(value) {
                return (value / 1000) + 'k Tons';
              }
            }
          }
        }
      }
    });
  }
}

/* ==========================================================================
   6. MODALS, PORTAL & HAZMAT EMERGENCY DRAWER
   ========================================================================== */
const serviceData = {
  residential: {
    title: "Municipal & Residential Curbside Solutions",
    subtitle: "High-density neighborhood routing with AI-camera contamination detection",
    content: `
      <p class="text-slate-600 mb-4 leading-relaxed">VerdeLoop provides municipalities and residential HOAs with zero-emission and low-carbon collection vehicles. Every cart is equipped with RFID tagging for volumetric tracking and billing transparency.</p>
      <h4 class="font-bold text-slate-800 text-sm mb-2">Key Program Features:</h4>
      <ul class="space-y-2 text-xs text-slate-600 mb-4">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Split-body dual collection (Recycling + Organics in single truck pass)</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Bulky item scheduled pickup with white-glove curbside service</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Resident mobile app for missed pickups, schedule alerts, and sorting tips</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> 99.4% on-time service compliance backed by municipal SLAs</li>
      </ul>
      <div class="bg-emerald-50 p-4 rounded-xl border border-emerald-100 text-xs text-emerald-900">
        <strong>Included Carts:</strong> Heavy-duty 64-gallon and 96-gallon HDPE bear-proof / wind-resistant carts with ergonomic wheels.
      </div>
    `
  },
  commercial: {
    title: "Commercial & Enterprise Zero-Waste Programs",
    subtitle: "Tailored waste audits, front-load dumpsters, and compactor management",
    content: `
      <p class="text-slate-600 mb-4 leading-relaxed">Designed for grocery chains, corporate headquarters, hospitality groups, and logistics centers. We optimize haul frequency to lower your tipping costs by up to 45% while driving toward Zero-Waste-to-Landfill certification.</p>
      <h4 class="font-bold text-slate-800 text-sm mb-2">Enterprise Advantages:</h4>
      <ul class="space-y-2 text-xs text-slate-600 mb-4">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> 2 to 8 cubic yard front-load dumpsters with secure locking bars</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Self-contained liquid-tight compactor installation and monitoring</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Automated CSRD, ESG, and Scope 3 greenhouse gas reporting portal</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Back-of-house staff training and color-coded sorting signage</li>
      </ul>
    `
  },
  industrial: {
    title: "Industrial & Regulated Hazardous Waste (Hazmat)",
    subtitle: "Cradle-to-grave compliance for chemicals, solvents, sludge, and drums",
    content: `
      <p class="text-slate-600 mb-4 leading-relaxed">Full compliance with EPA RCRA, DOT, and OSHA requirements. Our certified hazardous waste management specialists handle lab-packs, toxic waste containment, bulk tankers, and emergency remediation.</p>
      <h4 class="font-bold text-slate-800 text-sm mb-2">Capabilities:</h4>
      <ul class="space-y-2 text-xs text-slate-600 mb-4">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> 55-gallon steel & poly drum pickup with e-Manifest electronic tracking</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Solvent distillation, fuel blending, and high-temp thermal incineration</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Certified chemical spill emergency response unit (2-hour SLA)</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Comprehensive liability indemnification & Certificate of Destruction</li>
      </ul>
    `
  },
  ewaste: {
    title: "Certified Electronics (E-Waste) & ITAD Asset Disposal",
    subtitle: "R2v3, ISO 27001, and NIST 800-88 compliant secure data destruction",
    content: `
      <p class="text-slate-600 mb-4 leading-relaxed">We protect your corporate intellectual property while ensuring zero electronic waste reaches landfills. Our process guarantees serialized data destruction and precious metal circularity.</p>
      <h4 class="font-bold text-slate-800 text-sm mb-2">Security & Circular Standards:</h4>
      <ul class="space-y-2 text-xs text-slate-600 mb-4">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> On-site mobile shredding or high-security facility degaussing</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Serialized Certificate of Data Destruction for every hard drive and SSD</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Remarketing revenue share on qualified corporate computing assets</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> 100% domestic smelting and metallurgical commodity recovery</li>
      </ul>
    `
  },
  cnd: {
    title: "Construction & Demolition (C&D) Debris Recovery",
    subtitle: "LEED waste diversion reporting with 10 to 40-yard roll-off containers",
    content: `
      <p class="text-slate-600 mb-4 leading-relaxed">From ground-up commercial builds to highway tear-outs, VerdeLoop's high-tonnage roll-off fleet delivers fast swaps and guaranteed diversion rates exceeding 85% for LEED points.</p>
      <h4 class="font-bold text-slate-800 text-sm mb-2">C&D Services:</h4>
      <ul class="space-y-2 text-xs text-slate-600 mb-4">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Same-day roll-off container swaps (10, 20, 30, and 40-yard bins)</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Dedicated crushing and screening for concrete, asphalt, and brick</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Wood waste chipping for biofuel and architectural reuse</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Project-specific USGBC LEED diversion rate documentation</li>
      </ul>
    `
  },
  medical: {
    title: "Medical & Biohazard Regulated Waste Disposal",
    subtitle: "Stericycle-grade compliant handling for clinics, labs, and surgical centers",
    content: `
      <p class="text-slate-600 mb-4 leading-relaxed">Safe, tamper-evident containment for biohazardous waste, pathological items, chemotherapy residues, and sharps containers with compliant autoclave decontamination.</p>
      <h4 class="font-bold text-slate-800 text-sm mb-2">Healthcare Assurances:</h4>
      <ul class="space-y-2 text-xs text-slate-600 mb-4">
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> OSHA-approved sharps containers & puncture-resistant corrugated boxes</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> High-temperature thermal autoclave sterilization</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Compliant pharmaceutical disposal preventing waterway contamination</li>
        <li class="flex items-center gap-2"><i class="fa-solid fa-check text-emerald-600"></i> Online staff OSHA Bloodborne Pathogens training modules</li>
      </ul>
    `
  }
};

function initModals() {
  // Service Modal
  const serviceModal = document.getElementById('serviceDetailModal');
  const serviceModalTitle = document.getElementById('modalServiceTitle');
  const serviceModalSub = document.getElementById('modalServiceSubtitle');
  const serviceModalBody = document.getElementById('modalServiceBody');
  const serviceTriggers = document.querySelectorAll('[data-service-key]');

  serviceTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const key = trigger.getAttribute('data-service-key');
      const data = serviceData[key];
      if (data && serviceModal) {
        if (serviceModalTitle) serviceModalTitle.innerText = data.title;
        if (serviceModalSub) serviceModalSub.innerText = data.subtitle;
        if (serviceModalBody) serviceModalBody.innerHTML = data.content;
        serviceModal.classList.add('active');
      }
    });
  });

  // Portal Modal
  const portalModal = document.getElementById('portalModal');
  const portalBtns = document.querySelectorAll('.open-portal-btn');
  portalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (portalModal) portalModal.classList.add('active');
    });
  });

  // Emergency Hazmat Modal
  const hazmatModal = document.getElementById('hazmatModal');
  const hazmatBtns = document.querySelectorAll('.open-hazmat-btn');
  hazmatBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (hazmatModal) hazmatModal.classList.add('active');
    });
  });

  // Close buttons on all modals
  const closeBtns = document.querySelectorAll('.close-modal-btn');
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-backdrop');
      if (modal) modal.classList.remove('active');
    });
  });

  // Close on outside backdrop click
  document.querySelectorAll('.modal-backdrop').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Handle mock portal login submit
  const portalForm = document.getElementById('portalLoginForm');
  if (portalForm) {
    portalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Login successful! Redirecting to ESG telemetry dashboard...', 'success');
      setTimeout(() => {
        if (portalModal) portalModal.classList.remove('active');
      }, 1000);
    });
  }

  // Handle Hazmat Emergency dispatch form submit
  const hazmatForm = document.getElementById('hazmatDispatchForm');
  if (hazmatForm) {
    hazmatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('EMERGENCY ALERT BROADCASTED: Rapid Response Unit #4 dispatched to your coordinates.', 'warning');
      setTimeout(() => {
        if (hazmatModal) hazmatModal.classList.remove('active');
        hazmatForm.reset();
      }, 1200);
    });
  }

  // Handle newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for subscribing to VerdeLoop Circular Insights!', 'success');
      newsletterForm.reset();
    });
  }
}

/* ==========================================================================
   7. INTERACTIVE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (header && content) {
      header.addEventListener('click', () => {
        const isOpen = !content.classList.contains('hidden');

        // Close other items
        faqItems.forEach(other => {
          const oContent = other.querySelector('.faq-content');
          const oIcon = other.querySelector('.faq-icon');
          if (oContent) oContent.classList.add('hidden');
          if (oIcon) {
            oIcon.classList.remove('rotate-180', 'text-emerald-600');
            oIcon.classList.add('text-slate-400');
          }
        });

        if (!isOpen) {
          content.classList.remove('hidden');
          if (icon) {
            icon.classList.add('rotate-180', 'text-emerald-600');
            icon.classList.remove('text-slate-400');
          }
        }
      });
    }
  });
}

/* ==========================================================================
   8. MOBILE NAVIGATION MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('closeMobileMenuBtn');
  const menuLinks = document.querySelectorAll('.mobile-nav-link');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('hidden');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    }

    menuLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }
}

/* ==========================================================================
   9. TOAST NOTIFICATION UTILITY
   ========================================================================== */
window.showToast = function(message, type = 'info') {
  let toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toastContainer';
    toastContainer.className = 'fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto p-4 rounded-xl shadow-xl flex items-center gap-3 text-xs font-semibold transform transition-all duration-300 translate-y-4 opacity-0 border';

  let icon = 'fa-info-circle';
  let colorStyles = 'bg-white text-slate-800 border-slate-200';

  if (type === 'success') {
    icon = 'fa-circle-check';
    colorStyles = 'bg-emerald-900 text-white border-emerald-700';
  } else if (type === 'warning') {
    icon = 'fa-triangle-exclamation';
    colorStyles = 'bg-amber-900 text-white border-amber-700';
  }

  toast.className += ` ${colorStyles}`;
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base flex-shrink-0"></i>
    <div class="flex-grow">${message}</div>
    <button class="text-slate-300 hover:text-white ml-2" onclick="this.parentElement.remove()">
      <i class="fa-solid fa-xmark"></i>
    </button>
  `;

  toastContainer.appendChild(toast);

  // Trigger anim
  setTimeout(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
  }, 10);

  // Auto remove
  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 4500);
};
