import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-research-article',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="scientific-paper-container py-5">
      <div class="container py-5">
        
        <!-- Back Button -->
        <div class="mb-5 no-print">
          <a routerLink="/" class="back-link-premium">
            <i class="bi bi-arrow-left-circle"></i> Return to Mission Home
          </a>
        </div>

        <article class="journal-entry">
          <!-- Premium Paper Header -->
          <div class="journal-header p-5">
            <div class="archival-seal">ARCHIVE #A4-MAM-2026</div>
            
            <div class="row align-items-end mb-5">
              <div class="col-md-12">
                 <div class="journal-vol-header text-uppercase">Mission Against Malnutrition /// Scientific Division</div>
                 <h1 class="journal-title mt-3">
                   <span class="title-top">INTERGENERATIONAL</span>
                   <span class="title-bottom">MALNOURISHMENT</span>
                 </h1>
                 <p class="journal-subtitle">Women Eat <span class="accent-maroon">Last.</span> Women Pay <span class="accent-maroon">First!</span></p>
              </div>
            </div>

            <p class="journal-pub-info">
              A4MAM Scientific Division &bull; South Asia Context &bull; Nutrition Research &bull; 2026
            </p>
          </div>

          <!-- Journal Body: Clean Single Column -->
          <div class="journal-body p-5">
            <div class="row justify-content-center">
              <div class="col-lg-10 content-column">
                
                <!-- Main Article Text -->
                <div class="article-text">
                  <p class="dropcase">
                    In households across South Asia, there is a meal-time hierarchy so embedded it is rarely spoken aloud: 
                    men eat first, children eat next, women eat what remains. In food-insecure homes, what remains is rarely enough.
                    This is not simply a social injustice. It is a physiological one with cascading consequences. 
                  </p>

                  <p>
                    A malnourished girl becomes a malnourished adolescent. A malnourished adolescent becomes a pregnant woman 
                    whose body — already depleted of iron, calcium, folate — is asked to build a human being from its own reserves.
                    Her child is born into the first of those 1,000 critical days already behind. The cycle does not begin at birth. 
                    It begins a generation earlier, on a plate that was never full enough.
                  </p>
                  
                  <p>
                    Anemia affects nearly 40% of pregnant women globally. In India alone, over 50% of women of 
                    reproductive age are anemic — a figure that has barely shifted in decades. 
                    Iron-deficiency anemia during pregnancy raises the risk of maternal death, premature birth, and low birth weight. 
                    It contributes directly to the cognitive deficits described earlier. And it is, overwhelmingly, 
                    a disease of women who were taught that their hunger mattered less.
                  </p>

                  <p>
                    When a mother is malnourished, her child is more likely to be malnourished — and more likely 
                    to grow into a malnourished adult who passes the same deficit to the next generation. 
                    Nutritionists call this the <strong>intergenerational cycle of malnutrition</strong>. 
                    Breaking it requires reaching women not just during pregnancy, but throughout adolescence 
                    — before the damage is internal and permanent.
                  </p>

                  <p>
                    The tragedy compounds further in older age. Women who have spent decades eating last — 
                    feeding children, deferring to husbands, skipping meals during economic hardship — arrive 
                    at old age with bone density depleted by calcium deficiency, immune systems eroded by protein gaps, 
                    and no buffer left for the illnesses that come with age.
                  </p>

                  <p class="final-statement mt-5 pt-4 border-top text-center text-maroon fw-bold">
                    Hunger, for women, is not an episode. It is a biography.
                  </p>
                </div>

                <div class="footer-signatures mt-5 d-flex justify-content-between align-items-center opacity-75">
                   <div class="sig-seal">
                     <span class="small font-monospace">OFFICIAL SCIENTIFIC RECORD</span>
                   </div>
                   <div class="pagination-leaf">ARCHIVE PAGE 01 // MISSION CONTROL</div>
                </div>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .scientific-paper-container {
      background: #f4f1ea; /* Paper Tone */
      min-height: 100vh;
      font-family: 'Cambria', 'Georgia', serif;
      position: relative;
    }

    .back-link-premium {
      text-decoration: none;
      color: #666;
      font-weight: 700;
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 1px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .back-link-premium:hover {
      color: #800000;
      transform: translateX(-5px);
    }

    .journal-entry {
      background: #ffffff;
      box-shadow: 0 40px 100px rgba(0,0,0,0.1), 0 0 1px rgba(0,0,0,0.2);
      max-width: 1100px;
      margin: 0 auto;
      border-radius: 4px;
      position: relative;
      overflow: hidden;
    }

    /* Paper Aesthetic Overlays */
    .journal-entry::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background-image: url('https://www.transparenttextures.com/patterns/handmade-paper.png');
      opacity: 0.1;
      pointer-events: none;
      z-index: 10;
    }

    .journal-header {
      background: #fff;
      border-bottom: 3px double #e0e0e0;
      position: relative;
    }

    .archival-seal {
      position: absolute;
      top: 50px;
      right: -30px;
      transform: rotate(15deg);
      border: 2px solid #80000020;
      color: #80000040;
      padding: 5px 20px;
      font-family: monospace;
      font-weight: 900;
      font-size: 0.7rem;
      border-radius: 4px;
    }

    .journal-vol-header {
      font-family: sans-serif;
      font-size: 0.7rem;
      font-weight: 900;
      color: #888;
      letter-spacing: 3px;
    }

    .journal-title {
      line-height: 0.9;
      margin: 0;
    }

    .title-top {
      font-size: 2.5rem;
      display: block;
      color: #800000;
      font-weight: 900;
    }

    .title-bottom {
      font-size: 3.5rem;
      display: block;
      color: #111;
      font-weight: 950;
      letter-spacing: -2px;
    }

    .journal-subtitle {
      font-size: 1.5rem;
      font-style: italic;
      color: #555;
      margin-top: 15px;
      font-weight: 400;
    }

    .date-stamp {
      font-family: sans-serif;
      font-size: 0.8rem;
      color: #666;
    }

    .journal-pub-info {
      margin-top: 40px;
      border-top: 1px solid #efefef;
      padding-top: 25px;
      font-family: sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      color: #888;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .article-text {
      max-width: 800px;
      margin: 0 auto;
    }

    .dropcase::first-letter {
      float: left;
      font-size: 4rem;
      line-height: 0.8;
      padding-top: 4px;
      padding-right: 8px;
      padding-left: 3px;
      color: #800000;
      font-weight: 950;
    }

    .article-text p {
      font-size: 1.15rem; /* Larger for better readability */
      line-height: 1.9;
      color: #222;
      margin-bottom: 2rem;
      text-align: justify;
    }

    .final-statement {
      font-size: 1.6rem;
      color: #800000 !important;
    }

    .text-maroon { color: #800000 !important; }
    .accent-maroon { color: #800000; font-weight: 700; }

    @media print {
      .no-print { display: none; }
      .scientific-paper-container { background: white; padding: 0 !important; }
      .journal-entry { box-shadow: none; border: none; }
    }

    @media (max-width: 768px) {
      .title-top { font-size: 1.8rem; }
      .title-bottom { font-size: 2.2rem; }
      .journal-meta-grid { grid-template-columns: 1fr 1fr; }
    }
  `]
})
export class ResearchArticleComponent implements OnInit {
  constructor() {}
  ngOnInit(): void {}
}
