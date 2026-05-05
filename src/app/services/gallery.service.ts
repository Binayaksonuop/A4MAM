import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  location: string;
  description: string;
  category: string;
  date: Date;
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private storageKey = 'a4mam_gallery_images';
  private imagesSubject: BehaviorSubject<GalleryImage[]>;

  constructor() {
    const savedImages = localStorage.getItem(this.storageKey);
    const initialImages = savedImages ? JSON.parse(savedImages) : this.getMockImages();
    this.imagesSubject = new BehaviorSubject<GalleryImage[]>(initialImages);
  }

  getImages(): Observable<GalleryImage[]> {
    return this.imagesSubject.asObservable();
  }

  addImage(image: Omit<GalleryImage, 'id' | 'date'>): void {
    const newImage: GalleryImage = {
      ...image,
      id: 'IMG-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      date: new Date()
    };

    const currentImages = this.imagesSubject.getValue();
    const updatedImages = [newImage, ...currentImages];
    
    this.saveAndPublish(updatedImages);
  }

  deleteImage(id: string): void {
    const updatedImages = this.imagesSubject.getValue().filter(img => img.id !== id);
    this.saveAndPublish(updatedImages);
  }

  private saveAndPublish(images: GalleryImage[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(images));
    this.imagesSubject.next(images);
  }

  private getMockImages(): GalleryImage[] {
    return [
      {
        id: 'IMG-001',
        url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.41 PM (1).jpeg',
        title: 'Child Screening',
        location: 'Odisha',
        description: 'Initial health assessment for moderate malnutrition.',
        category: 'Field Data',
        date: new Date()
      },
      {
        id: 'IMG-002',
        url: 'assets/images/gallery/WhatsApp Image 2026-04-09 at 12.23.53 PM (2).jpeg',
        title: 'Nutrition Kits',
        location: 'Telangana',
        description: 'Distribution of monthly nutrition intervention packs.',
        category: 'Intervention',
        date: new Date()
      },
      {
        id: 'IMG-003',
        url: 'assets/images/gallery/WhatsApp Image 2026-04-04 at 12.19.25 PM.jpeg',
        title: 'Clinical Outreach',
        location: 'Odisha',
        description: 'MAM health monitoring at the village level.',
        category: 'Outreach',
        date: new Date()
      },
      {
        id: 'IMG-004',
        url: 'assets/images/gallery/WhatsApp Image 2026-04-11 at 9.02.44 PM.jpeg',
        title: 'Recovery Success',
        location: 'Jharkhand',
        description: 'Child showing significant growth after 90 days.',
        category: 'Impact',
        date: new Date()
      }
    ];
  }
}
