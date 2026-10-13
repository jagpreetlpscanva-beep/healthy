
export const LANGS = { EN: 'English', HI: 'हिन्दी', TE: 'తెలుగు' };
export const nextLang = l => ({ EN: 'HI', HI: 'TE', TE: 'EN' })[l];
const T = (EN, HI, TE) => ({ EN, HI, TE });

export const UI = {
  headline: T('Your results, in everyday language.', 'आपकी रिपोर्ट, आसान भाषा में।', 'మీ రిపోర్ట్, సులభమైన భాషలో.'),
  sub: T('Sample explanations generated from your extracted values. Always confirm with your doctor.', 'निकाली गई वैल्यू के आधार पर नमूना व्याख्या। कृपया डॉक्टर से पुष्टि करें।', 'సేకరించిన విలువల ఆధారంగా నమూనా వివరణ. దయచేసి డాక్టర్‌తో నిర్ధారించుకోండి.'),
  low: T('Low', 'कम', 'తక్కువ'), high: T('High', 'ज़्यादा', 'ఎక్కువ'), normal: T('In range', 'सामान्य', 'సాధారణం'),
  ask: T('Questions for your doctor', 'डॉक्टर से पूछने के सवाल', 'డాక్టర్‌ను అడగాల్సిన ప్రశ్నలు'),
  safe: T('Informational only — not a diagnosis.', 'केवल जानकारी के लिए — निदान नहीं।', 'సమాచారం కోసం మాత్రమే — నిర్ధారణ కాదు.'),
  unknown: T('No range', 'सीमा उपलब्ध नहीं', 'పరిధి లేదు'),
  inRange: T('in range', 'सामान्य सीमा में', 'సాధారణ పరిధిలో'),
};
export const QUESTIONS = {
  EN: ['Is this value expected for my age and health history?', 'Do I need a repeat test, and when?', 'Should I change anything in my diet, activity or medicines?'],
  HI: ['क्या यह वैल्यू मेरी उम्र और सेहत के हिसाब से ठीक है?', 'क्या दोबारा जाँच करानी चाहिए, और कब?', 'क्या मुझे खान-पान, गतिविधि या दवाओं में कुछ बदलना चाहिए?'],
  TE: ['నా వయసు, ఆరోగ్య చరిత్రకు ఈ విలువ సాధారణమేనా?', 'మళ్లీ పరీక్ష చేయించుకోవాలా, ఎప్పుడు?', 'నా ఆహారం, కార్యకలాపాలు లేదా మందుల్లో ఏమైనా మార్చాలా?'],
};

export const TESTS = [
  { id: 'hb', name: 'Hemoglobin', value: 12.4, unit: 'g/dL', lo: 12, hi: 15.5, conf: 97, loinc: '718-7',
    say: T('Hemoglobin carries oxygen in your blood. Your value is within the usual range.', 'हीमोग्लोबिन आपके खून में ऑक्सीजन पहुँचाता है। आपकी वैल्यू सामान्य सीमा में है।', 'హిమోగ్లోబిన్ మీ రక్తంలో ఆక్సిజన్‌ను తీసుకెళ్తుంది. మీ విలువ సాధారణ పరిధిలో ఉంది.') },
  { id: 'vitd', name: 'Vitamin D (25-OH)', value: 12.8, unit: 'ng/mL', lo: 30, hi: 100, conf: 94, loinc: '62292-8',
    say: T('Vitamin D keeps bones and muscles strong. Your value is lower than the usual range — your doctor can tell you whether you need a supplement.', 'विटामिन D हड्डियों और मांसपेशियों को मज़बूत रखता है। आपकी वैल्यू सामान्य से कम है — सप्लीमेंट की ज़रूरत है या नहीं, डॉक्टर बता सकते हैं।', 'విటమిన్ D ఎముకలు, కండరాలను బలంగా ఉంచుతుంది. మీ విలువ సాధారణ పరిధికంటే తక్కువగా ఉంది — సప్లిమెంట్ అవసరమా అని డాక్టర్ చెప్పగలరు.') },
  { id: 'chol', name: 'Total Cholesterol', value: 210, unit: 'mg/dL', lo: 125, hi: 200, conf: 96, loinc: '2093-3',
    say: T('Cholesterol is a type of fat in your blood. Yours is slightly above the desirable range; your doctor will look at the full lipid profile.', 'कोलेस्ट्रॉल खून में मौजूद एक तरह की चर्बी है। आपकी वैल्यू वांछित सीमा से थोड़ी ऊपर है; डॉक्टर पूरी लिपिड प्रोफ़ाइल देखकर बताएँगे।', 'కొలెస్ట్రాల్ రక్తంలోని ఒక రకమైన కొవ్వు. మీ విలువ కోరదగిన పరిధికంటే కొద్దిగా ఎక్కువగా ఉంది; పూర్తి లిపిడ్ ప్రొఫైల్ చూసి డాక్టర్ చెబుతారు.') },
  { id: 'glu', name: 'Fasting Glucose', value: 92, unit: 'mg/dL', lo: 70, hi: 99, conf: 95, loinc: '1558-6',
    say: T('Fasting glucose shows blood sugar after an overnight fast. Yours is within the usual range.', 'फास्टिंग ग्लूकोज़ रात भर भूखे रहने के बाद का ब्लड शुगर बताता है। आपकी वैल्यू सामान्य सीमा में है।', 'ఫాస్టింగ్ గ్లూకోజ్ రాత్రంతా ఉపవాసం తర్వాత రక్తంలో చక్కెర స్థాయిని చూపుతుంది. మీ విలువ సాధారణ పరిధిలో ఉంది.') },
];
export const statusOf = t => (t.lo == null || t.hi == null ? 'unknown' : t.value < t.lo ? 'low' : t.value > t.hi ? 'high' : 'normal');
export const toneOf = s => ({ normal: 'teal', low: 'blue', high: 'orange', unknown: 'violet' })[s];

export const MEDS = [
  { id: 'm1', name: 'Vitamin D3 60000 IU', dose: '1 sachet', freq: 'Once weekly', days: '8 weeks', sched: ['W'], conf: 93 },
  { id: 'm2', name: 'Calcium 500 mg', dose: '1 tablet', freq: 'Twice daily, after food', days: '30 days', sched: ['M', 'N'], conf: 88, hand: true },
  { id: 'm3', name: 'Omega-3 1000 mg', dose: '1 capsule', freq: 'Once daily, night', days: '30 days', sched: ['N'], conf: 84, hand: true },
];
export const DX = [{ id: 'd1', name: 'Vitamin D deficiency (suspected)', conf: 90 }, { id: 'd2', name: 'Borderline high cholesterol', conf: 87 }];

export const initialVault = { tests: [], meds: [], dx: [] };



export const SAMPLE_EXTRACTION = { meta: { documentType: 'lab_report', date: '2026-10-10', provider: 'City Diagnostics', doctor: 'Dr. A. Sharma' }, tests: TESTS, meds: MEDS, dx: DX };

export function buildFhir({ abha, tests, meds, dx }) {
  const subject = { reference: 'Patient/patient-zero' };
  const flag = { low: 'L', high: 'H', normal: 'N' };
  return {
    Patient: [{ resourceType: 'Patient', id: 'patient-zero', meta: { profile: ['https://nrces.in/ndhm/fhir/r4/StructureDefinition/Patient'] },
      identifier: [{ system: 'https://healthid.ndhm.gov.in', value: abha || 'XX-XXXX-XXXX-XXXX' }], name: [{ text: 'Patient Zero' }] }],
    Observation: tests.map(t => ({ resourceType: 'Observation', id: 'obs-' + t.id, status: 'final',
      category: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/observation-category', code: 'laboratory' }] }],
      code: { coding: t.loinc ? [{ system: 'http://loinc.org', code: t.loinc, display: t.name }] : [], text: t.name }, subject,
      valueQuantity: { value: t.value, unit: t.unit, system: 'http://unitsofmeasure.org' },
      ...(t.lo != null && t.hi != null ? { referenceRange: [{ low: { value: t.lo, unit: t.unit }, high: { value: t.hi, unit: t.unit } }] } : {}),
      ...(flag[statusOf(t)] ? { interpretation: [{ coding: [{ system: 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation', code: flag[statusOf(t)] }] }] } : {}) })),
    MedicationRequest: meds.map(m => ({ resourceType: 'MedicationRequest', id: 'rx-' + m.id, status: 'active', intent: 'order',
      medicationCodeableConcept: { text: m.name }, subject, dosageInstruction: [{ text: `${m.dose} · ${m.freq} · ${m.days}` }] })),
    Condition: dx.map(d => ({ resourceType: 'Condition', id: 'dx-' + d.id, subject, code: { text: d.name }, clinicalStatus: { coding: [{ code: 'active' }] } })),
  };
}
export const toBundle = fhir => ({ resourceType: 'Bundle', type: 'collection', entry: Object.values(fhir).flat().map(resource => ({ resource })) });
