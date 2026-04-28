import { Component, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
  encapsulation: ViewEncapsulation.None
})
export class ContactComponent implements AfterViewInit {
  isSubmitting = false;
  submitted = false;
  error = false;
  errorMessage = '';

  formData = {
    name: '',
    email: '',
    phone: '',
    organization: '',
    subject: '',
    message: ''
  };

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.initAnimations();
  }

  private initAnimations(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

    tl.fromTo('.contact-hero .badge-premium-pill', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
      .fromTo('.contact-hero h1', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2 }, '-=0.7')
      .fromTo('.contact-hero p', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, '-=0.9')
      .fromTo('.office-glass-card', { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2, stagger: 0.2 }, '-=1')
      .fromTo('.form-glass-card', { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 1.2 }, '-=1.2');

    gsap.to('.hero-glow-blob', {
      scale: 1.2,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  async onSubmit() {
    this.isSubmitting = true;
    this.error = false;
    this.errorMessage = '';

    try {
      const response = await fetch('https://formspree.io/f/mqakeylg', {
        method: 'POST',
        body: JSON.stringify(this.formData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        this.isSubmitting = false;
        this.submitted = true;
        this.animateSuccess();
      } else {
        const errorData = await response.json();
        this.isSubmitting = false;
        this.error = true;
        
        // Handle specific Formspree errors
        if (response.status === 404) {
          this.errorMessage = 'Invalid Form ID. Please ensure your Formspree ID (mqakeylg) is correct and active.';
        } else {
          this.errorMessage = errorData.error || 'Transmission failed. Please try again later.';
        }
        console.error('Formspree Error:', errorData);
      }
    } catch (err) {
      this.isSubmitting = false;
      this.error = true;
      this.errorMessage = 'Network error. Please check your internet connection and try again.';
      console.error('Network/CORS Error:', err);
    }
  }

  private animateSuccess() {
    setTimeout(() => {
      gsap.fromTo('.success-state-premium', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: 'elastic.out(1, 0.75)' }
      );
      
      gsap.fromTo('.success-icon-wrap i',
        { scale: 0, rotate: -45 },
        { scale: 1, rotate: 0, duration: 0.8, delay: 0.3, ease: 'back.out(2)' }
      );
    }, 0);
  }

  resetForm() {
    this.submitted = false;
    this.formData = {
      name: '',
      email: '',
      phone: '',
      organization: '',
      subject: '',
      message: ''
    };
  }
}
