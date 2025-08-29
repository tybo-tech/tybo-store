import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon-examples',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="icon-examples p-8 max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">
        <i class="fas fa-palette text-purple-500 mr-3"></i>
        Font Awesome Icon Examples
      </h1>

      <!-- Navigation Icons -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Navigation & UI Icons</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-home text-2xl text-blue-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-home</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-shopping-cart text-2xl text-green-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-shopping-cart</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-user text-2xl text-indigo-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-user</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-search text-2xl text-yellow-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-search</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-heart text-2xl text-red-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-heart</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-bars text-2xl text-gray-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-bars</p>
          </div>
        </div>
      </section>

      <!-- Sports & E-commerce Icons -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Sports & E-commerce Icons</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-futbol text-2xl text-green-600 mb-2"></i>
            <p class="text-sm text-gray-600">fa-futbol</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-tshirt text-2xl text-blue-600 mb-2"></i>
            <p class="text-sm text-gray-600">fa-tshirt</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-medal text-2xl text-yellow-600 mb-2"></i>
            <p class="text-sm text-gray-600">fa-medal</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-trophy text-2xl text-orange-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-trophy</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-credit-card text-2xl text-purple-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-credit-card</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fas fa-truck text-2xl text-teal-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-truck</p>
          </div>
        </div>
      </section>

      <!-- Social Media Icons -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Social Media Icons</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fab fa-facebook text-2xl text-blue-600 mb-2"></i>
            <p class="text-sm text-gray-600">fa-facebook</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fab fa-twitter text-2xl text-sky-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-twitter</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fab fa-instagram text-2xl text-pink-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-instagram</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fab fa-whatsapp text-2xl text-green-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-whatsapp</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fab fa-youtube text-2xl text-red-500 mb-2"></i>
            <p class="text-sm text-gray-600">fa-youtube</p>
          </div>
          <div class="text-center p-4 bg-white rounded-lg shadow border hover:shadow-md transition-shadow">
            <i class="fab fa-linkedin text-2xl text-blue-700 mb-2"></i>
            <p class="text-sm text-gray-600">fa-linkedin</p>
          </div>
        </div>
      </section>

      <!-- Interactive Examples -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Interactive Examples</h2>
        <div class="space-y-4">
          <!-- Button with icon -->
          <button class="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            <i class="fas fa-shopping-bag mr-2"></i>
            Add to Cart
          </button>

          <!-- Loading state -->
          <button class="bg-gray-400 text-white px-6 py-3 rounded-lg font-medium cursor-not-allowed">
            <i class="fas fa-spinner fa-spin mr-2"></i>
            Processing...
          </button>

          <!-- Success state -->
          <button class="bg-green-500 text-white px-6 py-3 rounded-lg font-medium">
            <i class="fas fa-check-circle mr-2"></i>
            Order Complete
          </button>

          <!-- Error state -->
          <button class="bg-red-500 text-white px-6 py-3 rounded-lg font-medium">
            <i class="fas fa-exclamation-triangle mr-2"></i>
            Payment Failed
          </button>
        </div>
      </section>

      <!-- Icon Sizes -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Icon Sizes</h2>
        <div class="flex items-center space-x-6">
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-xs"></i>
            <p class="text-xs text-gray-600 mt-1">text-xs</p>
          </div>
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-sm"></i>
            <p class="text-xs text-gray-600 mt-1">text-sm</p>
          </div>
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-base"></i>
            <p class="text-xs text-gray-600 mt-1">text-base</p>
          </div>
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-lg"></i>
            <p class="text-xs text-gray-600 mt-1">text-lg</p>
          </div>
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-xl"></i>
            <p class="text-xs text-gray-600 mt-1">text-xl</p>
          </div>
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-2xl"></i>
            <p class="text-xs text-gray-600 mt-1">text-2xl</p>
          </div>
          <div class="text-center">
            <i class="fas fa-star text-yellow-500 text-4xl"></i>
            <p class="text-xs text-gray-600 mt-1">text-4xl</p>
          </div>
        </div>
      </section>

      <!-- Usage Examples -->
      <section class="mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">HTML Usage Examples</h2>
        <div class="bg-gray-50 rounded-lg p-6">
          <pre class="text-sm text-gray-700 whitespace-pre-wrap"><code>&lt;!-- Basic icon --&gt;
&lt;i class="fas fa-heart"&gt;&lt;/i&gt;

&lt;!-- Icon with color and size --&gt;
&lt;i class="fas fa-heart text-red-500 text-2xl"&gt;&lt;/i&gt;

&lt;!-- Icon with animation --&gt;
&lt;i class="fas fa-spinner fa-spin"&gt;&lt;/i&gt;

&lt;!-- Icon in button --&gt;
&lt;button class="btn"&gt;
  &lt;i class="fas fa-download mr-2"&gt;&lt;/i&gt;
  Download
&lt;/button&gt;

&lt;!-- Social media icons --&gt;
&lt;i class="fab fa-facebook"&gt;&lt;/i&gt;
&lt;i class="fab fa-twitter"&gt;&lt;/i&gt;
&lt;i class="fab fa-instagram"&gt;&lt;/i&gt;</code></pre>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .icon-examples {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
    }
  `]
})
export class IconExamplesComponent {}
