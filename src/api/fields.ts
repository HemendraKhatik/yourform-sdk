import { HttpClient } from '../http';
import { Field, validateQuestionType } from '../types';

/**
 * API for managing fields (questions) within a YourForm form.
 */
export class FieldsApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * List all fields for a specific form.
   * @param formId The unique identifier of the form.
   * @returns A list of field objects.
   */
  public async list(formId: string): Promise<Field[]> {
    return this.http.request<Field[]>(`/forms/${formId}/fields`);
  }

  /**
   * Add a new field or multiple fields to a form.
   * @param formId The unique identifier of the form.
   * @param data A single field configuration or an array of field configurations (excluding IDs).
   * @returns The created field object or an array of created field objects.
   */
  public async add(formId: string, data: Omit<Field, 'id'>): Promise<Field>;
  public async add(formId: string, data: Omit<Field, 'id'>[]): Promise<Field[]>;
  public async add(formId: string, data: Omit<Field, 'id'> | Omit<Field, 'id'>[]): Promise<Field | Field[]> {
    if (Array.isArray(data)) {
      data.forEach(q => validateQuestionType(q.type));
    } else {
      validateQuestionType(data.type);
    }
    
    return this.http.request<Field | Field[]>(`/forms/${formId}/fields`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Update an existing field or multiple fields.
   * @param formId The unique identifier of the form.
   * @param fieldId The unique identifier of the field (for single update).
   * @param data The updates to apply.
   * @returns The updated field object or an array of updated field objects.
   */
  public async update(formId: string, fieldId: string, data: Partial<Field>): Promise<Field>;
  public async update(formId: string, data: (Partial<Field> & { id: string })[]): Promise<Field[]>;
  public async update(
    formId: string,
    fieldIdOrData: string | (Partial<Field> & { id: string })[],
    data?: Partial<Field>
  ): Promise<Field | Field[]> {
    if (Array.isArray(fieldIdOrData)) {
      fieldIdOrData.forEach(u => u.type && validateQuestionType(u.type));
      
      return this.http.request<Field[]>(`/forms/${formId}/fields`, {
        method: 'PATCH',
        body: JSON.stringify(fieldIdOrData),
      });
    }

    if (typeof fieldIdOrData === 'string' && data) {
      if (data.type) {
        validateQuestionType(data.type);
      }

      return this.http.request<Field>(`/forms/${formId}/fields/${fieldIdOrData}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    }

    throw new Error('Invalid arguments: provide (formId, fieldId, data) or (formId, updatesArray)');
  }

  /**
   * Permanently remove a field from a form.
   * @param formId The unique identifier of the form.
   * @param fieldId The unique identifier of the field to remove.
   */
  public async remove(formId: string, fieldId: string): Promise<void> {
    return this.http.request<void>(`/forms/${formId}/fields/${fieldId}`, {
      method: 'DELETE',
    });
  }
}
