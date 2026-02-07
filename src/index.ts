import { HttpClient, HttpClientOptions } from './http.js';
import { FormsApi } from './api/forms.js';
import { FieldsApi } from './api/fields.js';
import { ResponsesApi } from './api/responses.js';

export * from './types/index.js';
export * from './errors/index.js';

/**
 * Options for initializing the YourForm SDK.
 */
export interface YourFormOptions extends HttpClientOptions {}

/**
 * Main entry point for the YourForm SDK.
 * Provides access to forms, fields, and responses APIs.
 */
export class YourForm {
  private readonly http: HttpClient;
  
  /** API for managing forms and their settings. */
  public readonly forms: FormsApi;
  
  /** API for managing form fields and questions. */
  public readonly fields: FieldsApi;
  
  /** API for retrieving and managing form responses. */
  public readonly responses: ResponsesApi;

  /**
   * Initialize a new YourForm SDK instance.
   * @param options Configuration options including API key and base URL.
   */
  constructor(options: YourFormOptions) {
    this.http = new HttpClient(options);
    
    this.forms = new FormsApi(this.http);
    this.fields = new FieldsApi(this.http);
    this.responses = new ResponsesApi(this.http);
  }
}
