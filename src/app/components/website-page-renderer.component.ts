import { Component, Input, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsiteService } from '../services/website.service';
import { StyleManagerService, IThemeColor } from '../services/style-manager.service';
import { ContextService } from '../services/context.service';
import { DynamicElementComponent } from './dynamic-element-new.component';
import { WebsitePageData, PageSection, PageElement } from '../models/website.interface';

export type RenderMode = 'storefront' | 'editor' | 'preview';
export type DeviceMode = 'pc' | 'mobile' | 'tablet';

@Component({
  selector: 'app-website-page-renderer',
  standalone: true,
  imports: [
    CommonModule,
    DynamicElementComponent
  ],
  template: `
    <div
      class="website-page-renderer"
      [attr.data-mode]="mode"
      [attr.data-device]="device"
      [attr.data-page]="pageId"
      [attr.data-company]="companyId">

      @if (loading()) {
        <div class="flex justify-center items-center min-h-[200px]">
          <div class="text-center">
            <i class="fas fa-spinner fa-spin text-2xl text-teal-500 mb-2"></i>
            <p class="text-gray-600">Loading page...</p>
          </div>
        </div>
      }

      @if (error()) {
        <div class="bg-red-50 border border-red-200 rounded-lg p-4 m-4">
          <div class="flex items-center">
            <i class="fas fa-exclamation-triangle text-red-500 mr-3"></i>
            <div>
              <h3 class="text-red-800 font-medium">Error Loading Page</h3>
              <p class="text-red-600 text-sm">{{ error() }}</p>
            </div>
          </div>
        </div>
      }

      @if (pageData() && !loading()) {
        <!-- Page-level wrapper -->
        <div
          class="page-container"
          [id]="'page-' + pageId"
          [class]="pageClasses()">

          <!-- Render each section -->
          @for (section of sections(); track section.id) {
            <div
              class="section-wrapper"
              [attr.data-section-id]="section.id"
              [attr.data-section-type]="section.type"
              [class]="getSectionClasses(section)">

              <!-- Section container with dynamic element rendering -->
              <app-dynamic-element
                [element]="section"
                [device]="device">
              </app-dynamic-element>

              <!-- Editor-only overlays -->
              @if (mode === 'editor') {
                <div class="editor-section-overlay">
                  <div class="editor-section-controls">
                    <button
                      class="editor-btn"
                      (click)="editSection(section)"
                      title="Edit Section">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      class="editor-btn"
                      (click)="moveSection(section, 'up')"
                      title="Move Up">
                      <i class="fas fa-arrow-up"></i>
                    </button>
                    <button
                      class="editor-btn"
                      (click)="moveSection(section, 'down')"
                      title="Move Down">
                      <i class="fas fa-arrow-down"></i>
                    </button>
                    <button
                      class="editor-btn editor-btn-danger"
                      (click)="deleteSection(section)"
                      title="Delete Section">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              }
            </div>
          }

          <!-- Editor-only add section button -->
          @if (mode === 'editor') {
            <div class="add-section-wrapper">
              <button
                class="add-section-btn"
                (click)="addSection()"
                title="Add New Section">
                <i class="fas fa-plus mr-2"></i>
                Add Section
              </button>
            </div>
          }
        </div>
      }

      @if (!loading() && !error() && !pageData()) {
        <div class="text-center py-12">
          <i class="fas fa-file-alt text-4xl text-gray-400 mb-4"></i>
          <h3 class="text-xl font-medium text-gray-600 mb-2">No Page Data</h3>
          <p class="text-gray-500">This page hasn't been created yet.</p>
          @if (mode === 'editor') {
            <button
              class="mt-4 bg-teal-500 hover:bg-teal-600 text-white px-6 py-2 rounded-lg"
              (click)="createNewPage()">
              <i class="fas fa-plus mr-2"></i>
              Create Page
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .website-page-renderer {
      width: 100%;
      min-height: 100vh;
      position: relative;
    }

    /* Storefront mode - clean display */
    .website-page-renderer[data-mode="storefront"] {
      background: var(--page-background, #ffffff);
    }

    /* Editor mode - with editing controls */
    .website-page-renderer[data-mode="editor"] {
      background: #f8fafc;
      padding: 1rem;
    }

    .section-wrapper {
      position: relative;
      min-height: 50px;
    }

    /* Editor-specific styles */
    .website-page-renderer[data-mode="editor"] .section-wrapper {
      margin-bottom: 1rem;
      border: 2px dashed transparent;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .website-page-renderer[data-mode="editor"] .section-wrapper:hover {
      border-color: #1abc9c;
      background-color: rgba(26, 188, 156, 0.05);
    }

    .editor-section-overlay {
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    .section-wrapper:hover .editor-section-overlay {
      opacity: 1;
    }

    .editor-section-controls {
      display: flex;
      gap: 0.25rem;
      padding: 0.5rem;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 6px;
      margin: 0.5rem;
    }

    .editor-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 4px;
      background: #1abc9c;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s ease;
    }

    .editor-btn:hover {
      background: #16a085;
    }

    .editor-btn-danger {
      background: #e74c3c;
    }

    .editor-btn-danger:hover {
      background: #c0392b;
    }

    .add-section-wrapper {
      text-align: center;
      padding: 2rem;
    }

    .add-section-btn {
      background: #1abc9c;
      color: white;
      border: 2px dashed #1abc9c;
      padding: 1rem 2rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      transition: all 0.2s ease;
    }

    .add-section-btn:hover {
      background: #16a085;
      border-color: #16a085;
      transform: translateY(-2px);
    }

    /* Device-specific styles */
    .website-page-renderer[data-device="mobile"] {
      max-width: 375px;
      margin: 0 auto;
    }

    .website-page-renderer[data-device="tablet"] {
      max-width: 768px;
      margin: 0 auto;
    }

    /* Preview mode */
    .website-page-renderer[data-mode="preview"] {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      overflow: hidden;
    }
  `]
})
export class WebsitePageRendererComponent implements OnInit {
  private websiteService = inject(WebsiteService);
  private contextService = inject(ContextService);
  private styleManager = inject(StyleManagerService);

  // Required inputs
  @Input({ required: true }) pageId!: string;
  @Input() companyId?: number;
  @Input() mode: RenderMode = 'storefront';
  @Input() device: DeviceMode = 'pc';
  @Input() collectionId: string = 'page';

  // Optional customization inputs
  @Input() enableLazyLoading: boolean = true;
  @Input() enableEditor: boolean = false;
  @Input() customClasses: string = '';

  // Reactive state
  pageData = signal<WebsitePageData | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // Computed values
  sections = computed(() => {
    const data = this.pageData();
    return data?.data?.sections || [];
  });

  pageClasses = computed(() => {
    const classes = ['page-container'];
    if (this.customClasses) {
      classes.push(this.customClasses);
    }
    return classes.join(' ');
  });

  ngOnInit(): void {
    this.loadPageData();
  }

  private async loadPageData(): Promise<void> {
    if (!this.pageId) {
      this.error.set('Page ID is required');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    try {
      const targetCompanyId = this.companyId || this.contextService.getCompanyId();

      this.websiteService.getPageDataForCompany(
        this.pageId,
        targetCompanyId,
        this.collectionId
      ).subscribe({
        next: (pages) => {
          if (pages && pages.length > 0) {
            this.pageData.set(pages[0]); // Take the first page
            // Generate and inject styles for the loaded sections, scoped to this page
            try {
              const sections = pages[0]?.data?.sections || [];
              const scope = `#page-${this.pageId}`;

              // Get theme colors from company context
              const company = this.contextService.currentCompany();
              const themeColors: IThemeColor[] = company?.metadata?.themeColors || [];

              this.styleManager.generateFromSections(sections, [], scope, themeColors);
            } catch (e) {
              console.warn('Style generation failed:', e);
            }
          } else {
            this.pageData.set(null);
            // Clear styles when no page
            this.styleManager.clear();
          }
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading page data:', err);
          this.error.set('Failed to load page data');
          this.styleManager.clear();
          this.loading.set(false);
        }
      });
    } catch (err) {
      console.error('Unexpected error:', err);
      this.error.set('An unexpected error occurred');
      this.loading.set(false);
    }
  }

  /**
   * Get CSS classes for a section wrapper
   */
  getSectionClasses(section: PageSection): string {
    const classes = ['section', 'section-' + section.type];

    // Add device-specific classes if needed
    if (section.styles?.[this.device]) {
      const deviceStyles = section.styles[this.device];
      if (deviceStyles['className'] && typeof deviceStyles['className'] === 'string') {
        classes.push(deviceStyles['className']);
      }
    }

    return classes.join(' ');
  }

  /**
   * Reload page data (useful after edits)
   */
  reload(): void {
    this.loadPageData();
  }

  /**
   * Update page data programmatically
   */
  updatePageData(newData: WebsitePageData): void {
    this.pageData.set(newData);
  }

  // Editor-specific methods (only active when mode === 'editor')
  editSection(section: PageSection): void {
    if (this.mode !== 'editor') return;
    console.log('Edit section:', section);
    // Emit event or call service to open section editor
  }

  moveSection(section: PageSection, direction: 'up' | 'down'): void {
    if (this.mode !== 'editor') return;
    console.log('Move section:', section.id, direction);
    // Implement section reordering logic
  }

  deleteSection(section: PageSection): void {
    if (this.mode !== 'editor') return;
    console.log('Delete section:', section);
    // Implement section deletion with confirmation
  }

  addSection(): void {
    if (this.mode !== 'editor') return;
    console.log('Add new section');
    // Open section type selector
  }

  createNewPage(): void {
    if (this.mode !== 'editor') return;
    console.log('Create new page:', this.pageId);
    // Create new page with default structure
  }
}
