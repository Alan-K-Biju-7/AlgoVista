'use strict';

const crypto = require('node:crypto');

const EMAIL = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE = /(?:\+?\d[\s().-]*){9,}\d/g;
const SECRET = /\b(api[_-]?key|token|password|secret)\s*[:=]\s*[^\s,;]+/gi;

function deidentifyText(value) {
  return String(value || '').replace(EMAIL, '[email]').replace(PHONE, '[phone]').replace(SECRET, '$1=[secret]').slice(0, 4000);
}

function prepareQuarantinedExample(input, consent) {
  if (!consent?.modelImprovement || !consent?.grantedAt || consent?.revokedAt) {
    throw new TypeError('Active, explicit model-improvement consent is required.');
  }
  const example = {
    id: crypto.createHash('sha256').update(`${consent.subjectId}:${input.attemptId}:${consent.grantedAt}`).digest('hex'),
    status: 'quarantined',
    consentRevision: String(consent.revision || '1'),
    createdAt: new Date().toISOString(),
    mode: String(input.mode || 'socratic').slice(0, 32),
    question: deidentifyText(input.question),
    response: deidentifyText(input.response),
    diagnosis: String(input.diagnosis || 'none').slice(0, 48),
  };
  if (/\[[a-z]+\]/i.test(example.question + example.response)) example.reviewFlags = ['redaction-applied'];
  return example;
}

function exportApprovedExamples(examples, revokedIds = []) {
  const revoked = new Set(revokedIds);
  return examples.filter((item) => item.status === 'approved' && !revoked.has(item.id))
    .map(({ question, response, mode, diagnosis }) => ({ question, response, mode, diagnosis }));
}

module.exports = { deidentifyText, exportApprovedExamples, prepareQuarantinedExample };
