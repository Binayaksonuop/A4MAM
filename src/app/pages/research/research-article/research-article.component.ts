import { Component, OnInit, AfterViewInit, OnDestroy, PLATFORM_ID, Inject, NgZone, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResearchService, ResearchArticle } from '../../../services/research.service';
import { Subscription } from 'rxjs';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';



@Component({
  selector: 'app-research-article',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './research-article.component.html',
  styleUrls: ['./research-article.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ResearchArticleComponent implements OnInit, AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  publishedArticles: ResearchArticle[] = [];
  private subscription: Subscription | null = null;
  activeWorkflowStep = 0;
  private workflowInterval: any;

  workflowSteps = [
    { title: 'Screening', icon: 'bi bi-search', desc: 'Initial identification of at-risk children in community blocks.' },
    { title: 'Measurement', icon: 'bi bi-rulers', desc: 'Clinical assessment via MUAC and weight-for-age metrics.' },
    { title: 'Risk ID', icon: 'bi bi-exclamation-triangle', desc: 'Categorization into SAM/MAM recovery protocols.' },
    { title: 'Nutrition', icon: 'bi bi-cup-hot', desc: 'Deployment of specialized Spirulina-based interventions.' },
    { title: 'Monitoring', icon: 'bi bi-activity', desc: 'Bi-weekly tracking of growth velocity and hemoglobin.' },
    { title: 'Recovery', icon: 'bi bi-check-circle', desc: 'Transition to maintenance nutrition after full stabilization.' }
  ];

  constructor(
    private zone: NgZone,
    private researchService: ResearchService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.subscription = this.researchService.getArticles().subscribe(res => {
      if (res.success && res.data) {
        this.publishedArticles = res.data.filter(a => a.status === 'Published');
        
        // Re-trigger scroll triggers if DOM updates and we're in browser
        if (this.isBrowser) {
          setTimeout(() => {
            ScrollTrigger.refresh();
          }, 100);
        }
      }
    });
  }

  trackByArticleId(index: number, article: ResearchArticle): string {
    return article._id;
  }

  trackByWorkflow(index: number, step: any): string {
    return step.title;
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) {
      setTimeout(() => {
        this.initReadingProgressAnimation();
        this.initRevealAnimations();
        this.initStickyStackAnimations();
        this.initAnthropoSliderAnimations();
        this.initCircularProgressAnimations();
        this.initCycleOrbitAnimations();
        this.initStatCounters();
        this.startWorkflowCycle();
        ScrollTrigger.refresh();
      }, 500);
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.isBrowser) {
      ScrollTrigger.getAll().forEach(st => st.kill());
      if (this.workflowInterval) clearInterval(this.workflowInterval);
    }
  }

  private initRevealAnimations(): void {
    gsap.utils.toArray<HTMLElement>('.gsap-reveal').forEach(el => {
      gsap.fromTo(el,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  }

  private initReadingProgressAnimation(): void {
    const progressBar = document.querySelector('.reading-progress-bar');
    const articleBody = document.querySelector('.journal-entry');
    if (progressBar && articleBody) {
      gsap.to(progressBar, {
        width: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: articleBody,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true
        }
      });
    }
  }

  private initStickyStackAnimations(): void {
    const cards = gsap.utils.toArray<HTMLElement>('.sticky-card-ultra');
    if (!cards.length) return;

    cards.forEach((card, index) => {
      if (index === cards.length - 1) return;

      gsap.to(card, {
        scale: 0.90,
        opacity: 0.5,
        y: -10,
        filter: 'blur(4px)',
        ease: 'none',
        scrollTrigger: {
          trigger: cards[index + 1],
          start: 'top 90%',
          end: 'top 20%',
          scrub: true
        }
      });
    });
  }

  private initAnthropoSliderAnimations(): void {
    const track = document.querySelector('.anthropo-slider-track') as HTMLElement;
    const viewport = document.querySelector('.anthropo-slider-viewport') as HTMLElement;
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');

    if (!track || !viewport) return;

    const cards = gsap.utils.toArray<HTMLElement>('.anthropo-slide-card');
    const cardWidth = cards[0].offsetWidth + 24; // width + gap
    let currentIndex = 0;
    const totalCards = cards.length;

    const goToSlide = (index: number) => {
      if (index < 0) index = totalCards - 1;
      if (index >= totalCards) index = 0;
      currentIndex = index;

      gsap.to(track, {
        x: -currentIndex * cardWidth,
        duration: 1.2,
        ease: 'power3.inOut'
      });
    };

    // Auto Slide
    let autoSlide = setInterval(() => {
      goToSlide(currentIndex + 1);
    }, 4000);

    const resetTimer = () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => {
        goToSlide(currentIndex + 1);
      }, 4000);
    };

    nextBtn?.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
      resetTimer();
    });

    prevBtn?.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
      resetTimer();
    });

    // Reveal animations
    gsap.from('.anthropo-slide-card', {
      x: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.anthropometric-slider-section',
        start: 'top 70%'
      }
    });
  }

  private initCircularProgressAnimations(): void {
    const paths = document.querySelectorAll('.progress-path');
    paths.forEach(path => {
      const target = (path as HTMLElement).dataset['target'];
      const container = path.closest('.fact-item');
      const text = container?.querySelector('.progress-text');

      gsap.to(path, {
        strokeDasharray: target + ', 100',
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      if (text) {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(target),
          duration: 2,
          ease: 'power2.out',
          onUpdate: () => {
            text.textContent = Math.round(counter.value) + '%';
          },
          scrollTrigger: {
            trigger: container,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
      }
    });
  }

  private initCycleOrbitAnimations(): void {
    const isDesktop = window.innerWidth > 1200;
    if (!isDesktop) return;

    const section = document.querySelector('.cycle-orbit-premium-section');
    const cards = gsap.utils.toArray<HTMLElement>('.orbit-card-ultra');

    if (!section || !cards.length) return;

    // Smooth reveal animation for cards
    cards.forEach((card, i) => {
      gsap.set(card, { opacity: 0, scale: 0.6 });
      
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        duration: 1.2,
        delay: i * 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%'
        }
      });
    });

    // Add mouse tracking for glow effects
    this.initMouseTrackingEffects();

    // CYCLE CARDS REVEAL (from implementation plan)
    const cycleSection = document.querySelector('.cycle-simple-section');
    const cycleCards = gsap.utils.toArray<HTMLElement>('.cycle-card');
    if (cycleSection && cycleCards.length) {
      gsap.fromTo(cycleCards, 
        { opacity: 0, y: 30, scale: 0.95 },
        {
          opacity: 1, y: 0, scale: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cycleSection,
            start: 'top 75%'
          }
        }
      );
    }
  }

  private initMouseTrackingEffects(): void {
    const cards = gsap.utils.toArray<HTMLElement>('.orbit-card-ultra');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        
        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    });
  }

  private initStatCounters(): void {
    const counters = document.querySelectorAll('.counter-val');
    counters.forEach(counter => {
      const target = Number((counter as HTMLElement).dataset['target']);
      const obj = { value: 0 };
      
      gsap.to(obj, {
        value: target,
        duration: 2.5,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.textContent = Math.round(obj.value).toString();
        }
      });
    });
  }

  private startWorkflowCycle(): void {
    if (!this.isBrowser) return;
    this.workflowInterval = setInterval(() => {
      this.zone.run(() => {
        this.activeWorkflowStep = (this.activeWorkflowStep + 1) % this.workflowSteps.length;
      });
    }, 4000);
  }
}



