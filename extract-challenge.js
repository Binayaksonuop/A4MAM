const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'pages', 'home');
const homeHtmlPath = path.join(baseDir, 'home.component.html');
const homeTsPath = path.join(baseDir, 'home.component.ts');
const challengeHtmlPath = path.join(baseDir, 'components', 'challenge-section', 'challenge-section.component.html');
const challengeTsPath = path.join(baseDir, 'components', 'challenge-section', 'challenge-section.component.ts');

// Create directory if not exists
const dir = path.join(baseDir, 'components', 'challenge-section');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

let homeHtml = fs.readFileSync(homeHtmlPath, 'utf8');
let homeTs = fs.readFileSync(homeTsPath, 'utf8');

// 1. EXTRACT HTML
const start = homeHtml.indexOf('<!-- CHALLENGE SECTION -->');
const end = homeHtml.indexOf('<!-- MALNUTRITION REASONS SECTION (ULTRA PREMIUM 3D MOTION GRAPHICS) -->');

if (start !== -1 && end !== -1) {
  const extractedHtml = homeHtml.substring(start, end);
  fs.writeFileSync(challengeHtmlPath, extractedHtml);
  homeHtml = homeHtml.replace(extractedHtml, '<app-challenge-section></app-challenge-section>\n\n');
  fs.writeFileSync(homeHtmlPath, homeHtml);
  console.log('Extracted Challenge HTML');
} else {
  console.log('Challenge HTML not found. Start:', start, 'End:', end);
}

// 2. CREATE NEW TS
const newTs = `import { Component, AfterViewInit, NgZone, PLATFORM_ID, Inject, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-challenge-section',
  standalone: true,
  imports: [CommonModule, RouterModule, NgOptimizedImage],
  templateUrl: './challenge-section.component.html',
  styleUrl: './challenge-section.component.css'
})
export class ChallengeSectionComponent implements AfterViewInit, OnDestroy {
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
    gsap.utils.toArray('.reveal-card').forEach((elem: any) => {
      gsap.from(elem, {
        scrollTrigger: {
          trigger: elem,
          start: 'top 85%',
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });
    });
  }
}
`;
fs.writeFileSync(challengeTsPath, newTs);
fs.writeFileSync(path.join(baseDir, 'components', 'challenge-section', 'challenge-section.component.css'), '');
console.log('Written new TS and CSS');

// 3. CLEAN UP HOME TS
if (!homeTs.includes('ChallengeSectionComponent')) {
  homeTs = homeTs.replace(
    "import { MissionSectionComponent } from './components/mission-section/mission-section.component';",
    "import { MissionSectionComponent } from './components/mission-section/mission-section.component';\nimport { ChallengeSectionComponent } from './components/challenge-section/challenge-section.component';"
  );
  homeTs = homeTs.replace(
    "imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage, HeroSectionComponent, MissionSectionComponent]",
    "imports: [CommonModule, RouterModule, FormsModule, NgOptimizedImage, HeroSectionComponent, MissionSectionComponent, ChallengeSectionComponent]"
  );
  fs.writeFileSync(homeTsPath, homeTs);
  console.log('Cleaned up home.component.ts');
}
