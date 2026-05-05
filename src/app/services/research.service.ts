import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ResearchArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  status: 'Draft' | 'Published';
}

@Injectable({
  providedIn: 'root'
})
export class ResearchService {
  private articlesSubject = new BehaviorSubject<ResearchArticle[]>([]);
  private storageKey = 'a4mam_research_articles';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        this.articlesSubject.next(JSON.parse(stored));
      } else {
        // Initialize with some mock data
        const initialData: ResearchArticle[] = [
          { id: '1', title: 'Spirulina Impact on Severe Malnutrition', category: 'Clinical Study', summary: 'Results from 6-month trial in rural India showing 40% faster recovery rates.', status: 'Published' }
        ];
        this.articlesSubject.next(initialData);
        this.saveToStorage(initialData);
      }
    }
  }

  private saveToStorage(articles: ResearchArticle[]): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(articles));
    }
  }

  getArticles(): Observable<ResearchArticle[]> {
    return this.articlesSubject.asObservable();
  }

  addArticle(article: Omit<ResearchArticle, 'id'>): void {
    const newArticle = { ...article, id: Date.now().toString() };
    const current = this.articlesSubject.value;
    const updated = [...current, newArticle];
    this.articlesSubject.next(updated);
    this.saveToStorage(updated);
  }

  updateArticle(id: string, updates: Partial<ResearchArticle>): void {
    const current = this.articlesSubject.value;
    const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
    this.articlesSubject.next(updated);
    this.saveToStorage(updated);
  }

  deleteArticle(id: string): void {
    const current = this.articlesSubject.value;
    const updated = current.filter(a => a.id !== id);
    this.articlesSubject.next(updated);
    this.saveToStorage(updated);
  }
}
