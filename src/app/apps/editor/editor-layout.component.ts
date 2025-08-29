import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WebsiteService, ContextService } from '../../services';
import { WebsitePageData, PageSection } from '../../models';

@Component({
  selector: 'app-editor',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="editor-layout">
      <!-- Editor Toolbar -->
      <div class="editor-toolbar">
        <div class="toolbar-left">
          <h2>Website Editor</h2>
          <span class="page-info">Editing: {{ currentPageName() }}</span>
        </div>

        <div class="toolbar-right">
          <button (click)="previewMode.set(!previewMode())" class="toolbar-btn">
            {{ previewMode() ? '✏️ Edit' : '👁️ Preview' }}
          </button>
          <button (click)="saveChanges()" [disabled]="saving()" class="toolbar-btn save-btn">
            {{ saving() ? 'Saving...' : '💾 Save' }}
          </button>
        </div>
      </div>

      <div class="editor-content">
        <!-- Sections Panel -->
        @if (!previewMode()) {
          <div class="sections-panel">
            <div class="panel-header">
              <h3>Page Sections</h3>
              <button (click)="addSection()" class="add-section-btn">+ Add Section</button>
            </div>

            <div class="sections-list">
              @for (section of pageSections(); track section.id) {
                <div
                  class="section-item"
                  [class.active]="selectedSectionId() === section.id"
                  (click)="selectSection(section.id)"
                >
                  <div class="section-info">
                    <span class="section-type">{{ section.type }}</span>
                    <span class="section-id">{{ section.id.substring(0, 8) }}...</span>
                  </div>
                  <div class="section-actions">
                    <button (click)="duplicateSection(section)" class="action-btn">📋</button>
                    <button (click)="deleteSection(section.id)" class="action-btn delete">🗑️</button>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Editor Canvas -->
        <div class="editor-canvas" [class.preview-mode]="previewMode()">
          @if (loading()) {
            <div class="loading-state">
              <div class="loading-spinner"></div>
              <p>Loading page data...</p>
            </div>
          } @else {
            <!-- Render sections -->
            @for (section of pageSections(); track section.id) {
              <div
                class="canvas-section"
                [class.selected]="selectedSectionId() === section.id && !previewMode()"
                [attr.data-section-type]="section.type"
                (click)="!previewMode() && selectSection(section.id)"
              >
                @switch (section.type) {
                  @case ('hero-slider') {
                    <div class="section-preview hero-slider">
                      <h3>🎠 Hero Slider</h3>
                      <p>Interactive image slider with call-to-action buttons</p>
                    </div>
                  }
                  @case ('nine-grid-category') {
                    <div class="section-preview nine-grid">
                      <h3>⏹️ Nine Grid Categories</h3>
                      <p>3x3 grid layout showcasing product categories</p>
                    </div>
                  }
                  @case ('feature-intro1') {
                    <div class="section-preview feature-intro">
                      <h3>✨ Feature Introduction</h3>
                      <p>Highlight key features with compelling content</p>
                    </div>
                  }
                  @case ('category-with-products') {
                    <div class="section-preview category-products">
                      <h3>🛍️ Category Products</h3>
                      <p>Display products from a specific category</p>
                    </div>
                  }
                  @default {
                    <div class="section-preview unknown">
                      <h3>❓ Unknown Section</h3>
                      <p>Type: {{ section.type }}</p>
                    </div>
                  }
                }
              </div>
            }
          }
        </div>

        <!-- Properties Panel -->
        @if (!previewMode() && selectedSection()) {
          <div class="properties-panel">
            <div class="panel-header">
              <h3>Section Properties</h3>
            </div>

            <div class="properties-content">
              <div class="property-group">
                <label>Section Type</label>
                <input
                  [value]="selectedSection()?.type"
                  readonly
                  class="property-input"
                />
              </div>

              <div class="property-group">
                <label>Section ID</label>
                <input
                  [value]="selectedSection()?.id"
                  readonly
                  class="property-input"
                />
              </div>

              <div class="property-group">
                <label>Background Color (PC)</label>
                <input
                  type="color"
                  [value]="selectedSection()?.styles?.pc?.['background-color'] || '#f3f4f6'"
                  (change)="updateSectionStyle('pc', 'background-color', $event)"
                  class="property-input"
                />
              </div>

              <div class="property-group">
                <label>Padding (PC)</label>
                <input
                  [value]="selectedSection()?.styles?.pc?.['padding'] || '60px 20px'"
                  (input)="updateSectionStyle('pc', 'padding', $event)"
                  class="property-input"
                  placeholder="e.g., 60px 20px"
                />
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .editor-layout {
      height: 100vh;
      display: flex;
      flex-direction: column;
      background: #f8fafc;
    }

    .editor-toolbar {
      height: 60px;
      background: white;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 1rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    }

    .toolbar-left h2 {
      margin: 0;
      color: #1a202c;
      font-size: 1.25rem;
    }

    .page-info {
      color: #718096;
      font-size: 0.875rem;
      margin-left: 1rem;
    }

    .toolbar-right {
      display: flex;
      gap: 0.5rem;
    }

    .toolbar-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #d2d6dc;
      border-radius: 0.375rem;
      background: white;
      color: #374151;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .toolbar-btn:hover {
      background: #f9fafb;
    }

    .save-btn {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .save-btn:hover {
      background: #2563eb;
    }

    .editor-content {
      flex: 1;
      display: flex;
      overflow: hidden;
    }

    .sections-panel {
      width: 250px;
      background: white;
      border-right: 1px solid #e2e8f0;
      overflow-y: auto;
    }

    .panel-header {
      padding: 1rem;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .panel-header h3 {
      margin: 0;
      font-size: 1rem;
      color: #1a202c;
    }

    .add-section-btn {
      padding: 0.25rem 0.5rem;
      background: #10b981;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.75rem;
    }

    .sections-list {
      padding: 0.5rem;
    }

    .section-item {
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      margin-bottom: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .section-item:hover {
      background: #f7fafc;
    }

    .section-item.active {
      background: #ebf8ff;
      border-color: #3182ce;
    }

    .section-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .section-type {
      font-weight: 500;
      color: #2d3748;
    }

    .section-id {
      font-size: 0.75rem;
      color: #718096;
    }

    .section-actions {
      display: flex;
      gap: 0.25rem;
    }

    .action-btn {
      padding: 0.25rem;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 0.25rem;
    }

    .action-btn:hover {
      background: #f1f5f9;
    }

    .action-btn.delete:hover {
      background: #fef2f2;
    }

    .editor-canvas {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
    }

    .editor-canvas.preview-mode {
      padding: 0;
    }

    .canvas-section {
      margin-bottom: 1rem;
      border: 2px dashed transparent;
      border-radius: 0.375rem;
      transition: all 0.2s;
    }

    .canvas-section:hover {
      border-color: #93c5fd;
    }

    .canvas-section.selected {
      border-color: #3b82f6;
      border-style: solid;
    }

    .section-preview {
      padding: 2rem;
      background: white;
      border-radius: 0.375rem;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .section-preview h3 {
      margin: 0 0 0.5rem 0;
      color: #1a202c;
    }

    .section-preview p {
      margin: 0;
      color: #718096;
      font-size: 0.875rem;
    }

    .properties-panel {
      width: 300px;
      background: white;
      border-left: 1px solid #e2e8f0;
      overflow-y: auto;
    }

    .properties-content {
      padding: 1rem;
    }

    .property-group {
      margin-bottom: 1rem;
    }

    .property-group label {
      display: block;
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #374151;
    }

    .property-input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      font-size: 0.875rem;
    }

    .property-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 1px #3b82f6;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      gap: 1rem;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f4f6;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class EditorLayoutComponent implements OnInit {
  private readonly websiteService = inject(WebsiteService);
  private readonly contextService = inject(ContextService);

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly previewMode = signal<boolean>(false);
  readonly currentPageName = signal<string>('Home Page');
  readonly pageSections = signal<PageSection[]>([]);
  readonly selectedSectionId = signal<string | null>(null);

  readonly selectedSection = signal<PageSection | null>(null);

  ngOnInit(): void {
    this.loadPageData();
  }

  loadPageData(): void {
    this.loading.set(true);

    // Use the new context-aware method to load home page data
    this.websiteService.getPageData('home').subscribe({
      next: (data: WebsitePageData[]) => {
        if (data && data.length > 0) {
          const homePageData = data[0];
          this.pageSections.set(homePageData.data.sections || []);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading page data:', err);
        this.loading.set(false);
      }
    });
  }

  selectSection(sectionId: string): void {
    this.selectedSectionId.set(sectionId);
    const section = this.pageSections().find(s => s.id === sectionId);
    this.selectedSection.set(section || null);
  }

  addSection(): void {
    const newSection = this.websiteService.createDefaultSection('text-content', 'home');
    this.pageSections.update(sections => [...sections, newSection]);
  }

  duplicateSection(section: PageSection): void {
    const duplicatedSection = {
      ...section,
      id: `section-${this.generateUUID()}`
    };
    this.pageSections.update(sections => [...sections, duplicatedSection]);
  }

  deleteSection(sectionId: string): void {
    if (confirm('Are you sure you want to delete this section?')) {
      this.pageSections.update(sections => sections.filter(s => s.id !== sectionId));
      if (this.selectedSectionId() === sectionId) {
        this.selectedSectionId.set(null);
        this.selectedSection.set(null);
      }
    }
  }

  updateSectionStyle(device: 'pc' | 'mobile' | 'tablet', property: string, event: any): void {
    const value = event.target.value;
    const currentSection = this.selectedSection();

    if (currentSection) {
      const updatedSection = {
        ...currentSection,
        styles: {
          ...currentSection.styles,
          [device]: {
            ...currentSection.styles[device],
            [property]: value
          }
        }
      };

      this.selectedSection.set(updatedSection);

      // Update in the main sections array
      this.pageSections.update(sections =>
        sections.map(s => s.id === currentSection.id ? updatedSection : s)
      );
    }
  }

  saveChanges(): void {
    this.saving.set(true);

    // Simulate save operation
    setTimeout(() => {
      this.saving.set(false);
      // Here you would call the actual save API
      console.log('Page saved!', this.pageSections());
    }, 1000);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
