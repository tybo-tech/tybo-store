import { Injectable } from '@angular/core';
import { PageElement, PageSection } from '../models/website.interface';

export interface IFont { url: string }
export interface IStyleDM {
  css_class: string;
  properties: {
    pc?: Record<string, any>;
    tablet?: Record<string, any>;
    mobile?: Record<string, any>;
  }
}

export interface IThemeColor {
  name: string;
  value: string;
  variable: string;
}

@Injectable({ providedIn: 'root' })
export class StyleManagerService {
  private styleElId = 'dynamic-styles';

  // scopeSelector optionally prefixes each selector (e.g., '#page-home') for page-scoped CSS
  generateFromSections(sections: PageSection[], fonts: IFont[] = [], scopeSelector?: string, themeColors?: IThemeColor[]): void {
    if (!sections || sections.length === 0) {
      this.clear();
      return;
    }

    let pc = this.renderFonts(fonts);

    // Add CSS variables from theme colors
    if (themeColors && themeColors.length > 0) {
      pc += this.renderThemeVariables(themeColors, scopeSelector);
    }

    let tablet = '';
    let mobile = '';

    for (const section of sections) {
      // Section rule (if consumers add section class to DOM)
      const secClass = `sec-${this.sanitize(section.id)}`;
      pc += this.buildCssRule(secClass, section.styles?.pc, scopeSelector);
      tablet += this.buildCssRule(secClass, section.styles?.tablet, scopeSelector);
      mobile += this.buildCssRule(secClass, section.styles?.mobile, scopeSelector);

      // Container rule (if consumers add container class to DOM)
      const contClass = `cont-${this.sanitize(section.container?.id)}`;
      if (section.container?.styles) {
        pc += this.buildCssRule(contClass, section.container.styles.pc, scopeSelector);
        tablet += this.buildCssRule(contClass, section.container.styles.tablet, scopeSelector);
        mobile += this.buildCssRule(contClass, section.container.styles.mobile, scopeSelector);
      }

      // Element rules (walk all children)
      const children = section.container?.children || [];
      for (const child of children) {
        this.walkElement(child, (cls, pcObj, tabObj, mobObj) => {
          pc += this.buildCssRule(cls, pcObj, scopeSelector);
          tablet += this.buildCssRule(cls, tabObj, scopeSelector);
          mobile += this.buildCssRule(cls, mobObj, scopeSelector);
        });
      }
    }

    const styleString = this.compose(pc, tablet, mobile);
    this.render(styleString);
  }

  // Optional: accept a DM array directly (same shape as your example)
  generateFromDesignMap(styles: IStyleDM[], fonts: IFont[] = [], scopeSelector?: string, themeColors?: IThemeColor[]): void {
    if (!styles || styles.length === 0) {
      this.clear();
      return;
    }

    let pc = this.renderFonts(fonts);

    // Add CSS variables from theme colors
    if (themeColors && themeColors.length > 0) {
      pc += this.renderThemeVariables(themeColors, scopeSelector);
    }

    let tablet = '';
    let mobile = '';

    for (const style of styles) {
      const cls = this.sanitize(style.css_class);
      pc += this.buildCssRule(cls, style.properties?.pc || {}, scopeSelector);
      tablet += this.buildCssRule(cls, style.properties?.tablet || {}, scopeSelector);
      mobile += this.buildCssRule(cls, style.properties?.mobile || {}, scopeSelector);
    }

    const styleString = this.compose(pc, tablet, mobile);
    this.render(styleString);
  }

  clear(): void {
    const existing = document.getElementById(this.styleElId);
    if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
  }

  private renderFonts(fonts: IFont[]): string {
    let importString = '';
    for (const font of fonts || []) {
      if (font?.url) importString += `@import url(${font.url});`;
    }
    return `\n${importString}\n`;
  }

  private renderThemeVariables(themeColors: IThemeColor[], scopeSelector?: string): string {
    if (!themeColors || themeColors.length === 0) return '';

    // Use scoped selector or :root for global variables
    const selector = scopeSelector || ':root';

    let css = `${selector} {`;
    for (const color of themeColors) {
      if (color.variable && color.value) {
        css += `${color.variable}: ${color.value};`;
      }
    }
    css += '}';

    return css;
  }

  private walkElement(
    el: PageElement,
    cb: (className: string, pc: any, tablet: any, mobile: any) => void
  ): void {
    const cls = `el-${this.sanitize((el.id || '').replace(/^el-/, ''))}`;
    cb(cls, el.styles?.pc, el.styles?.tablet, el.styles?.mobile);
    if (el.children && el.children.length) {
      for (const child of el.children) this.walkElement(child, cb);
    }
  }

  private buildCssRule(className: string, styleObj: Record<string, any> | undefined, scopeSelector?: string): string {
    if (!styleObj) return '';
    // Skip Tailwind className key; handled as HTML class
    const keys = Object.keys(styleObj).filter(k => k !== 'className');
    if (keys.length === 0) return '';

    // Optional page scoping prefix
    const prefix = scopeSelector ? `${scopeSelector} ` : '';
    let css = `${prefix}.${className} {`;
    for (const key of keys) {
      const rawVal = styleObj[key];
      if (rawVal === undefined || rawVal === null || rawVal === '') continue;
      const val = typeof rawVal === 'string' ? rawVal.trim() : rawVal;
      if (val === '') continue;
      const prop = this.toKebab(key);
      css += `${prop}: ${val};`;
    }
    css += '}';
    return css;
  }

  private compose(pcStyles: string, tabletStyles: string, mobileStyles: string): string {
    return `\n${pcStyles}\n@media only screen and (max-width: 768px) {\n${tabletStyles}\n}\n@media only screen and (max-width: 600px) {\n${mobileStyles}\n}\n`;
  }

  private render(styleString: string): void {
    // Replace existing tag if present
    this.clear();
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.id = this.styleElId;
    style.type = 'text/css';
    style.innerHTML = styleString;
    head.appendChild(style);
  }

  private sanitize(id?: string): string {
    return (id || 'unknown').replace(/[^a-zA-Z0-9_-]/g, '-');
  }

  private toKebab(key: string): string {
    // Handle already-kebab keys like 'background-color' and camelCase like 'backgroundColor'
    if (key.includes('-')) return key;
    return key.replace(/([A-Z])/g, '-$1').toLowerCase();
  }
}
