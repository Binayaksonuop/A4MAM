const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'pages', 'home');
const homeHtmlPath = path.join(baseDir, 'home.component.html');
const homeTsPath = path.join(baseDir, 'home.component.ts');
const missionHtmlPath = path.join(baseDir, 'components', 'mission-section', 'mission-section.component.html');
const missionTsPath = path.join(baseDir, 'components', 'mission-section', 'mission-section.component.ts');

let homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');
let homeTs = fs.readFileSync(homeTsPath, 'utf8');

// 1. EXTRACT HTML
const missionStart = homeHtml.indexOf('<!-- MISSION SECTION (FULL PREMIUM REDESIGN) -->');
const challengeStart = homeHtml.indexOf('<!-- CHALLENGE SECTION -->');

if (missionStart !== -1 && challengeStart !== -1) {
  const missionHtml = homeHtml.substring(missionStart, challengeStart);
  fs.writeFileSync(missionHtmlPath, missionHtml);
  homeHtml = homeHtml.replace(missionHtml, '<app-mission-section></app-mission-section>\n\n');
  fs.writeFileSync(homeHtmlPath, homeHtml);
  console.log('Extracted Mission HTML');
} else {
  console.log('Mission HTML not found. Start:', missionStart, 'End:', challengeStart);
}

// 2. CREATE NEW MISSION TS
const newMissionTs = `import { Component, AfterViewInit, NgZone, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-mission-section',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './mission-section.component.html',
  styleUrl: './mission-section.component.css'
})
export class MissionSectionComponent implements AfterViewInit, OnDestroy {
  private isBrowser: boolean;
  private gsapCtx?: gsap.Context;

  constructor(
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    this.zone.runOutsideAngular(() => {
      this.gsapCtx = gsap.context(() => {
        setTimeout(() => {
          this.initScrollAnimations();
        }, 100);
      });
    });
  }

  ngOnDestroy(): void {
    if (this.gsapCtx) {
      this.gsapCtx.revert();
    }
  }

  private initScrollAnimations(): void {
    // Mission Section specific animations
    gsap.utils.toArray('.gsap-reveal').forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });

    const statCards = gsap.utils.toArray('.stat-card-ultra');
    if (statCards.length > 0) {
      gsap.from(statCards, {
        scrollTrigger: {
          trigger: '.mission-section-ultra',
          start: 'top 70%'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'back.out(1.2)'
      });
    }
  }
}
`;
fs.writeFileSync(missionTsPath, newMissionTs);
console.log('Written new mission-section.component.ts');

// 3. CLEAN UP HOME TS
if (!homeTs.includes('MissionSectionComponent')) {
  homeTs = homeTs.replace(
    "import { HeroSectionComponent } from './components/hero-section/hero-section.component';",
    "import { HeroSectionComponent } from './components/hero-section/hero-section.component';\nimport { MissionSectionComponent } from './components/mission-section/mission-section.component';"
  );
  homeTs = homeTs.replace(
    "imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage, HeroSectionComponent]",
    "imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage, HeroSectionComponent, MissionSectionComponent]"
  );
  fs.writeFileSync(homeTsPath, homeTs);
  console.log('Cleaned up home.component.ts');
}
