import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextService } from '../services';

@Component({
  selector: 'app-company-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="company-info p-4 bg-gray-50 border-l-4 border-blue-500 mb-4">
      <h3 class="text-lg font-semibold text-gray-800 mb-2">Company Context</h3>

      @if (contextService.isLoading()) {
        <div class="flex items-center">
          <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span class="text-sm text-gray-600">Loading company data...</span>
        </div>
      } @else if (contextService.error()) {
        <div class="text-red-600 text-sm">
          Error: {{ contextService.error() }}
        </div>
      } @else if (company()) {
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span class="font-medium">Company ID:</span> {{ company()!.id }}
          </div>
          <div>
            <span class="font-medium">Name:</span> {{ company()!.name }}
          </div>
          <div>
            <span class="font-medium">Slug:</span> {{ company()!.slug }}
          </div>
          <div>
            <span class="font-medium">Currency:</span> {{ contextService.currency() }}
          </div>
          <div>
            <span class="font-medium">Web URL:</span>
            <a [href]="contextService.webUrl()" target="_blank" class="text-blue-600 hover:underline">
              {{ contextService.webUrl() }}
            </a>
          </div>
          <div>
            <span class="font-medium">Pages:</span> {{ contextService.companyPages().length }}
          </div>
        </div>

        <div class="mt-3">
          <span class="font-medium text-sm">Navigation Pages:</span>
          <div class="flex flex-wrap gap-2 mt-1">
            @for (page of navigationPages(); track page.id) {
              <span class="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                {{ page.name }}
              </span>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .company-info {
      font-family: system-ui, sans-serif;
    }
  `]
})
export class CompanyInfoComponent {
  contextService = inject(ContextService);

  company = computed(() => this.contextService.currentCompany());
  navigationPages = computed(() => this.contextService.getNavigationPages());
}
