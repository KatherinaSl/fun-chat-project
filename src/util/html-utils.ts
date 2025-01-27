interface HTMLParams {
  className?: string;
  textContent?: string;
}

export function createHTMLElementWithParams(
  tagName: string,
  params: HTMLParams
): HTMLElement {
  const element = document.createElement(tagName);
  if (params.className) {
    element.classList.add(params.className);
  }
  if (params.textContent) {
    element.textContent = params.textContent;
  }
  return element;
}

export function createHTMLElement(
  tagName: string,
  className?: string
): HTMLElement {
  return createHTMLElementWithParams(tagName, { className });
}

export function removeHTMLElements(tags: string[]) {
  tags.forEach((tag) => document.querySelector(tag)?.remove());
}
