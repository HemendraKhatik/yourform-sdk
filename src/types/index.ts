import { ValidationError } from '../errors/index.js';

/**
 * Supported question types in YourForm.
 * 
 * Supported types:
 * - short_text: Single line text
 * - long_text: Multi-line text area
 * - dropdown: Single select dropdown
 * - checkboxes: Multiple select options
 * - email: Email address with validation
 * - phone: Phone number with validation
 * - number: Numeric input
 * - date: Date picker
 * - rating: Star or numeric rating
 * - opinion_scale: Scale (e.g. 0-10)
 * - yes_no: Binary choice
 * - file_upload: File attachment
 * - website: URL input
 * - matrix: Multi-row scale/choice matrix
 * - multiple_choice: Single select radio options
 */
export type QuestionType = 
  | 'short_text' 
  | 'long_text' 
  | 'dropdown' 
  | 'checkboxes' 
  | 'email' 
  | 'phone' 
  | 'number' 
  | 'date' 
  | 'rating' 
  | 'opinion_scale' 
  | 'yes_no' 
  | 'file_upload' 
  | 'website'
  | 'matrix'
  | 'multiple_choice';

/**
 * Validates if a given string is a supported QuestionType.
 */
export const SUPPORTED_QUESTION_TYPES: QuestionType[] = [
  'short_text', 'long_text', 'dropdown', 'checkboxes', 'email', 
  'phone', 'number', 'date', 'rating', 'opinion_scale', 
  'yes_no', 'file_upload', 'website', 'matrix', 'multiple_choice'
];

/**
 * Validates a question type and throws a ValidationError if unsupported.
 * @param type The question type to validate.
 * @throws ValidationError if the type is not supported.
 */
export function validateQuestionType(type: any): void {
  if (!SUPPORTED_QUESTION_TYPES.includes(type)) {
    throw new ValidationError(`Unsupported question type: ${type}. Supported types are: ${SUPPORTED_QUESTION_TYPES.join(', ')}`);
  }
}

/**
 * Supported layout styles for YourForm forms.
 */
export type FormStyle = 'classic' | 'step' | 'multi_step' | 'chat' | 'card' | 'survey';

/**
 * List of all supported form layout styles.
 */
export const SUPPORTED_FORM_STYLES: FormStyle[] = [
  'classic', 'step', 'multi_step', 'chat', 'card', 'survey'
];

/**
 * Validates a form style and throws a ValidationError if unsupported.
 * @param style The layout style to validate.
 * @throws ValidationError if the style is not supported.
 */
export function validateFormStyle(style: any): void {
  if (!SUPPORTED_FORM_STYLES.includes(style)) {
    throw new ValidationError(`Unsupported form style: ${style}. Supported styles are: ${SUPPORTED_FORM_STYLES.join(', ')}`);
  }
}

/**
 * Represents a YourForm form definition.
 */
export interface Form {
  /** Unique identifier for the form. */
  id: string;
  /** The title of the form. */
  title: string;
  /** Optional description for the form. */
  description?: string;
  /** List of questions associated with the form. */
  questions: Field[];
  /** Theme name or configuration. */
  theme?: string;
  /** Visual layout style. */
  style?: FormStyle;
  /** General form settings (e.g., closing date). */
  settings?: any;
  /** Whether the form is currently published and accepting responses. */
  published: boolean;
  /** ISO date string of creation. */
  createdAt: string;
  /** ISO date string of last update. */
  updatedAt: string;
}

/**
 * Options for creating a new form.
 */
export interface CreateFormOptions {
  /** The title of the form. */
  title: string;
  /** Optional description for the form. */
  description?: string;
  /** Optional initial questions. */
  questions?: (Omit<Field, 'id' | 'slug'> & { slug?: string })[];
  /** Optional theme selection. */
  theme?: string;
  /** Optional layout style. */
  style?: FormStyle;
  /** Optional form settings. */
  settings?: any;
}

/**
 * Options for updating an existing form.
 */
export interface UpdateFormOptions {
  /** New title for the form. */
  title?: string;
  /** New description for the form. */
  description?: string;
  /** New theme selection. */
  theme?: string;
  /** New layout style. */
  style?: FormStyle;
  /** New form settings. */
  settings?: any;
}

/**
 * Represents a single question or field in a form.
 */
export interface Field {
  /** Unique identifier for the field. */
  id: string;
  /** Explicit field name for submission (slug). */
  slug: string;
  /** The type of question (e.g., 'short_text', 'multiple_choice'). */
  type: QuestionType;
  /** The question text. */
  title: string;
  /** Whether an answer is required to proceed. */
  required?: boolean;
  /** Options for choice-based questions. */
  options?: any;
  /** Guidance text for the input field. */
  placeholder?: string;
}

/**
 * Represents a user submission for a form.
 */
export interface Response {
  /** Unique identifier for the response. */
  id: string;
  /** ID of the form this response belongs to. */
  formId: string;
  /** Map of field IDs to the user's answers. */
  data: Record<string, any>;
  /** ISO date string of submission. */
  submittedAt: string;
}
