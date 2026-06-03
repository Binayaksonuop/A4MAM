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
import { ProductService, AdminProduct } from '../../../services/product.service';
import { DonationService, DonationPlan } from '../../../services/donation.service';
import { TestimonialService, Testimonial } from '../../../services/testimonial.service';
import { SuccessStoryService, SuccessStory } from '../../../services/success-story.service';
import { FaqService, FAQ } from '../../../services/faq.service';
import { PageService, CMSPage } from '../../../services/page.service';
import { SiteSettingsService, SiteSettings } from '../../../services/site-settings.service';
import { FormsModule } from '@angular/forms';
import { Pipe, PipeTransform } from '@angular/core';
import gsap from 'gsap';

@Pipe({
  name: 'filterByStatus',
  standalone: true
})
export class FilterByStatusPipe implements PipeTransform {
  transform(items: any[], status: string): any[] {
    if (!items) return [];
    return items.filter(item => item.status === status);
  }
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, FilterByStatusPipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit, AfterViewInit {
  private isBrowser: boolean;
  activeAdminPanel: 'dashboard' | 'images' | 'research' | 'donations' | 'products' | 'inquiries' | 'orders' | 'settings' | 'pages' | 'testimonials' | 'success-stories' | 'faqs' = 'dashboard';
  isSidebarOpen = false;
  today = new Date();
  currentTime = new Date();
  missionTime: string = '00:00:00';
  private timerHandle: any;
  isDarkTheme = true;

  // Gallery State
  galleryImages: GalleryImage[] = [];

  // Data Streams
  stats: AdminStats | null = null;
  orders: AdminOrder[] = [];
  inquiries: AdminInquiry[] = [];
  articles: ResearchArticle[] = [];
  donationPlans: DonationPlan[] = [];
  products: AdminProduct[] = [];
  testimonials: Testimonial[] = [];
  successStories: SuccessStory[] = [];
  cmsPages: CMSPage[] = [];
  faqs: FAQ[] = [];
  siteSettings: SiteSettings = {};

  // Form states
  newArticle: Partial<ResearchArticle> = { title: '', slug: '', category: 'Clinical Study', summary: '', status: 'Draft' };
  newProduct: Partial<AdminProduct> = { name: '', price: 0, stock: 0, status: 'Draft', imageUrl: 'assets/images/spirulina_s.png' };
  newTestimonial: Partial<Testimonial> = { name: '', role: '', quote: '', rating: 5, status: 'Draft' };
  newStory: Partial<SuccessStory> = { title: '', slug: '', summary: '', body: '', status: 'Draft' };
  newFaq: Partial<FAQ> = { question: '', answer: '', category: 'General', sortOrder: 0, status: 'Draft' };

  // Gallery Upload State
  newImage = { title: '', location: '', description: '', category: 'Field Data' };
  previewUrl: string | null = null;
  selectedFile: File | null = null;
  isUploading = false;
  searchTerm = '';
  orderFilter: 'active' | 'delivered' | 'cancelled' | 'all' = 'active';

  // Admin Profile
  adminName = 'Admin';
  adminRole = 'Chief Admin';

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
    private testimonialService: TestimonialService,
    private successStoryService: SuccessStoryService,
    private faqService: FaqService,
    private pageService: PageService,
    private siteSettingsService: SiteSettingsService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    // Sync Admin Profile
    this.authService.getCurrentAdmin().subscribe(admin => {
      if (admin) {
        this.adminName = admin.name;
        this.adminRole = admin.role === 'admin' ? 'Chief Admin' : admin.role;
      }
    });

    // Initial Data Sync
    this.refreshDashboardData();

    if (this.isBrowser) {
      this.timerHandle = setInterval(() => {
        this.currentTime = new Date();
        const hrs = this.currentTime.getHours().toString().padStart(2, '0');
        const mins = this.currentTime.getMinutes().toString().padStart(2, '0');
        const secs = this.currentTime.getSeconds().toString().padStart(2, '0');
        this.missionTime = `${hrs}:${mins}:${secs}`;
      }, 1000);
    }
  }

  refreshDashboardData(): void {
    this.dashboardService.getStats().subscribe(s => this.stats = s);
    this.galleryService.getImages().subscribe(imgs => this.galleryImages = imgs);
    this.orderService.getOrders().subscribe(ords => this.orders = ords);
    this.inquiryService.getInquiries().subscribe(inqs => this.inquiries = inqs);
    this.researchService.getAdminArticles().subscribe(res => {
      if (res.success && res.data) {
        this.articles = res.data;
      }
    });
    this.donationService.getPlans().subscribe(plans => this.donationPlans = plans);
    this.productService.getProducts(true).subscribe(prods => this.products = prods);
    this.testimonialService.getTestimonials().subscribe(res => {
      if (res.success && res.data) {
        this.testimonials = res.data;
      }
    });
    this.successStoryService.getStories().subscribe(res => {
      if (res.success && res.data) {
        this.successStories = res.data;
      }
    });
    this.pageService.getAllPages().subscribe(res => {
      if (res.success && res.data) {
        this.cmsPages = res.data;
      }
    });
    this.faqService.getFaqs().subscribe(res => {
      if (res.success && res.data) {
        this.faqs = res.data;
      }
    });
    this.siteSettingsService.getSettings().subscribe(res => {
      if (res.success && res.data) {
        this.siteSettings = res.data;
        if (!this.siteSettings.branding) this.siteSettings.branding = {};
        if (!this.siteSettings.contact) this.siteSettings.contact = {};
        if (!this.siteSettings.social) this.siteSettings.social = {};
        if (!this.siteSettings.marquee) this.siteSettings.marquee = [];
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      this.animateDashboard();
    }
  }

  openAdminPanel(panel: any): void {
    this.activeAdminPanel = panel;
    this.isSidebarOpen = false; // Close on selection for mobile
    if (this.isBrowser && panel === 'dashboard') {
      setTimeout(() => this.animateDashboard(), 100);
    } else if (this.isBrowser) {
       setTimeout(() => {
        gsap.fromTo('.section-fade-in', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
       }, 50);
    }
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
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

  deleteOrder(mongoId: string, customerName: string): void {
    if (confirm(`Are you sure you want to permanently delete "${customerName}"'s order?`)) {
      this.orderService.deleteOrder(mongoId).subscribe(() => {
        this.refreshDashboardData();
      });
    }
  }

  // --- Research Articles ---
  saveArticle(): void {
    if (this.newArticle.title && this.newArticle.summary) {
      this.researchService.addArticle(this.newArticle).subscribe(() => {
        this.refreshDashboardData();
        this.newArticle = { title: '', slug: '', category: 'Clinical Study', summary: '', status: 'Draft' };
      });
    }
  }

  deleteArticle(id: string): void {
    if (confirm('Delete this article?')) {
      this.researchService.deleteArticle(id).subscribe(() => this.refreshDashboardData());
    }
  }

  // --- Donation Plans Actions ---
  updatePlan(plan: DonationPlan): void {
    this.donationService.updatePlan(plan.id, plan);
  }

  // --- Product Actions ---
  saveProduct(): void {
    if (this.newProduct.name && this.newProduct.price) {
      this.productService.addProduct(this.newProduct as AdminProduct).subscribe(() => {
        this.refreshDashboardData();
        this.newProduct = { name: '', price: 0, stock: 0, status: 'Draft', imageUrl: 'assets/images/spirulina_s.png' };
      });
    }
  }

  deleteProduct(id: string | undefined): void {
    if (!id) return;
    if (confirm('Delete this product?')) {
      this.productService.deleteProduct(id).subscribe(() => {
        this.refreshDashboardData();
      });
    }
  }

  // --- CMS Actions ---
  saveTestimonial(): void {
    if (this.newTestimonial.name && this.newTestimonial.quote) {
      this.testimonialService.createTestimonial(this.newTestimonial).subscribe(() => {
        this.refreshDashboardData();
        this.newTestimonial = { name: '', role: '', quote: '', rating: 5, status: 'Draft' };
      });
    }
  }

  deleteTestimonial(id: string): void {
    if (confirm('Delete this testimonial?')) {
      this.testimonialService.deleteTestimonial(id).subscribe(() => this.refreshDashboardData());
    }
  }

  saveStory(): void {
    if (this.newStory.title && this.newStory.slug && this.newStory.summary) {
      this.successStoryService.createStory(this.newStory).subscribe(() => {
        this.refreshDashboardData();
        this.newStory = { title: '', slug: '', summary: '', body: '', status: 'Draft' };
      });
    }
  }

  deleteStory(id: string): void {
    if (confirm('Delete this success story?')) {
      this.successStoryService.deleteStory(id).subscribe(() => this.refreshDashboardData());
    }
  }

  saveFaq(): void {
    if (this.newFaq.question && this.newFaq.answer) {
      this.faqService.createFaq(this.newFaq).subscribe(() => {
        // Not refreshing all data to avoid unnecessary calls, could do specific refresh
        window.location.reload(); // Simple approach for now
      });
    }
  }

  deleteFaq(id: string): void {
    if (confirm('Delete this FAQ?')) {
      this.faqService.deleteFaq(id).subscribe(() => {
        window.location.reload();
      });
    }
  }

  // --- Site Settings ---
  saveSiteSettings(): void {
    this.siteSettingsService.updateSettings(this.siteSettings).subscribe(res => {
      if (res.success) {
        alert('Site settings updated successfully!');
      }
    });
  }

  addMarqueeItem(): void {
    if (!this.siteSettings.marquee) {
      this.siteSettings.marquee = [];
    }
    this.siteSettings.marquee.push({ text: '', icon: 'bi-star-fill' });
  }

  removeMarqueeItem(index: number): void {
    if (this.siteSettings.marquee) {
      this.siteSettings.marquee.splice(index, 1);
    }
  }

  ngOnDestroy(): void {
    if (this.timerHandle) clearInterval(this.timerHandle);
  }

  // --- Inquiry Actions ---
  updateInquiryStatus(id: string, status: 'New' | 'Viewed' | 'Responded'): void {
    this.inquiryService.updateInquiryStatus(id, status);
  }

  // --- Search Getters ---
  get filteredOrders() {
    let result = this.orders;

    // Status filter
    if (this.orderFilter === 'active') {
      result = result.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
    } else if (this.orderFilter === 'delivered') {
      result = result.filter(o => o.status === 'Delivered');
    } else if (this.orderFilter === 'cancelled') {
      result = result.filter(o => o.status === 'Cancelled');
    }

    // Search filter
    if (!this.searchTerm) return result;
    const term = this.searchTerm.toLowerCase();
    return result.filter(o =>
      o.id.toLowerCase().includes(term) ||
      o.customerName.toLowerCase().includes(term)
    );
  }

  get filteredInquiries() {
    if (!this.searchTerm) return this.inquiries;
    const term = this.searchTerm.toLowerCase();
    return this.inquiries.filter(i => 
      i.name.toLowerCase().includes(term) || 
      i.email.toLowerCase().includes(term) ||
      (i.organization && i.organization.toLowerCase().includes(term)) ||
      i.message.toLowerCase().includes(term)
    );
  }

  get filteredProducts() {
    if (!this.searchTerm) return this.products;
    const term = this.searchTerm.toLowerCase();
    return this.products.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.status.toLowerCase().includes(term)
    );
  }
}
