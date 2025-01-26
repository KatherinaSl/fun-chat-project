export default function createHTMLElement(
  tagName: string,
  className?: string
): HTMLElement {
  const element = document.createElement(tagName);
  if (className) {
    element.classList.add(className);
  }
  return element;
}
