import { Injectable } from '@angular/core';
import { AuthSession, Session, SupabaseClient, createClient } from '@supabase/supabase-js';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { map } from 'rxjs';

@Injectable()
export class SupabaseService {
  private _supabase: SupabaseClient;
  private _session$ = new BehaviorSubject<AuthSession | null>(null);

  constructor() {
    this._supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  setSession(session: Session | null) {
    this._session$.next(session);
  }

  async refreshSession() {
    const {
      data: { session },
    } = await this.getSession();
    this._session$.next(session);
  }

  getSession() {
    return this._supabase.auth.getSession();
  }

  get session$() {
    return this._session$.asObservable();
  }

  signIn({ email, password }: { email: string; password: string }) {
    return this._supabase.auth.signInWithPassword({
      email,
      password,
    });
  }

  signUp(email: string, password: string, nick: string) {
    return this._supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          nick,
        },
      },
    });
  }

  signOut() {
    return this._supabase.auth.signOut();
  }

  userId$() {
    return this._session$.pipe(map(session => session?.user.id));
  }
}
