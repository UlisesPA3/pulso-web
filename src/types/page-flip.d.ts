/**
 * `page-flip` (StPageFlip) no publica tipos. Se declara solo la superficie que usa el visor.
 */
declare module 'page-flip' {
  export type Orientation = 'portrait' | 'landscape';
  export type FlippingState = 'user_fold' | 'fold_corner' | 'flipping' | 'read';

  export interface FlipSetting {
    startPage: number;
    size: 'fixed' | 'stretch';
    width: number;
    height: number;
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
    drawShadow: boolean;
    flippingTime: number;
    usePortrait: boolean;
    startZIndex: number;
    autoSize: boolean;
    maxShadowOpacity: number;
    showCover: boolean;
    mobileScrollSupport: boolean;
    clickEventForward: boolean;
    useMouseEvents: boolean;
    swipeDistance: number;
    showPageCorners: boolean;
    disableFlipByClick: boolean;
  }

  export interface FlipEvent<T> {
    data: T;
    object: PageFlip;
  }

  interface FlipEventMap {
    init: { page: number; mode: Orientation };
    update: { page: number; mode: Orientation };
    flip: number;
    changeOrientation: Orientation;
    changeState: FlippingState;
  }

  export class PageFlip {
    constructor(element: HTMLElement, setting: Partial<FlipSetting> & { width: number; height: number });
    loadFromHTML(items: NodeListOf<HTMLElement> | HTMLElement[]): void;
    on<K extends keyof FlipEventMap>(event: K, callback: (e: FlipEvent<FlipEventMap[K]>) => void): this;
    off(event: keyof FlipEventMap): void;
    /** Elimina del DOM el elemento raíz que se pasó al constructor. */
    destroy(): void;
    update(): void;
    flipNext(): void;
    flipPrev(): void;
    flip(page: number): void;
    turnToNextPage(): void;
    turnToPrevPage(): void;
    turnToPage(page: number): void;
    getPageCount(): number;
    getCurrentPageIndex(): number;
    getOrientation(): Orientation;
  }
}
