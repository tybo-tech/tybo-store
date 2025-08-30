import { Component, signal, inject, OnInit, computed, effect } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ContextService } from './services/context.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  private contextService = inject(ContextService);
  protected readonly title = signal('tybo-store-v2');

  // Get company background color from theme
  backgroundColor = computed(() => {
    const company = this.contextService.currentCompany();
    const themeColors = company?.metadata?.themeColors || [];
    const bgColor = themeColors.find(c => c.variable === '--color-background');
    return bgColor?.value || '#ffffff';
  });

  constructor() {
    // Use effect to automatically apply background when it changes
    effect(() => {
      const bgColor = this.backgroundColor();
      if (bgColor && document.body) {
        document.body.style.backgroundColor = bgColor;
        console.log('🎨 Applied body background color:', bgColor);
      }
    });
  }

  ngOnInit(): void {
    console.log('🚀 App initialized with dynamic routing and theming');
  }
}
