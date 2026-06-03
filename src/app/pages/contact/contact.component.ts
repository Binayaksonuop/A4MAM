import {
  Component,
  AfterViewInit,
  ViewEncapsulation,
  Inject,
  PLATFORM_ID
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { InquiryService } from '../../services/inquiry.service';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements AfterViewInit {
  isSubmitting = false;
  submitted = false;
  error = false;
  errorMessage = '';
  referenceId = '';

  formData = {
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: ''
  };

  constructor(
    private http: HttpClient,
    private inquiryService: InquiryService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      gsap.registerPlugin(ScrollTrigger);
      this.initAnimations();
    }
  }

  private initAnimations(): void {
    const tl = gsap.timeline({
      defaults: { ease: 'power4.out' }
    });

    tl.fromTo(
      '.contact-hero .badge-premium-pill',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1 }
    )
      .fromTo(
        '.contact-hero h1',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2 },
        '-=0.7'
      )
      .fromTo(
        '.contact-hero p',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        '-=0.9'
      )
      .fromTo(
        '.office-premium-card',
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2, stagger: 0.2 },
        '-=1'
      )
      .fromTo(
        '.form-premium-card',
        { x: 50, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.2 },
        '-=1.2'
      );

    gsap.to('.hero-glow-blob', {
      scale: 1.2,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    gsap.utils.toArray('.scroll-reveal-contact').forEach((el: any, i: number) => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.1,
          ease: 'power3.out',
          delay: i * 0.12,
          scrollTrigger: {
            trigger: '.contact-process-section',
            start: 'top 80%',
            once: true
          }
        }
      );
    });
  }

  countChars(value: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const counter = document.querySelector('.char-counter');

    if (counter) {
      counter.textContent = `${value.length} / 500`;
    }
  }

  onSubmit() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.error = false;
    this.errorMessage = '';

    const inquiryData = {
      name: this.formData.name,
      email: this.formData.email,
      phone: this.formData.phone,
      organization: this.formData.organization,
      subject: this.formData.subject,
      message: this.formData.message,
      type: 'Contact'
    };

    this.inquiryService.addInquiry(inquiryData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.referenceId = response.data.referenceId || response.data._id;
          this.submitted = true;
          this.animateSuccess();
          this.resetForm();
        }

        this.isSubmitting = false;
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.error = true;
        this.errorMessage =
          err.error?.message ||
          'Mission protocols failed to transmit. Please check your secure connection.';
      }
    });
  }

  private animateSuccess() {
    if (!isPlatformBrowser(this.platformId)) return;

    setTimeout(() => {
      gsap.fromTo(
        '.success-state-modern',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1,
          ease: 'elastic.out(1, 0.75)'
        }
      );

      gsap.fromTo(
        '.success-icon-wrap i',
        { scale: 0, rotate: -45 },
        {
          scale: 1,
          rotate: 0,
          duration: 0.8,
          delay: 0.3,
          ease: 'back.out(2)'
        }
      );
    }, 0);
  }

  resetForm() {
    this.formData = {
      name: '',
      email: '',
      phone: '',
      organization: '',
      subject: '',
      message: ''
    };

    this.submitted = false;
  }
}