// Static seed data for the ASG Eye Hospital demo API.
// Everything here is fake demo data - no real centres, doctors or patients.
// Shape is identical to ./data.js, so api/server.js serves either dataset.

const clinics = [
  {
    id: 'ASG-JAI-01',
    imageUrl: '/images/asg-jai-01.png',
    name: 'ASG Eye Hospital - Vaishali Nagar',
    city: 'Jaipur',
    area: 'Vaishali Nagar',
    address: 'Plot 12, Amrapali Circle, Vaishali Nagar, Jaipur 302021',
    phone: '+91 141 4000 101',
    timings: 'Mon-Sat 09:00-19:00, Sun 10:00-14:00',
    services: ['OPD', 'LASIK', 'Contoura', 'PRK', 'ICL', 'Cataract', 'Retina', 'Glaucoma', 'Cornea', 'Paediatric Ophthalmology', 'Optical Store'],
    hasLasikSuite: true,
    parking: true
  },
  {
    id: 'ASG-MUM-01',
    imageUrl: '/images/asg-mum-01.png',
    name: 'ASG Eye Hospital - Andheri West',
    city: 'Mumbai',
    area: 'Andheri West',
    address: 'Off New Link Road, Andheri West, Mumbai 400053',
    phone: '+91 22 4000 201',
    timings: 'Mon-Sun 09:00-21:00',
    services: ['OPD', 'LASIK', 'Contoura', 'ICL', 'Cataract', 'Retina', 'Diabetic Retinopathy', 'Emergency Eye Care'],
    hasLasikSuite: true,
    parking: false
  },
  {
    id: 'ASG-MUM-02',
    imageUrl: '/images/asg-mum-02.png',
    name: 'ASG Eye Hospital - Powai',
    city: 'Mumbai',
    area: 'Powai',
    address: 'Hiranandani Gardens, Powai, Mumbai 400076',
    phone: '+91 22 4000 202',
    timings: 'Mon-Sat 09:30-20:00',
    services: ['OPD', 'Cataract', 'Retina', 'Glaucoma', 'Paediatric Ophthalmology', 'Optical Store'],
    hasLasikSuite: false,
    parking: true
  },
  {
    id: 'ASG-JAI-02',
    imageUrl: '/images/asg-jai-02.png',
    name: 'ASG Eye Hospital - Malviya Nagar',
    city: 'Jaipur',
    area: 'Malviya Nagar',
    address: 'Sector 4, Malviya Nagar, Jaipur 302017',
    phone: '+91 141 4000 102',
    timings: 'Mon-Sat 10:00-19:00',
    services: ['OPD', 'Cataract', 'Glaucoma', 'Cornea', 'Optical Store'],
    hasLasikSuite: false,
    parking: true
  },
  {
    id: 'ASG-DEL-01',
    imageUrl: '/images/asg-del-01.png',
    name: 'ASG Eye Hospital - Rajouri Garden',
    city: 'Delhi',
    area: 'Rajouri Garden',
    address: 'A-24, Main Najafgarh Road, Rajouri Garden, New Delhi 110027',
    phone: '+91 11 4000 301',
    timings: 'Mon-Sat 09:00-20:00, Sun 10:00-16:00',
    services: ['OPD', 'LASIK', 'PRK', 'ICL', 'Cataract', 'Glaucoma', 'Cornea Transplant', 'Paediatric Ophthalmology'],
    hasLasikSuite: true,
    parking: true
  },
  {
    id: 'ASG-PUN-01',
    imageUrl: '/images/asg-pun-01.png',
    name: 'ASG Eye Hospital - Shivaji Nagar',
    city: 'Pune',
    area: 'Shivaji Nagar',
    address: 'FC Road, Shivaji Nagar, Pune 411005',
    phone: '+91 20 4000 401',
    timings: 'Mon-Sat 09:30-19:30',
    services: ['OPD', 'LASIK', 'Contoura', 'Cataract', 'Retina', 'Dry Eye Clinic', 'Optical Store'],
    hasLasikSuite: true,
    parking: true
  },
  {
    id: 'ASG-LKO-01',
    imageUrl: '/images/asg-lko-01.png',
    name: 'ASG Eye Hospital - Gomti Nagar',
    city: 'Lucknow',
    area: 'Gomti Nagar',
    address: 'Vibhuti Khand, Gomti Nagar, Lucknow 226010',
    phone: '+91 522 4000 501',
    timings: 'Mon-Sat 09:00-19:00',
    services: ['OPD', 'Cataract', 'Retina', 'Diabetic Retinopathy', 'Glaucoma', 'Optical Store'],
    hasLasikSuite: false,
    parking: true
  },
  {
    id: 'ASG-KOL-01',
    imageUrl: '/images/asg-kol-01.png',
    name: 'ASG Eye Hospital - Salt Lake',
    city: 'Kolkata',
    area: 'Salt Lake',
    address: 'Sector 2, EC Block, Salt Lake City, Kolkata 700091',
    phone: '+91 33 4000 601',
    timings: 'Mon-Sat 09:00-19:00, Sun 10:00-14:00',
    services: ['OPD', 'LASIK', 'Cataract', 'Retina', 'Paediatric Ophthalmology', 'Optical Store'],
    hasLasikSuite: true,
    parking: false
  },
  {
    id: 'ASG-BHO-01',
    imageUrl: '/images/asg-bho-01.png',
    name: 'ASG Eye Hospital - Arera Colony',
    city: 'Bhopal',
    area: 'Arera Colony',
    address: 'E-3 Arera Colony, Bhopal 462016',
    phone: '+91 755 4000 701',
    timings: 'Mon-Sat 10:00-19:00',
    services: ['OPD', 'Cataract', 'Glaucoma', 'Cornea', 'Optical Store'],
    hasLasikSuite: false,
    parking: true
  }
];

// days: 0 = Sunday ... 6 = Saturday
const doctors = [
  {
    id: 'ASG-DR-101',
    imageUrl: '/images/asg-dr-101.png',
    name: 'Dr. Meenakshi Sharma',
    title: 'Senior Consultant - Cataract & IOL Services',
    clinicId: 'ASG-JAI-01',
    specialties: ['cataract', 'iol', 'general'],
    languages: ['English', 'Hindi'],
    experienceYears: 19,
    consultationFee: 600,
    days: [1, 2, 3, 4, 5, 6],
    slots: ['10:00', '10:30', '11:00', '11:30', '16:00', '16:30', '17:00']
  },
  {
    id: 'ASG-DR-102',
    imageUrl: '/images/asg-dr-102.png',
    name: 'Dr. Arvind Soni',
    title: 'Head - Refractive Surgery (LASIK / Contoura / PRK)',
    clinicId: 'ASG-JAI-01',
    specialties: ['lasik', 'contoura', 'prk', 'refractive'],
    languages: ['English', 'Hindi'],
    experienceYears: 16,
    consultationFee: 700,
    days: [1, 3, 5],
    slots: ['09:30', '10:00', '12:00', '12:30', '17:00', '17:30']
  },
  {
    id: 'ASG-DR-103',
    imageUrl: '/images/asg-dr-103.png',
    name: 'Dr. Kavita Nagar',
    title: 'Consultant - Paediatric Ophthalmology & Squint',
    clinicId: 'ASG-JAI-01',
    specialties: ['paediatric', 'squint', 'general'],
    languages: ['English', 'Hindi'],
    experienceYears: 10,
    consultationFee: 600,
    days: [2, 4, 6],
    slots: ['11:00', '11:30', '15:00', '15:30', '16:00']
  },
  {
    id: 'ASG-DR-201',
    imageUrl: '/images/asg-dr-201.png',
    name: 'Dr. Farhan Qureshi',
    title: 'Head - Retina & Diabetic Retinopathy',
    clinicId: 'ASG-MUM-01',
    specialties: ['retina', 'diabetic-eye', 'general'],
    languages: ['English', 'Hindi', 'Marathi'],
    experienceYears: 15,
    consultationFee: 900,
    days: [1, 2, 4, 5, 6],
    slots: ['10:00', '10:30', '11:00', '18:00', '18:30', '19:00']
  },
  {
    id: 'ASG-DR-202',
    imageUrl: '/images/asg-dr-202.png',
    name: 'Dr. Ritu Shah',
    title: 'Consultant - ICL & Refractive Surgery',
    clinicId: 'ASG-MUM-01',
    specialties: ['icl', 'lasik', 'refractive'],
    languages: ['English', 'Hindi', 'Gujarati'],
    experienceYears: 12,
    consultationFee: 900,
    days: [2, 4, 6],
    slots: ['12:00', '12:30', '13:00', '17:00', '17:30']
  },
  {
    id: 'ASG-DR-301',
    imageUrl: '/images/asg-dr-301.png',
    name: 'Dr. Sanjay Mehra',
    title: 'Senior Consultant - Glaucoma Services',
    clinicId: 'ASG-DEL-01',
    specialties: ['glaucoma', 'general'],
    languages: ['English', 'Hindi', 'Punjabi'],
    experienceYears: 21,
    consultationFee: 800,
    days: [1, 2, 3, 4, 5],
    slots: ['09:30', '10:00', '10:30', '16:30', '17:00']
  },
  {
    id: 'ASG-DR-302',
    imageUrl: '/images/asg-dr-302.png',
    name: 'Dr. Ananya Rao',
    title: 'Consultant - Cornea & Cornea Transplant',
    clinicId: 'ASG-DEL-01',
    // Deliberately a two-day roster: shows the "not scheduled that day" path.
    specialties: ['cornea', 'keratoconus', 'general'],
    languages: ['English', 'Hindi'],
    experienceYears: 11,
    consultationFee: 800,
    days: [3, 6],
    slots: ['11:00', '11:30', '12:00']
  },
  {
    id: 'ASG-DR-401',
    imageUrl: '/images/asg-dr-401.png',
    name: 'Dr. Prashant Kulkarni',
    title: 'Consultant - Cataract & Refractive Surgery',
    clinicId: 'ASG-PUN-01',
    specialties: ['cataract', 'lasik', 'contoura', 'general'],
    languages: ['English', 'Hindi', 'Marathi'],
    experienceYears: 14,
    consultationFee: 700,
    days: [1, 2, 3, 5, 6],
    slots: ['10:00', '10:30', '11:00', '17:30', '18:00', '18:30']
  },
  {
    id: 'ASG-DR-203',
    imageUrl: '/images/asg-dr-203.png',
    name: 'Dr. Vivek Iyer',
    title: 'Consultant - Cataract & Glaucoma',
    clinicId: 'ASG-MUM-02',
    specialties: ['cataract', 'glaucoma', 'general'],
    languages: ['English', 'Hindi', 'Tamil'],
    experienceYears: 12,
    consultationFee: 800,
    days: [1, 2, 3, 4, 5, 6],
    slots: ['10:00', '10:30', '11:00', '18:00', '18:30']
  },
  {
    id: 'ASG-DR-104',
    imageUrl: '/images/asg-dr-104.png',
    name: 'Dr. Preeti Jain',
    title: 'Consultant - Cornea & Dry Eye',
    clinicId: 'ASG-JAI-02',
    specialties: ['cornea', 'dry-eye', 'general'],
    languages: ['English', 'Hindi'],
    experienceYears: 8,
    consultationFee: 600,
    days: [1, 2, 4, 5, 6],
    slots: ['11:00', '11:30', '12:00', '17:00', '17:30']
  },
  {
    id: 'ASG-DR-501',
    imageUrl: '/images/asg-dr-501.png',
    name: 'Dr. Neha Verma',
    title: 'Consultant - Retina & Diabetic Eye Care',
    clinicId: 'ASG-LKO-01',
    specialties: ['retina', 'diabetic-eye', 'general'],
    languages: ['English', 'Hindi'],
    experienceYears: 9,
    consultationFee: 600,
    days: [1, 2, 3, 4, 5, 6],
    slots: ['10:00', '10:30', '11:00', '11:30', '16:00']
  },
  {
    id: 'ASG-DR-601',
    imageUrl: '/images/asg-dr-601.png',
    name: 'Dr. Subhash Banerjee',
    title: 'Senior Consultant - Cataract & General Ophthalmology',
    clinicId: 'ASG-KOL-01',
    specialties: ['cataract', 'general'],
    languages: ['English', 'Hindi', 'Bengali'],
    experienceYears: 23,
    consultationFee: 700,
    days: [1, 2, 3, 4, 5, 6],
    slots: ['10:00', '10:30', '11:00', '16:30', '17:00', '17:30']
  },
  {
    id: 'ASG-DR-701',
    imageUrl: '/images/asg-dr-701.png',
    name: 'Dr. Alok Pandey',
    title: 'Consultant - Cataract & Glaucoma',
    clinicId: 'ASG-BHO-01',
    specialties: ['cataract', 'glaucoma', 'general'],
    languages: ['English', 'Hindi'],
    experienceYears: 13,
    consultationFee: 600,
    days: [1, 3, 4, 5, 6],
    slots: ['10:30', '11:00', '11:30', '17:00', '17:30']
  }
];

const fees = [
  { service: 'consultation', label: 'OPD consultation (comprehensive eye check-up)', currency: 'INR', min: 600, max: 900, note: 'Covers the initial consultation only. Diagnostics, investigations and procedures are charged separately as advised by the treating doctor.' },
  { service: 'eye-checkup', label: 'Routine eye check-up (vision, eye pressure, front and back of the eye)', currency: 'INR', min: 600, max: 900, note: 'Takes 60 to 90 minutes, longer if the eyes are dilated.' },
  { service: 'lasik-evaluation', label: 'Pre-LASIK assessment (corneal mapping, power evaluation)', currency: 'INR', min: 2500, max: 3500, note: 'Mandatory before any laser vision correction. Adjusted against surgery cost if you proceed within 60 days.' },
  { service: 'retina-screening', label: 'Dilated retina screening (diabetic eye check)', currency: 'INR', min: 1200, max: 2000, note: 'Recommended at least once a year for patients with diabetes.' },
  { service: 'lasik', label: 'Standard LASIK (both eyes)', currency: 'INR', min: 45000, max: 60000, note: 'Includes pre-op workup and the day-1 follow-up.' },
  { service: 'femto-lasik', label: 'Bladeless Femto LASIK (both eyes)', currency: 'INR', min: 70000, max: 90000, note: 'Flap created with a femtosecond laser instead of a blade.' },
  { service: 'contoura', label: 'Contoura Vision - topography-guided LASIK (both eyes)', currency: 'INR', min: 85000, max: 110000, note: 'Maps up to 22,000 points on the cornea for a personalised treatment.' },
  { service: 'prk', label: 'PRK surgery (both eyes)', currency: 'INR', min: 40000, max: 55000, note: 'For thinner corneas or active lifestyles. Recovery takes one to two weeks.' },
  { service: 'icl', label: 'ICL - Implantable Collamer Lens (per eye)', currency: 'INR', min: 65000, max: 95000, note: 'For high power, thin corneas or dry eyes. Lens is custom-ordered.' },
  { service: 'cataract-monofocal', label: 'Cataract surgery with Monofocal IOL (per eye)', currency: 'INR', min: 28000, max: 40000, note: 'Clear distance vision; reading glasses usually still needed.' },
  { service: 'cataract-multifocal', label: 'Cataract surgery with Multifocal IOL (per eye)', currency: 'INR', min: 55000, max: 85000, note: 'Distance and near vision, reducing dependence on glasses.' },
  { service: 'cataract-toric', label: 'Cataract surgery with Toric IOL (per eye)', currency: 'INR', min: 50000, max: 75000, note: 'Corrects astigmatism along with the cataract.' },
  { service: 'cataract-edof', label: 'Cataract surgery with EDOF IOL (per eye)', currency: 'INR', min: 60000, max: 90000, note: 'Extended depth of focus for distance and intermediate vision.' },
  { service: 'glaucoma-workup', label: 'Glaucoma workup (fields + OCT + pachymetry)', currency: 'INR', min: 3500, max: 5000, note: '' }
];

const procedures = [
  {
    name: 'eye-checkup',
    title: 'Routine eye check-up at ASG',
    summary: 'A vision acuity test, eye pressure measurement and a comprehensive examination of the front and back of the eye, using advanced diagnostic equipment.',
    goodCandidate: 'Adults with no eye condition once a year. Every 6 months for patients with diabetes, a family history of glaucoma, or those above 40. Children should have their first exam at 3 to 4 years.',
    downtime: 'None, though dilating drops can blur vision for a few hours.',
    duration: 'The full check-up typically takes 60 to 90 minutes.',
    anaesthesia: 'Not required.',
    risks: 'None.',
    preOp: 'Carry a valid photo ID, your current glasses or lenses, previous prescriptions or reports, and a list of medications you take.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-DEL-01', 'ASG-PUN-01', 'ASG-LKO-01', 'ASG-KOL-01', 'ASG-BHO-01']
  },
  {
    name: 'lasik',
    title: 'LASIK - Laser-Assisted In Situ Keratomileusis',
    summary: 'Laser eye surgery that reshapes the cornea to correct refractive errors - myopia, hyperopia and astigmatism. Most patients notice a significant improvement within 24 hours.',
    goodCandidate: '18 years or older, stable eye power with no significant change in the past year, a healthy cornea of adequate thickness, no active eye infection, severe dryness or major condition affecting healing. Pregnant or breastfeeding patients are advised to wait.',
    downtime: 'Clearer vision for many within 24 hours, desk work in one to two days. Swimming and contact sports are avoided for two to four weeks.',
    duration: 'Approximately 10 to 15 minutes per eye.',
    anaesthesia: 'Anaesthetic eye drops - the procedure is generally painless, with some mild pressure.',
    risks: 'Temporary dryness and night glare. Age-related changes such as presbyopia after 40 can still affect reading vision.',
    preOp: 'A pre-LASIK assessment with corneal mapping and eye power evaluation is required. Eligibility is confirmed only after that assessment.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-DEL-01', 'ASG-PUN-01', 'ASG-KOL-01']
  },
  {
    name: 'femto-lasik',
    title: 'Bladeless Femto LASIK',
    summary: 'LASIK in which the corneal flap is created with a femtosecond laser rather than a blade.',
    goodCandidate: 'Patients who qualify for LASIK and prefer a blade-free flap.',
    downtime: 'Same as standard LASIK - desk work in one to two days.',
    duration: 'About 15 minutes per eye.',
    anaesthesia: 'Anaesthetic eye drops.',
    risks: 'As with LASIK: temporary dryness and night glare.',
    preOp: 'Pre-LASIK assessment.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-DEL-01']
  },
  {
    name: 'contoura',
    title: 'Contoura Vision - topography-guided LASIK',
    summary: 'Maps up to 22,000 unique points on the cornea to build a highly personalised treatment plan, allowing more precise correction than standard LASIK.',
    goodCandidate: 'LASIK-eligible patients, particularly those with corneal irregularities who want the sharpest achievable outcome.',
    downtime: 'Similar to LASIK.',
    duration: 'About 15 minutes per eye.',
    anaesthesia: 'Anaesthetic eye drops.',
    risks: 'As with LASIK.',
    preOp: 'Corneal topography is part of the pre-LASIK assessment.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-PUN-01']
  },
  {
    name: 'prk',
    title: 'PRK - Photorefractive Keratectomy',
    summary: 'A laser refractive procedure treating the surface layer of the cornea directly, without creating a flap.',
    goodCandidate: 'Patients with thinner corneas, or active lifestyles involving contact sports.',
    downtime: 'Recovery takes slightly longer than LASIK - typically one to two weeks. Long-term results are comparable.',
    duration: 'About 10 to 15 minutes per eye.',
    anaesthesia: 'Anaesthetic eye drops.',
    risks: 'More discomfort in the first few days than LASIK, and vision clears more gradually.',
    preOp: 'Pre-LASIK assessment including corneal thickness measurement.',
    availableAt: ['ASG-JAI-01', 'ASG-DEL-01']
  },
  {
    name: 'icl',
    title: 'ICL - Implantable Collamer Lens',
    summary: 'A thin artificial lens is placed inside the eye, between the iris and the natural lens, to correct vision. The procedure is reversible.',
    goodCandidate: 'Patients with high refractive errors, thin corneas or dry eyes who may not be suitable for LASIK.',
    downtime: 'About a week; swimming avoided for a month.',
    duration: '20 to 30 minutes per eye.',
    anaesthesia: 'Topical or local anaesthesia.',
    risks: 'Small risk of raised eye pressure or lens repositioning; yearly checks are advised.',
    preOp: 'A detailed evaluation confirms whether ICL is the right option, and the lens is custom-ordered.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-DEL-01']
  },
  {
    name: 'refractive',
    title: 'Refractive surgery options at ASG',
    summary: 'A group of procedures that reduce or eliminate dependence on glasses and contact lenses by correcting how the eye focuses light. LASIK is one type; ASG also offers Femto LASIK, Contoura, PRK and ICL.',
    goodCandidate: 'Depends on corneal profile and eye power. Thin corneas are usually directed to PRK or ICL rather than standard LASIK.',
    downtime: 'LASIK and Contoura one to two days, PRK one to two weeks, ICL about a week.',
    duration: '10 to 30 minutes per eye depending on the procedure.',
    anaesthesia: 'Anaesthetic eye drops, or local anaesthesia for ICL.',
    risks: 'Vary by procedure and are explained at the clinical assessment.',
    preOp: 'Detailed corneal mapping and thickness measurement decide the safest option. The procedure is never chosen over the phone.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-DEL-01', 'ASG-PUN-01']
  },
  {
    name: 'cataract',
    title: 'Cataract surgery at ASG',
    summary: 'The cloudy natural lens is removed and replaced with a clear artificial intraocular lens (IOL). Stitch-free and performed under anaesthetic eye drops.',
    goodCandidate: 'Anyone whose cataract affects daily life - difficulty reading, glare sensitivity, faded colours, frequent power changes or trouble with night driving. Diabetic patients are operated once blood sugar is well controlled.',
    downtime: 'Vision improves for most within hours, with a follow-up the next day. Avoid rubbing the eye, keep water away for a week, wear the prescribed shield at night and avoid strenuous activity for a few days.',
    duration: 'Typically 15 to 30 minutes per eye.',
    anaesthesia: 'Local anaesthetic eye drops. Generally painless, with mild pressure only.',
    risks: 'Low overall risk. Uncontrolled diabetes can affect healing, so pre-operative clearance may be required.',
    preOp: 'A clinical examination confirms the diagnosis; surgery is the only proven treatment, as drops cannot reverse a cataract.',
    availableAt: ['ASG-JAI-01', 'ASG-MUM-01', 'ASG-DEL-01', 'ASG-PUN-01', 'ASG-LKO-01', 'ASG-KOL-01', 'ASG-BHO-01']
  }
];

const faqs = [
  { id: 'ASG-FAQ-01', tags: ['services'], question: 'What services does ASG Eye Hospital offer?', answer: 'Cataract Surgery, LASIK and Refractive Surgery, Glaucoma management, Diabetic Retinopathy treatment, Cornea transplant, Retina diseases, Paediatric Ophthalmology, ICL Surgery, Contoura LASIK and PRK Surgery - all under one roof.' },
  { id: 'ASG-FAQ-02', tags: ['appointment', 'walk-in'], question: 'Do I need an appointment, or can I walk in?', answer: 'Walk-ins are welcome at any ASG Eye Hospital. Booking in advance is recommended to avoid wait times and to ensure your preferred doctor is available.' },
  { id: 'ASG-FAQ-03', tags: ['helpline', 'contact'], question: 'What are your helpline hours and how can I reach you?', answer: 'Our toll-free number 1800 1211 804 is available from 7 AM to 9 PM daily. You can also book through asgeyehospital.com or visit your nearest branch.' },
  { id: 'ASG-FAQ-04', tags: ['locations'], question: 'How many centres does ASG have?', answer: 'ASG Eye Hospital has 200+ centres across 95+ cities in India, including Mumbai, Delhi, Pune, Jaipur, Lucknow, Kolkata and Bhopal.' }
];

const insurance = [
  { provider: 'Star Health', cashless: true, coversCataract: true, coversLasik: false, coversIcl: false, waitingPeriodMonths: 24, tpa: 'In-house', note: 'Cataract covered after a 24-month waiting period, subject to per-eye sub-limits.' },
  { provider: 'HDFC ERGO', cashless: true, coversCataract: true, coversLasik: false, coversIcl: false, waitingPeriodMonths: 24, tpa: 'In-house', note: 'Day-care cataract covered; refractive surgery excluded unless the power exceeds 7.5 D and is medically certified.' },
  { provider: 'ICICI Lombard', cashless: true, coversCataract: true, coversLasik: false, coversIcl: false, waitingPeriodMonths: 24, tpa: 'In-house', note: 'Pre-authorisation required at least 48 hours before admission.' },
  { provider: 'Niva Bupa', cashless: true, coversCataract: true, coversLasik: true, coversIcl: false, waitingPeriodMonths: 36, tpa: 'In-house', note: 'LASIK covered only on select plans and only above 7.5 D of refractive error.' },
  { provider: 'CGHS', cashless: true, coversCataract: true, coversLasik: false, coversIcl: false, waitingPeriodMonths: 0, tpa: 'CGHS', note: 'CGHS rates apply; a referral letter is mandatory.' },
  { provider: 'Bajaj Allianz', cashless: false, coversCataract: true, coversLasik: false, coversIcl: false, waitingPeriodMonths: 24, tpa: 'Medi Assist', note: 'Reimbursement only; submit bills within 30 days.' }
];

const insuranceGeneralNote =
  'ASG accepts a range of health insurance plans, and payment is accepted by cash, credit and debit cards. Cataract surgery is covered by nearly all policies after the waiting period, usually with a per-eye sub-limit. LASIK, Contoura, PRK and ICL are treated as elective refractive procedures and are excluded by most Indian policies unless the refractive error is above 7.5 D and certified as medically necessary.';

module.exports = { clinics, doctors, fees, procedures, faqs, insurance, insuranceGeneralNote };
