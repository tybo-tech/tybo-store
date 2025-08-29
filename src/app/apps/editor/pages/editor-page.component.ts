import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WebsitePageRendererComponent } from '../../../components/website-page-renderer.component';

@Component({
  selector: 'app-editor-page',
  standalone: true,
  imports: [
    CommonModule,
    WebsitePageRendererComponent
  ],
  template: `
    <div class="editor-page h-screen flex">
      <!-- Left Sidebar - Tools & Properties -->
      <aside class="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div class="p-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">
            <i class="fas fa-palette mr-2 text-purple-500"></i>
            Page Editor
          </h2>
        </div>

        <!-- Page Info -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Page Information</h3>
          <div class="space-y-2 text-sm">
            <div><span class="text-gray-500">Page ID:</span> {{ pageId }}</div>
            <div><span class="text-gray-500">Company:</span> {{ companyId || 'Current' }}</div>
            <div><span class="text-gray-500">Device:</span> {{ currentDevice() }}</div>
          </div>
        </div>

        <!-- Device Selector -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Preview Device</h3>
          <div class="flex space-x-2">
            @for (deviceOption of deviceOptions; track deviceOption.value) {
              <button
                class="flex-1 p-2 text-xs rounded border transition-colors"
                [class.bg-teal-500]="currentDevice() === deviceOption.value"
                [class.text-white]="currentDevice() === deviceOption.value"
                [class.border-teal-500]="currentDevice() === deviceOption.value"
                [class.bg-gray-50]="currentDevice() !== deviceOption.value"
                [class.text-gray-700]="currentDevice() !== deviceOption.value"
                [class.border-gray-200]="currentDevice() !== deviceOption.value"
                (click)="setDevice(deviceOption.value)">
                <i [class]="deviceOption.icon + ' mb-1 block'"></i>
                {{ deviceOption.label }}
              </button>
            }
          </div>
        </div>

        <!-- Section Library -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Add Sections</h3>
          <div class="grid grid-cols-2 gap-2">
            @for (sectionType of availableSections; track sectionType.type) {
              <button
                class="p-3 text-xs text-center border border-gray-200 rounded hover:bg-gray-50 transition-colors"
                (click)="addSectionType(sectionType.type)">
                <i [class]="sectionType.icon + ' text-lg block mb-1 text-teal-500'"></i>
                {{ sectionType.name }}
              </button>
            }
          </div>
        </div>

        <!-- Properties Panel -->
        <div class="flex-1 p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Properties</h3>
          <div class="text-sm text-gray-500">
            Select an element to edit properties
          </div>
        </div>
      </aside>

      <!-- Main Editor Area -->
      <main class="flex-1 flex flex-col bg-gray-100">
        <!-- Top Toolbar -->
        <header class="bg-white border-b border-gray-200 px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <h1 class="text-lg font-medium text-gray-900">Editing: {{ pageId }}</h1>
              <div class="flex items-center space-x-2">
                <button
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  (click)="undoLastAction()">
                  <i class="fas fa-undo mr-1"></i>
                  Undo
                </button>
                <button
                  class="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  (click)="redoLastAction()">
                  <i class="fas fa-redo mr-1"></i>
                  Redo
                </button>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <button
                class="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                (click)="previewPage()">
                <i class="fas fa-eye mr-2"></i>
                Preview
              </button>
              <button
                class="px-4 py-2 text-sm bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
                (click)="savePage()">
                <i class="fas fa-save mr-2"></i>
                Save
              </button>
            </div>
          </div>
        </header>

        <!-- Editor Canvas -->
        <div class="flex-1 overflow-auto p-6">
          <div class="max-w-full mx-auto" [style.max-width]="canvasMaxWidth()">
            <!-- Website Page Renderer in Editor Mode -->
            <app-website-page-renderer
              [pageId]="pageId"
              [companyId]="companyId"
              mode="editor"
              [device]="currentDevice()"
              [enableEditor]="true"
              customClasses="editor-canvas">
            </app-website-page-renderer>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .editor-page {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    }

    .editor-canvas {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    /* Custom scrollbar */
    .editor-page ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    .editor-page ::-webkit-scrollbar-track {
      background: #f1f1f1;
    }

    .editor-page ::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }

    .editor-page ::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
  `]
})
export class EditorPageComponent {
  @Input({ required: true }) pageId!: string;
  @Input() companyId?: number;

  // Device management
  currentDevice = signal<'pc' | 'mobile' | 'tablet'>('pc');

  deviceOptions = [
    { value: 'pc' as const, label: 'Desktop', icon: 'fas fa-desktop' },
    { value: 'tablet' as const, label: 'Tablet', icon: 'fas fa-tablet-alt' },
    { value: 'mobile' as const, label: 'Mobile', icon: 'fas fa-mobile-alt' }
  ];

  // Available section types
  availableSections = [
    { type: 'hero-slider', name: 'Hero Slider', icon: 'fas fa-images' },
    { type: 'feature-intro', name: 'Feature Intro', icon: 'fas fa-star' },
    { type: 'nine-grid-category', name: 'Category Grid', icon: 'fas fa-th' },
    { type: 'category-products', name: 'Products', icon: 'fas fa-shopping-bag' },
    { type: 'text-section', name: 'Text Block', icon: 'fas fa-paragraph' },
    { type: 'image-gallery', name: 'Gallery', icon: 'fas fa-images' },
    { type: 'contact-form', name: 'Contact Form', icon: 'fas fa-envelope' },
    { type: 'testimonials', name: 'Testimonials', icon: 'fas fa-quote-left' }
  ];

  // Computed canvas width based on device
  canvasMaxWidth = computed(() => {
    switch (this.currentDevice()) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      case 'pc': return '100%';
      default: return '100%';
    }
  });

  setDevice(device: 'pc' | 'mobile' | 'tablet'): void {
    this.currentDevice.set(device);
  }

  addSectionType(sectionType: string): void {
    console.log('Adding section:', sectionType);
    // Implement section addition logic
  }

  undoLastAction(): void {
    console.log('Undo last action');
    // Implement undo functionality
  }

  redoLastAction(): void {
    console.log('Redo last action');
    // Implement redo functionality
  }

  previewPage(): void {
    console.log('Preview page:', this.pageId);
    // Open preview in new tab/modal
  }

  savePage(): void {
    console.log('Save page:', this.pageId);
    // Save current page state
  }
}
