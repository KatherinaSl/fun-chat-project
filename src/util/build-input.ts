import { createHTMLElement } from './html-utils';

export default class FormInputBuilder {
  private input: HTMLInputElement;

  private requirements: string = '';

  private svgLabel?: string;

  private type: string = 'text';

  constructor(id: string) {
    this.input = createHTMLElement('input') as HTMLInputElement;
    this.input.id = id;
  }

  public setType(type: string): FormInputBuilder {
    this.type = type;
    return this;
  }

  public setPlaceholder(placeholder: string): FormInputBuilder {
    this.input.placeholder = placeholder;
    return this;
  }

  public setPattern(pattern: string): FormInputBuilder {
    this.input.pattern = pattern;
    return this;
  }

  public setRequirements(requirements: string): FormInputBuilder {
    this.requirements = requirements;
    return this;
  }

  public setAutocomplete(autocomplete: AutoFill): FormInputBuilder {
    this.input.autocomplete = autocomplete;
    return this;
  }

  public setSvgLabel(svg: string): FormInputBuilder {
    this.svgLabel = svg;
    return this;
  }

  public build(): HTMLElement {
    const divInput = createHTMLElement('div', 'inputbox');
    const divReq = createHTMLElement('div', 'requirements');

    if (this.svgLabel) {
      const label = createHTMLElement('label');
      label.innerHTML += this.svgLabel;
      label.setAttribute('for', this.input.id);
      divInput.append(label);
    }

    this.input.required = true;
    this.input.type = this.type;
    this.input.oninvalid = (event) => event.preventDefault();

    divReq.textContent = this.requirements;

    divInput.append(this.input, divReq);
    return divInput;
  }
}
