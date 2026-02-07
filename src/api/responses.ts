import { HttpClient } from '../http';
import { Response } from '../types';

/**
 * API for submitting and retrieving form responses.
 */
export class ResponsesApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * Submit a new response to a form.
   * @param formId The unique identifier of the form.
   * @param data A key-value map of question IDs to answers.
   * @returns The created response object.
   */
  public async submit(formId: string, data: Record<string, any>): Promise<Response> {
    return this.http.request<Response>(`/forms/${formId}/submissions`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * List all responses submitted to a specific form.
   * @param formId The unique identifier of the form.
   * @returns A list of response objects.
   */
  public async list(formId: string): Promise<Response[]> {
    return this.http.request<Response[]>(`/forms/${formId}/submissions`);
  }

  /**
   * Retrieve a specific form response by its ID.
   * @param formId The unique identifier of the form.
   * @param responseId The unique identifier of the response.
   * @returns The response object.
   */
  public async get(formId: string, responseId: string): Promise<Response> {
    return this.http.request<Response>(`/forms/${formId}/submissions/${responseId}`);
  }
}
