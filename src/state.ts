/**
 * Global Session State for Kshyara's Density.
 */
export class SessionState {
  public isAuthenticated: boolean = false;
  public startTime: number = Date.now();
  public activeModel: string = 'gemini-2.5-flash';
}

export const state = new SessionState();
