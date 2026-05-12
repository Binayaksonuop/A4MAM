import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  location: string;
  description: string;
  category: string;
  date: Date;
}

interface BackendResponse {
  success: boolean;
  data: any[];
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private adminApiUrl = `${environment.apiUrl}/admin/gallery`;
  private publicApiUrl = `${environment.apiUrl}/gallery`;
  private imagesSubject = new BehaviorSubject<GalleryImage[]>([]);

  constructor(private http: HttpClient) {}

  getImages(): Observable<GalleryImage[]> {
    return this.http.get<BackendResponse>(this.publicApiUrl).pipe(
      map(response => {
        if (response.success) {
          const mapped = response.data.map(item => ({
            id: item._id,
            url: item.url,
            title: item.title,
            location: item.location,
            description: item.description,
            category: item.category,
            date: new Date(item.createdAt)
          }));
          this.imagesSubject.next(mapped);
          return mapped;
        }
        return [];
      }),
      catchError(error => {
        console.error('Error fetching gallery images:', error);
        return of([]);
      })
    );
  }

  addImage(image: any): void {
    this.http.post(this.adminApiUrl, image).subscribe({
      next: () => this.getImages().subscribe(), // Refresh
      error: (err) => console.error('Error adding gallery image:', err)
    });
  }

  deleteImage(id: string): void {
    this.http.delete(`${this.adminApiUrl}/${id}`).subscribe({
      next: () => {
        const current = this.imagesSubject.getValue();
        const updated = current.filter(img => img.id !== id);
        this.imagesSubject.next(updated);
      },
      error: (err) => console.error('Error deleting gallery image:', err)
    });
  }
}
