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
  private storageKey = 'a4mam_gallery_images_v5'; // Incremented to v5 to ensure audited unique images load
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
    const base = 'assets/images/gallery/';
    const location = 'Odisha';
    
    return [
      { id: 'IMG-001', url: base + 'WhatsApp Image 2026-04-09 at 12.23.41 PM (1).jpeg', title: 'Child Health Screening', location, description: 'Clinical assessment in rural communities.', category: 'Field Data', date: new Date() },
      { id: 'IMG-002', url: base + 'WhatsApp Image 2026-04-09 at 12.23.53 PM (2).jpeg', title: 'Nutrition Kit Distribution', location, description: 'Providing monthly intervention packs.', category: 'Intervention', date: new Date() },
      { id: 'IMG-003', url: base + 'WhatsApp Image 2026-04-04 at 12.19.25 PM.jpeg', title: 'Medical Outreach', location, description: 'Village-level monitoring and care.', category: 'Outreach', date: new Date() },
      { id: 'IMG-004', url: base + 'WhatsApp Image 2026-04-11 at 9.02.44 PM.jpeg', title: 'Impact Showcase', location, description: 'Successful recovery after 90 days.', category: 'Impact', date: new Date() },
      { id: 'IMG-005', url: base + 'WhatsApp Image 2026-04-09 at 12.23.40 PM (1).jpeg', title: 'Awareness Workshop', location, description: 'Educating mothers on infant health.', category: 'Awareness', date: new Date() },
      { id: 'IMG-006', url: base + 'WhatsApp Image 2026-04-11 at 9.08.53 PM.jpeg', title: 'Production Excellence', location, description: 'Cultivating pharmaceutical-grade Spirulina.', category: 'Production', date: new Date() },
      { id: 'IMG-007', url: base + 'WhatsApp Image 2026-04-09 at 12.23.39 PM (1).jpeg', title: 'Data Collection', location, description: 'Precision tracking of nutritional progress.', category: 'Field Data', date: new Date() },
      { id: 'IMG-008', url: base + 'WhatsApp Image 2026-04-09 at 12.23.46 PM (3).jpeg', title: 'Logistics Center', location, description: 'Supply chain management for remote areas.', category: 'Intervention', date: new Date() },
      { id: 'IMG-009', url: base + 'WhatsApp Image 2026-04-09 at 12.23.56 PM (2).jpeg', title: 'Lab Testing', location, description: 'Quality control for our superfood products.', category: 'Production', date: new Date() },
      { id: 'IMG-010', url: base + 'WhatsApp Image 2026-04-11 at 9.04.46 PM (1).jpeg', title: 'Community Support', location, description: 'Empowering local leaders for nutrition.', category: 'Outreach', date: new Date() },
      { id: 'IMG-011', url: base + 'WhatsApp Image 2026-04-11 at 9.12.47 PM.jpeg', title: 'Recovery Milestones', location, description: 'Documenting clinical improvements.', category: 'Impact', date: new Date() },
      { id: 'IMG-012', url: base + 'WhatsApp Image 2026-04-11 at 9.14.40 PM (2).jpeg', title: 'Future Generation', location, description: 'Ensuring a healthy future for every child.', category: 'Impact', date: new Date() },
      { id: 'IMG-013', url: base + 'mam_gallery_1.jpg', title: 'Rural Mission Odisha', location, description: 'On-ground execution of MAM protocols.', category: 'Outreach', date: new Date() },
      { id: 'IMG-014', url: base + 'mam_gallery_2.jpg', title: 'Field Intervention Odisha', location, description: 'Direct nutritional support delivery.', category: 'Intervention', date: new Date() },
      { id: 'IMG-015', url: base + 'mam_gallery_3.jpg', title: 'Health Metrics Odisha', location, description: 'Measuring impact with precision.', category: 'Field Data', date: new Date() },
      { id: 'IMG-016', url: base + 'mam_gallery_4.jpg', title: 'Product Showcase Odisha', location, description: 'Our range of Spirulina-based solutions.', category: 'Production', date: new Date() },
      { id: 'IMG-018', url: base + 'mam_gallery_6.jpg', title: 'Scaling Impact Odisha', location, description: 'Expanding our reach across the state.', category: 'Impact', date: new Date() },
      { id: 'IMG-019', url: base + 'mam_gallery_7.jpg', title: 'Operational Excellence Odisha', location, description: 'Streamlined delivery systems.', category: 'Intervention', date: new Date() },
      { id: 'IMG-020', url: base + 'mam_gallery_8.jpg', title: 'Scientific Rigor Odisha', location, description: 'Evidence-based nutritional science.', category: 'Field Data', date: new Date() },
      { id: 'IMG-021', url: base + 'mam_gallery_9.jpg', title: 'Mission Growth Odisha', location, description: 'Scaling to new horizons.', category: 'Awareness', date: new Date() },
      { id: 'IMG-022', url: base + 'mam_gallery_10.jpg', title: 'Success Stories Odisha', location, description: 'Real lives transformed by A4MAM.', category: 'Impact', date: new Date() },
      { id: 'IMG-023', url: base + 'mam_gallery_11.jpg', title: 'Local Partnership Odisha', location, description: 'Collaborating for a malnutrition-free India.', category: 'Awareness', date: new Date() }
    ];
  }
}
