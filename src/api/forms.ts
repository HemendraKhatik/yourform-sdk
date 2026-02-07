import { HttpClient } from '../http.js';
import { CreateFormOptions, Form, UpdateFormOptions, validateQuestionType, validateFormStyle } from '../types/index.js';

/**
 * API for managing YourForm forms.
 */
export class FormsApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all forms owned by the authenticated user.
   * @returns A list of form objects.
   */
  public async list(): Promise<Form[]> {
    return this.http.request<Form[]>('/forms');
  }

  /**
   * Retrieve a specific form by its ID.
   * @param id The unique identifier of the form.
   * @returns The form object.
   */
  public async get(id: string): Promise<Form> {
    return this.http.request<Form>(`/forms/${id}`);
  }

  /**
   * Create a new form.
   * @param data Options for the new form, including title and questions.
   * @returns The created form object.
   */
  public async create(data: CreateFormOptions): Promise<Form> {
    // Default style to 'step' if not provided
    const style = data.style || 'step';
    validateFormStyle(style);
    
    if (data.questions) {
      data.questions.forEach(q => validateQuestionType(q.type));
    }

    return this.http.request<Form>('/forms', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        style
      }),
    });
  }

  /**
   * Update an existing form's settings or content.
   * @param id The unique identifier of the form to update.
   * @param data The updates to apply.
   * @returns The updated form object.
   */
  public async update(id: string, data: UpdateFormOptions): Promise<Form> {
    if (data.style) {
      validateFormStyle(data.style);
    }

    return this.http.request<Form>(`/forms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Permanently delete a form and all its associated data.
   * @param id The unique identifier of the form to delete.
   */
  public async delete(id: string): Promise<void> {
    return this.http.request<void>(`/forms/${id}`, {
      method: 'DELETE',
    });
  }

  /**
   * Publish a form to make it accessible to the public.
   * @param id The unique identifier of the form to publish.
   * @returns The updated form object with published status.
   */
  public async publish(id: string): Promise<Form> {
    return this.http.request<Form>(`/forms/${id}/publish`, {
      method: 'POST',
    });
  }
}
