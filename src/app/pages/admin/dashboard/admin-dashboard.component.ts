import { Component, OnInit, NgZone, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DashboardService, AdminStats } from '../../../services/dashboard.service';
import { GalleryService, GalleryImage } from '../../../services/gallery.service';
import { OrderService, AdminOrder } from '../../../services/order.service';
import { InquiryService, AdminInquiry } from '../../../services/inquiry.service';
import { ImageService } from '../../../services/image.service';
import { LightboxService } from '../../../services/lightbox.service';
import { ResearchService, ResearchArticle } from '../../../services/research.service';
import { DonationService, DonationPlan } from '../../../services/donation.service';
import { ProductService, AdminProduct } from '../../../services/product.service';
import { FormsModule } from '@angular/forms';
import gsap from 'gsap';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private isBrowser: boolean;
  activeAdminPanel: 'dashboard' | 'images' | 'research' | 'donations' | 'products' | 'inquiries' = 'dashboard';
  today = new Date();

  // Gallery State
  galleryImages: GalleryImage[] = [];

  // Data Streams
  stats: AdminStats | null = null;
  orders: AdminOrder[] = [];
  inquiries: AdminInquiry[] = [];
  articles: ResearchArticle[] = [];
  donationPlans: DonationPlan[] = [];
  products: AdminProduct[] = [];

  // Form states
  newArticle: Partial<ResearchArticle> = { title: '', category: 'Clinical Study', summary: '', status: 'Draft' };
  newProduct: Partial<AdminProduct> = { name: '', price: 0, stock: 0, status: 'Draft', imageUrl: 'assets/images/spirulina_s.png' };

  // Gallery Upload State
  newImage = { title: '', location: '', description: '', category: 'Field Data' };
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isUploading = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private zone: NgZone,
    private authService: AuthService,
    private dashboardService: DashboardService,
    private galleryService: GalleryService,
    private orderService: OrderService,
    private inquiryService: InquiryService,
    private imageService: ImageService,
    private lightboxService: LightboxService,
    private researchService: ResearchService,
    private donationService: DonationService,
    private productService: ProductService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe(s => this.stats = s);
    this.galleryService.getImages().subscribe(imgs => this.galleryImages = imgs);
    this.orderService.getOrders().subscribe(ords => this.orders = ords);
    this.inquiryService.getInquiries().subscribe(inqs => this.inquiries = inqs);
    this.researchService.getArticles().subscribe(arts => this.articles = arts);
    this.donationService.getPlans().subscribe(plans => this.donationPlans = plans);
    this.productService.getProducts().subscribe(prods => this.products = prods);
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.animateDashboard();
    }
  }

  openAdminPanel(panel: any): void {
    this.activeAdminPanel = panel;
    if (this.isBrowser && panel === 'dashboard') {
      setTimeout(() => this.animateDashboard(), 100);
    } else if (this.isBrowser) {
       setTimeout(() => {
        gsap.fromTo('.section-fade-in', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
       }, 50);
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // --- Lightbox Methods ---
  openLightbox(image: any): void {
    const idx = this.galleryImages.indexOf(image);
    this.lightboxService.open({
      src: image.url,
      title: image.title,
      tag: image.category,
      location: image.location,
      images: this.galleryImages,
      currentIndex: idx
    });
  }

  // --- Animation Logic ---
  private animateDashboard() {
    this.zone.runOutsideAngular(() => {
      gsap.fromTo('.reveal-dash',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );

      // Animate counters
      const counters = document.querySelectorAll('.counter-v6');
      counters.forEach(counter => {
        const targetValue = +(counter.getAttribute('data-target') || 0);
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: targetValue,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: () => {
            counter.innerHTML = Math.ceil(proxy.val).toLocaleString();
          }
        });
      });

      // Animate bars and progress
      gsap.fromTo('.bar-v6', { height: '0%' }, { height: (i, target: any) => target.dataset.height || '0%', duration: 1.5, stagger: 0.05, ease: 'power2.out' });
      gsap.fromTo('.progress-fill', { width: '0%' }, { width: (i, target: any) => target.dataset.width || '0%', duration: 1.5, ease: 'power2.out' });
    });
  }

  // --- Gallery Actions ---
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.imageService.fileToBase64(file).then(base64 => {
        this.previewUrl = base64;
      });
    }
  }

  async uploadImage(): Promise<void> {
    if (!this.previewUrl || !this.newImage.title) return;
    this.isUploading = true;
    try {
      const compressed = await this.imageService.compressImage(this.previewUrl);
      this.galleryService.addImage({
        url: compressed,
        title: this.newImage.title,
        location: this.newImage.location,
        description: this.newImage.description,
        category: this.newImage.category
      });
      this.newImage = { title: '', location: '', description: '', category: 'Field Data' };
      this.previewUrl = null;
      this.selectedFile = null;
      this.openAdminPanel('images');
    } finally {
      this.isUploading = false;
    }
  }

  deleteImage(id: string): void {
    if (confirm('Are you sure you want to delete this mission asset?')) {
      this.galleryService.deleteImage(id);
    }
  }

  updateOrderStatus(id: string, status: any): void {
    this.orderService.updateOrderStatus(id, status);
  }

  // --- Research Actions ---
  saveArticle(): void {
    if (this.newArticle.title && this.newArticle.summary) {
      this.researchService.addArticle(this.newArticle as Omit<ResearchArticle, 'id'>);
      this.newArticle = { title: '', category: 'Clinical Study', summary: '', status: 'Draft' };
    }
  }

  deleteArticle(id: string): void {
    if (confirm('Delete this article?')) this.researchService.deleteArticle(id);
  }

  // --- Donation Plans Actions ---
  updatePlan(plan: DonationPlan): void {
    this.donationService.updatePlan(plan.id, plan);
  }

  // --- Product Actions ---
  saveProduct(): void {
    if (this.newProduct.name) {
      this.productService.addProduct(this.newProduct as Omit<AdminProduct, 'id'>);
      this.newProduct = { name: '', price: 0, stock: 0, status: 'Draft', imageUrl: 'assets/images/spirulina_s.png' };
    }
  }

  deleteProduct(id: string): void {
    if (confirm('Delete this product?')) this.productService.deleteProduct(id);
  }

  // --- Inquiry Actions ---
  updateInquiryStatus(id: string, status: 'New' | 'Viewed' | 'Responded'): void {
    this.inquiryService.updateInquiryStatus(id, status);
  }
}
