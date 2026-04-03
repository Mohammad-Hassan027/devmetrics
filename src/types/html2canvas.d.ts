declare module "html2canvas" {
  interface Options {
    backgroundColor?: string | null;
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    logging?: boolean;
    onclone?: (doc: Document) => void;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    scrollX?: number;
    scrollY?: number;
    windowWidth?: number;
    windowHeight?: number;
    foreignObjectRendering?: boolean;
    imageTimeout?: number;
    removeContainer?: boolean;
    ignoreElements?: (element: Element) => boolean;
    proxy?: string;
  }

  function html2canvas(
    element: HTMLElement,
    options?: Options,
  ): Promise<HTMLCanvasElement>;
  export default html2canvas;
}
