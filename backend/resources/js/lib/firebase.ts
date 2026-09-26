import axios from 'axios';
import { InquiryFormData } from '../types';

export interface StoredInquiryPayload extends InquiryFormData {
  submittedAt: string;
  status: 'pending' | 'reviewed' | 'contacted';
  referenceNumber: string;
}

/**
 * Submits a new project inquiry to the Laravel backend API
 */
export async function submitProjectInquiry(formData: InquiryFormData): Promise<{
  id: string;
  referenceNumber: string;
}> {
  const response = await axios.post('/inquiry', {
    name: formData.name.trim(),
    email: formData.email.trim().toLowerCase(),
    company: formData.company ? formData.company.trim() : null,
    project_types: [formData.projectType],
    budget_range: formData.budgetRange || 'Flexible',
    timeline: formData.timeline,
    details: formData.description && formData.description.trim().length > 0
      ? formData.description.trim()
      : `Inquiry for ${formData.projectType}`,
    selected_tech: formData.selectedTech || [],
  });

  return {
    id: String(response.data.id),
    referenceNumber: response.data.reference_number,
  };
}

export interface NewsletterSubscriptionResult {
  id: string;
  email: string;
}

/**
 * Subscribes a user email address to the newsletter in the Laravel backend
 */
export async function subscribeToNewsletter(
  email: string,
  _source = 'newsletter_component'
): Promise<NewsletterSubscriptionResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const response = await axios.post('/newsletter/subscribe', {
    email: normalizedEmail,
  });

  return {
    id: String(response.data.id),
    email: response.data.email,
  };
}
